import assert from "node:assert/strict";
import test from "node:test";

import {
  getUnit,
  listPhases,
  listPolyglotTracks,
  listProjects,
  listUnits,
} from "./curriculum.js";

test("currículo descobre as unidades preparadas", () => {
  const units = listUnits();
  assert.equal(units.filter((unit) => unit.track === "javascript").length, 27);
  assert.equal(units.filter((unit) => unit.track === "dsa").length, 1);
  assert.equal(units.filter((unit) => unit.track === "sql").length, 8);
});

test("unidade SQL expõe exercícios, checks e três níveis de dica", () => {
  const unit = getUnit("sql-01");
  assert.equal(unit.phase, 4);
  assert.match(unit.exercisePath, /exercises\.sql$/);
  assert.match(unit.testPath, /checks\.sql$/);
  assert.ok(unit.exercises.length >= 4);
  assert.deepEqual(
    unit.hints.map((hint) => hint.level),
    [1, 2, 3],
  );
});

test("unidade expõe conteúdo, exercícios e três níveis de dica", () => {
  const unit = getUnit("js-01");
  assert.match(unit.markdown, /Valores, tipos e operadores/);
  assert.equal(unit.exercises.length, 16);
  assert.deepEqual(
    unit.hints.map((hint) => hint.level),
    [1, 2, 3],
  );
});

test("currículo inclui projeto progressivo", () => {
  const projects = listProjects();
  assert.equal(projects[0].id, "project-01-order-workbench");
  assert.equal(projects[0].unlockAfter, "js-06");
});

test("roadmap expõe as fases sem renumerar a trilha principal", () => {
  const phases = listPhases();
  assert.equal(phases.length, 28);
  assert.deepEqual(
    phases.map((phase) => phase.number),
    Array.from({ length: 28 }, (_, index) => index),
  );
  assert.equal(phases.find((phase) => phase.number === 1)?.status, "available");
});

test("trilhas poliglotas ficam disponíveis", () => {
  const tracks = listPolyglotTracks();
  assert.deepEqual(
    tracks.map((track) => track.id),
    ["java", "dotnet", "go"],
  );
  assert.ok(tracks.every((track) => track.status === "available"));
});

test("missões têm id sem assinatura e grupo do README", () => {
  const unit = getUnit("js-09");
  const maxBy = unit.exercises.find((e) => e.id === "maxBy");
  assert.equal(maxBy.name, "maxBy(items, fn)");
  assert.equal(maxBy.group, "Exercícios intermediários");
  assert.equal(unit.exercises.at(-1).group, "Desafio integrador");
  assert.equal(getUnit("sql-01").missionTestable, false);
});

test("id de missão é o primeiro identificador, sem palavras-chave nem genéricos", () => {
  const ids = (unitId) => getUnit(unitId).exercises.map((e) => e.id);
  assert.ok(ids("js-22").includes("ValidationError"));
  for (const unit of listUnits()) {
    for (const exercise of unit.exercises.filter((e) => !e.id.startsWith("sql-ex-"))) {
      assert.match(exercise.id, /^[A-Za-z_$][\w$]*$/, `${unit.id}: ${exercise.name}`);
      assert.ok(
        !/^(export|default|abstract|class|interface|type|const|enum|function)$/.test(
          exercise.id,
        ),
        `${unit.id}: ${exercise.name}`,
      );
    }
  }
  const all = listUnits().flatMap((u) => u.exercises.map((e) => `${e.name} => ${e.id}`));
  assert.ok(all.some((s) => /^identity<T>.* => identity$/.test(s)));
  assert.ok(all.some((s) => /^type Box<T>.* => Box$/.test(s)));
});
