import { readFileSync } from "node:fs";

import { TRAIL_PATH } from "./paths.js";

const LEVEL_IDS = ["lv1", "lv2", "lv3", "lv4"];
const NODE_KINDS = ["phase", "java", "dsa"];
const PHASES_WITH_UNITS = new Set([1, 2, 3, 4, 12]);
const MIN_ITEMS = 5;
const MAX_ITEMS = 10;
const MAX_PHASE = 27;

let cached = null;

function fail(message) {
  throw new Error(`trilha.json inválido: ${message}`);
}

function requireString(value, where) {
  if (typeof value !== "string" || value.trim() === "")
    fail(`${where} deve ser texto não vazio`);
}

export function validateTrailContent(raw) {
  if (!raw || !Array.isArray(raw.levels) || !Array.isArray(raw.nodes)) {
    fail("esperado { levels: [], nodes: [] }");
  }

  const nodeIds = new Set();
  const itemIds = new Set();
  const phases = new Set();

  for (const node of raw.nodes) {
    requireString(node?.id, "nó sem id");
    if (nodeIds.has(node.id)) fail(`id de nó duplicado: ${node.id}`);
    nodeIds.add(node.id);

    if (!NODE_KINDS.includes(node.kind)) fail(`${node.id}: kind inválido`);
    requireString(node.title, `${node.id}.title`);
    requireString(node.shortTitle, `${node.id}.shortTitle`);
    requireString(node.who, `${node.id}.who`);
    requireString(node.becomes, `${node.id}.becomes`);
    if (!Array.isArray(node.items)) fail(`${node.id}.items deve ser lista`);

    if (node.kind === "java") {
      if (node.phase !== null) fail(`${node.id}: nó java deve ter phase null`);
    } else {
      if (!Number.isInteger(node.phase) || node.phase < 0 || node.phase > MAX_PHASE) {
        fail(`${node.id}: phase fora de 0–${MAX_PHASE}`);
      }
      if (phases.has(node.phase)) fail(`fase duplicada: ${node.phase}`);
      phases.add(node.phase);
    }

    if (node.kind === "phase" && !PHASES_WITH_UNITS.has(node.phase)) {
      if (
        node.phase !== 0 &&
        (node.items.length < MIN_ITEMS || node.items.length > MAX_ITEMS)
      ) {
        fail(
          `${node.id}: precisa de ${MIN_ITEMS}–${MAX_ITEMS} itens (tem ${node.items.length})`,
        );
      }
    }

    for (const item of node.items) {
      requireString(item?.id, `${node.id}: item sem id`);
      requireString(item.label, `${item.id}.label`);
      if (itemIds.has(item.id)) fail(`id de item duplicado: ${item.id}`);
      itemIds.add(item.id);
    }
  }

  for (let phase = 0; phase <= MAX_PHASE; phase += 1) {
    if (!phases.has(phase)) fail(`fase ${phase} ausente`);
  }

  const seenLevels = new Set();
  for (const level of raw.levels) {
    if (!LEVEL_IDS.includes(level?.id)) fail(`nível desconhecido: ${level?.id}`);
    if (seenLevels.has(level.id)) fail(`nível duplicado: ${level.id}`);
    seenLevels.add(level.id);
    requireString(level.name, `${level.id}.name`);
    if (!Array.isArray(level.phases)) fail(`${level.id}.phases deve ser lista`);
    for (const phase of level.phases) {
      if (!phases.has(phase)) fail(`${level.id} referencia fase desconhecida: ${phase}`);
    }
  }

  return raw;
}

export function loadTrailContent() {
  if (!cached)
    cached = validateTrailContent(JSON.parse(readFileSync(TRAIL_PATH, "utf8")));
  return cached;
}
