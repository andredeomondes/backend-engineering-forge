import { spawn } from "node:child_process";
import path from "node:path";

import { getUnit } from "./curriculum.js";
import { WORKSPACE_ROOT } from "./paths.js";

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Lê o rodapé do reporter spec; 0 testes executados nunca conta como sucesso
// (um padrão que não casa nada faria `node --test` sair com 0).
export function summarizeRun(code, output) {
  const footer = (label) => {
    const match = output.match(new RegExp(`^ℹ ${label} (\\d+)\\s*$`, "m"));
    return match ? Number(match[1]) : null;
  };
  const lines = output.split(/\r?\n/);
  const countedPassed = lines.filter((line) => line.startsWith("✔ ")).length;
  const countedFailed = lines.filter((line) => line.startsWith("✖ ")).length;
  const passed = footer("pass") ?? countedPassed;
  const failed = footer("fail") ?? countedFailed;
  const total = footer("tests") ?? passed + failed;
  return { success: code === 0 && total > 0, passed, failed, total };
}

export async function runUnitTests(unitId, exerciseId) {
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
  if (typeof exerciseId === "string" && exerciseId.trim()) {
    args.push(`--test-name-pattern=^${escapeRegExp(exerciseId.trim())}\\b`);
  }
  args.push(resolvedTestPath);

  const startedAt = Date.now();
  const output = await new Promise((resolve, reject) => {
    // Dentro de `node --test` o filho herdaria NODE_TEST_CONTEXT e mudaria o formato da saída.
    const env = { ...process.env };
    delete env.NODE_TEST_CONTEXT;
    const child = spawn(process.execPath, args, {
      env,
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

  const summary = summarizeRun(output.code, output.combined);
  return {
    success: summary.success,
    passed: summary.passed,
    failed: summary.success ? 0 : Math.max(summary.failed, 1),
    total: summary.total,
    durationMs: Date.now() - startedAt,
    output: output.combined.slice(-40_000),
  };
}
