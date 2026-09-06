let ctx: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioCtx) return null;
  if (!ctx) ctx = new AudioCtx();
  if (ctx.state === "suspended") ctx.resume().catch(() => {});
  return ctx;
}

function beep(freq: number, durationMs: number, volume = 0.05, delayMs = 0) {
  const audio = getContext();
  if (!audio) return;
  const oscillator = audio.createOscillator();
  const gain = audio.createGain();
  oscillator.type = "square";
  oscillator.frequency.value = freq;
  const start = audio.currentTime + delayMs / 1000;
  const end = start + durationMs / 1000;
  gain.gain.setValueAtTime(volume, start);
  gain.gain.exponentialRampToValueAtTime(0.0001, end);
  oscillator.connect(gain);
  gain.connect(audio.destination);
  oscillator.start(start);
  oscillator.stop(end);
}

export const sfx = {
  click: () => beep(220, 45, 0.04),
  toggle: () => beep(330, 60, 0.045),
  start: () => beep(392, 70, 0.05),
  pause: () => beep(262, 70, 0.05),
  reset: () => beep(196, 90, 0.05),
  complete: () => {
    beep(523, 90, 0.06, 0);
    beep(659, 90, 0.06, 90);
    beep(784, 140, 0.06, 180);
  },
};
