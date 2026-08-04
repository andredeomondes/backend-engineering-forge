import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";

import { DATABASE_PATH, FORGE_DATA_DIR, LEGACY_STATE_PATH } from "./paths.js";
import { localDateString } from "./dates.js";

let database;

function initializeSchema(db) {
  db.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS study_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      study_date TEXT NOT NULL,
      minutes INTEGER NOT NULL CHECK (minutes BETWEEN 1 AND 600),
      summary TEXT NOT NULL,
      difficulty TEXT NOT NULL DEFAULT '',
      next_step TEXT NOT NULL DEFAULT '',
      unit_id TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS unit_progress (
      unit_id TEXT PRIMARY KEY,
      status TEXT NOT NULL DEFAULT 'available',
      attempts INTEGER NOT NULL DEFAULT 0,
      tests_passed INTEGER NOT NULL DEFAULT 0,
      tests_failed INTEGER NOT NULL DEFAULT 0,
      last_test_success INTEGER NOT NULL DEFAULT 0,
      last_test_at TEXT,
      reflection TEXT NOT NULL DEFAULT '',
      confidence INTEGER CHECK (confidence BETWEEN 1 AND 5),
      help_level INTEGER NOT NULL DEFAULT 0 CHECK (help_level BETWEEN 0 AND 3),
      completed_at TEXT
    );

    CREATE TABLE IF NOT EXISTS test_runs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      unit_id TEXT NOT NULL,
      passed INTEGER NOT NULL,
      failed INTEGER NOT NULL,
      success INTEGER NOT NULL,
      duration_ms INTEGER NOT NULL,
      output TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS hint_reveals (
      unit_id TEXT NOT NULL,
      level INTEGER NOT NULL CHECK (level BETWEEN 1 AND 3),
      revealed_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (unit_id, level)
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      unit_id TEXT NOT NULL,
      cycle_days INTEGER NOT NULL,
      scheduled_for TEXT NOT NULL,
      completed_at TEXT,
      confidence INTEGER CHECK (confidence BETWEEN 1 AND 5),
      UNIQUE (unit_id, cycle_days)
    );

    CREATE TABLE IF NOT EXISTS project_progress (
      project_id TEXT PRIMARY KEY,
      status TEXT NOT NULL DEFAULT 'locked',
      started_at TEXT,
      completed_at TEXT,
      retrospective TEXT NOT NULL DEFAULT ''
    );
  `);
}

function unitIdFromLegacyFocus(focus) {
  const match = focus?.match(/Unidade\s+(\d+)/i);
  return match ? `js-${String(match[1]).padStart(2, "0")}` : "js-01";
}

function importLegacyState(db) {
  const imported = db.prepare("SELECT value FROM settings WHERE key = ?").get("legacy_imported");
  if (imported) return;

  let state = { currentFocus: null, entries: [] };
  if (existsSync(LEGACY_STATE_PATH)) {
    try {
      state = JSON.parse(readFileSync(LEGACY_STATE_PATH, "utf8"));
    } catch {
      // A malformed legacy file must not prevent the new local app from starting.
    }
  }

  const insertSetting = db.prepare(
    "INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)",
  );
  insertSetting.run("current_unit", unitIdFromLegacyFocus(state.currentFocus));

  const insertSession = db.prepare(`
    INSERT INTO study_sessions (study_date, minutes, summary, unit_id)
    VALUES (?, ?, ?, ?)
  `);
  for (const entry of Array.isArray(state.entries) ? state.entries : []) {
    if (entry.date && entry.minutes && entry.summary) {
      insertSession.run(entry.date, entry.minutes, entry.summary, unitIdFromLegacyFocus(state.currentFocus));
    }
  }
  insertSetting.run("legacy_imported", new Date().toISOString());
}

export function getDatabase() {
  if (database) return database;
  mkdirSync(FORGE_DATA_DIR, { recursive: true });
  database = new DatabaseSync(DATABASE_PATH, { timeout: 5_000 });
  initializeSchema(database);
  importLegacyState(database);
  return database;
}

export function getSetting(key, fallback = null) {
  const row = getDatabase().prepare("SELECT value FROM settings WHERE key = ?").get(key);
  return row?.value ?? fallback;
}

export function setSetting(key, value) {
  getDatabase()
    .prepare("INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)")
    .run(key, String(value));
}

export function createStudySession({ date, minutes, summary, difficulty = "", nextStep = "", unitId }) {
  const parsedMinutes = Number(minutes);
  if (!Number.isInteger(parsedMinutes) || parsedMinutes < 1 || parsedMinutes > 600) {
    throw new Error("Informe uma duração entre 1 e 600 minutos.");
  }
  if (!summary?.trim()) throw new Error("O resumo da sessão não pode ficar vazio.");

  const result = getDatabase()
    .prepare(`
      INSERT INTO study_sessions
        (study_date, minutes, summary, difficulty, next_step, unit_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `)
    .run(
      date || localDateString(),
      parsedMinutes,
      summary.trim(),
      difficulty.trim(),
      nextStep.trim(),
      unitId || getSetting("current_unit", "js-01"),
    );
  return Number(result.lastInsertRowid);
}

export function listStudySessions(limit = 8) {
  return getDatabase()
    .prepare(`
      SELECT id, study_date AS date, minutes, summary, difficulty,
             next_step AS nextStep, unit_id AS unitId, created_at AS createdAt
      FROM study_sessions
      ORDER BY study_date DESC, id DESC
      LIMIT ?
    `)
    .all(limit);
}

export function listAllStudySessions() {
  return getDatabase()
    .prepare(`
      SELECT id, study_date AS date, minutes, summary, difficulty,
             next_step AS nextStep, unit_id AS unitId, created_at AS createdAt
      FROM study_sessions ORDER BY study_date, id
    `)
    .all();
}

export function ensureUnitProgress(unitId) {
  getDatabase()
    .prepare("INSERT OR IGNORE INTO unit_progress (unit_id) VALUES (?)")
    .run(unitId);
}

export function getUnitProgress(unitId) {
  ensureUnitProgress(unitId);
  return getDatabase()
    .prepare(`
      SELECT unit_id AS unitId, status, attempts, tests_passed AS testsPassed,
             tests_failed AS testsFailed, last_test_success AS lastTestSuccess,
             last_test_at AS lastTestAt, reflection, confidence,
             help_level AS helpLevel, completed_at AS completedAt
      FROM unit_progress WHERE unit_id = ?
    `)
    .get(unitId);
}

export function listUnitProgress() {
  return getDatabase()
    .prepare(`
      SELECT unit_id AS unitId, status, attempts, tests_passed AS testsPassed,
             tests_failed AS testsFailed, last_test_success AS lastTestSuccess,
             last_test_at AS lastTestAt, reflection, confidence,
             help_level AS helpLevel, completed_at AS completedAt
      FROM unit_progress ORDER BY unit_id
    `)
    .all();
}

export function recordTestRun(unitId, result) {
  const db = getDatabase();
  ensureUnitProgress(unitId);
  db.prepare(`
    INSERT INTO test_runs (unit_id, passed, failed, success, duration_ms, output)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(unitId, result.passed, result.failed, result.success ? 1 : 0, result.durationMs, result.output);
  db.prepare(`
    UPDATE unit_progress
       SET attempts = attempts + 1,
           tests_passed = ?, tests_failed = ?, last_test_success = ?,
           last_test_at = CURRENT_TIMESTAMP
     WHERE unit_id = ?
  `).run(result.passed, result.failed, result.success ? 1 : 0, unitId);
}

export function revealHint(unitId, level) {
  ensureUnitProgress(unitId);
  const db = getDatabase();
  db.prepare("INSERT OR IGNORE INTO hint_reveals (unit_id, level) VALUES (?, ?)").run(unitId, level);
  db.prepare("UPDATE unit_progress SET help_level = MAX(help_level, ?) WHERE unit_id = ?").run(
    level,
    unitId,
  );
}

export function listRevealedHints(unitId) {
  return getDatabase()
    .prepare("SELECT level, revealed_at AS revealedAt FROM hint_reveals WHERE unit_id = ? ORDER BY level")
    .all(unitId);
}

export function listAllHintReveals() {
  return getDatabase()
    .prepare("SELECT unit_id AS unitId, level, revealed_at AS revealedAt FROM hint_reveals ORDER BY unit_id, level")
    .all();
}

export function saveReflection(unitId, reflection, confidence) {
  ensureUnitProgress(unitId);
  getDatabase()
    .prepare("UPDATE unit_progress SET reflection = ?, confidence = ? WHERE unit_id = ?")
    .run(reflection.trim(), Number(confidence), unitId);
}

export function markUnitCompleted(unitId, completedDate = localDateString()) {
  const db = getDatabase();
  db.prepare(`
    UPDATE unit_progress
       SET status = 'completed', completed_at = COALESCE(completed_at, CURRENT_TIMESTAMP)
     WHERE unit_id = ?
  `).run(unitId);
  const insertReview = db.prepare(`
    INSERT OR IGNORE INTO reviews (unit_id, cycle_days, scheduled_for)
    VALUES (?, ?, ?)
  `);
  for (const cycle of [2, 7, 30]) {
    const scheduled = new Date(`${completedDate}T12:00:00`);
    scheduled.setDate(scheduled.getDate() + cycle);
    insertReview.run(unitId, cycle, localDateString(scheduled));
  }
}

export function listDueReviews(date = localDateString()) {
  return getDatabase()
    .prepare(`
      SELECT id, unit_id AS unitId, cycle_days AS cycleDays,
             scheduled_for AS scheduledFor, completed_at AS completedAt, confidence
      FROM reviews
      WHERE completed_at IS NULL AND scheduled_for <= ?
      ORDER BY scheduled_for, id
    `)
    .all(date);
}

export function listReviews() {
  return getDatabase()
    .prepare(`
      SELECT id, unit_id AS unitId, cycle_days AS cycleDays,
             scheduled_for AS scheduledFor, completed_at AS completedAt, confidence
      FROM reviews ORDER BY scheduled_for, id
    `)
    .all();
}

export function completeReview(reviewId, confidence) {
  const value = Number(confidence);
  if (!Number.isInteger(value) || value < 1 || value > 5) {
    throw new Error("A confiança da revisão deve ficar entre 1 e 5.");
  }
  getDatabase()
    .prepare("UPDATE reviews SET completed_at = CURRENT_TIMESTAMP, confidence = ? WHERE id = ?")
    .run(value, reviewId);
}

export function getStudyStats() {
  const db = getDatabase();
  const totals = db
    .prepare("SELECT COALESCE(SUM(minutes), 0) AS minutes, COUNT(DISTINCT study_date) AS days FROM study_sessions")
    .get();
  const dates = db
    .prepare("SELECT DISTINCT study_date AS date FROM study_sessions ORDER BY study_date DESC")
    .all()
    .map((row) => row.date);
  const review = db
    .prepare("SELECT AVG(confidence) AS average FROM reviews WHERE completed_at IS NOT NULL")
    .get();
  return { minutes: totals.minutes, days: totals.days, dates, reviewAverage: review.average };
}

export function restoreData(data) {
  if (!data || !Array.isArray(data.sessions) || !Array.isArray(data.progress)) {
    throw new Error("Backup inválido: sessões ou progresso ausentes.");
  }

  const db = getDatabase();
  db.exec("BEGIN IMMEDIATE");
  try {
    db.exec(`
      DELETE FROM test_runs;
      DELETE FROM hint_reveals;
      DELETE FROM reviews;
      DELETE FROM unit_progress;
      DELETE FROM study_sessions;
    `);

    const insertSession = db.prepare(`
      INSERT INTO study_sessions
        (id, study_date, minutes, summary, difficulty, next_step, unit_id, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, COALESCE(?, CURRENT_TIMESTAMP))
    `);
    for (const session of data.sessions) {
      insertSession.run(
        session.id,
        session.date,
        session.minutes,
        session.summary,
        session.difficulty || "",
        session.nextStep || "",
        session.unitId || null,
        session.createdAt || null,
      );
    }

    const insertProgress = db.prepare(`
      INSERT INTO unit_progress
        (unit_id, status, attempts, tests_passed, tests_failed, last_test_success,
         last_test_at, reflection, confidence, help_level, completed_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const progress of data.progress) {
      insertProgress.run(
        progress.unitId,
        progress.status || "available",
        progress.attempts || 0,
        progress.testsPassed || 0,
        progress.testsFailed || 0,
        progress.lastTestSuccess ? 1 : 0,
        progress.lastTestAt || null,
        progress.reflection || "",
        progress.confidence || null,
        progress.helpLevel || 0,
        progress.completedAt || null,
      );
    }

    const insertHint = db.prepare(
      "INSERT INTO hint_reveals (unit_id, level, revealed_at) VALUES (?, ?, COALESCE(?, CURRENT_TIMESTAMP))",
    );
    for (const hint of Array.isArray(data.hints) ? data.hints : []) {
      insertHint.run(hint.unitId, hint.level, hint.revealedAt || null);
    }

    const insertReview = db.prepare(`
      INSERT INTO reviews
        (id, unit_id, cycle_days, scheduled_for, completed_at, confidence)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    for (const review of Array.isArray(data.reviews) ? data.reviews : []) {
      insertReview.run(
        review.id,
        review.unitId,
        review.cycleDays,
        review.scheduledFor,
        review.completedAt || null,
        review.confidence || null,
      );
    }
    setSetting("current_unit", data.currentUnit || "js-01");
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}
