import assert from "node:assert/strict";
import test from "node:test";

import { loadTrailContent, validateTrailContent } from "./trail-content.js";

const clone = () => structuredClone(loadTrailContent());
const node = (c, id) => c.nodes.find((n) => n.id === id);

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

test("ids de itens são slugs curtos de palavras inteiras", () => {
  for (const n of loadTrailContent().nodes)
    for (const i of n.items) {
      assert.match(i.id, /^(f\d{2}|java)-[a-z0-9]+(-[a-z0-9]+){0,4}$/, i.id);
      assert.ok(i.id.length <= 32, `${i.id} tem mais de 32 caracteres`);
    }
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

test("conteúdo real passa na validação", () => {
  assert.doesNotThrow(() => validateTrailContent(clone()));
});

test("validação recusa id de nó duplicado", () => {
  const c = clone();
  node(c, "f06").id = "f05";
  assert.throws(() => validateTrailContent(c), /id de nó duplicado: f05/);
});

test("validação recusa id de item duplicado entre nós", () => {
  const c = clone();
  node(c, "f06").items[0].id = node(c, "f05").items[0].id;
  assert.throws(() => validateTrailContent(c), /id de item duplicado/);
});

test("validação recusa fase ausente", () => {
  const c = clone();
  c.nodes = c.nodes.filter((n) => n.id !== "f27");
  c.levels = c.levels.map((l) => ({ ...l, phases: l.phases.filter((p) => p !== 27) }));
  assert.throws(() => validateTrailContent(c), /fase 27 ausente/);
});

test("validação recusa quantidade de itens fora de 5–10", () => {
  const few = clone();
  node(few, "f05").items = node(few, "f05").items.slice(0, 4);
  assert.throws(() => validateTrailContent(few), /f05: precisa de 5–10 itens \(tem 4\)/);

  const many = clone();
  const f11 = node(many, "f11");
  f11.items = Array.from({ length: 11 }, (_, i) => ({
    id: `f11-extra-${i}`,
    label: `Extra ${i}`,
  }));
  assert.throws(
    () => validateTrailContent(many),
    /f11: precisa de 5–10 itens \(tem 11\)/,
  );
});

test("validação recusa nível que referencia fase desconhecida", () => {
  const c = clone();
  c.levels[0].phases.push(99);
  assert.throws(() => validateTrailContent(c), /lv1 referencia fase desconhecida: 99/);
});
