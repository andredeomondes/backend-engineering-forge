import { useState } from "react";
import ReactMarkdown from "react-markdown";

import type { Exercise, Mission, TestResult, UnitDetail } from "../../types";
import {
  HINT_LIST_ID,
  STATUS_LABEL,
  groupLabel,
  hintButtonId,
  isMissionDone,
  missionDoneId,
  missionRunId,
} from "./format";

export type MissionRun = { result: TestResult; noTests: boolean };

type Props = {
  unit: UnitDetail;
  exercise: Exercise;
  mission: Mission;
  busy: boolean;
  running: boolean;
  run: MissionRun | null;
  onRun: () => void;
  onToggleDone: (done: boolean) => void;
  onRevealHint: (level: number) => void;
};

const STATUS_BADGE: Record<Mission["status"], string> = {
  todo: "○ não feita",
  failing: "✕ teste falhando",
  passed: "■ teste verde",
  manual: "▨ marcada · sem teste",
};

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Splits hint markdown into top-level blocks (each bullet with its continuation lines). */
function hintBlocks(content: string) {
  const lines = content.replace(/\r\n?/g, "\n").split("\n");
  const blocks: string[] = [];
  let current: string[] = [];
  let fenced = false;
  const flush = () => {
    const text = current.join("\n").trim();
    if (text) blocks.push(text);
    current = [];
  };
  for (const line of lines) {
    const startsItem = !fenced && /^([-*+]|\d+[.)])\s/.test(line);
    if (startsItem) flush();
    if (/^\s*(```|~~~)/.test(line)) fenced = !fenced;
    current.push(line);
  }
  flush();
  return blocks;
}

function splitHint(content: string, missionId: string) {
  const pattern = new RegExp(`(^|[^\\w$])${escapeRegExp(missionId)}(?![\\w$])`);
  const mine: string[] = [];
  const others: string[] = [];
  for (const block of hintBlocks(content))
    (pattern.test(block) ? mine : others).push(block);
  return { mine: mine.join("\n"), others: others.join("\n") };
}

function RuleList({ items, warn = false }: { items: string[]; warn?: boolean }) {
  if (items.length === 0) return <p className="mission-none">—</p>;
  return (
    <ul className={`mission-rules ${warn ? "is-warn" : ""}`}>
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
}

function CopyCommand({ command }: { command: string }) {
  const [copied, setCopied] = useState<"" | "ok" | "fail">("");

  async function copy() {
    try {
      await navigator.clipboard.writeText(command);
      setCopied("ok");
    } catch {
      setCopied("fail");
    }
  }

  return (
    <div className="mission-cmd">
      <code>{command}</code>
      <button type="button" className="unit-btn is-small" onClick={copy}>
        {copied === "ok" ? "Copiado" : "Copiar"}
      </button>
      <span className="sr-only" role="status">
        {copied === "ok"
          ? "Comando copiado."
          : copied === "fail"
            ? "Não foi possível copiar; selecione o comando."
            : ""}
      </span>
    </div>
  );
}

function RunSummary({ run }: { run: MissionRun }) {
  if (run.noTests) {
    return (
      <p className="mission-note" role="status">
        Sem teste próprio para esta missão — marque como feita quando concluir.
      </p>
    );
  }
  return <RunOutput result={run.result} />;
}

/** Result line (announced) + collapsible raw output. Shared with CloseUnit. */
export function RunOutput({ result }: { result: TestResult }) {
  return (
    <div className={`unit-output ${result.success ? "is-pass" : "is-fail"}`}>
      <p className="unit-output-line" role="status">
        {result.success
          ? `■ ${result.passed}/${result.total} teste(s) passaram`
          : result.total === 0
            ? "✕ nenhum teste rodou"
            : `✕ ${result.failed} de ${result.total} teste(s) falharam`}
        <small> · {(result.durationMs / 1000).toFixed(1)}s</small>
      </p>
      <details>
        <summary>ver saída</summary>
        <pre>{result.output}</pre>
      </details>
    </div>
  );
}

export function MissionCard({
  unit,
  exercise,
  mission,
  busy,
  running,
  run,
  onRun,
  onToggleDone,
  onRevealHint,
}: Props) {
  const detail = exercise.detail;
  const done = isMissionDone(mission.status);
  const command = `node --test --test-name-pattern="^${exercise.id}\\b" ${unit.testPath}`;
  const total = unit.missions.length;

  return (
    <section className="mission-card" aria-labelledby="mission-title">
      <header className="mission-head">
        <div>
          <span className="unit-k">
            Missão {exercise.index} de {total}
          </span>
          <h3 id="mission-title" className="mission-name">
            {exercise.name}
          </h3>
        </div>
        <div className="mission-badges">
          <span className="unit-badge">{groupLabel(exercise.group)}</span>
          {detail?.uses && <span className="unit-badge">USA: {detail.uses}</span>}
          <span className={`unit-badge is-status is-${mission.status}`}>
            {STATUS_BADGE[mission.status]}
            <span className="sr-only"> ({STATUS_LABEL[mission.status]})</span>
          </span>
        </div>
      </header>

      {detail ? (
        <>
          <div className="mission-sec">
            <span className="unit-k">Objetivo</span>
            <p className="unit-read mission-goal">{detail.objective}</p>
          </div>

          {detail.example && (
            <div className="mission-sec">
              <span className="unit-k">Exemplo · entrada ▶ saída</span>
              <div className="mission-io">
                <pre aria-label="Entrada">{detail.example.input}</pre>
                <span className="mission-arrow" aria-hidden="true">
                  ▶
                </span>
                <pre aria-label="Saída">{detail.example.output}</pre>
              </div>
            </div>
          )}

          <div className="mission-cols">
            <div className="mission-sec">
              <span className="unit-k">Regras</span>
              <RuleList items={detail.rules} />
            </div>
            <div className="mission-sec">
              <span className="unit-k">Armadilhas</span>
              <RuleList items={detail.pitfalls} warn />
            </div>
          </div>
        </>
      ) : (
        <div className="mission-sec">
          <span className="unit-k">Enunciado</span>
          <div className="unit-read unit-markdown mission-summary">
            <ReactMarkdown>
              {exercise.summary || "Sem enunciado no README."}
            </ReactMarkdown>
          </div>
        </div>
      )}

      <div className="mission-sec">
        <span className="unit-k">Validar</span>
        {unit.missionTestable ? (
          <>
            <div className="unit-actions">
              <button
                type="button"
                id={missionRunId(exercise.id)}
                className="unit-btn is-primary"
                disabled={busy}
                onClick={onRun}
              >
                {running ? "Rodando..." : "▶ Rodar teste desta missão"}
              </button>
            </div>
            <CopyCommand command={command} />
          </>
        ) : (
          <p className="mission-note">
            Esta unidade não tem teste por missão: valide pela suíte completa na aba
            "Fechar unidade".
          </p>
        )}
        {run && <RunSummary run={run} />}
        <label className="unit-check">
          <input
            id={missionDoneId(exercise.id)}
            type="checkbox"
            checked={done}
            disabled={busy || mission.status === "passed"}
            onChange={(event) => onToggleDone(event.target.checked)}
          />
          <span>
            Marcar como feita
            {mission.status === "passed" && (
              <small className="unit-check-note"> · já concluída pelo teste verde</small>
            )}
          </span>
        </label>
      </div>

      <div className="mission-sec" id={HINT_LIST_ID} tabIndex={-1}>
        <span className="unit-k">Dicas progressivas · cada uma revela mais</span>
        <MissionHints
          hints={unit.hints}
          missionId={exercise.id}
          busy={busy}
          onRevealHint={onRevealHint}
        />
      </div>
    </section>
  );
}

function MissionHints({
  hints,
  missionId,
  busy,
  onRevealHint,
}: {
  hints: UnitDetail["hints"];
  missionId: string;
  busy: boolean;
  onRevealHint: (level: number) => void;
}) {
  if (hints.length === 0)
    return <p className="mission-none">Esta unidade não tem dicas.</p>;

  const sorted = [...hints].sort((a, b) => a.level - b.level);
  const revealed = sorted.filter((hint) => hint.revealed);
  const pending = sorted.filter((hint) => !hint.revealed);

  return (
    <>
      {revealed.map((hint) => {
        const { mine, others } = splitHint(hint.content, missionId);
        return (
          <article key={hint.level} className="mission-hint">
            <h4 className="mission-hint-title">
              Dica {hint.level}
              {hint.title ? ` · ${hint.title}` : ""}
            </h4>
            {mine ? (
              <div className="unit-read unit-markdown">
                <ReactMarkdown>{mine}</ReactMarkdown>
              </div>
            ) : (
              <p className="mission-none">Nada específico desta missão neste nível.</p>
            )}
            {others && (
              <details className="mission-more">
                <summary>outras dicas da unidade</summary>
                <div className="unit-read unit-markdown">
                  <ReactMarkdown>{others}</ReactMarkdown>
                </div>
              </details>
            )}
          </article>
        );
      })}
      {pending.length > 0 && (
        <div className="unit-actions">
          {pending.map((hint) => {
            const previous = sorted.find((item) => item.level === hint.level - 1);
            const waiting = Boolean(previous && !previous.revealed);
            return (
              <button
                key={hint.level}
                type="button"
                id={hintButtonId(hint.level)}
                className="unit-btn"
                disabled={busy || waiting}
                onClick={() => onRevealHint(hint.level)}
              >
                {waiting
                  ? `Dica ${hint.level} · abra a dica ${previous?.level} primeiro`
                  : `Revelar dica ${hint.level}${hint.title ? ` · ${hint.title}` : ""}`}
              </button>
            );
          })}
        </div>
      )}
    </>
  );
}
