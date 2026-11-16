import { useRef, useState } from "react";

import roadmap from "../../../../docs/curriculum/study-sessions.md?raw";
import type { UnitSummary } from "../types";
import { Button } from "./ui/8bit/button";

const storageKey = "forge-roadmap-completed";
const blocks = roadmap
  .split(/^## Dias /m)
  .slice(1)
  .map((block) => {
    const title = block.split("\n", 1)[0].trim();
    const days = Array.from(
      block.matchAll(/^\| (\d+) \| (.+?) \| (.+?) \| (.+?) \|$/gm),
      (row) => ({
        number: Number(row[1]),
        focus: row[2].replaceAll("`", ""),
        practice: row[3].replaceAll("`", ""),
        english: row[4],
      }),
    );
    return { title, days };
  });
const days = blocks.flatMap((block) => block.days);

function readCompleted(): number[] {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(storageKey) ?? "[]");
    return Array.isArray(saved)
      ? days.filter((day) => saved.includes(day.number)).map((day) => day.number)
      : [];
  } catch {
    return [];
  }
}

type Props = {
  units: UnitSummary[];
  onOpenUnit: (id: string) => Promise<void>;
  mode?: "today" | "roadmap";
};

export function RoadmapView({ units, onOpenUnit, mode = "roadmap" }: Props) {
  const [completed, setCompleted] = useState(readCompleted);
  const [browsedDay, setSelected] = useState(
    () => days.find((day) => !completed.includes(day.number))?.number ?? days.length,
  );
  const [openingUnit, setOpeningUnit] = useState(false);
  const [error, setError] = useState("");
  const [copiedDay, setCopiedDay] = useState<number | null>(null);
  const dayHeading = useRef<HTMLHeadingElement>(null);
  const currentDay = days.find((entry) => !completed.includes(entry.number));
  const isToday = mode === "today";
  const selected = isToday ? (currentDay?.number ?? days.length) : browsedDay;
  const day = days[selected - 1];
  const block = blocks.find((entry) => entry.days.includes(day))!;
  const references = new Set(
    `${day.focus} ${day.practice}`.match(/\b(?:js|ts|node|sql|java)-\d{2}\b/g),
  );
  const linkedUnits = units.filter((unit) => references.has(unit.id));
  const isComplete = completed.includes(selected);

  function openDay(number: number) {
    setSelected(number);
    setError("");
    dayHeading.current?.focus();
  }

  async function copyEnglishPrompt() {
    const prompt = `Treine inglês falado comigo no Dia ${day.number} por 20 minutos. Tema: ${day.english} Use 2 minutos para explicar a estrutura com um exemplo, 15 para conversar e 3 para feedback. Faça uma pergunta de cada vez, espere minha resposta em voz alta e ajuste a dificuldade. No fim, corrija dois pontos e peça que eu repita uma resposta.`;
    try {
      await navigator.clipboard.writeText(prompt);
      setCopiedDay(day.number);
      setError("");
    } catch {
      setError("Não foi possível copiar. Use o tema abaixo em uma conversa por voz.");
    }
  }

  function toggleDay() {
    const next = isComplete
      ? completed.filter((number) => number !== selected)
      : [...completed, selected];
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
      setCompleted(next);
      setError("");
    } catch {
      setError("O navegador não conseguiu salvar este dia.");
    }
  }

  async function openUnit(id: string) {
    setOpeningUnit(true);
    setError("");
    try {
      await onOpenUnit(id);
    } catch {
      setError("Não foi possível abrir a unidade. Tente novamente.");
    } finally {
      setOpeningUnit(false);
    }
  }

  return (
    <section className="roadmap-view" aria-labelledby="roadmap-title">
      <header className="roadmap-heading">
        <h1 id="roadmap-title">
          {isToday ? "Dia atual" : `Roteiro de ${days.length} dias`}
        </h1>
        {!isToday && (
          <p>
            TicketAtlas com TypeScript, Express, NestJS e React. LedgerFlow com Java e
            Spring. Inglês falado todos os dias.
          </p>
        )}
        <p>
          Uma hora por dia: 5 min de revisão, 10 min de teoria, 25 min de prática e 20 min
          de inglês.
        </p>
        <label htmlFor="roadmap-progress">
          {completed.length} de {days.length} dias concluídos neste navegador
        </label>
        <progress id="roadmap-progress" value={completed.length} max={days.length} />
        {!isToday && (
          <div className="roadmap-current">
            {currentDay ? (
              <>
                <strong>Dia atual · {currentDay.number}</strong>
                <span>{currentDay.focus}</span>
                {selected !== currentDay.number && (
                  <Button variant="secondary" onClick={() => openDay(currentDay.number)}>
                    Voltar ao dia atual
                  </Button>
                )}
              </>
            ) : (
              <strong>Roteiro concluído</strong>
            )}
          </div>
        )}
      </header>

      {isToday && !currentDay ? (
        <p className="panel">
          Roteiro concluído. Abra Roteiro para revisar qualquer sessão.
        </p>
      ) : (
        <article className="panel roadmap-day">
          {!isToday && (
            <>
              <label htmlFor="roadmap-day">Ir para o dia</label>
              <select
                id="roadmap-day"
                value={selected}
                onChange={(event) => setSelected(Number(event.target.value))}
              >
                {blocks.map((group) => (
                  <optgroup key={group.title} label={group.title}>
                    {group.days.map((entry) => (
                      <option key={entry.number} value={entry.number}>
                        Dia {entry.number}
                        {completed.includes(entry.number) ? " ✓" : ""}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </>
          )}
          <div aria-live="polite">
            <p className="roadmap-block">Dias {block.title}</p>
            <h2 ref={dayHeading} tabIndex={-1}>
              Dia {selected}
            </h2>
            <div className="roadmap-session-grid">
              <section className="roadmap-step">
                {isToday && (
                  <>
                    <h3>Revisão · 5 min</h3>
                    <p>
                      {selected === 1
                        ? "Explique de memória o que já sabe sobre o tema antes de abrir a unidade."
                        : `Relembre o Dia ${selected - 1}. ${days[selected - 2].focus}`}
                    </p>
                  </>
                )}
                <h3>{isToday ? "Estudo · 10 min" : "Estude"}</h3>
                <p>{day.focus}</p>
              </section>
              <section className="roadmap-step">
                <h3>{isToday ? "Prática e registro · 25 min" : "Pratique e registre"}</h3>
                <p>{day.practice}</p>
              </section>
              <section className="roadmap-step">
                <h3>Inglês por voz · 20 min</h3>
                <p lang="en">{day.english}</p>
                <p>2 min de teoria, 15 min de conversa e 3 min de correção.</p>
                <Button variant="secondary" onClick={() => void copyEnglishPrompt()}>
                  {copiedDay === selected ? "Prompt copiado" : "Copiar prompt de inglês"}
                </Button>
              </section>
            </div>
          </div>
          <div className="roadmap-footer">
            {linkedUnits.length > 0 && (
              <div className="roadmap-actions" aria-label="Unidades deste dia">
                {linkedUnits.map((unit) => (
                  <Button
                    key={unit.id}
                    variant="secondary"
                    disabled={openingUnit}
                    onClick={() => void openUnit(unit.id)}
                  >
                    Abrir {unit.id}
                  </Button>
                ))}
              </div>
            )}
            <div className="roadmap-actions">
              {!isToday && (
                <Button
                  variant="secondary"
                  disabled={selected === 1}
                  onClick={() => setSelected(selected - 1)}
                >
                  Dia anterior
                </Button>
              )}
              <Button onClick={toggleDay}>
                {isComplete ? "Reabrir dia" : "Marcar dia concluído"}
              </Button>
              {!isToday && (
                <Button
                  variant="secondary"
                  disabled={selected === days.length}
                  onClick={() => setSelected(selected + 1)}
                >
                  Próximo dia
                </Button>
              )}
            </div>
          </div>
          {error && <p role="alert">{error}</p>}
        </article>
      )}

      {!isToday && (
        <section aria-labelledby="roadmap-blocks">
          <h2 id="roadmap-blocks">Blocos de estudo</h2>
          <div className="roadmap-blocks">
            {blocks.map((entry) => (
              <details key={entry.title}>
                <summary>
                  <span>Dias {entry.title}</span>
                  <span>
                    {entry.days.filter((item) => completed.includes(item.number)).length}/
                    {entry.days.length}
                  </span>
                </summary>
                <ul>
                  {entry.days.map((item) => (
                    <li key={item.number}>
                      <button
                        type="button"
                        aria-current={item.number === selected ? "true" : undefined}
                        onClick={() => openDay(item.number)}
                      >
                        <span>
                          Dia {item.number} · {item.focus}
                        </span>
                        {completed.includes(item.number) && <span>Concluído</span>}
                        {currentDay?.number === item.number && <span>Dia atual</span>}
                      </button>
                    </li>
                  ))}
                </ul>
              </details>
            ))}
          </div>
        </section>
      )}
    </section>
  );
}
