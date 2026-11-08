import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";

import { api } from "../api";
import type { TestResult, UnitDetail } from "../types";
import { CloseUnit } from "./unit/CloseUnit";
import {
  HINT_LIST_ID,
  MARK_ALL_ID,
  REFLECTION_SAVE_ID,
  RUN_ALL_ID,
  isMissionDone,
  missionDoneId,
  missionRunId,
} from "./unit/format";
import { MissionCard, type MissionRun } from "./unit/MissionCard";
import { QuestLog } from "./unit/QuestLog";
import { UnitBriefing } from "./unit/UnitBriefing";

type Props = { unitId: string; onChanged: () => Promise<void> };

type Tab = "briefing" | "before" | "missions" | "close";
const TABS: Tab[] = ["briefing", "before", "missions", "close"];
const tabId = (tab: Tab) => `unit-tab-${tab}`;
const panelId = (tab: Tab) => `unit-panel-${tab}`;

function errorMessage(caught: unknown, fallback: string) {
  return caught instanceof Error ? caught.message : fallback;
}

/** Remounts per unit so tab, selection and test results never leak between units. */
export function UnitView({ unitId, onChanged }: Props) {
  return <UnitScreen key={unitId} unitId={unitId} onChanged={onChanged} />;
}

function UnitScreen({ unitId, onChanged }: Props) {
  const [unit, setUnit] = useState<UnitDetail | null>(null);
  const [loadError, setLoadError] = useState("");
  const [actionError, setActionError] = useState("");
  const [tab, setTab] = useState<Tab>("missions");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  // What is running right now: a mission id, "all", or nothing.
  const [running, setRunning] = useState<string | null>(null);
  const [missionRuns, setMissionRuns] = useState<Record<string, MissionRun>>({});
  const [lastFullRun, setLastFullRun] = useState<TestResult | null>(null);

  useEffect(() => {
    let active = true;
    api
      .unit(unitId)
      .then((detail) => {
        if (!active) return;
        setUnit(detail);
        // Pin the selection once, on load: the card must never move to another
        // mission because the one on screen just became done.
        const firstOpen =
          detail.missions.find((m) => !isMissionDone(m.status)) ?? detail.missions[0];
        setSelectedId(firstOpen?.id ?? null);
      })
      .catch((caught) => {
        if (active)
          setLoadError(errorMessage(caught, "Não foi possível carregar a unidade."));
      });
    return () => {
      active = false;
    };
  }, [unitId]);

  // Element id to re-focus after a mutation (controls are disabled while busy,
  // which drops keyboard focus).
  const focusAfter = useRef<string | null>(null);
  useEffect(() => {
    if (busy || !focusAfter.current) return;
    document.getElementById(focusAfter.current)?.focus();
    focusAfter.current = null;
  }, [busy, unit]);

  const mutate = useCallback(
    async (action: () => Promise<UnitDetail>, focusId: string, fallback: string) => {
      setBusy(true);
      setActionError("");
      focusAfter.current = focusId;
      try {
        setUnit(await action());
        await onChanged();
      } catch (caught) {
        setActionError(errorMessage(caught, fallback));
      } finally {
        setBusy(false);
        setRunning(null);
      }
    },
    [onChanged],
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

  if (!unit) {
    return (
      <div className="page-stack">
        <p className="empty-state" role="status">
          Carregando unidade...
        </p>
      </div>
    );
  }

  const current = unit;
  const doneCount = current.missions.filter((m) => isMissionDone(m.status)).length;
  const firstOpen =
    current.missions.find((m) => !isMissionDone(m.status)) ?? current.missions[0];
  const mission = current.missions.find((m) => m.id === selectedId) ?? firstOpen;
  const exercise = mission
    ? current.exercises.find((item) => item.id === mission.id)
    : undefined;

  const labels: Record<Tab, string> = {
    briefing: "1 · Briefing",
    before: "2 · Antes de começar",
    missions: `3 · Missões ${doneCount}/${current.missions.length}`,
    close: "4 · Fechar unidade",
  };

  function selectTab(next: Tab) {
    setTab(next);
    setActionError("");
  }

  function onTabKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const index = TABS.indexOf(tab);
    let next: number | null = null;
    if (event.key === "ArrowRight") next = (index + 1) % TABS.length;
    else if (event.key === "ArrowLeft") next = (index - 1 + TABS.length) % TABS.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = TABS.length - 1;
    if (next === null) return;
    event.preventDefault();
    selectTab(TABS[next]);
    document.getElementById(tabId(TABS[next]))?.focus();
  }

  function runMission(missionId: string) {
    setSelectedId(missionId);
    setRunning(missionId);
    return mutate(
      async () => {
        const response = await api.test(current.id, missionId);
        setMissionRuns((runs) => ({
          ...runs,
          [missionId]: { result: response.result, noTests: response.noTests },
        }));
        return response.unit;
      },
      missionRunId(missionId),
      "Falha ao executar o teste da missão.",
    );
  }

  function runAll() {
    setRunning("all");
    return mutate(
      async () => {
        const response = await api.test(current.id);
        setLastFullRun(response.result);
        return response.unit;
      },
      RUN_ALL_ID,
      "Falha ao executar os testes.",
    );
  }

  return (
    <div className="page-stack unit-page">
      <header className="unit-header">
        <div>
          <span className="unit-k">
            Fase {current.phase} · Unidade {current.number} · {current.id.toUpperCase()}
          </span>
          <h2>{current.title}</h2>
        </div>
        <span className={`unit-badge ${current.gate.completed ? "is-inv" : ""}`}>
          {current.gate.completed ? "Concluída" : "Em andamento"}
          {current.gate.badge ? " · ★" : ""}
        </span>
      </header>

      <div>
        <div
          className="unit-tabs"
          role="tablist"
          aria-label="Seções da unidade"
          onKeyDown={onTabKeyDown}
        >
          {TABS.map((item) => (
            <button
              key={item}
              type="button"
              role="tab"
              id={tabId(item)}
              className="unit-tab"
              aria-selected={tab === item}
              aria-controls={panelId(item)}
              tabIndex={tab === item ? 0 : -1}
              onClick={() => selectTab(item)}
            >
              {labels[item]}
            </button>
          ))}
        </div>

        <div
          role="tabpanel"
          id={panelId(tab)}
          aria-labelledby={tabId(tab)}
          className="unit-tabpanel"
        >
          {tab === "briefing" && (
            <UnitBriefing markdown={current.markdown} section="briefing" />
          )}
          {tab === "before" && (
            <UnitBriefing markdown={current.markdown} section="before" />
          )}
          {tab === "missions" &&
            (mission && exercise ? (
              <div className="unit-missions">
                <QuestLog
                  missions={current.missions}
                  selectedId={mission.id}
                  onSelect={(id) => {
                    setSelectedId(id);
                    setActionError("");
                  }}
                />
                <MissionCard
                  key={mission.id}
                  unit={current}
                  exercise={exercise}
                  mission={mission}
                  busy={busy}
                  running={running === mission.id}
                  run={missionRuns[mission.id] ?? null}
                  onRun={() => runMission(mission.id)}
                  onToggleDone={(done) => {
                    setSelectedId(mission.id);
                    return mutate(
                      () => api.markMission(current.id, mission.id, done),
                      missionDoneId(mission.id),
                      "Não foi possível marcar a missão.",
                    );
                  }}
                  onRevealHint={(level) => {
                    setSelectedId(mission.id);
                    return mutate(
                      () => api.revealHint(current.id, level),
                      HINT_LIST_ID,
                      "Não foi possível abrir a dica.",
                    );
                  }}
                />
              </div>
            ) : (
              <article className="unit-panel">
                <p className="unit-empty">Esta unidade não tem missões listadas.</p>
              </article>
            ))}
          {tab === "close" && (
            <CloseUnit
              key={current.id}
              unit={current}
              busy={busy}
              runningAll={running === "all"}
              lastRun={lastFullRun}
              onRunAll={runAll}
              onSaveReflection={(reflection, confidence) =>
                mutate(
                  () => api.saveReflection(current.id, reflection, confidence),
                  REFLECTION_SAVE_ID,
                  "Não foi possível salvar a reflexão.",
                )
              }
              onMarkAll={() =>
                mutate(
                  () => api.markAllMissions(current.id),
                  MARK_ALL_ID,
                  "Não foi possível marcar as missões.",
                )
              }
            />
          )}
        </div>

        {actionError && (
          <p className="form-message unit-error" role="alert">
            {actionError}
          </p>
        )}
      </div>
    </div>
  );
}
