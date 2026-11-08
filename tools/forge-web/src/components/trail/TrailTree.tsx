import type { TrailData, TrailNode } from "../../types";
import { blockBar, nodeCode } from "./format";

type Props = {
  levels: TrailData["levels"];
  nodes: TrailNode[];
  selectedId: string | null;
  onSelect: (nodeId: string) => void;
};

const STATE_LABEL: Record<TrailNode["state"], string> = {
  done: "concluída",
  current: "você está aqui",
  todo: "a fazer",
};

function NodeButton({
  node,
  selected,
  compact = false,
  onSelect,
}: {
  node: TrailNode;
  selected: boolean;
  compact?: boolean;
  onSelect: (nodeId: string) => void;
}) {
  const code = nodeCode(node);
  const classes = [
    "trail-node",
    `is-${node.state}`,
    node.kind !== "phase" ? `is-${node.kind}` : "",
    compact ? "is-compact" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type="button"
      className={classes}
      aria-pressed={selected}
      aria-label={`${code} ${node.title}, ${node.percent}%, ${STATE_LABEL[node.state]}`}
      onClick={() => onSelect(node.id)}
    >
      <span className="trail-node-name">
        {code && <span className="trail-node-code">{code}</span>} {node.shortTitle}
      </span>
      <span className="trail-node-bar" aria-hidden="true">
        {blockBar(node.percent)} {node.percent}%
        {node.state === "current" && <span className="trail-node-here"> ◀ AQUI</span>}
      </span>
    </button>
  );
}

function NodeStack({
  nodes,
  selectedId,
  compact,
  onSelect,
}: {
  nodes: TrailNode[];
  selectedId: string | null;
  compact?: boolean;
  onSelect: (nodeId: string) => void;
}) {
  return (
    <ol className="trail-stack">
      {nodes.map((node, index) => (
        <li key={node.id}>
          {index > 0 && (
            <span className="trail-arrow" aria-hidden="true">
              ▼
            </span>
          )}
          <NodeButton
            node={node}
            selected={node.id === selectedId}
            compact={compact}
            onSelect={onSelect}
          />
        </li>
      ))}
    </ol>
  );
}

export function TrailTree({ levels, nodes, selectedId, onSelect }: Props) {
  const byPhase = new Map<number, TrailNode>();
  for (const node of nodes) {
    if (node.kind === "phase" && node.phase !== null) byPhase.set(node.phase, node);
  }
  const java = nodes.filter((node) => node.kind === "java");
  const dsa = nodes.find((node) => node.kind === "dsa");

  return (
    <section className="trail-tree-box" aria-labelledby="trail-tree-title">
      <header className="trail-box-head">
        <h3 id="trail-tree-title">Árvore da trilha</h3>
        <ul className="trail-legend" aria-label="Legenda">
          <li><i className="lg-done" aria-hidden="true" />feito</li>
          <li><i className="lg-current" aria-hidden="true" />aqui</li>
          <li><i className="lg-todo" aria-hidden="true" />a fazer</li>
          <li><i className="lg-side" aria-hidden="true" />java · dsa</li>
        </ul>
      </header>

      <div className="trail-tree">
        {levels.map((level, index) => {
          const levelNodes = level.phases
            .map((phase) => byPhase.get(phase))
            .filter((node): node is TrailNode => Boolean(node));
          return (
            <div key={level.id} className={`trail-area trail-area-${level.id}`}>
              {index > 0 && (
                <span className="trail-arrow trail-arrow-group" aria-hidden="true">
                  ▼
                </span>
              )}
              <section className="trail-group" aria-label={`${level.id.toUpperCase()} · ${level.name}`}>
                <h4 className="trail-group-title">
                  {level.id.toUpperCase()} · {level.name.toUpperCase()}
                </h4>
                <NodeStack
                  nodes={levelNodes}
                  selectedId={selectedId}
                  compact={level.id === "lv4"}
                  onSelect={onSelect}
                />
              </section>
            </div>
          );
        })}

        {dsa && (
          <div className="trail-area trail-area-dsa">
            <span className="trail-side-link" aria-hidden="true">
              paralelo
            </span>
            <section className="trail-group is-side" aria-label="Paralelo · DSA">
              <h4 className="trail-group-title">PARALELO · DSA</h4>
              <NodeStack nodes={[dsa]} selectedId={selectedId} onSelect={onSelect} />
            </section>
          </div>
        )}

        {java.length > 0 && (
          <div className="trail-area trail-area-java">
            <span className="trail-side-link" aria-hidden="true">
              da fase 09
            </span>
            <section className="trail-group is-side" aria-label="Side quest · Java">
              <h4 className="trail-group-title">SIDE QUEST · JAVA</h4>
              <NodeStack nodes={java} selectedId={selectedId} onSelect={onSelect} />
            </section>
          </div>
        )}
      </div>
    </section>
  );
}
