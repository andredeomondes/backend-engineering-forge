import { Check, Circle, FlaskConical, Lightbulb, Play } from "lucide-react";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

import { api } from "../api";
import type { TestResult, UnitDetail } from "../types";

type Props = { unitId: string; onChanged: () => Promise<void> };

export function UnitView({ unitId, onChanged }: Props) {
  const [unit, setUnit] = useState<UnitDetail | null>(null);
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [testing, setTesting] = useState<string | boolean>(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;
    api
      .unit(unitId)
      .then((detail) => {
        if (active) setUnit(detail);
      })
      .catch((error) => {
        if (active) setMessage(error.message);
      });
    return () => {
      active = false;
    };
  }, [unitId]);

  async function runTests(exerciseName?: string) {
    setTesting(exerciseName || true);
    setMessage("");
    try {
      const response = await api.test(unitId, exerciseName);
      setTestResult(response.result);
      setUnit(response.unit);
      await onChanged();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Falha ao executar os testes.");
    } finally {
      setTesting(false);
    }
  }

  async function revealHint(level: number) {
    try {
      setUnit(await api.revealHint(unitId, level));
      await onChanged();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Não foi possível abrir a dica.",
      );
    }
  }

  if (!unit) return <div className="loading-state">Carregando unidade...</div>;

  return (
    <div className="unit-layout">
      <article className="lesson-content">
        <header className="lesson-header">
          <div>
            <span className="eyebrow">
              Fase {unit.phase} · Unidade {unit.number}
            </span>
            <h2>{unit.title}</h2>
          </div>
          <span className={`status-badge ${unit.gate.completed ? "complete" : "active"}`}>
            {unit.gate.completed ? "Concluída" : "Em andamento"}
          </span>
        </header>
        <div className="markdown-body">
          <ReactMarkdown>{unit.markdown}</ReactMarkdown>
        </div>
      </article>

      <aside className="unit-tools">
        <section className="panel test-panel">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Validação</span>
              <h3>Testes da unidade</h3>
            </div>
            <FlaskConical size={20} />
          </div>
          <div className="test-summary">
            <span>
              <Check size={16} /> {unit.progress.testsPassed} passando
            </span>
            <span>
              <Circle size={16} /> {unit.progress.testsFailed} falhando
            </span>
          </div>
          <button
            className="primary-button full-width"
            onClick={() => runTests()}
            disabled={!!testing}
          >
            <Play size={17} fill="currentColor" />
            {testing === true ? "Executando..." : "Executar todos"}
          </button>
          {testResult && (
            <details
              className={`test-output ${testResult.success ? "success" : "failure"}`}
            >
              <summary>
                {testResult.success
                  ? "Todos os testes passaram"
                  : `${testResult.failed} teste(s) falharam`}
              </summary>
              <pre>{testResult.output}</pre>
            </details>
          )}
          {unit.exercises.length > 0 && (
            <ul className="exercise-list">
              {unit.exercises.map((exercise) => (
                <li key={exercise.index}>
                  <span>
                    {exercise.index}. {exercise.name}
                  </span>
                  <button
                    className="icon-button"
                    title={`Executar só ${exercise.name}`}
                    onClick={() => runTests(exercise.name)}
                    disabled={!!testing}
                  >
                    {testing === exercise.name ? "..." : <Play size={14} />}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="panel hints-panel">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Apoio</span>
              <h3>Dicas progressivas</h3>
            </div>
            <Lightbulb size={20} />
          </div>
          <div className="hint-list">
            {unit.hints.map((hint) =>
              hint.revealed ? (
                <details key={hint.level} name="hint-accordion">
                  <summary>
                    Nível {hint.level} · {hint.title}
                  </summary>
                  <div className="hint-copy">
                    <ReactMarkdown>{hint.content}</ReactMarkdown>
                  </div>
                </details>
              ) : (
                <button
                  key={hint.level}
                  className="hint-button"
                  onClick={() => revealHint(hint.level)}
                >
                  <Lightbulb size={16} /> Revelar dica {hint.level}
                </button>
              ),
            )}
          </div>
        </section>

        {message && (
          <p className="form-message" role="status">
            {message}
          </p>
        )}
      </aside>
    </div>
  );
}
