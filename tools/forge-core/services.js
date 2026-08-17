import {
  completeReview,
  createStudySession,
  getSetting,
  getStudyStats,
  getUnitProgress,
  listAllStudySessions,
  listAllHintReveals,
  listDueReviews,
  listRevealedHints,
  listReviews,
  listStudySessions,
  listUnitProgress,
  markUnitCompleted,
  recordTestRun,
  restoreData,
  revealHint,
  saveReflection,
  setSetting,
} from "./database.js";
import { daysBetween, localDateString } from "./dates.js";
import { getUnit, listPhases, listPolyglotTracks, listProjects, listUnits } from "./curriculum.js";
import { runUnitTests } from "./test-runner.js";

function computeStreak(dates, today = localDateString()) {
  if (!dates.length) return 0;
  const gap = daysBetween(today, dates[0]);
  if (gap > 1) return 0;
  let streak = 1;
  for (let index = 1; index < dates.length; index += 1) {
    if (daysBetween(dates[index - 1], dates[index]) !== 1) break;
    streak += 1;
  }
  return streak;
}

function unitSummary(unit, progress) {
  return {
    id: unit.id,
    track: unit.track,
    phase: unit.phase,
    number: unit.number,
    title: unit.title,
    exerciseCount: unit.exercises.length,
    estimatedHours: unit.estimatedHours,
    status: progress?.status || "available",
    attempts: progress?.attempts || 0,
    testsPassed: progress?.testsPassed || 0,
    testsFailed: progress?.testsFailed || 0,
    completedAt: progress?.completedAt || null,
  };
}

export function getDashboard() {
  const units = listUnits();
  const progressRows = listUnitProgress();
  const progress = new Map(progressRows.map((row) => [row.unitId, row]));
  const currentUnitId = getSetting("current_unit", units[0]?.id || "js-01");
  const currentUnit = units.find((unit) => unit.id === currentUnitId) || units[0];
  const stats = getStudyStats();
  const completed = progressRows.filter((row) => row.status === "completed").length;
  const assisted = progressRows.filter((row) => row.attempts > 0);
  const autonomy = assisted.length
    ? Math.round(
        assisted.reduce((sum, row) => sum + Math.max(0, 100 - row.helpLevel * 25), 0) /
          assisted.length,
      )
    : null;

  const unitSummaries = units.map((unit) => unitSummary(unit, progress.get(unit.id)));
  const trackRequirements = {
    javascript: null,
    dsa: null,
    typescript: "js-27",
    node: "ts-08",
    sql: "node-07",
  };
  for (const track of Object.keys(trackRequirements)) {
    const trackUnits = unitSummaries.filter((unit) => unit.track === track);
    trackUnits.forEach((unit, index) => {
      const previous = trackUnits[index - 1];
      const requirement = trackRequirements[track];
      const trackReleased = !requirement || progress.get(requirement)?.status === "completed";
      const unlocked =
        (index === 0 && trackReleased) ||
        unit.id === currentUnitId ||
        unit.status === "completed" ||
        previous?.status === "completed";
      if (!unlocked) unit.status = "locked";
    });
  }
  const projectSummaries = listProjects().map((project) => ({
    ...project,
    status: progress.get(project.unlockAfter)?.status === "completed" ? "available" : "locked",
  }));

  return {
    currentUnit: unitSummaries.find((unit) => unit.id === currentUnit?.id) || null,
    stats: {
      minutes: stats.minutes,
      hours: Number((stats.minutes / 60).toFixed(1)),
      days: stats.days,
      streak: computeStreak(stats.dates),
      completedUnits: completed,
      totalUnits: units.length,
      retention: stats.reviewAverage ? Math.round((stats.reviewAverage / 5) * 100) : null,
      autonomy,
      dueReviews: listDueReviews().length,
    },
    recentSessions: listStudySessions(5),
    units: unitSummaries,
    projects: projectSummaries,
    phases: listPhases(),
    polyglotTracks: listPolyglotTracks(),
  };
}

export function getUnitDetail(unitId) {
  const unit = getUnit(unitId);
  if (!unit) throw new Error("Unidade não encontrada.");
  const progress = getUnitProgress(unitId);
  const revealed = new Set(listRevealedHints(unitId).map((item) => item.level));
  return {
    ...unitSummary(unit, progress),
    markdown: unit.markdown,
    exercises: unit.exercises,
    progress,
    hints: unit.hints.map((hint) => ({ ...hint, revealed: revealed.has(hint.level) })),
    gate: {
      tests: Boolean(progress.lastTestSuccess),
      reflection: progress.reflection.length >= 30,
      confidence: (progress.confidence || 0) >= 3,
      completed: progress.status === "completed",
    },
  };
}

export function setCurrentUnit(unitId) {
  if (!getUnit(unitId)) throw new Error("Unidade não encontrada.");
  const summary = getDashboard().units.find((unit) => unit.id === unitId);
  if (summary?.status === "locked") throw new Error("Conclua o gate anterior para liberar esta unidade.");
  setSetting("current_unit", unitId);
  return getUnitDetail(unitId);
}

export function addStudySession(input) {
  const id = createStudySession(input);
  return listAllStudySessions().find((session) => session.id === id);
}

export function revealUnitHint(unitId, level) {
  const unit = getUnit(unitId);
  const value = Number(level);
  if (!unit || ![1, 2, 3].includes(value)) throw new Error("Dica inválida.");
  revealHint(unitId, value);
  return getUnitDetail(unitId);
}

function evaluateGate(unitId) {
  const progress = getUnitProgress(unitId);
  if (
    progress.status !== "completed" &&
    progress.lastTestSuccess &&
    progress.reflection.length >= 30 &&
    progress.confidence >= 3
  ) {
    markUnitCompleted(unitId);
  }
  return getUnitDetail(unitId);
}

export async function testUnit(unitId) {
  const result = await runUnitTests(unitId);
  recordTestRun(unitId, result);
  return { result, unit: evaluateGate(unitId) };
}

export function reflectOnUnit(unitId, reflection, confidence) {
  if (!reflection?.trim() || reflection.trim().length < 30) {
    throw new Error("Escreva uma reflexão com pelo menos 30 caracteres.");
  }
  const value = Number(confidence);
  if (!Number.isInteger(value) || value < 1 || value > 5) {
    throw new Error("A confiança deve ficar entre 1 e 5.");
  }
  saveReflection(unitId, reflection, value);
  return evaluateGate(unitId);
}

export function getReviews() {
  const units = new Map(listUnits().map((unit) => [unit.id, unit]));
  return listReviews().map((review) => ({
    ...review,
    unitTitle: units.get(review.unitId)?.title || review.unitId,
    due: !review.completedAt && review.scheduledFor <= localDateString(),
  }));
}

export function finishReview(reviewId, confidence) {
  completeReview(reviewId, confidence);
  return getReviews();
}

export function exportData() {
  return {
    exportedAt: new Date().toISOString(),
    currentUnit: getSetting("current_unit", "js-01"),
    sessions: listAllStudySessions(),
    progress: listUnitProgress(),
    hints: listAllHintReveals(),
    reviews: listReviews(),
  };
}

export function importData(data) {
  if (data.currentUnit && !getUnit(data.currentUnit)) {
    throw new Error("O backup aponta para uma unidade que não existe neste currículo.");
  }
  restoreData(data);
  return getDashboard();
}

export function exportSessionsCsv() {
  const escape = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;
  const rows = listAllStudySessions().map((session) =>
    [session.date, session.minutes, session.unitId, session.summary, session.difficulty, session.nextStep]
      .map(escape)
      .join(","),
  );
  return ["date,minutes,unit,summary,difficulty,next_step", ...rows].join("\n");
}
