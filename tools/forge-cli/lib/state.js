import { readFile, writeFile } from "node:fs/promises";

const DAY_MS = 24 * 60 * 60 * 1000;

export function todayString(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseUtcDate(dateStr) {
  return new Date(`${dateStr}T00:00:00.000Z`);
}

export function defaultState() {
  return { currentFocus: null, entries: [] };
}

export async function loadState(path) {
  try {
    const raw = await readFile(path, "utf8");
    const parsed = JSON.parse(raw);
    return {
      currentFocus: parsed.currentFocus ?? null,
      entries: Array.isArray(parsed.entries) ? parsed.entries : [],
    };
  } catch (err) {
    if (err.code === "ENOENT") return defaultState();
    throw err;
  }
}

export async function saveState(path, state) {
  await writeFile(path, `${JSON.stringify(state, null, 2)}\n`, "utf8");
}

export function addEntry(state, entry) {
  return {
    ...state,
    entries: [...state.entries, entry],
  };
}

export function setFocus(state, focus) {
  return { ...state, currentFocus: focus };
}

/**
 * Conta dias consecutivos com pelo menos uma entrada, terminando na
 * entrada mais recente. Se a entrada mais recente for de ontem (ou
 * hoje ainda não tiver entrada), o streak de ontem continua valendo.
 * Se houver um buraco maior que 1 dia antes de "hoje", o streak é 0.
 */
export function computeStreak(entries, todayStr = todayString()) {
  if (entries.length === 0) return 0;

  const uniqueDates = [...new Set(entries.map((e) => e.date))].sort().reverse();

  const today = parseUtcDate(todayStr);
  const mostRecent = parseUtcDate(uniqueDates[0]);
  const gapFromToday = Math.round((today - mostRecent) / DAY_MS);

  if (gapFromToday > 1) return 0;

  let streak = 1;
  for (let i = 1; i < uniqueDates.length; i++) {
    const current = parseUtcDate(uniqueDates[i - 1]);
    const previous = parseUtcDate(uniqueDates[i]);
    const gap = Math.round((current - previous) / DAY_MS);
    if (gap === 1) {
      streak += 1;
    } else {
      break;
    }
  }
  return streak;
}

export function totalMinutes(entries) {
  return entries.reduce((sum, e) => sum + (e.minutes || 0), 0);
}

export function daysLogged(entries) {
  return new Set(entries.map((e) => e.date)).size;
}
