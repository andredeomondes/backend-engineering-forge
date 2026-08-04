import {
  ArrowRight,
  BookOpen,
  CalendarClock,
  Download,
  Flame,
  Gauge,
  Timer,
} from "lucide-react";
import { FormEvent, ReactNode, useState } from "react";

import { api } from "../api";
import type { DashboardData } from "../types";

type Props = {
  data: DashboardData;
  onContinue: () => void;
  onRefresh: () => Promise<void>;
};

export function Dashboard({ data, onContinue, onRefresh }: Props) {
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function submitSession(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setSaving(true);
    setMessage("");
    try {
      await api.session({
        minutes: Number(form.get("minutes")),
        summary: form.get("summary"),
        difficulty: form.get("difficulty"),
        nextStep: form.get("nextStep"),
        unitId: data.currentUnit.id,
      });
      event.currentTarget.reset();
      setMessage("Sessão registrada.");
      await onRefresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Não foi possível registrar.");
    } finally {
      setSaving(false);
    }
  }

  const progressPercent = Math.round((data.stats.completedUnits / data.stats.totalUnits) * 100);

  return (
    <div className="page-stack">
      <section className="current-band">
        <div className="current-copy">
          <span className="eyebrow">Foco atual</span>
          <h2>{data.currentUnit.title}</h2>
          <p>
            {data.currentUnit.exerciseCount} exercícios · {data.currentUnit.attempts} execuções
          </p>
        </div>
        <div className="current-progress" aria-label={`${progressPercent}% da trilha concluída`}>
          <span>{String(progressPercent).padStart(2, "0")}%</span>
          <div className="progress-track">
            <div style={{ width: `${progressPercent}%` }} />
          </div>
        </div>
        <button className="primary-button" onClick={onContinue}>
          Continuar
          <ArrowRight size={18} />
        </button>
      </section>

      <section className="metrics-grid" aria-label="Resumo do progresso">
        <Metric icon={<Timer />} label="Tempo registrado" value={`${data.stats.hours}h`} />
        <Metric icon={<Flame />} label="Sequência" value={`${data.stats.streak} dias`} />
        <Metric
          icon={<Gauge />}
          label="Autonomia"
          value={data.stats.autonomy === null ? "—" : `${data.stats.autonomy}%`}
        />
        <Metric
          icon={<CalendarClock />}
          label="Revisões pendentes"
          value={String(data.stats.dueReviews)}
        />
      </section>

      <div className="dashboard-grid">
        <section className="panel session-panel">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Diário</span>
              <h3>Registrar sessão</h3>
            </div>
            <Timer size={20} />
          </div>
          <form className="session-form" onSubmit={submitSession}>
            <label>
              Minutos
              <input name="minutes" type="number" min="1" max="600" defaultValue="60" required />
            </label>
            <label className="wide-field">
              Resumo
              <input name="summary" placeholder="O que avançou hoje?" required />
            </label>
            <label>
              Dificuldade
              <input name="difficulty" placeholder="O que travou?" />
            </label>
            <label>
              Próximo passo
              <input name="nextStep" placeholder="Onde retomar?" />
            </label>
            <button className="secondary-button" disabled={saving}>
              {saving ? "Registrando..." : "Registrar"}
            </button>
          </form>
          {message && <p className="form-message" role="status">{message}</p>}
        </section>

        <section className="panel recent-panel">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Histórico</span>
              <h3>Sessões recentes</h3>
            </div>
            <BookOpen size={20} />
          </div>
          {data.recentSessions.length ? (
            <div className="session-list">
              {data.recentSessions.map((session) => (
                <article key={session.id}>
                  <time>{formatDate(session.date)}</time>
                  <div>
                    <strong>{session.summary}</strong>
                    <span>{session.minutes} min · {session.unitId.toUpperCase()}</span>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="empty-state">Seu primeiro registro aparece aqui.</p>
          )}
        </section>
      </div>

      <section className="utility-bar">
        <div>
          <span className="eyebrow">Portabilidade</span>
          <h3>Seus dados continuam seus</h3>
        </div>
        <div className="button-row">
          <a className="icon-text-button" href="/api/export/json">
            <Download size={17} /> Backup JSON
          </a>
          <a className="icon-text-button" href="/api/export/csv">
            <Download size={17} /> Sessões CSV
          </a>
        </div>
      </section>
    </div>
  );
}

function Metric({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <article className="metric">
      <span className="metric-icon">{icon}</span>
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
    </article>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short" }).format(
    new Date(`${value}T12:00:00`),
  );
}
