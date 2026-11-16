import { spawn } from "node:child_process";
import { existsSync, readFileSync, rmSync } from "node:fs";
import path from "node:path";

import { getUnit } from "./curriculum.js";
import { JAVA_UNITS_PATH, WORKSPACE_ROOT } from "./paths.js";

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

function runProcess(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    // Dentro de `node --test` o filho herdaria NODE_TEST_CONTEXT e mudaria o formato da saída.
    const env = { ...process.env };
    delete env.NODE_TEST_CONTEXT;
    const child = spawn(command, args, {
      env,
      cwd: WORKSPACE_ROOT,
      shell: false,
      windowsHide: true,
      ...options,
    });
    let combined = "";
    child.stdout.on("data", (chunk) => (combined += chunk));
    child.stderr.on("data", (chunk) => (combined += chunk));
    child.on("error", reject);
    child.on("close", (code) => resolve({ code, combined }));
  });
}

// Lê o relatório XML do Surefire (um <testsuite> por classe de teste).
export function summarizeSurefire(xml) {
  const suite = xml.match(/<testsuite\b[^>]*>/)?.[0];
  if (!suite) return null;
  const attr = (name) => Number(suite.match(new RegExp(`\\b${name}="(\\d+)"`))?.[1] ?? 0);
  const total = attr("tests") - attr("skipped");
  const failed = attr("failures") + attr("errors");
  const passed = Math.max(total - failed, 0);
  return { success: total > 0 && failed === 0, passed, failed, total };
}

const JAVA_EXERCISE_ID = /^[A-Za-z_$][\w$]*$/;
const JAVA_TOOLING_MISSING =
  "Maven ou JDK não encontrado. Instale JDK 21+ e Maven e confirme `mvn -v` no terminal.";

async function runJavaUnitTests(unit, exerciseId) {
  const testClass = `${unit.javaClass}Test`;
  let selector = testClass;
  if (typeof exerciseId === "string" && exerciseId.trim()) {
    const id = exerciseId.trim();
    if (!JAVA_EXERCISE_ID.test(id))
      throw new Error("Identificador de exercício inválido.");
    selector = `${testClass}#${id}_*`;
  }

  const reportPath = path.join(
    JAVA_UNITS_PATH,
    "target",
    "surefire-reports",
    `TEST-forge.java.${testClass}.xml`,
  );
  rmSync(reportPath, { force: true });

  const args = [
    "-B",
    "-q",
    "-f",
    path.join(JAVA_UNITS_PATH, "pom.xml"),
    "test",
    `-Dtest=${selector}`,
    "-Dsurefire.failIfNoSpecifiedTests=false",
  ];
  // No Windows o Maven é um .cmd, que só roda via cmd.exe; os argumentos são fixos
  // ou validados acima, então nada vindo do usuário chega cru ao interpretador.
  const windows = process.platform === "win32";
  const startedAt = Date.now();
  let output;
  try {
    output = windows
      ? await runProcess(process.env.ComSpec || "cmd.exe", [
          "/d",
          "/c",
          "mvn.cmd",
          ...args,
        ])
      : await runProcess("mvn", args);
  } catch (error) {
    if (error.code === "ENOENT") output = { code: 127, combined: JAVA_TOOLING_MISSING };
    else throw error;
  }
  if (/não é reconhecido|is not recognized|command not found/i.test(output.combined)) {
    output.combined = `${JAVA_TOOLING_MISSING}\n\n${output.combined}`;
  }

  const summary = existsSync(reportPath)
    ? summarizeSurefire(readFileSync(reportPath, "utf8"))
    : null;
  const result = summary ?? { success: false, passed: 0, failed: 1, total: 0 };
  return {
    success: result.success,
    passed: result.passed,
    failed: result.success ? 0 : Math.max(result.failed, 1),
    total: result.total,
    durationMs: Date.now() - startedAt,
    output:
      `${output.combined}\n${result.passed}/${result.total} testes passaram (${testClass}).`.slice(
        -40_000,
      ),
  };
}

export async function runUnitTests(unitId, exerciseId) {
  const unit = getUnit(unitId);
  if (!unit) throw new Error(`Unidade desconhecida: ${unitId}`);
  if (unit.track === "java") return runJavaUnitTests(unit, exerciseId);

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
  const output = await runProcess(process.execPath, args);

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
