import { Maximize2, Minimize2, Pause, Play, RotateCcw, Timer, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { api } from "../api";
import { sfx } from "../lib/sound";
import { Button } from "./ui/8bit/button";

const FOCUS_SECONDS = 25 * 60;
const BREAK_SECONDS = 5 * 60;
const STORAGE_KEY = "forge-pomodoro";

type Mode = "focus" | "break";

type State = {
  mode: Mode;
  secondsLeft: number;
  running: boolean;
  cycles: number;
};

function loadState(): State {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { running: false, ...JSON.parse(raw) };
  } catch {
    // ignore corrupt storage
  }
  return { mode: "focus", secondsLeft: FOCUS_SECONDS, running: false, cycles: 0 };
}

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${seconds}`;
}

type Props = {
  unitId: string;
  onLogged?: () => void;
};

export function PomodoroWidget({ unitId, onLogged }: Props) {
  const [open, setOpen] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [flash, setFlash] = useState(false);
  const [state, setState] = useState<State>(loadState);
  const originalTitle = useRef(document.title);
  const loggedCycles = useRef(state.cycles);

  useEffect(() => {
    const { running, ...persisted } = state;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted));
  }, [state]);

  useEffect(() => {
    if (state.cycles <= loggedCycles.current) return;
    loggedCycles.current = state.cycles;
    api
      .session({
        minutes: FOCUS_SECONDS / 60,
        summary: "Pomodoro concluído",
        difficulty: "",
        nextStep: "",
        unitId,
      })
      .then(() => onLogged?.())
      .catch(() => {
        // registro silencioso, não interrompe o timer
      });
  }, [state.cycles, unitId, onLogged]);

  useEffect(() => {
    if (!state.running) return;
    const id = setInterval(() => {
      setState((current) => {
        if (current.secondsLeft <= 1) {
          const nextMode: Mode = current.mode === "focus" ? "break" : "focus";
          sfx.complete();
          setFlash(true);
          setTimeout(() => setFlash(false), 500);
          return {
            mode: nextMode,
            secondsLeft: nextMode === "focus" ? FOCUS_SECONDS : BREAK_SECONDS,
            running: true,
            cycles: current.mode === "focus" ? current.cycles + 1 : current.cycles,
          };
        }
        return { ...current, secondsLeft: current.secondsLeft - 1 };
      });
    }, 1000);
    return () => clearInterval(id);
  }, [state.running]);

  useEffect(() => {
    document.title = state.running
      ? `${formatTime(state.secondsLeft)} · ${state.mode === "focus" ? "Foco" : "Pausa"}`
      : originalTitle.current;
  }, [state.secondsLeft, state.running, state.mode]);

  useEffect(() => {
    if (!fullscreen) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setFullscreen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [fullscreen]);

  function toggleRunning() {
    sfx[state.running ? "pause" : "start"]();
    setState((current) => ({ ...current, running: !current.running }));
  }

  function reset() {
    sfx.reset();
    setState((current) => ({
      mode: "focus",
      secondsLeft: FOCUS_SECONDS,
      running: false,
      cycles: current.cycles,
    }));
  }

  function toggleOpen() {
    sfx.toggle();
    setOpen((value) => !value);
  }

  function toggleFullscreen() {
    sfx.toggle();
    setFullscreen((value) => !value);
  }

  const sessionsLabel = `${state.cycles} sessõe${state.cycles === 1 ? "" : "s"} concluída${state.cycles === 1 ? "" : "s"}`;

  const controls = (
    <div className="pomodoro-actions">
      <Button
        size="icon"
        onClick={toggleRunning}
        aria-label={state.running ? "Pausar" : "Iniciar"}
      >
        {state.running ? <Pause size={16} /> : <Play size={16} />}
      </Button>
      <Button size="icon" variant="secondary" onClick={reset} aria-label="Reiniciar">
        <RotateCcw size={16} />
      </Button>
      <Button
        size="icon"
        variant="secondary"
        onClick={toggleFullscreen}
        aria-label="Tela cheia"
      >
        {fullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
      </Button>
    </div>
  );

  if (fullscreen) {
    return (
      <div className={`pomodoro-fullscreen ${state.mode} ${flash ? "pixel-shake" : ""}`}>
        <button
          className="icon-button pomodoro-fullscreen-close"
          onClick={toggleFullscreen}
          aria-label="Sair da tela cheia"
        >
          <Minimize2 size={22} />
        </button>
        <span className="eyebrow">{state.mode === "focus" ? "Foco" : "Pausa"}</span>
        <strong className={`pomodoro-clock-huge ${state.running ? "pixel-blink" : ""}`}>
          {formatTime(state.secondsLeft)}
        </strong>
        <span className="pomodoro-cycles">{sessionsLabel}</span>
        {controls}
      </div>
    );
  }

  return (
    <div className="pomodoro-widget">
      {open && (
        <div
          className={`pomodoro-panel pixel-enter ${state.mode} ${flash ? "pixel-shake" : ""}`}
        >
          <div className="pomodoro-panel-head">
            <span className="eyebrow">{state.mode === "focus" ? "Foco" : "Pausa"}</span>
            <button className="icon-button" onClick={toggleOpen} aria-label="Fechar">
              <X size={16} />
            </button>
          </div>
          <strong className={`pomodoro-clock ${state.running ? "pixel-blink" : ""}`}>
            {formatTime(state.secondsLeft)}
          </strong>
          <span className="pomodoro-cycles">{sessionsLabel}</span>
          {controls}
        </div>
      )}

      <Button
        size="icon"
        className="pomodoro-toggle"
        onClick={toggleOpen}
        aria-label="Pomodoro"
      >
        <Timer size={20} />
      </Button>
    </div>
  );
}
