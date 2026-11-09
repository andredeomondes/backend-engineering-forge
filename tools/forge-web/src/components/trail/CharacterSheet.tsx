import { RefreshCw } from "lucide-react";

import type { TrailData, TrailNode } from "../../types";
import { useHero } from "../rpg/hero";
import { Sprite } from "../rpg/Sprite";

type Props = {
  sheet: TrailData["sheet"];
  nodes: TrailNode[];
};

type Gear = {
  slot: string;
  skill: string;
  percent: number;
  item?: { src: string; w: number; h: number };
};

function plural(count: number, singular: string, pluralForm: string) {
  return `${count} ${count === 1 ? singular : pluralForm}`;
}

function clamp(percent: number) {
  return Math.max(0, Math.min(100, Math.round(percent)));
}

export function Meter({
  label,
  percent,
  tone = "xp",
}: {
  label: string;
  percent: number;
  tone?: "xp" | "hp" | "mp";
}) {
  const value = clamp(percent);
  return (
    <div
      className={`mmo-bar is-${tone}`}
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

function phasePercent(nodes: TrailNode[], phase: number) {
  return nodes.find((n) => n.kind === "phase" && n.phase === phase)?.percent ?? 0;
}

function buildGear(sheet: TrailData["sheet"], nodes: TrailNode[]): Gear[] {
  return [
    { slot: "helmet", skill: "Ambiente & Web", percent: phasePercent(nodes, 0) },
    {
      slot: "weapon",
      skill: "JavaScript",
      percent: phasePercent(nodes, 1),
      item: { src: "/sprites/weapon_knight_sword.png", w: 10, h: 29 },
    },
    {
      slot: "shield",
      skill: "TypeScript",
      percent: phasePercent(nodes, 2),
      item: { src: "/rpgui/icons/shield.png", w: 12, h: 12 },
    },
    { slot: "shoes", skill: "Node.js", percent: phasePercent(nodes, 3) },
    { slot: "armor", skill: "SQL", percent: phasePercent(nodes, 4) },
    {
      slot: "ring",
      skill: "DSA",
      percent: sheet.dsa.percent,
      item: { src: "/sprites/coin_anim_f0.png", w: 8, h: 8 },
    },
    {
      slot: "magic",
      skill: "Java",
      percent: sheet.java.percent,
      item: { src: "/sprites/weapon_green_magic_staff.png", w: 8, h: 30 },
    },
  ];
}

function GearSlot({ gear }: { gear: Gear }) {
  const owned = gear.percent > 0;
  const mastered = gear.percent >= 100;
  return (
    <div
      className={`mmo-slot ${owned ? "is-owned" : ""} ${mastered ? "is-mastered" : ""}`}
      title={`${gear.skill}: ${gear.percent}%`}
    >
      <span className="mmo-slot-box">
        {owned && gear.item ? (
          <img
            className="sprite"
            src={gear.item.src}
            alt=""
            style={{ height: gear.item.h > 20 ? 34 : gear.item.h * 2.5 }}
          />
        ) : (
          <img className="sprite mmo-slot-bg" src={`/rpgui/icons/${gear.slot}-slot.png`} alt="" />
        )}
      </span>
      <span className="mmo-slot-name">{gear.skill}</span>
    </div>
  );
}

export function CharacterSheet({ sheet, nodes }: Props) {
  const { hero, label, cycle } = useHero();
  const gear = buildGear(sheet, nodes);
  const next = sheet.nextLevel
    ? `${sheet.nextLevel.name} ▸ Fase ${sheet.nextLevel.firstPhase}`
    : "Nível máximo";

  return (
    <section className="trail-sheet mmo-sheet" aria-label="Ficha do personagem">
      <div className="mmo-portrait">
        <div className="mmo-stage">
          <Sprite name={hero} width={16} height={28} scale={4} label={label} />
        </div>
        <button type="button" className="mmo-class-btn" onClick={cycle}>
          <RefreshCw size={12} /> {label}
        </button>
      </div>

      <div className="mmo-stats">
        <span className="trail-k">{sheet.className}</span>
        <strong className="mmo-level">
          {sheet.level.id.toUpperCase()} · {sheet.level.name}
        </strong>
        <div className="mmo-stat-row">
          <span>XP</span>
          <Meter label="XP da formação" percent={sheet.xpPercent} />
          <b>{sheet.xpPercent}%</b>
        </div>
        <span className="trail-sheet-count">
          {sheet.phasesDone}/{sheet.phasesTotal} fases · {sheet.unitsDone}/
          {sheet.unitsTotal} unidades
        </span>
        <dl className="mmo-facts">
          <div>
            <dt>Você está em</dt>
            <dd>
              Fase {sheet.currentPhase} · {sheet.currentUnitId.toUpperCase()}
            </dd>
          </div>
          <div>
            <dt>Falta nesta fase</dt>
            <dd>
              {sheet.remainingInPhase === 0
                ? "Fase completa"
                : plural(sheet.remainingInPhase, "unidade", "unidades")}
            </dd>
          </div>
          <div>
            <dt>Próximo nível</dt>
            <dd>{next}</dd>
          </div>
        </dl>
      </div>

      <div className="mmo-gear">
        <span className="trail-k">Equipamento</span>
        <div className="mmo-gear-grid">
          {gear.map((g) => (
            <GearSlot key={g.slot} gear={g} />
          ))}
        </div>
      </div>

      <div className="mmo-skills">
        <span className="trail-k">Skills</span>
        <ul>
          {gear.map((g) => (
            <li key={g.slot}>
              <span>{g.skill}</span>
              <b>{g.percent}</b>
              <Meter label={`${g.skill}`} percent={g.percent} tone="mp" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
