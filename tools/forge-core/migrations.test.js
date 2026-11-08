import assert from "node:assert/strict";
import test from "node:test";

import { useTempDatabase } from "./test-helpers.js";

useTempDatabase();
const db = await import("./database.js");
const services = await import("./services.js");

test("migração marca missões de unidades concluídas", () => {
  db.getUnitProgress("js-01"); // garante a linha de unit_progress
  db.markUnitCompleted("js-01");
  services.runMigrations();
  assert.ok(services.getUnitDetail("js-01").missions.every((m) => m.status === "passed"));
});

test("migração roda uma vez só", () => {
  db.getUnitProgress("js-02"); // garante a linha de unit_progress
  db.markUnitCompleted("js-02");
  services.runMigrations();
  assert.ok(services.getUnitDetail("js-02").missions.every((m) => m.status === "todo"));
});
