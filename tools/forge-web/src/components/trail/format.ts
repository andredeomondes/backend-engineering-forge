import type { TrailData, TrailNode } from "../../types";

/** Text progress bar: "█░░░" — `blocks` cells, filled proportionally to percent. */
export function blockBar(percent: number, blocks = 4) {
  const clamped = Math.max(0, Math.min(100, percent));
  let filled = Math.round((clamped / 100) * blocks);
  // Started but tiny still shows one block; unfinished never shows a full bar.
  if (clamped > 0 && filled === 0) filled = 1;
  if (clamped < 100 && filled === blocks) filled = blocks - 1;
  return "█".repeat(filled) + "░".repeat(blocks - filled);
}

export const TRAIL_PANEL_TITLE_ID = "trail-panel-title";

/** Stable DOM id of a topic item's checkbox (used to restore focus after a toggle). */
export function trailItemInputId(itemId: string) {
  return `trail-item-${itemId}`;
}

export function pad2(value: number) {
  return String(value).padStart(2, "0");
}

/** Short code shown before the node name: "01", "12", "JAVA 01–03". */
export function nodeCode(node: TrailNode) {
  if (node.kind === "java") return node.title.split(" · ")[0];
  return node.phase === null ? "" : pad2(node.phase);
}

export function nodeLevelTag(node: TrailNode, levels: TrailData["levels"]) {
  if (node.kind === "java") return "SIDE QUEST · JAVA";
  if (node.kind === "dsa") return "PARALELO · DSA";
  const level = levels.find((candidate) => candidate.id === node.level);
  if (!level) return "";
  return `${level.id.toUpperCase()} · ${level.name.toUpperCase()}`;
}
