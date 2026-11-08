import { useState } from "react";

import type { TestResult, UnitDetail } from "../../types";
import { ConfirmDialog } from "../ConfirmDialog";
import {
  MARK_ALL_ID,
  MIN_CONFIDENCE,
  MIN_REFLECTION_LENGTH,
  REFLECTION_SAVE_ID,
  RUN_ALL_ID,
  isMissionDone,
} from "./format";
import { RunOutput } from "./MissionCard";

type Props = {
  unit: UnitDetail;
  busy: boolean;
  runningAll: boolean;
  lastRun: TestResult | null;
  onRunAll: () => void;
  onSaveReflection: (reflection: string, confidence: number) => void;
  onMarkAll: () => void;
};

const CONFIDENCE_LABEL = ["", "perdido", "inseguro", "razoável", "seguro", "dominado"];

export function CloseUnit({
  unit,
  busy,
  runningAll,
  lastRun,
  onRunAll,
  onSaveReflection,
  onMarkAll,
}: Props) {
  const [reflection, setReflection] = useState(unit.progress.reflection || "");
  const [confidence, setConfidence] = useState<number | null>(unit.progress.confidence);
  const [confirming, setConfirming] = useState(false);

  const length = reflection.trim().length;
  const savedReflection = (unit.progress.reflection || "").trim().length;
  const savedConfidence = unit.progress.confidence ?? 0;
  const pendingMissions = unit.missions.filter((m) => !isMissionDone(m.status)).length;
  const dirty =
    reflection !== (unit.progress.reflection || "") ||
    confidence !== unit.progress.confidence;

  const checklist = [
    { done: unit.gate.tests, label: "Suíte da unidade verde" },
    {
      done: savedReflection >= MIN_REFLECTION_LENGTH,
      label: `Reflexão salva (mín. ${MIN_REFLECTION_LENGTH} caracteres)`,
    },
    {
      done: savedConfidence >= MIN_CONFIDENCE,
      label: `Confiança ${MIN_CONFIDENCE} ou mais`,
    },
  ];

  return (
    <div className="close-grid">
      <section className="unit-panel close-sec" aria-labelledby="close-suite-title">
        <h3 id="close-suite-title">Suíte completa</h3>
        <p className="unit-read close-help">
          Roda todos os testes da unidade. Verde aqui marca todas as missões como
          concluídas.
        </p>
        <div className="unit-actions">
          <button
            type="button"
            id={RUN_ALL_ID}
            className="unit-btn is-primary"
            disabled={busy}
            onClick={onRunAll}
          >
            {runningAll ? "Executando..." : "▶ Executar todos"}
          </button>
        </div>
        {lastRun && <RunOutput result={lastRun} />}

        <h3 className="close-sub">Missões</h3>
        <p className="unit-read close-help">
          {pendingMissions === 0
            ? "Todas as missões estão concluídas ou marcadas."
            : `${pendingMissions} missão(ões) ainda sem verde nem marca.`}
        </p>
        <div className="unit-actions">
          <button
            type="button"
            id={MARK_ALL_ID}
            className="unit-btn"
            disabled={busy}
            // aria-disabled (not disabled) keeps focus here after "marcar todas".
            aria-disabled={pendingMissions === 0}
            onClick={() => {
              if (pendingMissions > 0) setConfirming(true);
            }}
          >
            Marcar todas as missões
          </button>
        </div>
      </section>

      <section className="unit-panel close-sec" aria-labelledby="close-reflection-title">
        <h3 id="close-reflection-title">Reflexão e confiança</h3>
        <form
          className="close-form"
          onSubmit={(event) => {
            event.preventDefault();
            if (confidence !== null) onSaveReflection(reflection, confidence);
          }}
        >
          <label className="unit-k" htmlFor="unit-reflection">
            O que você aprendeu e onde ainda trava?
          </label>
          <textarea
            id="unit-reflection"
            className="close-textarea"
            rows={6}
            value={reflection}
            onChange={(event) => setReflection(event.target.value)}
            aria-describedby="unit-reflection-count"
          />
          <span
            id="unit-reflection-count"
            className={`close-count ${length >= MIN_REFLECTION_LENGTH ? "is-ok" : ""}`}
          >
            {length}/{MIN_REFLECTION_LENGTH}
            {length < MIN_REFLECTION_LENGTH
              ? ` · faltam ${MIN_REFLECTION_LENGTH - length}`
              : " · ok"}
          </span>

          <fieldset className="close-confidence">
            <legend className="unit-k">Confiança (1–5)</legend>
            <div className="close-scale">
              {[1, 2, 3, 4, 5].map((value) => (
                <label key={value} className="close-level">
                  <input
                    type="radio"
                    name="unit-confidence"
                    value={value}
                    checked={confidence === value}
                    onChange={() => setConfidence(value)}
                  />
                  <span aria-hidden="true">{value}</span>
                  <span className="sr-only">
                    {value} · {CONFIDENCE_LABEL[value]}
                  </span>
                </label>
              ))}
            </div>
            {confidence !== null && (
              <span className="close-count">{CONFIDENCE_LABEL[confidence]}</span>
            )}
          </fieldset>

          <div className="unit-actions">
            <button
              type="submit"
              id={REFLECTION_SAVE_ID}
              className="unit-btn is-primary"
              disabled={busy || confidence === null || length < MIN_REFLECTION_LENGTH}
            >
              Salvar reflexão
            </button>
            {dirty && <span className="close-count">alterações não salvas</span>}
          </div>
        </form>
      </section>

      <section
        className="unit-panel close-sec close-gate"
        aria-labelledby="close-gate-title"
      >
        <h3 id="close-gate-title">Gate da unidade</h3>
        <ul className="close-checklist">
          {checklist.map((item) => (
            <li key={item.label} className={item.done ? "is-done" : ""}>
              <span className="close-box" aria-hidden="true">
                {item.done ? "■" : ""}
              </span>
              <span className="unit-read">{item.label}</span>
              <span className="sr-only">{item.done ? " (feito)" : " (pendente)"}</span>
            </li>
          ))}
        </ul>
        {unit.gate.badge ? (
          <p className="close-badge" role="status">
            GATE FECHADO ★
          </p>
        ) : (
          <p className="unit-read close-help">
            O selo é uma conquista: nada depende dele para ser aberto.
          </p>
        )}
      </section>

      <ConfirmDialog
        open={confirming}
        title="Marcar todas as missões?"
        description={`As ${pendingMissions} missão(ões) pendentes de ${unit.id.toUpperCase()} ficam marcadas como feitas (sem teste verde).`}
        confirmLabel="Marcar todas"
        onCancel={() => setConfirming(false)}
        onConfirm={() => {
          setConfirming(false);
          onMarkAll();
        }}
      />
    </div>
  );
}
