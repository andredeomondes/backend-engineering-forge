import assert from "node:assert/strict";
import test from "node:test";

import { getUnit, listProjects, listUnits } from "./curriculum.js";

test("currículo descobre as unidades JavaScript e DSA", () => {
  const units = listUnits();
  assert.equal(units.filter((unit) => unit.track === "javascript").length, 27);
  assert.equal(units.filter((unit) => unit.track === "dsa").length, 1);
});

test("unidade expõe conteúdo, exercícios e três níveis de dica", () => {
  const unit = getUnit("js-01");
  assert.match(unit.markdown, /Valores, tipos e operadores/);
  assert.equal(unit.exercises.length, 16);
  assert.deepEqual(unit.hints.map((hint) => hint.level), [1, 2, 3]);
});

test("currículo inclui projeto progressivo", () => {
  const projects = listProjects();
  assert.equal(projects[0].id, "project-01-order-workbench");
  assert.equal(projects[0].unlockAfter, "js-06");
});
