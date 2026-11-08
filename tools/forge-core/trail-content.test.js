import assert from "node:assert/strict";
import test from "node:test";

import { loadTrailContent, validateTrailContent } from "./trail-content.js";

test("trilha cobre fases 0–27 e três blocos Java", () => {
  const c = loadTrailContent();
  const phases = c.nodes
    .filter((n) => n.phase !== null)
    .map((n) => n.phase)
    .sort((a, b) => a - b);
  assert.deepEqual(
    phases,
    Array.from({ length: 28 }, (_, i) => i),
  );
  assert.deepEqual(
    c.nodes.filter((n) => n.kind === "java").map((n) => n.id),
    ["java-1", "java-2", "java-3"],
  );
});

test("ids de itens são únicos", () => {
  const ids = loadTrailContent().nodes.flatMap((n) => n.items.map((i) => i.id));
  assert.equal(new Set(ids).size, ids.length);
});

test("fases sem unidades têm de 5 a 10 itens", () => {
  for (const n of loadTrailContent().nodes.filter(
    (n) => n.kind === "phase" && ![0, 1, 2, 3, 4].includes(n.phase),
  ))
    assert.ok(n.items.length >= 5 && n.items.length <= 10, `fase ${n.phase}`);
});

test("todo nó tem quem você é e o que vira", () => {
  assert.ok(
    loadTrailContent().nodes.every((n) => n.who.length > 20 && n.becomes.length > 10),
  );
});

test("validação recusa id duplicado", () => {
  assert.throws(() =>
    validateTrailContent({ levels: [], nodes: [{ id: "f00" }, { id: "f00" }] }),
  );
});
