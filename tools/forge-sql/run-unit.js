import { existsSync, readdirSync } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const workspaceRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
export const sqlRoot = path.join(workspaceRoot, "exercises", "04-sql-postgresql");
const composePath = path.join(sqlRoot, "compose.yaml");

export function normalizeSqlUnit(input) {
  const text = String(input || "").trim().toLowerCase();
  const match = text.match(/^(?:sql-|unit-)?(0?[1-8])$/);
  if (!match) throw new Error("Use uma unidade entre sql-01 e sql-08.");
  return `sql-${String(Number(match[1])).padStart(2, "0")}`;
}

export function findUnitDirectory(unitId, entries = readdirSync(sqlRoot)) {
  const number = normalizeSqlUnit(unitId).slice(-2);
  const directory = entries.find((entry) => entry.startsWith(`unit-${number}-`));
  if (!directory) throw new Error(`Material não encontrado para ${unitId}.`);
  return directory;
}

function runDocker(args) {
  const result = spawnSync("docker", args, { cwd: workspaceRoot, encoding: "utf8", stdio: "inherit" });
  if (result.error) throw new Error(`Docker indisponível: ${result.error.message}`);
  if (result.status !== 0) throw new Error(`Comando Docker terminou com código ${result.status}.`);
}

export function runSqlUnit(input) {
  const unitId = normalizeSqlUnit(input);
  const directory = findUnitDirectory(unitId);
  const exercisePath = path.join(sqlRoot, directory, "exercises.sql");
  const checksPath = path.join(sqlRoot, directory, "checks.sql");
  if (!existsSync(exercisePath) || !existsSync(checksPath)) {
    throw new Error(`Arquivos incompletos para ${unitId}.`);
  }

  runDocker(["compose", "-f", composePath, "up", "-d", "--wait"]);
  for (const filename of ["exercises.sql", "checks.sql"]) {
    runDocker([
      "compose", "-f", composePath, "exec", "-T", "postgres",
      "psql", "-v", "ON_ERROR_STOP=1", "-U", "forge", "-d", "forge_sql",
      "-f", `/workspace/${directory}/${filename}`,
    ]);
  }
}

const isEntryPoint = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isEntryPoint) {
  try {
    runSqlUnit(process.argv[2]);
    process.stdout.write(`\n${normalizeSqlUnit(process.argv[2])} concluída com verificações verdes.\n`);
  } catch (error) {
    process.stderr.write(`Erro: ${error.message}\n`);
    process.exitCode = 1;
  }
}
