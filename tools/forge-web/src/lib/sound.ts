let ctx: AudioContext | null = null;
let noiseBuffer: AudioBuffer | null = null;
let crackleBuffer: AudioBuffer | null = null;

const VOLUME_KEY = "forge-sound-volume";
const MUTE_KEY = "forge-sound-muted";
const AMBIENT_KEY = "forge-sound-ambient";
const AMBIENT_MODE_KEY = "forge-sound-ambient-mode";

export type AmbientMode = "noise" | "lofi";

const NOISE_BASE_GAIN = 0.25;
const LOFI_PAD_BASE_GAIN = 0.16;
const LOFI_CRACKLE_BASE_GAIN = 0.04;

type NoiseNodes = { kind: "noise"; source: AudioBufferSourceNode; gain: GainNode };
type LofiNodes = {
  kind: "lofi";
  padGain: GainNode;
  crackleSource: AudioBufferSourceNode;
  crackleGain: GainNode;
  warble: OscillatorNode;
  filter: BiquadFilterNode;
  timer: ReturnType<typeof setTimeout> | null;
  stopped: boolean;
};
let ambientNodes: NoiseNodes | LofiNodes | null = null;

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioCtx) return null;
  if (!ctx) ctx = new AudioCtx();
  if (ctx.state === "suspended") ctx.resume().catch(() => {});
  return ctx;
}

function getVolume(): number {
  try {
    const raw = localStorage.getItem(VOLUME_KEY);
    if (raw !== null) return Math.min(1, Math.max(0, Number(raw)));
  } catch {
    // ignore corrupt storage
  }
  return 0.6;
}

function isMuted(): boolean {
  try {
    return localStorage.getItem(MUTE_KEY) === "1";
  } catch {
    return false;
  }
}

export function isAmbientOn(): boolean {
  try {
    return localStorage.getItem(AMBIENT_KEY) === "1";
  } catch {
    return false;
  }
}

export function getAmbientMode(): AmbientMode {
  try {
    const raw = localStorage.getItem(AMBIENT_MODE_KEY);
    if (raw === "lofi" || raw === "noise") return raw;
  } catch {
    // ignore
  }
  return "noise";
}

export function setAmbientMode(mode: AmbientMode) {
  try {
    localStorage.setItem(AMBIENT_MODE_KEY, mode);
  } catch {
    // ignore
  }
  if (ambientNodes) {
    stopAmbient();
    startAmbient(mode);
  }
}

// beep com envelope ADSR curto (attack rápido, decay curto) em vez de rampa linear crua
function beep(
  freq: number,
  durationMs: number,
  peakVolume = 0.05,
  delayMs = 0,
  type: OscillatorType = "square",
) {
  if (isMuted()) return;
  const audio = getContext();
  if (!audio) return;
  const volume = peakVolume * getVolume();
  if (volume <= 0) return;

  const oscillator = audio.createOscillator();
  const gain = audio.createGain();
  oscillator.type = type;
  oscillator.frequency.value = freq;

  const start = audio.currentTime + delayMs / 1000;
  const attackEnd = start + 0.008;
  const decayEnd = start + durationMs / 1000;

  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(volume, attackEnd);
  gain.gain.exponentialRampToValueAtTime(0.0001, decayEnd);

  oscillator.connect(gain);
  gain.connect(audio.destination);
  oscillator.start(start);
  oscillator.stop(decayEnd + 0.02);
}

function arpeggio(
  notes: [freq: number, delayMs: number, durationMs: number][],
  volume = 0.06,
) {
  for (const [freq, delayMs, durationMs] of notes) {
    beep(freq, durationMs, volume, delayMs);
  }
}

export const sfx = {
  click: () => beep(220, 45, 0.04),
  toggle: () => beep(330, 60, 0.045),
  start: () => beep(392, 70, 0.05),
  pause: () => beep(262, 70, 0.05),
  reset: () => beep(196, 90, 0.05),
  // foco concluído -> pausa: fanfarra curta ascendente
  focusComplete: () =>
    arpeggio([
      [523, 0, 90],
      [659, 90, 90],
      [784, 180, 140],
      [1047, 320, 180],
    ]),
  // pausa concluída -> foco: som mais sério/urgente, descendente
  breakComplete: () =>
    arpeggio(
      [
        [784, 0, 110],
        [587, 110, 110],
        [466, 220, 160],
      ],
      0.07,
    ),
  complete: () => sfx.focusComplete(),
};

export function getSoundVolume(): number {
  return getVolume();
}

export function setSoundVolume(volume: number) {
  const clamped = Math.min(1, Math.max(0, volume));
  try {
    localStorage.setItem(VOLUME_KEY, String(clamped));
  } catch {
    // ignore
  }
  if (ambientNodes) {
    if (ambientNodes.kind === "noise") {
      ambientNodes.gain.gain.value = NOISE_BASE_GAIN * clamped;
    } else {
      ambientNodes.padGain.gain.value = LOFI_PAD_BASE_GAIN * clamped;
      ambientNodes.crackleGain.gain.value = LOFI_CRACKLE_BASE_GAIN * clamped;
    }
  }
}

export function getSoundMuted(): boolean {
  return isMuted();
}

export function setSoundMuted(muted: boolean) {
  try {
    localStorage.setItem(MUTE_KEY, muted ? "1" : "0");
  } catch {
    // ignore
  }
  if (muted) stopAmbient();
}

// brown noise (integrado a partir de ruído branco) - mascara distração melhor que drone tonal
function getNoiseBuffer(audio: AudioContext): AudioBuffer {
  if (noiseBuffer) return noiseBuffer;
  const durationSeconds = 4;
  const buffer = audio.createBuffer(
    1,
    audio.sampleRate * durationSeconds,
    audio.sampleRate,
  );
  const data = buffer.getChannelData(0);
  let lastOut = 0;
  for (let i = 0; i < data.length; i++) {
    const white = Math.random() * 2 - 1;
    lastOut = (lastOut + 0.02 * white) / 1.02;
    data[i] = lastOut * 3.5;
  }
  noiseBuffer = buffer;
  return buffer;
}

// estalos de vinil esparsos (silêncio na maior parte, picos curtos aleatórios)
function getCrackleBuffer(audio: AudioContext): AudioBuffer {
  if (crackleBuffer) return crackleBuffer;
  const durationSeconds = 5;
  const buffer = audio.createBuffer(
    1,
    audio.sampleRate * durationSeconds,
    audio.sampleRate,
  );
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    if (Math.random() < 0.0006) {
      const burstLength = 40 + Math.floor(Math.random() * 60);
      for (let j = 0; j < burstLength && i + j < data.length; j++) {
        data[i + j] = (Math.random() * 2 - 1) * (1 - j / burstLength);
      }
      i += burstLength;
    } else {
      data[i] = 0;
    }
  }
  crackleBuffer = buffer;
  return buffer;
}

function startNoise(audio: AudioContext) {
  const gain = audio.createGain();
  gain.gain.value = NOISE_BASE_GAIN * getVolume();
  gain.connect(audio.destination);

  const source = audio.createBufferSource();
  source.buffer = getNoiseBuffer(audio);
  source.loop = true;
  source.connect(gain);
  source.start();

  ambientNodes = { kind: "noise", source, gain };
}

// progressão de acordes tipo lo-fi (Cmaj7 - Am7 - Fmaj7 - G7), pad abafado + wobble + estalos
const LOFI_CHORDS: number[][] = [
  [261.63, 329.63, 392.0, 493.88],
  [220.0, 261.63, 329.63, 392.0],
  [174.61, 220.0, 261.63, 329.63],
  [196.0, 246.94, 293.66, 349.23],
];
const LOFI_CHORD_MS = 4000;

function playLofiChord(
  audio: AudioContext,
  filter: BiquadFilterNode,
  freqs: number[],
  durationMs: number,
) {
  const start = audio.currentTime;
  const attack = 0.6;
  const release = 0.8;
  const sustainEnd = start + durationMs / 1000 - release;

  for (const freq of freqs) {
    const osc = audio.createOscillator();
    const noteGain = audio.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    noteGain.gain.setValueAtTime(0.0001, start);
    noteGain.gain.exponentialRampToValueAtTime(0.2, start + attack);
    noteGain.gain.setValueAtTime(0.2, sustainEnd);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, sustainEnd + release);
    osc.connect(noteGain);
    noteGain.connect(filter);
    osc.start(start);
    osc.stop(start + durationMs / 1000 + 0.05);
  }
}

function startLofi(audio: AudioContext) {
  const padGain = audio.createGain();
  padGain.gain.value = LOFI_PAD_BASE_GAIN * getVolume();
  padGain.connect(audio.destination);

  const filter = audio.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 1100;
  filter.Q.value = 0.6;
  filter.connect(padGain);

  // wobble: LFO lenta modulando o corte do filtro, efeito "vinil"
  const warble = audio.createOscillator();
  warble.type = "sine";
  warble.frequency.value = 0.15;
  const warbleGain = audio.createGain();
  warbleGain.gain.value = 250;
  warble.connect(warbleGain);
  warbleGain.connect(filter.frequency);
  warble.start();

  const crackleGain = audio.createGain();
  crackleGain.gain.value = LOFI_CRACKLE_BASE_GAIN * getVolume();
  crackleGain.connect(audio.destination);
  const crackleSource = audio.createBufferSource();
  crackleSource.buffer = getCrackleBuffer(audio);
  crackleSource.loop = true;
  crackleSource.connect(crackleGain);
  crackleSource.start();

  const nodes: LofiNodes = {
    kind: "lofi",
    padGain,
    crackleSource,
    crackleGain,
    warble,
    filter,
    timer: null,
    stopped: false,
  };
  ambientNodes = nodes;

  let chordIndex = 0;
  function scheduleNext() {
    if (nodes.stopped) return;
    playLofiChord(
      audio,
      filter,
      LOFI_CHORDS[chordIndex % LOFI_CHORDS.length],
      LOFI_CHORD_MS,
    );
    chordIndex += 1;
    nodes.timer = setTimeout(scheduleNext, LOFI_CHORD_MS);
  }
  scheduleNext();
}

export function startAmbient(mode: AmbientMode = getAmbientMode()) {
  if (isMuted() || ambientNodes) return;
  const audio = getContext();
  if (!audio) return;

  if (mode === "lofi") startLofi(audio);
  else startNoise(audio);

  try {
    localStorage.setItem(AMBIENT_KEY, "1");
    localStorage.setItem(AMBIENT_MODE_KEY, mode);
  } catch {
    // ignore
  }
}

export function stopAmbient() {
  if (ambientNodes) {
    if (ambientNodes.kind === "noise") {
      ambientNodes.source.stop();
    } else {
      ambientNodes.stopped = true;
      if (ambientNodes.timer) clearTimeout(ambientNodes.timer);
      ambientNodes.warble.stop();
      ambientNodes.crackleSource.stop();
    }
    ambientNodes = null;
  }
  try {
    localStorage.setItem(AMBIENT_KEY, "0");
  } catch {
    // ignore
  }
}

export function toggleAmbient() {
  if (ambientNodes) stopAmbient();
  else startAmbient();
}
