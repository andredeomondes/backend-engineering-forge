import type { MissionStatus } from "../../types";

/** Gate thresholds (mirror MIN_REFLECTION_LENGTH / MIN_REFLECTION_CONFIDENCE in forge-core). */
export const MIN_REFLECTION_LENGTH = 30;
export const MIN_CONFIDENCE = 3;

export function isMissionDone(status: MissionStatus) {
  return status === "passed" || status === "manual";
}

export function isBossGroup(group: string) {
  return /^desafio integrador/i.test(group.trim());
}

/** "Exercícios fundamentais" → "Fundamentais"; "Desafio integrador" → "Chefão ★". */
export function groupLabel(group: string) {
  if (isBossGroup(group)) return "Chefão ★";
  const label = group
    .replace(/^exercícios\s+/i, "")
    .replace(/\s*\(\d+\)\s*$/, "")
    .trim();
  return label ? label[0].toUpperCase() + label.slice(1) : "Missões";
}

export const STATUS_LABEL: Record<MissionStatus, string> = {
  todo: "não feita",
  failing: "teste falhando",
  passed: "teste verde",
  manual: "marcada · sem teste verde",
};

export function pad2(value: number) {
  return String(value).padStart(2, "0");
}

/** DOM ids used to restore focus after a mutation re-renders the card. */
export const missionButtonId = (id: string) => `quest-${id}`;
export const missionDoneId = (id: string) => `mission-done-${id}`;
export const missionRunId = (id: string) => `mission-run-${id}`;
export const hintButtonId = (level: number) => `hint-reveal-${level}`;
export const HINT_LIST_ID = "mission-hints";
export const RUN_ALL_ID = "unit-run-all";
export const REFLECTION_SAVE_ID = "unit-reflection-save";
export const MARK_ALL_ID = "unit-mark-all";
