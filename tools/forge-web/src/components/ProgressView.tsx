import {
  ArrowRight,
  Braces,
  Check,
  Code2,
  Database,
  FolderKanban,
  Languages,
  LockKeyhole,
  Map,
  Server,
  TableProperties,
} from "lucide-react";

import type { DashboardData } from "../types";

type Props = {
  data: DashboardData;
  onSelect: (unitId: string) => Promise<void>;
};

export function ProgressView({ data, onSelect }: Props) {
  const javascript = data.units.filter((unit) => unit.track === "javascript");
  const typescript = data.units.filter((unit) => unit.track === "typescript");
  const node = data.units.filter((unit) => unit.track === "node");
  const sql = data.units.filter((unit) => unit.track === "sql");
  const dsa = data.units.filter((unit) => unit.track === "dsa");

  return (
    <div className="page-stack">
      <header className="page-header">
        <div>
          <span className="eyebrow">Jornada</span>
          <h2>Progresso da formação</h2>
        </div>
        <strong>{data.stats.completedUnits}/{data.stats.totalUnits} unidades</strong>
      </header>

      <section className="roadmap-section">
        <div className="track-heading">
          <Map size={20} />
          <div><h3>Fases do Forge</h3><span>0–27 · avance somente por gate</span></div>
        </div>
        <div className="phase-groups">
          <PhaseGroup title="Fundamentos" phases={data.phases.filter((phase) => phase.number <= 3)} />
          <PhaseGroup title="Backend profissional" phases={data.phases.filter((phase) => phase.number >= 4 && phase.number <= 8)} />
          <PhaseGroup title="Produção e full-stack" phases={data.phases.filter((phase) => phase.number >= 9 && phase.number <= 14)} />
          <PhaseGroup title="Engenharia sênior" phases={data.phases.filter((phase) => phase.number >= 15)} />
        </div>
      </section>

      <section className="track-section">
        <div className="track-heading">
          <Code2 size={20} />
          <div><h3>JavaScript profundo</h3><span>Fase 1</span></div>
        </div>
        <UnitTable units={javascript} currentId={data.currentUnit.id} onSelect={onSelect} />
      </section>

      <section className="track-section">
        <div className="track-heading">
          <Braces size={20} />
          <div><h3>TypeScript profissional</h3><span>Fase 2 · bloqueada até o gate de JavaScript</span></div>
        </div>
        <UnitTable units={typescript} currentId={data.currentUnit.id} onSelect={onSelect} />
      </section>

      <section className="track-section">
        <div className="track-heading">
          <Server size={20} />
          <div><h3>Node.js por baixo dos frameworks</h3><span>Fase 3 · bloqueada até o gate de TypeScript</span></div>
        </div>
        <UnitTable units={node} currentId={data.currentUnit.id} onSelect={onSelect} />
      </section>

      <section className="track-section">
        <div className="track-heading">
          <TableProperties size={20} />
          <div><h3>SQL e PostgreSQL de verdade</h3><span>Fase 4 · preparada e bloqueada até o gate de Node.js</span></div>
        </div>
        <UnitTable units={sql} currentId={data.currentUnit.id} onSelect={onSelect} />
      </section>

      <section className="track-section">
        <div className="track-heading">
          <Database size={20} />
          <div><h3>Estruturas de dados e algoritmos</h3><span>Trilha paralela</span></div>
        </div>
        <UnitTable units={dsa} currentId={data.currentUnit.id} onSelect={onSelect} />
      </section>

      <section className="projects-section">
        <div className="track-heading">
          <FolderKanban size={20} />
          <div><h3>Projetos progressivos</h3><span>Aplicação prática</span></div>
        </div>
        <div className="project-list">
          {data.projects.map((project) => (
            <article key={project.id}>
              <div>
                <span className={`status-badge ${project.status === "available" ? "complete" : "active"}`}>
                  {project.status === "available" ? "Disponível" : `Após ${project.unlockAfter?.toUpperCase()}`}
                </span>
                <h4>{project.title}</h4>
              </div>
              <span>{project.status === "available" ? "Pronto para iniciar" : "Bloqueado"}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="polyglot-section">
        <div className="track-heading">
          <Languages size={20} />
          <div><h3>Polyglot Backend Engineering</h3><span>Uma opção após o gate da Fase 9</span></div>
        </div>
        <div className="polyglot-list">
          {data.polyglotTracks.map((track) => (
            <article key={track.id}>
              <LockKeyhole size={17} />
              <div><strong>{track.title}</strong><span>{track.modules}</span></div>
              <span className="status-badge active">Bloqueada</span>
            </article>
          ))}
        </div>
        <p className="track-note">Nenhuma trilha selecionada · futura divisão 70% Forge / 30% especialização</p>
      </section>
    </div>
  );
}

function PhaseGroup({ title, phases }: {
  title: string;
  phases: DashboardData["phases"];
}) {
  return (
    <div className="phase-group">
      <strong>{title}</strong>
      {phases.map((phase) => (
        <div key={phase.number} className={`phase-row ${phase.status}`}>
          <span>{String(phase.number).padStart(2, "0")}</span>
          <div><strong>{phase.title}</strong><small>{phase.label.replace(/^[🟢🟡⚪]\s*/u, "")}</small></div>
        </div>
      ))}
    </div>
  );
}

function UnitTable({ units, currentId, onSelect }: {
  units: DashboardData["units"];
  currentId: string;
  onSelect: (unitId: string) => Promise<void>;
}) {
  return (
    <div className="unit-table">
      {units.map((unit) => (
        <article key={unit.id} className={unit.id === currentId ? "current" : ""}>
          <span className={`unit-number ${unit.status === "completed" ? "complete" : ""}`}>
            {unit.status === "completed" ? <Check size={16} /> : String(unit.number).padStart(2, "0")}
          </span>
          <div>
            <strong>{unit.title.replace(/^Unidade \d+\s*[—-]\s*/, "")}</strong>
            <span>{unit.exerciseCount} exercícios · {unit.attempts} tentativas</span>
          </div>
          <button
            className="icon-button"
            title={unit.status === "locked" ? "Conclua a unidade anterior" : "Definir como unidade atual"}
            onClick={() => onSelect(unit.id)}
            disabled={unit.status === "locked"}
          >
            <ArrowRight size={18} />
          </button>
        </article>
      ))}
    </div>
  );
}
