import assert from "node:assert/strict";
import test from "node:test";

import { useTempDatabase } from "./test-helpers.js";

useTempDatabase();
const db = await import("./database.js");

test("rodar uma missão não altera o resultado da suíte da unidade", () => {
  const green = { passed: 5, failed: 0, success: true, durationMs: 1, output: "ok" };
  db.recordTestRun("js-01", green);
  const before = db.getUnitProgress("js-01");
  db.recordMissionRun("js-01", { passed: 0, failed: 1, success: false, durationMs: 1, output: "x" });
  const after = db.getUnitProgress("js-01");
  assert.ok(after.lastTestSuccess);
  assert.deepEqual(after, before);
});
