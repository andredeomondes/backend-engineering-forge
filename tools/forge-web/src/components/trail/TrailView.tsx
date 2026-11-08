import { useCallback, useEffect, useState } from "react";

import { api } from "../../api";
import type { TrailData } from "../../types";
import { CharacterSheet } from "./CharacterSheet";
import { PhasePanel } from "./PhasePanel";
import { TrailTree } from "./TrailTree";

type Props = {
  onOpenUnit: (unitId: string) => Promise<void>;
};

function errorMessage(caught: unknown, fallback: string) {
  return caught instanceof Error ? caught.message : fallback;
}

export function TrailView({ onOpenUnit }: Props) {
  const [trail, setTrail] = useState<TrailData | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loadError, setLoadError] = useState("");
  const [actionError, setActionError] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => {
    let active = true;
    api
      .trail()
      .then((data) => {
        if (!active) return;
        setTrail(data);
        setLoadError("");
      })
      .catch((caught) => {
        if (active) setLoadError(errorMessage(caught, "Não foi possível carregar a trilha."));
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => load(), [load]);

  const mutate = useCallback(async (action: () => Promise<TrailData>) => {
    setBusy(true);
    setActionError("");
    try {
      setTrail(await action());
    } catch (caught) {
      setActionError(errorMessage(caught, "A operação não foi concluída."));
    } finally {
      setBusy(false);
    }
  }, []);

  const openUnit = useCallback(
    async (unitId: string) => {
      setBusy(true);
      setActionError("");
      try {
        await onOpenUnit(unitId);
      } catch (caught) {
        setActionError(errorMessage(caught, "Não foi possível abrir a unidade."));
        setBusy(false);
      }
    },
    [onOpenUnit],
  );

  if (loadError) {
    return (
      <div className="page-stack">
        <section className="panel">
          <p className="form-message" role="status">
            {loadError}
          </p>
        </section>
      </div>
    );
  }

  if (!trail) {
    return (
      <div className="page-stack">
        <p className="empty-state" role="status">
          Carregando a trilha...
        </p>
      </div>
    );
  }

  const current = trail.nodes.find((node) => node.state === "current") ?? trail.nodes[0];
  const selected = trail.nodes.find((node) => node.id === selectedId) ?? current;

  return (
    <div className="page-stack trail-page">
      <CharacterSheet sheet={trail.sheet} />
      <div className="trail-layout">
        <TrailTree
          levels={trail.levels}
          nodes={trail.nodes}
          selectedId={selected?.id ?? null}
          onSelect={(nodeId) => {
            setSelectedId(nodeId);
            setActionError("");
          }}
        />
        {selected && (
          <PhasePanel
            key={selected.id}
            node={selected}
            levels={trail.levels}
            busy={busy}
            error={actionError}
            onToggleItem={(itemId, done) => mutate(() => api.trailItem(itemId, done))}
            onCompleteNode={(nodeId) => mutate(() => api.trailNodeComplete(nodeId))}
            onOpenUnit={openUnit}
          />
        )}
      </div>
    </div>
  );
}
