import { spawn } from "node:child_process";
import path from "node:path";

import { getUnit } from "./curriculum.js";
import { WORKSPACE_ROOT } from "./paths.js";

export async function runUnitTests(unitId, testNamePattern) {
  const unit = getUnit(unitId);
  if (!unit) throw new Error(`Unidade desconhecida: ${unitId}`);

  const resolvedTestPath = path.resolve(unit.testPath);
  const validTestPath =
    resolvedTestPath.endsWith("exercises.test.js") ||
    resolvedTestPath.endsWith("exercises.test.ts");
  if (!resolvedTestPath.startsWith(WORKSPACE_ROOT) || !validTestPath) {
    throw new Error("Caminho de testes recusado.");
  }

  const args = ["--test", "--test-reporter=spec"];
  if (typeof testNamePattern === "string" && testNamePattern.trim()) {
    args.push(`--test-name-pattern=${testNamePattern.trim()}`);
  }
  args.push(resolvedTestPath);

  const startedAt = Date.now();
  const output = await new Promise((resolve, reject) => {
    const child = spawn(process.execPath, args, {
      cwd: WORKSPACE_ROOT,
      shell: false,
      windowsHide: true,
    });
    let combined = "";
    child.stdout.on("data", (chunk) => (combined += chunk));
    child.stderr.on("data", (chunk) => (combined += chunk));
    child.on("error", reject);
    child.on("close", (code) => resolve({ code, combined }));
  });

  const lines = output.combined.split(/\r?\n/);
  const passed = lines.filter((line) => line.startsWith("✔ ")).length;
  const reportedFailures = lines.filter((line) => line.startsWith("✖ ")).length;
  const success = output.code === 0;
  return {
    success,
    passed,
    failed: success ? 0 : Math.max(reportedFailures, 1),
    durationMs: Date.now() - startedAt,
    output: output.combined.slice(-40_000),
  };
}
