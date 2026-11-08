import assert from "node:assert/strict";
import test from "node:test";

import { getUnit } from "./curriculum.js";
import { runUnitTests, summarizeRun } from "./test-runner.js";

test("summarizeRun trata 0 testes como falha", () => {
  const out = "ℹ tests 0\nℹ pass 0\nℹ fail 0\n";
  assert.deepEqual(summarizeRun(0, out), {
    success: false,
    passed: 0,
    failed: 0,
    total: 0,
  });
});

test("summarizeRun lê o rodapé do reporter spec", () => {
  const out = "✔ maxBy: x\nℹ tests 3\nℹ pass 2\nℹ fail 1\n";
  assert.deepEqual(summarizeRun(1, out), {
    success: false,
    passed: 2,
    failed: 1,
    total: 3,
  });
});

test("padrão por missão roda só o teste certo", async () => {
  const result = await runUnitTests("js-01", getUnit("js-01").exercises[0].id);
  assert.ok(result.total >= 1);
});
