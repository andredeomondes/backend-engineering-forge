import {
  completeReview,
  createStudySession,
  deleteStudySession,
  getSetting,
  getStudyStats,
  getUnitProgress,
  listExerciseProgress,
  listAllStudySessions,
  listAllHintReveals,
  listDueReviews,
  listRevealedHints,
  listReviews,
  listStudySessions,
  listUnitProgress,
  markUnitCompleted,
  recordMissionRun,
  recordTestRun,
  listTopicChecks,
  restoreData,
  revealHint,
  saveReflection,
  setExerciseManual,
  setSetting,
  setTopicCheck,
  upsertExerciseResult,
} from "./database.js";
import { readFileSync } from "node:fs";

import { daysBetween, localDateString } from "./dates.js";
import {
  getUnit,
  listPhases,
  listPolyglotTracks,
  listProjects,
  listUnits,
} from "./curriculum.js";
import { PROGRESS_PATH } from "./paths.js";
import { runUnitTests } from "./test-runner.js";
import { buildNodeItems, computeTrail } from "./trail.js";
import { loadTrailContent } from "./trail-content.js";

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
  runMigrations();
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
  const projectSummaries = listProjects().map((project) => ({
    ...project,
    status: "available",
  }));
  const phaseSummaries = listPhases().map((phase) => {
    const phaseUnits = unitSummaries.filter((unit) => unit.phase === phase.number);
    let status = "available";
    if (currentUnit?.phase === phase.number) status = "active";
    else if (phaseUnits.length && phaseUnits.every((unit) => unit.status === "completed"))
      status = "completed";
    return { ...phase, status };
  });

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
    phases: phaseSummaries,
    polyglotTracks: listPolyglotTracks(),
  };
}

const MIN_REFLECTION_LENGTH = 30;
const MIN_REFLECTION_CONFIDENCE = 3;

function missionStatus(row) {
  if (row?.lastResult === "pass") return "passed";
  if (row?.manualDone) return "manual";
  if (row?.lastResult === "fail") return "failing";
  return "todo";
}

function listMissions(unit) {
  const rows = new Map(listExerciseProgress(unit.id).map((row) => [row.exerciseId, row]));
  return unit.exercises.map((exercise) => ({
    index: exercise.index,
    id: exercise.id,
    name: exercise.name,
    group: exercise.group,
    status: missionStatus(rows.get(exercise.id)),
  }));
}

export function getUnitDetail(unitId) {
  runMigrations();
  const unit = getUnit(unitId);
  if (!unit) throw new Error("Unidade não encontrada.");
  const progress = getUnitProgress(unitId);
  const revealed = new Set(listRevealedHints(unitId).map((item) => item.level));
  const tests = Boolean(progress.lastTestSuccess);
  const reflection =
    (progress.reflection || "").length >= MIN_REFLECTION_LENGTH &&
    (progress.confidence || 0) >= MIN_REFLECTION_CONFIDENCE;
  return {
    ...unitSummary(unit, progress),
    markdown: unit.markdown,
    exercises: unit.exercises,
    missions: listMissions(unit),
    progress,
    hints: unit.hints.map((hint) => ({ ...hint, revealed: revealed.has(hint.level) })),
    gate: {
      tests,
      reflection,
      completed: progress.status === "completed",
      badge: tests && reflection,
    },
  };
}

export function setCurrentUnit(unitId) {
  if (!getUnit(unitId)) throw new Error("Unidade não encontrada.");
  setSetting("current_unit", unitId);
  return getUnitDetail(unitId);
}

export function addStudySession(input) {
  const id = createStudySession(input);
  return listAllStudySessions().find((session) => session.id === id);
}

export function removeStudySession(id) {
  deleteStudySession(id);
  return { id: Number(id) };
}

export function revealUnitHint(unitId, level) {
  const unit = getUnit(unitId);
  const value = Number(level);
  if (!unit || ![1, 2, 3].includes(value)) throw new Error("Dica inválida.");
  revealHint(unitId, value);
  return getUnitDetail(unitId);
}

// Conclui a unidade quando a suíte fica verde ou todas as missões estão feitas.
// Nunca reabre uma unidade já concluída.
function evaluateCompletion(unitId) {
  const unit = getUnit(unitId);
  const progress = getUnitProgress(unitId);
  if (progress.status === "completed") return;
  const missionsDone =
    unit &&
    unit.exercises.length > 0 &&
    listMissions(unit).every((mission) => ["passed", "manual"].includes(mission.status));
  if (progress.lastTestSuccess || missionsDone) markUnitCompleted(unitId);
}

function seedPhase0FromProgress() {
  let text;
  try {
    text = readFileSync(PROGRESS_PATH, "utf8");
  } catch {
    return;
  }
  const lines = new Set(text.split(/\r?\n/).map((line) => line.trimEnd()));
  const phase0 = loadTrailContent().nodes.find((node) => node.id === "f00");
  for (const item of phase0?.items || [])
    if (lines.has(`- [x] ${item.label}`)) setTopicCheck(item.id, true);
}

export function runMigrations() {
  if (!getSetting("migration_trail_v1")) {
    for (const row of listUnitProgress()) {
      if (row.status !== "completed") continue;
      const unit = getUnit(row.unitId);
      if (!unit) continue;
      for (const exercise of unit.exercises)
        upsertExerciseResult(row.unitId, exercise.id, true);
    }
    setSetting("migration_trail_v1", "done");
  }
  if (!getSetting("migration_trail_phase0_v1")) {
    seedPhase0FromProgress();
    setSetting("migration_trail_phase0_v1", "done");
  }
}

function requireUnit(unitId) {
  const unit = getUnit(unitId);
  if (!unit) throw new Error("Unidade não encontrada.");
  return unit;
}

export function markMission(unitId, exerciseId, done) {
  const unit = requireUnit(unitId);
  if (!unit.exercises.some((exercise) => exercise.id === exerciseId))
    throw new Error("Exercício desconhecido.");
  setExerciseManual(unitId, exerciseId, Boolean(done));
  evaluateCompletion(unitId);
  return getUnitDetail(unitId);
}

export function markAllMissions(unitId) {
  const unit = requireUnit(unitId);
  for (const exercise of unit.exercises) setExerciseManual(unitId, exercise.id, true);
  evaluateCompletion(unitId);
  return getUnitDetail(unitId);
}

export function saveUnitReflection(unitId, reflection, confidence) {
  requireUnit(unitId);
  const value = Number(confidence);
  if (!Number.isInteger(value) || value < 1 || value > 5)
    throw new Error("A confiança deve ser de 1 a 5.");
  saveReflection(unitId, String(reflection ?? ""), value);
  evaluateCompletion(unitId);
  return getUnitDetail(unitId);
}

export async function testUnit(unitId, exerciseId, runTests = runUnitTests) {
  const unit = getUnit(unitId);
  if (exerciseId) {
    if (!unit?.exercises.some((exercise) => exercise.id === exerciseId))
      throw new Error("Exercício desconhecido.");
    if (unit.missionTestable === false)
      throw new Error("Esta unidade não tem teste por missão.");
  }
  const result = await runTests(unitId, exerciseId || undefined);
  if (exerciseId) {
    // Rodar uma missão só nunca pode concluir (nem reabrir) a unidade.
    recordMissionRun(unitId, result);
    // Sem teste com esse nome (missão só de tipos): não há resultado a gravar.
    if (result.total !== 0) upsertExerciseResult(unitId, exerciseId, result.success);
  } else {
    recordTestRun(unitId, result);
    if (result.success && unit) {
      for (const exercise of unit.exercises)
        upsertExerciseResult(unitId, exercise.id, true);
    }
  }
  evaluateCompletion(unitId);
  return {
    result,
    unit: getUnitDetail(unitId),
    noTests: Boolean(exerciseId) && result.total === 0,
  };
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
    [
      session.date,
      session.minutes,
      session.unitId,
      session.summary,
      session.difficulty,
      session.nextStep,
    ]
      .map(escape)
      .join(","),
  );
  return ["date,minutes,unit,summary,difficulty,next_step", ...rows].join("\n");
}

function trailUnits() {
  const progress = new Map(listUnitProgress().map((row) => [row.unitId, row]));
  return listUnits().map((unit) => unitSummary(unit, progress.get(unit.id)));
}

export function getTrail() {
  runMigrations();
  const units = trailUnits();
  return computeTrail({
    content: loadTrailContent(),
    units,
    checkedItemIds: listTopicChecks().map((check) => check.itemId),
    currentUnitId: getSetting("current_unit", units[0]?.id || "js-01"),
  });
}

export function setTrailItem(itemId, done) {
  runMigrations();
  if (typeof done !== "boolean") throw new Error("Valor 'done' deve ser booleano.");
  const known = loadTrailContent().nodes.some((node) =>
    node.items.some((item) => item.id === itemId),
  );
  if (!known) throw new Error("Item da trilha desconhecido.");
  setTopicCheck(itemId, done);
  return getTrail();
}

export function markTrailNode(nodeId) {
  runMigrations();
  const node = loadTrailContent().nodes.find((candidate) => candidate.id === nodeId);
  if (!node) throw new Error("Nó da trilha desconhecido.");
  for (const item of buildNodeItems(node, trailUnits(), new Set())) {
    if (item.kind === "unit") markAllMissions(item.unitId);
    else setTopicCheck(item.id, true);
  }
  return getTrail();
}
