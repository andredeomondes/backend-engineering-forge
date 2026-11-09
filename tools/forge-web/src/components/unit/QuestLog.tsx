import type { KeyboardEvent } from "react";

import type { Mission, MissionStatus } from "../../types";
import { Sprite } from "../rpg/Sprite";
import {
  STATUS_LABEL,
  groupLabel,
  isBossGroup,
  isMissionDone,
  missionButtonId,
  pad2,
} from "./format";

type Props = {
  missions: Mission[];
  selectedId: string | null;
  onSelect: (missionId: string) => void;
};

/** Square drawn per mission: empty, ✕, filled, or dashed hatch (monochrome). */
export function StatusSquare({ status }: { status: MissionStatus }) {
  return (
    <span
      className={`quest-st is-${status}`}
      aria-hidden="true"
      title={status === "manual" ? "marcada · sem teste verde" : undefined}
    >
      {status === "failing" ? "✕" : ""}
    </span>
  );
}

function groupMissions(missions: Mission[]) {
  const groups: Array<{ group: string; missions: Mission[] }> = [];
  for (const mission of missions) {
    const last = groups[groups.length - 1];
    if (last && last.group === mission.group) last.missions.push(mission);
    else groups.push({ group: mission.group, missions: [mission] });
  }
  return groups;
}

// Up/Down move between missions (the list is long; Tab still works too).
function onListKeyDown(event: KeyboardEvent<HTMLElement>) {
  if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
  const buttons = Array.from(
    event.currentTarget.querySelectorAll<HTMLButtonElement>(".quest-row"),
  );
  const index = buttons.indexOf(document.activeElement as HTMLButtonElement);
  if (index < 0) return;
  event.preventDefault();
  const next = event.key === "ArrowDown" ? index + 1 : index - 1;
  buttons[(next + buttons.length) % buttons.length]?.focus();
}

export function QuestLog({ missions, selectedId, onSelect }: Props) {
  const done = missions.filter((mission) => isMissionDone(mission.status)).length;
  const percent = missions.length ? Math.round((done / missions.length) * 100) : 0;

  return (
    <aside className="quest-log" aria-labelledby="quest-log-title">
      <div className="quest-head">
        <span className="unit-k" id="quest-log-title">
          Quest log
        </span>
        <strong className="quest-count">
          {done}/{missions.length} concluídas
        </strong>
        <div
          className="trail-meter trail-meter-sm quest-xp"
          role="progressbar"
          aria-label="XP da unidade"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percent}
        >
          <i style={{ width: `${percent}%` }} />
        </div>
        {missions.length > 0 && done === missions.length && (
          <div className="quest-chest" aria-hidden="true">
            <img className="sprite" src="/sprites/chest_full_open_anim_f2.png" alt="" width={32} height={32} />
            <span>Baú liberado</span>
          </div>
        )}
      </div>

      {missions.length === 0 ? (
        <p className="quest-empty">Esta unidade não tem missões listadas.</p>
      ) : (
        <div className="quest-groups" onKeyDown={onListKeyDown}>
          {groupMissions(missions).map(({ group, missions: items }) => {
            const groupDone = items.filter((m) => isMissionDone(m.status)).length;
            return (
              <section key={group} className="quest-group" aria-label={groupLabel(group)}>
                <h4 className="quest-group-title">
                  {groupLabel(group)} · {groupDone}/{items.length}
                </h4>
                {isBossGroup(group) && (
                  <div className="quest-boss" aria-hidden="true">
                    {groupDone === items.length ? (
                      <img className="sprite" src="/sprites/skull.png" alt="" width={32} height={32} />
                    ) : (
                      <Sprite name="big_demon" width={32} height={36} scale={2} fps={5} />
                    )}
                    <span>{groupDone === items.length ? "Chefão derrotado" : "Chefão à espreita"}</span>
                  </div>
                )}
                <ul>
                  {items.map((mission) => {
                    const selected = mission.id === selectedId;
                    return (
                      <li key={mission.id}>
                        <button
                          type="button"
                          id={missionButtonId(mission.id)}
                          className={`quest-row ${selected ? "is-selected" : ""}`}
                          aria-current={selected ? "true" : undefined}
                          onClick={() => onSelect(mission.id)}
                        >
                          <StatusSquare status={mission.status} />
                          <span className="quest-name">
                            {pad2(mission.index)} {mission.id}
                            {isBossGroup(mission.group) ? " ★" : ""}
                          </span>
                          <span className="sr-only">
                            , {STATUS_LABEL[mission.status]}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </section>
            );
          })}
        </div>
      )}

      <ul className="quest-legend" aria-label="Legenda">
        <li>
          <StatusSquare status="todo" /> a fazer
        </li>
        <li>
          <StatusSquare status="failing" /> falhando
        </li>
        <li>
          <StatusSquare status="passed" /> verde
        </li>
        <li>
          <StatusSquare status="manual" /> marcada
        </li>
      </ul>
    </aside>
  );
}
