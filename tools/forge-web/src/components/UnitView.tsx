import { Check, Circle, FlaskConical, Lightbulb, Play, ShieldCheck } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

import { api } from "../api";
import type { TestResult, UnitDetail } from "../types";

type Props = { unitId: string; onChanged: () => Promise<void> };

export function UnitView({ unitId, onChanged }: Props) {
  const [unit, setUnit] = useState<UnitDetail | null>(null);
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [testing, setTesting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;
    api.unit(unitId)
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

  async function runTests() {
    setTesting(true);
    setMessage("");
    try {
      const response = await api.test(unitId);
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
      setMessage(error instanceof Error ? error.message : "Não foi possível abrir a dica.");
    }
  }

  async function submitReflection(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    try {
      const updated = await api.reflect(
        unitId,
        String(form.get("reflection")),
        Number(form.get("confidence")),
      );
      setUnit(updated);
      setMessage(updated.gate.completed ? "Unidade concluída. Revisões agendadas." : "Reflexão salva.");
      await onChanged();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Não foi possível salvar a reflexão.");
    }
  }

  if (!unit) return <div className="loading-state">Carregando unidade...</div>;

  return (
    <div className="unit-layout">
      <article className="lesson-content">
        <header className="lesson-header">
          <div>
            <span className="eyebrow">Fase {unit.phase} · Unidade {unit.number}</span>
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
            <span><Check size={16} /> {unit.progress.testsPassed} passando</span>
            <span><Circle size={16} /> {unit.progress.testsFailed} falhando</span>
          </div>
          <button className="primary-button full-width" onClick={runTests} disabled={testing}>
            <Play size={17} fill="currentColor" />
            {testing ? "Executando..." : "Executar testes"}
          </button>
          {testResult && (
            <details className={`test-output ${testResult.success ? "success" : "failure"}`}>
              <summary>
                {testResult.success ? "Todos os testes passaram" : `${testResult.failed} teste(s) falharam`}
              </summary>
              <pre>{testResult.output}</pre>
            </details>
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
                <details key={hint.level} open={hint.level === 1}>
                  <summary>Nível {hint.level} · {hint.title}</summary>
                  <div className="hint-copy"><ReactMarkdown>{hint.content}</ReactMarkdown></div>
                </details>
              ) : (
                <button key={hint.level} className="hint-button" onClick={() => revealHint(hint.level)}>
                  <Lightbulb size={16} /> Revelar dica {hint.level}
                </button>
              ),
            )}
          </div>
        </section>

        <section className="panel gate-panel">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Gate</span>
              <h3>Conclusão da unidade</h3>
            </div>
            <ShieldCheck size={20} />
          </div>
          <ul className="gate-list">
            <GateItem done={unit.gate.tests} label="Testes verdes" />
            <GateItem done={unit.gate.reflection} label="Reflexão registrada" />
            <GateItem done={unit.gate.confidence} label="Confiança mínima 3" />
          </ul>
          <form className="reflection-form" onSubmit={submitReflection}>
            <label>
              O que você aprendeu?
              <textarea
                name="reflection"
                rows={4}
                defaultValue={unit.progress.reflection}
                placeholder="Explique com suas palavras..."
                required
              />
            </label>
            <label>
              Confiança
              <select name="confidence" defaultValue={unit.progress.confidence || 3}>
                <option value="1">1 · Ainda confuso</option>
                <option value="2">2 · Preciso revisar</option>
                <option value="3">3 · Consigo explicar</option>
                <option value="4">4 · Consigo aplicar</option>
                <option value="5">5 · Domino o tema</option>
              </select>
            </label>
            <button className="secondary-button">Salvar reflexão</button>
          </form>
          {message && <p className="form-message" role="status">{message}</p>}
        </section>
      </aside>
    </div>
  );
}

function GateItem({ done, label }: { done: boolean; label: string }) {
  return <li className={done ? "done" : ""}>{done ? <Check size={16} /> : <Circle size={16} />}{label}</li>;
}
