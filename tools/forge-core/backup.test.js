import assert from "node:assert/strict";
import test from "node:test";

import { useTempDatabase } from "./test-helpers.js";

useTempDatabase();
const db = await import("./database.js");
const services = await import("./services.js");

const isChecked = (itemId) => db.listTopicChecks().some((row) => row.itemId === itemId);

test("export → restore preserva missão manual e tópico marcado", () => {
  const missionId = services.getUnitDetail("js-09").missions[0].id;
  services.markMission("js-09", missionId, true);
  services.setTrailItem("f05-idempotencia", true);

  const backup = JSON.parse(JSON.stringify(services.exportData()));
  assert.ok(Array.isArray(backup.exerciseProgress));
  assert.ok(Array.isArray(backup.topicChecks));

  // O estado muda depois do backup; o restore deve voltar ao exportado.
  services.markMission("js-09", missionId, false);
  services.setTrailItem("f05-idempotencia", false);
  services.setTrailItem("f06-swagger-serializacao", true);

  services.importData(backup);
  assert.equal(services.getUnitDetail("js-09").missions[0].status, "manual");
  assert.equal(isChecked("f05-idempotencia"), true);
  assert.equal(isChecked("f06-swagger-serializacao"), false);
});

test("backup antigo (sem missões/tópicos) restaura e mantém as linhas atuais", () => {
  const missionId = services.getUnitDetail("js-09").missions[0].id;
  services.markMission("js-09", missionId, true);
  services.setTrailItem("f05-openapi", true);

  const { exerciseProgress, topicChecks, ...oldBackup } = services.exportData();
  assert.ok(exerciseProgress && topicChecks);

  assert.doesNotThrow(() => services.importData(oldBackup));
  assert.equal(services.getUnitDetail("js-09").missions[0].status, "manual");
  assert.equal(isChecked("f05-openapi"), true);
});

test("backup antigo com unidade concluída mostra as missões passadas", () => {
  const backup = services.exportData();
  const oldBackup = {
    currentUnit: "js-10",
    sessions: [],
    progress: [
      ...backup.progress.filter((row) => row.unitId !== "js-10"),
      { unitId: "js-10", status: "completed", completedAt: "2026-10-01" },
    ],
    hints: [],
    reviews: [],
  };
  services.importData(oldBackup);
  const detail = services.getUnitDetail("js-10");
  assert.equal(detail.gate.completed, true);
  assert.ok(detail.missions.length > 0);
  assert.ok(detail.missions.every((mission) => mission.status === "passed"));
});
