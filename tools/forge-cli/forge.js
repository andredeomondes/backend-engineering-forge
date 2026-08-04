#!/usr/bin/env node
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import path from "node:path";

import { getSetting } from "../forge-core/database.js";
import { listUnits } from "../forge-core/curriculum.js";
import { FORGE_DATA_DIR } from "../forge-core/paths.js";
import {
  addStudySession,
  exportData,
  exportSessionsCsv,
  getDashboard,
  getReviews,
  getUnitDetail,
  importData,
  revealUnitHint,
  setCurrentUnit,
  testUnit,
} from "../forge-core/services.js";

function printStatus() {
  const dashboard = getDashboard();
  const { stats, currentUnit } = dashboard;
  console.log(
    [
      "Backend Engineering Forge — status",
      "",
      `Foco atual: ${currentUnit.title} (${currentUnit.id})`,
      `Dias estudados: ${stats.days}`,
      `Streak atual: ${stats.streak} dia(s)`,
      `Tempo total: ${stats.hours}h (${stats.minutes} min)`,
      `Unidades concluídas: ${stats.completedUnits}/${stats.totalUnits}`,
      `Revisões pendentes: ${stats.dueReviews}`,
    ].join("\n"),
  );
}

async function runLog() {
  const rl = createInterface({ input: stdin, output: stdout });
  try {
    const minutes = await rl.question("Minutos estudados hoje (1-600): ");
    const summary = await rl.question("Resumo curto: ");
    const difficulty = await rl.question("Principal dificuldade (opcional): ");
    const nextStep = await rl.question("Próximo passo (opcional): ");
    addStudySession({ minutes: Number(minutes), summary, difficulty, nextStep });
    console.log("\nSessão registrada no Forge.");
    printStatus();
  } finally {
    rl.close();
  }
}

function normalizeUnitId(input) {
  const text = input.trim().toLowerCase();
  if (/^(js|dsa)-\d{2}$/.test(text)) return text;
  const match = text.match(/(?:unidade|unit|sessão|session)?\s*(\d+)/);
  if (match) return `js-${String(match[1]).padStart(2, "0")}`;
  return text;
}

function runFocus(args) {
  if (!args.length) throw new Error("Uso: forge focus js-02");
  const unit = setCurrentUnit(normalizeUnitId(args.join(" ")));
  console.log(`Foco atualizado: ${unit.title}`);
}

async function runTests(args) {
  const unitId = args[0] || getSetting("current_unit", "js-01");
  console.log(`Executando ${unitId}...\n`);
  const { result, unit } = await testUnit(unitId);
  process.stdout.write(result.output);
  console.log(
    `\n${result.success ? "Verde" : "Ainda há trabalho"}: ${result.passed} passando, ${result.failed} falhando.`,
  );
  if (unit.gate.completed) console.log("Gate concluído. Revisões de 2, 7 e 30 dias agendadas.");
  process.exitCode = result.success ? 0 : 1;
}

function runHint(args) {
  const level = Number(args[0]);
  const unitId = getSetting("current_unit", "js-01");
  const unit = revealUnitHint(unitId, level);
  const hint = unit.hints.find((item) => item.level === level);
  console.log(`Dica ${level} — ${hint.title}\n\n${hint.content}`);
}

function runProgress() {
  const dashboard = getDashboard();
  for (const unit of dashboard.units) {
    const marker = unit.status === "completed" ? "✓" : unit.id === dashboard.currentUnit.id ? "→" : "·";
    console.log(`${marker} ${unit.id.toUpperCase()}  ${unit.title}  (${unit.testsPassed} testes passando)`);
  }
}

function runReviews() {
  const pending = getReviews().filter((review) => !review.completedAt);
  if (!pending.length) {
    console.log("Nenhuma revisão agendada.");
    return;
  }
  for (const review of pending) {
    console.log(`${review.due ? "!" : "·"} ${review.scheduledFor}  ${review.unitId.toUpperCase()}  ciclo ${review.cycleDays}d`);
  }
}

function runNext() {
  const currentId = getSetting("current_unit", "js-01");
  const current = getUnitDetail(currentId);
  if (!current.gate.completed) throw new Error("O gate da unidade atual ainda não foi concluído.");
  const units = listUnits().filter((unit) => unit.track === current.track);
  const index = units.findIndex((unit) => unit.id === currentId);
  const next = units[index + 1];
  if (!next) throw new Error("Você chegou ao fim desta trilha.");
  setCurrentUnit(next.id);
  console.log(`Próxima unidade liberada: ${next.title}`);
}

async function runExport(args) {
  const format = args[0] === "csv" ? "csv" : "json";
  const exportDirectory = path.join(FORGE_DATA_DIR, "exports");
  await mkdir(exportDirectory, { recursive: true });
  const filename = format === "csv" ? "study-sessions.csv" : "forge-backup.json";
  const content = format === "csv" ? exportSessionsCsv() : `${JSON.stringify(exportData(), null, 2)}\n`;
  const destination = path.join(exportDirectory, filename);
  await writeFile(destination, content, "utf8");
  console.log(`Exportado: ${destination}`);
}

async function runImport(args) {
  const source = args.find((argument) => argument !== "--replace");
  if (!source || !args.includes("--replace")) {
    throw new Error("Uso: forge import <backup.json> --replace");
  }
  const content = await readFile(path.resolve(source), "utf8");
  importData(JSON.parse(content));
  console.log("Backup restaurado. O estado anterior foi substituído.");
  printStatus();
}

function printHelp() {
  console.log(
    [
      "Uso: npm run forge -- <comando>",
      "",
      "Comandos:",
      "  status             mostra seu estado atual",
      "  log                registra uma sessão de estudo",
      "  focus <js-02>      define a unidade ativa",
      "  test [js-02]       executa os testes de uma unidade",
      "  hint <1|2|3>       revela uma dica progressiva",
      "  progress           mostra todas as unidades",
      "  review             lista revisões agendadas",
      "  next               avança após concluir o gate",
      "  export [json|csv]  exporta seus dados",
      "  import <json> --replace  restaura um backup",
      "",
      "Painel local: npm run forge:web",
    ].join("\n"),
  );
}

async function main() {
  const [, , command, ...args] = process.argv;
  switch (command) {
    case "status": printStatus(); break;
    case "log": await runLog(); break;
    case "focus": runFocus(args); break;
    case "test": await runTests(args); break;
    case "hint": runHint(args); break;
    case "progress": runProgress(); break;
    case "review": runReviews(); break;
    case "next": runNext(); break;
    case "export": await runExport(args); break;
    case "import": await runImport(args); break;
    default:
      printHelp();
      if (command && command !== "help") process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(`Erro: ${error.message}`);
  process.exitCode = 1;
});
