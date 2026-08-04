import { test } from "node:test";
import assert from "node:assert/strict";

import { buildEntry, appendToStudyLog } from "./log.js";

test("buildEntry: entrada válida", () => {
  const entry = buildEntry({ date: "2026-07-16", minutes: "90", summary: "  fiz X  " });
  assert.deepEqual(entry, { date: "2026-07-16", minutes: 90, summary: "fiz X" });
});

test("buildEntry: rejeita minutos inválidos", () => {
  assert.throws(() => buildEntry({ date: "2026-07-16", minutes: "abc", summary: "x" }));
  assert.throws(() => buildEntry({ date: "2026-07-16", minutes: "0", summary: "x" }));
  assert.throws(() => buildEntry({ date: "2026-07-16", minutes: "301", summary: "x" }));
});

test("buildEntry: rejeita resumo vazio", () => {
  assert.throws(() => buildEntry({ date: "2026-07-16", minutes: "60", summary: "   " }));
});

test("appendToStudyLog: insere no marcador quando presente", () => {
  const content = "# Study Log\n\n<!-- Novas entradas abaixo desta linha -->\n";
  const entry = { date: "2026-07-16", minutes: 60, summary: "estudei closures" };
  const result = appendToStudyLog(content, entry, "Fase 1 / Unidade 1");
  assert.match(result, /## 2026-07-16 — 60 min/);
  assert.match(result, /estudei closures/);
});

test("appendToStudyLog: faz append no fim quando não há marcador", () => {
  const content = "# Study Log sem marcador";
  const entry = { date: "2026-07-16", minutes: 30, summary: "revisão" };
  const result = appendToStudyLog(content, entry, null);
  assert.match(result, /## 2026-07-16 — 30 min/);
});
