import { CalendarCheck, Check, Clock3 } from "lucide-react";
import { useEffect, useState } from "react";

import { api } from "../api";
import type { Review } from "../types";

export function ReviewsView({ onChanged }: { onChanged: () => Promise<void> }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [confidence, setConfidence] = useState<Record<number, number>>({});

  useEffect(() => {
    api.reviews().then(setReviews);
  }, []);

  async function complete(review: Review) {
    const updated = await api.completeReview(review.id, confidence[review.id] || 3);
    setReviews(updated);
    await onChanged();
  }

  const pending = reviews.filter((review) => !review.completedAt);
  const completed = reviews.filter((review) => review.completedAt);

  return (
    <div className="page-stack">
      <header className="page-header">
        <div><span className="eyebrow">Retenção</span><h2>Revisões espaçadas</h2></div>
        <strong>{pending.filter((review) => review.due).length} para hoje</strong>
      </header>

      <section className="review-section">
        <div className="track-heading"><Clock3 size={20} /><div><h3>Fila de revisão</h3><span>2, 7 e 30 dias</span></div></div>
        {pending.length ? (
          <div className="review-list">
            {pending.map((review) => (
              <article key={review.id} className={review.due ? "due" : ""}>
                <div className="review-date">
                  <span>{review.due ? "Agora" : formatDate(review.scheduledFor)}</span>
                  <small>Ciclo de {review.cycleDays} dias</small>
                </div>
                <div className="review-title"><strong>{review.unitTitle}</strong><span>{review.unitId.toUpperCase()}</span></div>
                <select
                  aria-label={`Confiança para ${review.unitTitle}`}
                  value={confidence[review.id] || 3}
                  onChange={(event) => setConfidence({ ...confidence, [review.id]: Number(event.target.value) })}
                >
                  {[1, 2, 3, 4, 5].map((value) => <option key={value} value={value}>Confiança {value}</option>)}
                </select>
                <button className="secondary-button" onClick={() => complete(review)} disabled={!review.due}>
                  <Check size={16} /> Concluir
                </button>
              </article>
            ))}
          </div>
        ) : <p className="empty-state">Nenhuma revisão agendada.</p>}
      </section>

      {completed.length > 0 && (
        <section className="review-section">
          <div className="track-heading"><CalendarCheck size={20} /><div><h3>Histórico</h3><span>{completed.length} concluídas</span></div></div>
          <div className="completed-reviews">
            {completed.slice(0, 10).map((review) => (
              <span key={review.id}><Check size={14} /> {review.unitId.toUpperCase()} · confiança {review.confidence}</span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short" }).format(new Date(`${value}T12:00:00`));
}
