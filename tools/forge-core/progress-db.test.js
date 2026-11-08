import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";

import { useTempDatabase } from "./test-helpers.js";

const dbPath = useTempDatabase();
const db = await import("./database.js");

test("missão registra resultado e marcação manual separadamente", () => {
  db.upsertExerciseResult("js-09", "maxBy", false);
  db.setExerciseManual("js-09", "maxBy", true);
  const [row] = db.listExerciseProgress("js-09");
  assert.equal(row.exerciseId, "maxBy");
  assert.equal(row.lastResult, "fail");
  assert.equal(row.manualDone, true);
  db.upsertExerciseResult("js-09", "maxBy", true);
  assert.equal(db.listExerciseProgress("js-09")[0].lastResult, "pass");
});

test("tópico marca e desmarca", () => {
  db.setTopicCheck("f05-idempotencia", true);
  assert.deepEqual(
    db.listTopicChecks().map((r) => r.itemId),
    ["f05-idempotencia"],
  );
  db.setTopicCheck("f05-idempotencia", false);
  assert.equal(db.listTopicChecks().length, 0);
});

test("teste usa banco temporário, nunca .forge/forge.db", () => {
  assert.ok(!dbPath.includes(`${path.sep}.forge${path.sep}`));
});
