import { ArrowRight, Check, Code2, Database, FolderKanban } from "lucide-react";

import type { DashboardData } from "../types";

type Props = {
  data: DashboardData;
  onSelect: (unitId: string) => Promise<void>;
};

export function ProgressView({ data, onSelect }: Props) {
  const javascript = data.units.filter((unit) => unit.track === "javascript");
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

      <section className="track-section">
        <div className="track-heading">
          <Code2 size={20} />
          <div><h3>JavaScript profundo</h3><span>Fase 1</span></div>
        </div>
        <UnitTable units={javascript} currentId={data.currentUnit.id} onSelect={onSelect} />
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
