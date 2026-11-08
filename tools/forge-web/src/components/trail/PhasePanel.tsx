import { useState } from "react";

import type { TrailData, TrailItem, TrailNode } from "../../types";
import { ConfirmDialog } from "../ConfirmDialog";
import { Button } from "../ui/8bit/button";
import { nodeCode, nodeLevelTag } from "./format";

type Props = {
  node: TrailNode;
  levels: TrailData["levels"];
  busy: boolean;
  error: string;
  onToggleItem: (itemId: string, done: boolean) => void;
  onCompleteNode: (nodeId: string) => void;
  onOpenUnit: (unitId: string) => void;
};

function ItemRow({
  item,
  busy,
  onToggleItem,
  onOpenUnit,
}: {
  item: TrailItem;
  busy: boolean;
  onToggleItem: Props["onToggleItem"];
  onOpenUnit: Props["onOpenUnit"];
}) {
  if (item.kind === "unit" && item.unitId) {
    const unitId = item.unitId;
    return (
      <li className={`trail-item is-unit ${item.done ? "is-done" : ""}`}>
        <span className="trail-check" aria-hidden="true" />
        <span className="trail-item-label">
          {item.label}
          <span className="sr-only">{item.done ? " (concluída)" : " (pendente)"}</span>
        </span>
        <button
          type="button"
          className="trail-open"
          disabled={busy}
          onClick={() => onOpenUnit(unitId)}
          aria-label={`Abrir ${item.label}`}
        >
          Abrir
        </button>
      </li>
    );
  }

  return (
    <li className={`trail-item ${item.done ? "is-done" : ""}`}>
      <label>
        <input
          type="checkbox"
          checked={item.done}
          disabled={busy}
          onChange={(event) => onToggleItem(item.id, event.target.checked)}
        />
        <span className="trail-item-label">{item.label}</span>
      </label>
    </li>
  );
}

export function PhasePanel({
  node,
  levels,
  busy,
  error,
  onToggleItem,
  onCompleteNode,
  onOpenUnit,
}: Props) {
  const [confirming, setConfirming] = useState(false);
  const done = node.items.filter((item) => item.done);
  const pending = node.items.filter((item) => !item.done);
  const units = node.items.filter((item) => item.kind === "unit" && item.unitId);
  const firstUnitId = (units.find((item) => !item.done) ?? units[0])?.unitId;
  const code = nodeCode(node);
  const tag = nodeLevelTag(node, levels);
  const percent = Math.max(0, Math.min(100, node.percent));

  return (
    <aside className="trail-panel" aria-labelledby="trail-panel-title">
      <h3 id="trail-panel-title">
        {code ? `${code} · ` : ""}
        {node.title}
      </h3>
      <span className={`trail-tag ${node.state === "current" ? "is-current" : ""}`}>
        {tag}
        {node.state === "current" ? " · VOCÊ ESTÁ AQUI" : ""}
      </span>

      <span className="trail-k">Progresso</span>
      <div
        className="trail-meter trail-meter-solid"
        role="progressbar"
        aria-label="Progresso da fase"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
      >
        <i style={{ width: `${percent}%` }} />
      </div>
      <span className="trail-panel-pct">
        {percent}% · {done.length}/{node.items.length}
      </span>

      {node.who && (
        <>
          <span className="trail-k">Quem você é aqui</span>
          <p className="trail-quote">{node.who}</p>
        </>
      )}

      {done.length > 0 && (
        <>
          <span className="trail-k">Já consegue</span>
          <ul className="trail-items">
            {done.map((item) => (
              <ItemRow
                key={item.id}
                item={item}
                busy={busy}
                onToggleItem={onToggleItem}
                onOpenUnit={onOpenUnit}
              />
            ))}
          </ul>
        </>
      )}

      {pending.length > 0 && (
        <>
          <span className="trail-k">Falta nesta seção</span>
          <ul className="trail-items">
            {pending.map((item) => (
              <ItemRow
                key={item.id}
                item={item}
                busy={busy}
                onToggleItem={onToggleItem}
                onOpenUnit={onOpenUnit}
              />
            ))}
          </ul>
        </>
      )}

      {node.becomes && (
        <>
          <span className="trail-k">O que você vira</span>
          <p className="trail-quote is-dashed">{node.becomes}</p>
        </>
      )}

      <div className="button-row trail-actions">
        {firstUnitId && (
          <Button variant="default" disabled={busy} onClick={() => onOpenUnit(firstUnitId)}>
            Abrir fase ▸
          </Button>
        )}
        <Button
          variant="secondary"
          disabled={busy || pending.length === 0}
          onClick={() => setConfirming(true)}
        >
          Marcar tudo
        </Button>
      </div>

      {error && (
        <p className="form-message trail-error" role="status">
          {error}
        </p>
      )}

      <ConfirmDialog
        open={confirming}
        title="Marcar tudo?"
        description={`Todos os ${node.items.length} itens de "${node.title}" serão marcados como concluídos.`}
        confirmLabel="Marcar tudo"
        onCancel={() => setConfirming(false)}
        onConfirm={() => {
          setConfirming(false);
          onCompleteNode(node.id);
        }}
      />
    </aside>
  );
}
