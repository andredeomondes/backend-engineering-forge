import type { TrailData } from "../../types";

type Props = {
  sheet: TrailData["sheet"];
};

function plural(count: number, singular: string, pluralForm: string) {
  return `${count} ${count === 1 ? singular : pluralForm}`;
}

function Meter({ label, percent, size = "lg" }: { label: string; percent: number; size?: "lg" | "sm" }) {
  const value = Math.max(0, Math.min(100, Math.round(percent)));
  return (
    <div
      className={`trail-meter trail-meter-${size}`}
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value}
    >
      <i style={{ width: `${value}%` }} />
    </div>
  );
}

export function CharacterSheet({ sheet }: Props) {
  const next = sheet.nextLevel
    ? `${sheet.nextLevel.name} ▸ Fase ${sheet.nextLevel.firstPhase}`
    : "Nível máximo";

  return (
    <section className="trail-sheet" aria-label="Ficha do personagem">
      <div className="trail-sheet-grid">
        <div className="trail-sheet-col">
          <span className="trail-k">Classe</span>
          <strong className="trail-v">{sheet.className}</strong>
          <span className="trail-k">Nível atual</span>
          <strong className="trail-v">{sheet.level.name}</strong>
        </div>
        <div className="trail-sheet-col">
          <span className="trail-k">XP da formação · {sheet.xpPercent}%</span>
          <Meter label="XP da formação" percent={sheet.xpPercent} />
          <span className="trail-sheet-count">
            {sheet.phasesDone}/{sheet.phasesTotal} fases · {sheet.unitsDone}/{sheet.unitsTotal}{" "}
            unidades
          </span>
          <span className="trail-k">Próximo nível</span>
          <strong className="trail-v">{next}</strong>
        </div>
        <div className="trail-sheet-col">
          <span className="trail-k">Você está em</span>
          <strong className="trail-v">
            Fase {sheet.currentPhase} · {sheet.currentUnitId.toUpperCase()}
          </strong>
          <span className="trail-k">Falta nesta fase</span>
          <strong className="trail-v">
            {sheet.remainingInPhase === 0
              ? "Fase completa"
              : plural(sheet.remainingInPhase, "unidade", "unidades")}
          </strong>
        </div>
      </div>
      <div className="trail-sheet-side">
        <div className="trail-mini">
          <span className="trail-k">Side quest Java</span>
          <Meter label="Side quest Java" percent={sheet.java.percent} size="sm" />
          <span className="trail-mini-pct">{sheet.java.percent}%</span>
        </div>
        <div className="trail-mini">
          <span className="trail-k">DSA · Fase 12</span>
          <Meter label="DSA, Fase 12" percent={sheet.dsa.percent} size="sm" />
          <span className="trail-mini-pct">{sheet.dsa.percent}%</span>
        </div>
      </div>
    </section>
  );
}
