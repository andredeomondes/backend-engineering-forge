import { computeStreak, daysLogged, totalMinutes, todayString } from "../state.js";

export function status(state) {
  const streak = computeStreak(state.entries);
  const days = daysLogged(state.entries);
  const minutes = totalMinutes(state.entries);
  const hours = (minutes / 60).toFixed(1);
  const lastEntry = [...state.entries].sort((a, b) => (a.date < b.date ? 1 : -1))[0];

  const lines = [
    "Backend Engineering Forge — status",
    "",
    `Foco atual: ${state.currentFocus ?? '(não definido — use "forge focus <texto>")'}`,
    `Dias estudados: ${days}`,
    `Streak atual: ${streak} dia(s) consecutivo(s)`,
    `Tempo total registrado: ${hours}h (${minutes} min)`,
  ];

  if (lastEntry) {
    lines.push(
      `Último registro: ${lastEntry.date} — ${lastEntry.minutes} min — ${lastEntry.summary}`,
    );
  } else {
    lines.push("Nenhum dia registrado ainda. Rode: forge log");
  }

  const today = todayString();
  const loggedToday = state.entries.some((e) => e.date === today);
  lines.push("");
  lines.push(
    loggedToday
      ? "Hoje já está registrado. Meta cumprida."
      : "Hoje ainda não tem registro. Meta: 1-2h. Rode: forge log",
  );

  return lines.join("\n");
}
