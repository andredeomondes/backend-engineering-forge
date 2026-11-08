import assert from "node:assert/strict";
import test from "node:test";

import { useTempDatabase } from "./test-helpers.js";

useTempDatabase();
const db = await import("./database.js");
const services = await import("./services.js");

test("qualquer unidade pode virar foco", () => {
  assert.equal(services.setCurrentUnit("ts-05").id, "ts-05");
  const dashboard = services.getDashboard();
  assert.ok(dashboard.units.every((u) => u.status !== "locked"));
  assert.ok(dashboard.phases.every((p) => p.status !== "locked"));
  assert.ok(dashboard.projects.every((p) => p.status === "available"));
  assert.ok(dashboard.polyglotTracks.every((t) => t.status === "available"));
  assert.equal(dashboard.phases.find((p) => p.number === 2).status, "active");
});

test("marcar todas as missões conclui a unidade e agenda revisões", () => {
  const detail = services.markAllMissions("js-10");
  assert.equal(detail.gate.completed, true);
  assert.ok(detail.missions.every((m) => m.status === "manual"));
  assert.equal(db.listReviews().filter((r) => r.unitId === "js-10").length, 3);
});

test("desmarcar missão não reabre unidade", () => {
  const detail = services.markMission(
    "js-10",
    services.getUnitDetail("js-10").missions[0].id,
    false,
  );
  assert.equal(detail.gate.completed, true);
  assert.equal(detail.missions[0].status, "todo");
  assert.equal(db.listReviews().filter((r) => r.unitId === "js-10").length, 3);
});

test("selo exige suíte verde + reflexão >= 30 + confiança >= 3", () => {
  const d = services.saveUnitReflection("js-10", "x".repeat(30), 3);
  assert.equal(d.gate.reflection, true);
  assert.equal(d.gate.badge, false); // suíte nunca rodou verde
  assert.equal(
    services.saveUnitReflection("js-10", "x".repeat(29), 5).gate.reflection,
    false,
  );
  assert.equal(
    services.saveUnitReflection("js-10", "x".repeat(40), 2).gate.reflection,
    false,
  );
});

test("confiança fora de 1-5 lança erro", () => {
  assert.throws(() => services.saveUnitReflection("js-10", "x".repeat(40), 0));
  assert.throws(() => services.saveUnitReflection("js-10", "x".repeat(40), 6));
  assert.throws(() => services.saveUnitReflection("js-10", "x".repeat(40), 2.5));
});

test("status de missão: passed, manual, failing, todo", () => {
  const unit = "js-11";
  const [a, b, c, d, e] = services.getUnitDetail(unit).missions;
  db.upsertExerciseResult(unit, a.id, true);
  db.upsertExerciseResult(unit, b.id, false);
  db.setExerciseManual(unit, c.id, true);
  db.upsertExerciseResult(unit, d.id, true);
  db.setExerciseManual(unit, d.id, true);
  const status = Object.fromEntries(
    services.getUnitDetail(unit).missions.map((m) => [m.id, m.status]),
  );
  assert.equal(status[a.id], "passed");
  assert.equal(status[b.id], "failing");
  assert.equal(status[c.id], "manual");
  assert.equal(status[d.id], "passed");
  assert.equal(status[e.id], "todo");
});

test("missão sem teste próprio não registra resultado", async () => {
  // Nenhuma missão atual tem 0 testes de verdade; o runner é injetado.
  const none = async () => ({
    success: false,
    passed: 0,
    failed: 0,
    total: 0,
    durationMs: 1,
    output: "",
  });
  const { result, noTests, unit } = await services.testUnit("ts-04", "Box", none);
  assert.equal(result.total, 0);
  assert.equal(noTests, true);
  assert.equal(unit.missions.find((m) => m.id === "Box").status, "todo");
});

test("missão com teste verde fica passed e noTests é falso", async () => {
  const { noTests, unit } = await services.testUnit("ts-04", "identity", async () => ({
    success: true,
    passed: 1,
    failed: 0,
    total: 1,
    durationMs: 1,
    output: "",
  }));
  assert.equal(noTests, false);
  assert.equal(unit.missions.find((m) => m.id === "identity").status, "passed");
});
