import { addEntry, todayString } from "../state.js";

const STUDY_LOG_MARKER = "<!-- Novas entradas abaixo desta linha -->";

export function buildEntry({ date, minutes, summary }) {
  const parsedMinutes = Number(minutes);
  if (!Number.isFinite(parsedMinutes) || parsedMinutes <= 0 || parsedMinutes > 300) {
    throw new Error("Minutos inválidos: informe um número entre 1 e 300.");
  }
  if (!summary || !summary.trim()) {
    throw new Error("Resumo não pode ser vazio.");
  }
  return { date, minutes: parsedMinutes, summary: summary.trim() };
}

export function applyLogEntry(state, entry) {
  return addEntry(state, entry);
}

export function formatStudyLogBlock(entry, focus) {
  return [
    `## ${entry.date} — ${entry.minutes} min (registrado via forge-cli)`,
    "",
    `Foco: ${focus ?? "(não definido)"}`,
    "",
    `Resumo: ${entry.summary}`,
    "",
  ].join("\n");
}

export function appendToStudyLog(currentContent, entry, focus) {
  const block = formatStudyLogBlock(entry, focus);
  if (currentContent.includes(STUDY_LOG_MARKER)) {
    return currentContent.replace(STUDY_LOG_MARKER, `${STUDY_LOG_MARKER}\n\n${block}`);
  }
  return `${currentContent.trimEnd()}\n\n${block}`;
}

export async function promptForEntry(rl) {
  const minutes = await rl.question("Minutos estudados hoje (1-300): ");
  const summary = await rl.question("Resumo curto do que você fez: ");
  return buildEntry({ date: todayString(), minutes, summary });
}
