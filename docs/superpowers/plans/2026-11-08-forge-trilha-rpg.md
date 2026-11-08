# Forge Trilha RPG Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade the existing 8-bit Forge Web panel with a clickable RPG trail (phases 0–27 + Java side quest), mission cards per exercise, free progress marking, and no locks anywhere.

**Architecture:** `tools/forge-core` gains two additive SQLite tables (per-exercise progress, topic checks), a curated content file `docs/curriculum/trilha.json`, a `trail.js` module that computes the character sheet/tree, and lock-free services. `tools/forge-web` gains a Trilha page (sheet + tree + phase panel) and a rebuilt Unidade page (tabs, quest log, mission card). All visuals are monochrome.

**Tech Stack:** Node ≥24 (`node:sqlite`, `node:test`), Express 5, React 19 + Vite 8 + Tailwind 4, lucide-react, react-markdown, gray-matter. No new runtime dependency.

**Spec:** `docs/superpowers/specs/2026-11-08-forge-trilha-rpg-design.md`

## Global Constraints

- Work on branch `feat/trilha-rpg`. The working tree already holds the student's uncommitted edits (`README.md`, `ROADMAP.md`, `docs/screenshots/*`): never stage them unless a task edits that file, and then preserve their content.
- Stage only the files a task lists (`git add <paths>`, never `git add -A`).
- Monochrome only: no hue anywhere in new UI. States use fill, outline, dashed outline, pattern and stepped blink. Respect `prefers-reduced-motion` (no blink).
- Both themes (light/dark via `ThemeToggle`) must work: use the existing tokens `--background`, `--foreground`, `--muted`, `--muted-foreground`, `--accent`, `--border` from `tools/forge-web/src/globals.css`.
- Fonts: `Press Start 2P` for titles, labels, badges, nav and numbers; `JetBrains Mono` (Google Fonts, weights 400/600/700) for long text, statements, code and markdown, at ~14px.
- Follow `ui-registry.md`: 1–2px borders, no shadows, no panel nested inside a panel.
- Schema changes are additive only (`CREATE TABLE IF NOT EXISTS`); the student's `.forge/forge.db` must keep all its data.
- Tests must never touch `.forge/forge.db`: they set `FORGE_DB_PATH` to a temp file before importing `forge-core` modules.
- The tree renders offline: no CDN, no Mermaid; custom React/CSS.
- Never write the word "bloqueada"/"locked" as a status shown to the user.
- Final gate: `npm run test:system`, `npm run lint`, `npm run typecheck`, `npm run build:web`, `git diff --check` all pass.

## Review Focus

- Per-mission test run whose pattern matches zero tests → must be recorded as failure, never green (Task 2 test `summarizeRun trata 0 testes como falha`).
- Student's existing DB with JS-01…08 completed and no per-exercise rows → after first start those 128 missions show as passed, and re-running the migration is a no-op (Task 3 tests `migração marca missões de unidades concluídas` and `migração roda uma vez só`).
- Unchecking a mission after its unit auto-completed → unit stays completed, reviews are not duplicated (Task 3 test `desmarcar missão não reabre unidade`).
- `trilha.json` with a duplicated or missing item id → loader throws at startup instead of silently merging checks (Task 4 test `ids de itens são únicos`).
- Current unit in Phase 12 (DSA, no level) → sheet still shows a level (first unfinished phase's level) and no crash (Task 5 test `fase atual 12 usa nível da primeira fase pendente`).

---

### Task 1: Isolated test DB and progress tables

**Files:**
- Modify: `tools/forge-core/paths.js`
- Modify: `tools/forge-core/database.js` (schema in `initializeSchema`, new exports at end)
- Create: `tools/forge-core/test-helpers.js`
- Test: `tools/forge-core/progress-db.test.js`
- Modify: `package.json` (`test:system` script: append `tools/forge-core/*.test.js` already globbed — confirm new files match; no change needed if glob covers them)

**Interfaces:**
- Produces:
  - `DATABASE_PATH` = `process.env.FORGE_DB_PATH || <root>/.forge/forge.db`; `FORGE_DATA_DIR = path.dirname(DATABASE_PATH)`; new `PROGRESS_PATH` (`<root>/PROGRESS.md`) and `TRAIL_PATH` (`<root>/docs/curriculum/trilha.json`).
  - `useTempDatabase(): string` in `test-helpers.js` — sets `process.env.FORGE_DB_PATH` to a fresh file under `os.tmpdir()` and returns it. Must be called before any dynamic `import()` of `database.js`/`services.js`.
  - `upsertExerciseResult(unitId: string, exerciseId: string, pass: boolean): void`
  - `setExerciseManual(unitId: string, exerciseId: string, done: boolean): void`
  - `listExerciseProgress(unitId?: string): Array<{ unitId, exerciseId, lastResult: "pass"|"fail"|null, lastRunAt: string|null, manualDone: boolean, manualAt: string|null }>`
  - `setTopicCheck(itemId: string, done: boolean): void`
  - `listTopicChecks(): Array<{ itemId: string, checkedAt: string }>`

- [ ] **Step 1: Write the failing tests** in `progress-db.test.js` (top of file: `const dbPath = useTempDatabase(); const db = await import("./database.js");`)

```js
test("missão registra resultado e marcação manual separadamente", () => {
  db.upsertExerciseResult("js-09", "maxBy", false);
  db.setExerciseManual("js-09", "maxBy", true);
  const [row] = db.listExerciseProgress("js-09");
  assert.equal(row.exerciseId, "maxBy");
  assert.equal(row.lastResult, "fail");
  assert.equal(row.manualDone, true);
  db.upsertExerciseResult("js-09", "maxBy", true);
  assert.equal(db.listExerciseProgress("js-09")[0].lastResult, "pass");
});

test("tópico marca e desmarca", () => {
  db.setTopicCheck("f05-idempotencia", true);
  assert.deepEqual(db.listTopicChecks().map((r) => r.itemId), ["f05-idempotencia"]);
  db.setTopicCheck("f05-idempotencia", false);
  assert.equal(db.listTopicChecks().length, 0);
});

test("teste usa banco temporário, nunca .forge/forge.db", () => {
  assert.ok(!dbPath.includes(`${path.sep}.forge${path.sep}`));
});
```

- [ ] **Step 2: Run** `node --test tools/forge-core/progress-db.test.js` — Expected: FAIL (`useTempDatabase` / `upsertExerciseResult` not defined).

- [ ] **Step 3: Implement.** Tables:

```sql
CREATE TABLE IF NOT EXISTS exercise_progress (
  unit_id TEXT NOT NULL,
  exercise_id TEXT NOT NULL,
  last_result TEXT CHECK (last_result IN ('pass','fail')),
  last_run_at TEXT,
  manual_done INTEGER NOT NULL DEFAULT 0,
  manual_at TEXT,
  PRIMARY KEY (unit_id, exercise_id)
);
CREATE TABLE IF NOT EXISTS topic_checks (
  item_id TEXT PRIMARY KEY,
  checked_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

Upserts use `INSERT ... ON CONFLICT(unit_id, exercise_id) DO UPDATE`. `setTopicCheck(id,false)` deletes the row.

- [ ] **Step 4: Run** `node --test tools/forge-core/progress-db.test.js` then `npm run test:system` — Expected: PASS, and `.forge/forge.db` modification time unchanged.

- [ ] **Step 5: Commit** `git add tools/forge-core/paths.js tools/forge-core/database.js tools/forge-core/test-helpers.js tools/forge-core/progress-db.test.js && git commit -m "forge-core: tabelas de progresso por missão e tópico, banco isolado em testes"`

---

### Task 2: Mission ids, groups and reliable per-mission tests

**Files:**
- Modify: `tools/forge-core/curriculum.js` (`extractExercises`, `extractSqlExercises`, `readUnit`)
- Modify: `tools/forge-core/test-runner.js`
- Modify: `tools/forge-core/services.js` (`testUnit`)
- Test: `tools/forge-core/curriculum.test.js`, `tools/forge-core/test-runner.test.js` (create)

**Interfaces:**
- Consumes: `upsertExerciseResult` (Task 1).
- Produces:
  - Each unit exercise: `{ index: number, id: string, name: string, group: string }`. `id` = text before the first `(` of the README name (`"maxBy(items, fn)"` → `"maxBy"`); SQL exercises get `id = "sql-ex-<index>"`. `group` = the nearest preceding `## ` heading with its `(N)` count stripped (`"Exercícios intermediários (4)"` → `"Exercícios intermediários"`); `"Desafio integrador"` stays as is (UI renames it).
  - `unit.missionTestable: boolean` — `false` for SQL units.
  - `summarizeRun(code: number|null, output: string): { success: boolean, passed: number, failed: number, total: number }` exported from `test-runner.js`. Reads the spec reporter footer `ℹ tests N`, `ℹ pass N`, `ℹ fail N`; falls back to counting `✔ `/`✖ ` lines. `success = code === 0 && total > 0`.
  - `runUnitTests(unitId, exerciseId?)` builds the pattern `^<escaped exerciseId>\b` itself (callers pass the id, not a regex).
  - `testUnit(unitId, exerciseId?)` — with an id: validates it against `unit.exercises[].id`, refuses for `missionTestable === false`, records `upsertExerciseResult(unitId, exerciseId, result.success)`, does **not** touch the unit's last suite result. Without id: as today, and on success also `upsertExerciseResult(..., true)` for every exercise of the unit.

- [ ] **Step 1: Write the failing tests**

`curriculum.test.js`:
```js
test("missões têm id sem assinatura e grupo do README", () => {
  const unit = getUnit("js-09");
  const maxBy = unit.exercises.find((e) => e.id === "maxBy");
  assert.equal(maxBy.name, "maxBy(items, fn)");
  assert.equal(maxBy.group, "Exercícios intermediários");
  assert.equal(unit.exercises.at(-1).group, "Desafio integrador");
  assert.equal(getUnit("sql-01").missionTestable, false);
});
```

`test-runner.test.js`:
```js
test("summarizeRun trata 0 testes como falha", () => {
  const out = "ℹ tests 0\nℹ pass 0\nℹ fail 0\n";
  assert.deepEqual(summarizeRun(0, out), { success: false, passed: 0, failed: 0, total: 0 });
});
test("summarizeRun lê o rodapé do reporter spec", () => {
  const out = "✔ maxBy: x\nℹ tests 3\nℹ pass 2\nℹ fail 1\n";
  assert.deepEqual(summarizeRun(1, out), { success: false, passed: 2, failed: 1, total: 3 });
});
test("padrão por missão roda só o teste certo", async () => {
  const result = await runUnitTests("js-01", getUnit("js-01").exercises[0].id);
  assert.ok(result.total >= 1);
});
```

- [ ] **Step 2: Run** `node --test tools/forge-core/curriculum.test.js tools/forge-core/test-runner.test.js` — Expected: FAIL.
- [ ] **Step 3: Implement** the interfaces above. `runUnitTests` return gains `total`.
- [ ] **Step 4: Run** both test files + `npm run test:system` — Expected: PASS.
- [ ] **Step 5: Commit** `git add tools/forge-core/curriculum.js tools/forge-core/test-runner.js tools/forge-core/services.js tools/forge-core/curriculum.test.js tools/forge-core/test-runner.test.js && git commit -m "forge-core: id de missão e teste por missão confiável"`

---

### Task 3: No locks, completion rules, reflection and migration

**Files:**
- Modify: `tools/forge-core/services.js` (`getDashboard`, `setCurrentUnit`, `getUnitDetail`, `evaluateGate`, new functions)
- Modify: `tools/forge-core/curriculum.js` (`listPolyglotTracks`, `listPhases`)
- Modify: `tools/forge-web/server.js` (new routes)
- Test: `tools/forge-core/services.test.js` (create), `tools/forge-core/curriculum.test.js` (replace the polyglot "bloqueadas" test)

**Interfaces:**
- Consumes: Task 1 DB functions, Task 2 exercise `id`/`missionTestable`.
- Produces:
  - Unit `status`: `"available" | "completed"` only. `phases[].status`: `"completed" | "active" | "available"` (computed in services from unit progress; `active` = phase of current unit). `projects[].status`: `"available"` (keep `unlockAfter` as a suggestion). `listPolyglotTracks()[].status`: `"available"`.
  - `setCurrentUnit(unitId)` accepts any existing unit.
  - `missionStatus`: `"todo" | "failing" | "passed" | "manual"` — `passed` if `lastResult==="pass"`; `manual` if `manualDone` and not passed; `failing` if `lastResult==="fail"`; else `todo`.
  - `getUnitDetail` adds `missions: Array<{ index, id, name, group, status: MissionStatus }>` and `gate: { tests: boolean, reflection: boolean, completed: boolean, badge: boolean }` where `reflection = reflection.length >= 30 && confidence >= 3` and `badge = tests && reflection`.
  - `markMission(unitId: string, exerciseId: string, done: boolean): UnitDetail`
  - `markAllMissions(unitId: string): UnitDetail`
  - `saveUnitReflection(unitId: string, reflection: string, confidence: number): UnitDetail` (confidence 1–5, else throws).
  - `evaluateCompletion(unitId)` (private): if not completed and (`lastTestSuccess` or every mission is `passed`/`manual`) → `markUnitCompleted`. Called after test runs, mission marks and reflection. Never un-completes.
  - `runMigrations()` (exported, idempotent, guarded by setting `migration_trail_v1`): for every unit with `status === "completed"`, `upsertExerciseResult(unit, id, true)` for all its exercises. Phase 0 seeding is added in Task 5. Called once from `getDatabase()` consumers: call it at the top of `getDashboard`, `getUnitDetail` and (Task 5) `getTrail`.
  - Routes: `POST /api/units/:unitId/missions/:exerciseId` body `{ done: boolean }` → `markMission`; `POST /api/units/:unitId/missions` → `markAllMissions`; `POST /api/units/:unitId/reflection` body `{ reflection, confidence }` → `saveUnitReflection`.

- [ ] **Step 1: Write the failing tests** in `services.test.js` (temp DB via `useTempDatabase()` then dynamic import of `services.js` and `database.js`):

```js
test("qualquer unidade pode virar foco", () => {
  assert.equal(services.setCurrentUnit("ts-05").id, "ts-05");
  assert.ok(services.getDashboard().units.every((u) => u.status !== "locked"));
  assert.ok(services.getDashboard().phases.every((p) => p.status !== "locked"));
});
test("marcar todas as missões conclui a unidade e agenda revisões", () => {
  const detail = services.markAllMissions("js-10");
  assert.equal(detail.gate.completed, true);
  assert.ok(detail.missions.every((m) => m.status === "manual"));
  assert.equal(db.listReviews().filter((r) => r.unitId === "js-10").length, 3);
});
test("desmarcar missão não reabre unidade", () => {
  const detail = services.markMission("js-10", services.getUnitDetail("js-10").missions[0].id, false);
  assert.equal(detail.gate.completed, true);
  assert.equal(db.listReviews().filter((r) => r.unitId === "js-10").length, 3);
});
test("selo exige suíte verde + reflexão >= 30 + confiança >= 3", () => {
  const d = services.saveUnitReflection("js-10", "x".repeat(30), 3);
  assert.equal(d.gate.reflection, true);
  assert.equal(d.gate.badge, false); // suíte nunca rodou verde
});
test("migração marca missões de unidades concluídas", () => {
  db.markUnitCompleted("js-01");
  services.runMigrations();
  assert.ok(services.getUnitDetail("js-01").missions.every((m) => m.status === "passed"));
});
test("migração roda uma vez só", () => {
  db.markUnitCompleted("js-02");
  services.runMigrations();
  assert.ok(services.getUnitDetail("js-02").missions.every((m) => m.status === "todo"));
});
```

(Order matters: the "uma vez só" test relies on the previous one having run the migration. Check `listReviews` row field names in `database.js` and adapt `unitId` if it differs.)

`curriculum.test.js`: replace `trilhas poliglotas começam bloqueadas e sem seleção` with `trilhas poliglotas ficam disponíveis` asserting `status === "available"`.

- [ ] **Step 2: Run** `node --test tools/forge-core/services.test.js tools/forge-core/curriculum.test.js` — Expected: FAIL.
- [ ] **Step 3: Implement** the interfaces above; delete `trackRequirements` and the `"Conclua o gate anterior..."` throw.
- [ ] **Step 4: Run** the two files + `npm run test:system` — Expected: PASS.
- [ ] **Step 5: Commit** `git add tools/forge-core/services.js tools/forge-core/curriculum.js tools/forge-core/services.test.js tools/forge-core/curriculum.test.js tools/forge-web/server.js && git commit -m "forge-core: progresso livre, conclusão por missões, reflexão e migração"`

---

### Task 4: Trail content file and loader

**Files:**
- Create: `docs/curriculum/trilha.json`
- Create: `tools/forge-core/trail-content.js`
- Test: `tools/forge-core/trail-content.test.js`

**Interfaces:**
- Produces `loadTrailContent(): TrailContent` (reads `TRAIL_PATH`, validates, caches), where:

```ts
type TrailContent = {
  levels: Array<{ id: "lv1"|"lv2"|"lv3"|"lv4"; name: string; phases: number[] }>;
  nodes: Array<{
    id: string;            // "f00".."f27", "java-1".."java-3"
    kind: "phase" | "java" | "dsa";
    phase: number | null;  // 0..27 for phase/dsa, null for java
    title: string;         // full title, from ROADMAP / JAVA_SPRING_TRACK
    shortTitle: string;    // uppercase, ≤ 18 chars, for the tree node
    who: string;           // "Quem você é aqui", 1–2 sentences
    becomes: string;       // "O que você vira"
    items: Array<{ id: string; label: string }>; // [] for phases 1,2,3,4,12 (they use units)
  }>;
};
```

- Levels (exact): `lv1` "Júnior em construção" [0,1,2,3]; `lv2` "Júnior" [4..9]; `lv3` "Pleno" [10,11,13,14]; `lv4` "Sênior" [15..27]. Phase 12 is `kind: "dsa"` and belongs to no level.
- Java nodes: `java-1` "JAVA 01–03 · Spring Boot", `java-2` "JAVA 04–06 · JPA, Security, Testes", `java-3` "JAVA 07–09 · Async, Produção, Comparativo"; items = one per module from `docs/tracks/JAVA_SPRING_TRACK.md`, ids `java-01`…`java-09`.
- Phase 0 items: exactly the 10 checkbox lines under `## Fase 0` in `PROGRESS.md`, labels copied verbatim (including backticks), ids `f00-*`.
- Phases 5–11, 13–27: 5–10 curated items each, condensed from the phase's "Gate da fase / Devo:" in `docs/curriculum/*.md` (else "Conteúdo" or subsection titles). Ids `fNN-<slug>`.
- `who`/`becomes`: Portuguese, Forge tone, second person; e.g. Phase 1 who: "Você escreve JS que funciona, mas ainda depende de exemplo para resolver algo novo." becomes: "Lê e escreve JS de backend sem travar na sintaxe."
- Validation throws on: missing phase 0–27, duplicate node id, duplicate item id across the file, item count outside 5–10 for phases 5–11/13–27, unknown level phase.

- [ ] **Step 1: Write the failing tests**

```js
test("trilha cobre fases 0–27 e três blocos Java", () => {
  const c = loadTrailContent();
  const phases = c.nodes.filter((n) => n.phase !== null).map((n) => n.phase).sort((a, b) => a - b);
  assert.deepEqual(phases, Array.from({ length: 28 }, (_, i) => i));
  assert.deepEqual(c.nodes.filter((n) => n.kind === "java").map((n) => n.id), ["java-1", "java-2", "java-3"]);
});
test("ids de itens são únicos", () => {
  const ids = loadTrailContent().nodes.flatMap((n) => n.items.map((i) => i.id));
  assert.equal(new Set(ids).size, ids.length);
});
test("fases sem unidades têm de 5 a 10 itens", () => {
  for (const n of loadTrailContent().nodes.filter((n) => n.kind === "phase" && ![0, 1, 2, 3, 4].includes(n.phase)))
    assert.ok(n.items.length >= 5 && n.items.length <= 10, `fase ${n.phase}`);
});
test("todo nó tem quem você é e o que vira", () => {
  assert.ok(loadTrailContent().nodes.every((n) => n.who.length > 20 && n.becomes.length > 10));
});
test("validação recusa id duplicado", () => {
  assert.throws(() => validateTrailContent({ levels: [], nodes: [{ id: "f00" }, { id: "f00" }] }));
});
```

(`validateTrailContent(raw): TrailContent` is exported for this test.)

- [ ] **Step 2: Run** `node --test tools/forge-core/trail-content.test.js` — Expected: FAIL.
- [ ] **Step 3: Write `trilha.json`** (all 31 nodes) **and implement the loader.**
- [ ] **Step 4: Run** the test file + `npm run test:system` + `npx prettier --check docs/curriculum/trilha.json` — Expected: PASS.
- [ ] **Step 5: Commit** `git add docs/curriculum/trilha.json tools/forge-core/trail-content.js tools/forge-core/trail-content.test.js && git commit -m "trilha: conteúdo curado de níveis, fases e side quest Java"`

---

### Task 5: Trail service (sheet, XP, tree) and API

**Files:**
- Create: `tools/forge-core/trail.js`
- Modify: `tools/forge-core/services.js` (`runMigrations` gains phase 0 seed; export `getTrail`, `setTrailItem`, `markTrailNode`)
- Modify: `tools/forge-web/server.js`
- Test: `tools/forge-core/trail.test.js`

**Interfaces:**
- Consumes: `loadTrailContent` (Task 4), `listTopicChecks`/`setTopicCheck` (Task 1), unit summaries + `markAllMissions` (Task 3), `listUnits` (curriculum).
- Produces `getTrail(): TrailData`:

```ts
type TrailItem = { id: string; label: string; kind: "unit" | "topic"; done: boolean; unitId?: string };
type TrailNode = {
  id: string; kind: "phase" | "java" | "dsa"; phase: number | null; level: "lv1"|"lv2"|"lv3"|"lv4"|null;
  title: string; shortTitle: string; who: string; becomes: string;
  percent: number;              // 0–100, integer
  state: "done" | "current" | "todo";
  items: TrailItem[];
};
type TrailData = {
  sheet: {
    className: "Backend Dev";
    level: { id: string; name: string };
    nextLevel: { id: string; name: string; firstPhase: number } | null;
    xpPercent: number;          // integer
    phasesDone: number; phasesTotal: 27;
    unitsDone: number; unitsTotal: number;
    currentPhase: number; currentUnitId: string; remainingInPhase: number;
    java: { percent: number }; dsa: { percent: number };
  };
  levels: TrailContent["levels"];
  nodes: TrailNode[];
};
```

- Rules (exact):
  - Items for phases 1, 2, 3, 4, 12 = that phase's units (`kind: "unit"`, `id` = unit id, `label` = unit title, `done` = unit `status === "completed"`); all other nodes = content items (`kind: "topic"`, `done` = present in `topic_checks`).
  - `percent = round(100 * done / items.length)`; a node with 0 items has `percent 0`.
  - `xpPercent = round(average of percent over phases 0–27 except 12)`; `phasesDone` counts those with `percent === 100`.
  - `currentPhase` = phase of the current unit. `level` = level containing `currentPhase`; if `currentPhase` is 12, the level of the first non-12 phase with `percent < 100` (or `lv4` if none). `nextLevel` = level after it, `firstPhase` = its lowest phase; `null` after `lv4`.
  - Node `state`: `"done"` if `percent === 100`, else `"current"` if `phase === currentPhase`, else `"todo"`. Java nodes are never `current`.
  - Phase 0 seed inside `runMigrations` (guard `migration_trail_v1` covers both): for each `f00-*` item whose label appears in `PROGRESS.md` as `- [x] <label>`, `setTopicCheck(id, true)`.
- `setTrailItem(itemId: string, done: boolean): TrailData` — topic ids only (throws for unknown id).
- `markTrailNode(nodeId: string): TrailData` — topics → all checked; unit items → `markAllMissions` for each unit.
- Routes: `GET /api/trail`, `POST /api/trail/items/:itemId` body `{ done }`, `POST /api/trail/nodes/:nodeId/complete`.

- [ ] **Step 1: Write the failing tests** in `trail.test.js` (temp DB; dynamic imports):

```js
test("XP pesa fases igualmente e ignora a Fase 12", () => {
  services.markTrailNode("f00");
  const t = services.getTrail();
  assert.equal(t.sheet.xpPercent, Math.round(100 / 27));
  assert.equal(t.sheet.phasesDone, 1);
});
test("tópico marcado persiste e desmarca", () => {
  const id = services.getTrail().nodes.find((n) => n.id === "f05").items[0].id;
  assert.equal(services.setTrailItem(id, true).nodes.find((n) => n.id === "f05").items[0].done, true);
  assert.equal(services.setTrailItem(id, false).nodes.find((n) => n.id === "f05").items[0].done, false);
});
test("fase 1 lista unidades e nível LV1", () => {
  services.setCurrentUnit("js-09");
  const t = services.getTrail();
  assert.equal(t.nodes.find((n) => n.id === "f01").items[0].kind, "unit");
  assert.equal(t.sheet.level.id, "lv1");
  assert.equal(t.sheet.nextLevel.firstPhase, 4);
  assert.equal(t.nodes.find((n) => n.id === "f01").state, "current");
});
test("fase atual 12 usa nível da primeira fase pendente", () => {
  services.setCurrentUnit("dsa-01");
  assert.equal(services.getTrail().sheet.level.id, "lv1");
});
test("item desconhecido é recusado", () => {
  assert.throws(() => services.setTrailItem("nao-existe", true));
});
```

(Adjust `dsa-01` to the real DSA unit id from `listUnits()` if it differs.)

- [ ] **Step 2: Run** `node --test tools/forge-core/trail.test.js` — Expected: FAIL.
- [ ] **Step 3: Implement** `trail.js` (pure computation from content + progress) and the service/route wiring.
- [ ] **Step 4: Run** the file + `npm run test:system` — Expected: PASS.
- [ ] **Step 5: Commit** `git add tools/forge-core/trail.js tools/forge-core/services.js tools/forge-core/trail.test.js tools/forge-web/server.js && git commit -m "forge-core: ficha RPG, XP e árvore da trilha via API"`

---

### Task 6: Structured mission content (JS-09…11)

**Files:**
- Create: `exercises/01-javascript-core/unit-09-map-filter-reduce/missions.json`, `.../unit-10-destructuring/missions.json`, `.../unit-11-spread-rest/missions.json`
- Modify: `tools/forge-core/curriculum.js` (`readUnit` merges missions)
- Test: `tools/forge-core/curriculum.test.js`

**Interfaces:**
- `missions.json` shape: `{ "<exerciseId>": { objective: string; uses?: string; example?: { input: string; output: string }; rules: string[]; pitfalls: string[] } }`.
- Each unit exercise gains `detail: { objective, uses?, example?, rules, pitfalls } | null` plus `summary: string` (the README item text after `— `, always present, used as fallback).
- Content rules: examples are copied from the unit's `exercises.test.js` cases (input/output only, formatted as JS literals); no implementation code; Portuguese; `objective` is one sentence.

- [ ] **Step 1: Write the failing tests**

```js
test("missões de JS-09 têm conteúdo estruturado", () => {
  const maxBy = getUnit("js-09").exercises.find((e) => e.id === "maxBy");
  assert.equal(maxBy.detail.uses, "reduce");
  assert.ok(maxBy.detail.example.output.includes("{"));
  assert.ok(maxBy.detail.pitfalls.some((p) => /vazio/.test(p)));
});
test("toda missão de JS-09…11 tem detalhe; demais caem no resumo", () => {
  for (const id of ["js-09", "js-10", "js-11"])
    assert.ok(getUnit(id).exercises.every((e) => e.detail?.objective));
  const js12 = getUnit("js-12").exercises[0];
  assert.equal(js12.detail, null);
  assert.ok(js12.summary.length > 10);
});
```

- [ ] **Step 2: Run** `node --test tools/forge-core/curriculum.test.js` — Expected: FAIL.
- [ ] **Step 3: Write the three `missions.json`** (16 entries each, keys = exercise ids) **and the merge in `readUnit`** (missing file → `detail: null`; malformed JSON → throw with the file path).
- [ ] **Step 4: Run** the file + `npm run test:system` — Expected: PASS.
- [ ] **Step 5: Commit** `git add exercises/01-javascript-core/unit-09-map-filter-reduce/missions.json exercises/01-javascript-core/unit-10-destructuring/missions.json exercises/01-javascript-core/unit-11-spread-rest/missions.json tools/forge-core/curriculum.js tools/forge-core/curriculum.test.js && git commit -m "exercícios: enunciados estruturados para JS-09 a JS-11"`

---

### Task 7: Trilha page (front)

**Files:**
- Modify: `tools/forge-web/src/types.ts`, `tools/forge-web/src/api.ts`, `tools/forge-web/src/App.tsx` (nav item + page), `tools/forge-web/src/globals.css` (JetBrains Mono import + `--font-read` token), `tools/forge-web/src/main.tsx` (import new CSS)
- Create: `tools/forge-web/src/components/trail/TrailView.tsx`, `CharacterSheet.tsx`, `TrailTree.tsx`, `PhasePanel.tsx`
- Create: `tools/forge-web/src/styles/trail.css`

**Interfaces:**
- Consumes: `TrailData` (Task 5) mirrored in `types.ts`; API `api.trail()`, `api.trailItem(itemId, done)`, `api.trailNodeComplete(nodeId)`.
- Produces: `Page` gains `"trail"`; nav order Dashboard, Unidade, **Trilha** (icon `Map` from lucide), Progresso; `TrailView` props `{ onOpenUnit(unitId: string): Promise<void> }` (App passes its existing `selectUnit`).

Layout and visuals (match `.superpowers/brainstorm/*/content/arvore-8bit-v2.html`, minus colors):
- `CharacterSheet`: 3 columns — Classe + Nível atual · XP bar (blocks via `repeating-linear-gradient` of `--foreground`) + "N/27 fases · K/L unidades" + Próximo nível · Você está em (fase + unit id) + Falta nesta fase. Small Java and DSA bars under it.
- `TrailTree`: one bordered group per level (title "LV1 · JÚNIOR EM CONSTRUÇÃO", etc.) stacked vertically, nodes in order with `▼` connectors; a Java column beside LV3 linked from Phase 9 (dashed border); DSA node beside LV1–LV2 with a dashed connector. Each node is a `<button>` showing `NN SHORTTITLE` + text bar (`████░░`) with `aria-pressed` for the selected node. States: done = filled (`--foreground` bg, `--background` text); current = inverted + stepped blink (`animation: blink 1.1s steps(2) infinite`, disabled under `prefers-reduced-motion`); todo = outline; java = dashed outline.
- `PhasePanel` (sticky right column; below the tree under 900px): title, level tag, percent bar, "Quem você é aqui", "Já consegue" (done items), "Falta nesta seção" (pending items) — every item a checkbox calling `api.trailItem` for topics; unit items are links "Abrir" calling `onOpenUnit`; "O que você vira"; buttons "Abrir fase" (first unit, only for unit phases) and "Marcar tudo" (`api.trailNodeComplete`, confirm via existing `ConfirmDialog`).
- Default selected node = the `current` one.

- [ ] **Step 1:** Add types, API methods and nav/page wiring; render an empty `TrailView`. Run `npm run typecheck` — Expected: PASS.
- [ ] **Step 2:** Implement the three components + `trail.css`; long text uses `font-family: var(--font-read)`.
- [ ] **Step 3: Verify** `npm run typecheck && npm run lint && npm run build:web` — Expected: PASS.
- [ ] **Step 4: Verify in browser** — `npm run forge:web`, open http://127.0.0.1:4310, Trilha page: Phase 1 blinks, clicking Phase 5 shows its items, checking one and reloading keeps it checked, dark and light themes both monochrome, 375px width stacks the panel under the tree.
- [ ] **Step 5: Commit** `git add tools/forge-web/src/types.ts tools/forge-web/src/api.ts tools/forge-web/src/App.tsx tools/forge-web/src/globals.css tools/forge-web/src/main.tsx tools/forge-web/src/components/trail tools/forge-web/src/styles/trail.css && git commit -m "forge-web: página Trilha com ficha RPG e árvore clicável"`

---

### Task 8: Unidade page with tabs and mission cards (front)

**Files:**
- Modify: `tools/forge-web/src/components/UnitView.tsx` (becomes the tab container)
- Create: `tools/forge-web/src/components/unit/QuestLog.tsx`, `MissionCard.tsx`, `UnitBriefing.tsx`, `CloseUnit.tsx`
- Create: `tools/forge-web/src/styles/unit.css`
- Modify: `tools/forge-web/src/types.ts`, `tools/forge-web/src/api.ts`, `tools/forge-web/src/components/ProgressView.tsx` (drop any "locked" rendering; show `available`), `tools/forge-web/src/main.tsx`

**Interfaces:**
- Consumes: `UnitDetail` with `missions[]`, `exercises[].detail/summary`, `gate.{tests,reflection,completed,badge}` (Tasks 3, 6); API `api.markMission(unitId, exerciseId, done)`, `api.markAllMissions(unitId)`, `api.saveReflection(unitId, reflection, confidence)`, existing `api.test(unitId, exerciseId?)` (now sends the id), `api.revealHint`.
- Briefing split: `UnitBriefing` splits `unit.markdown` at `## ` headings — tab 1 "Briefing" = text before the first `## ` plus any section not listed below; tab 2 "Antes de começar" = the `## Antes de começar` section, each numbered question in its own bordered block; exercise sections, "Como trabalhar", "Critérios de aceitação" and "Dicas" go to tab 3/4 instead of markdown.

Visuals (match `.superpowers/brainstorm/*/content/unidade-missoes-v1.html`, monochrome):
- Tabs: `1 · Briefing`, `2 · Antes de começar`, `3 · Missões X/N`, `4 · Fechar unidade`. Default tab = Missões.
- `QuestLog`: missions grouped by `group` (label "Desafio integrador" displayed as "Chefão ★"), per group "done/total", per mission a status square: todo = empty, failing = `✕`, passed = filled, manual = dashed filled pattern with tooltip "marcada · sem teste verde". XP bar of the unit. Selected mission inverted.
- `MissionCard`: header "Missão i de N", name, badges (group, `USA: <uses>`, test status); sections Objetivo, Exemplo (input ▶ output in `<pre>`), Regras, Armadilhas (two columns), Validar (button "Rodar teste desta missão" hidden when `missionTestable` is false; copyable command `node --test --test-name-pattern="^<id>\b" <testPath>`; checkbox "Marcar como feita"), Dicas. When `detail` is null: show `summary` in a readable block instead of Objetivo/Regras/Armadilhas.
- Hints inside `MissionCard`: for each revealed level, lines/bullets of `hint.content` containing the mission id are shown first, then a collapsible "outras dicas da unidade". Revealing level N+1 requires N revealed (button disabled with text "abra a dica N primeiro").
- `CloseUnit`: "Executar todos" (full suite) with output, reflection textarea (min 30 chars counter) + confidence 1–5 selector → `api.saveReflection`; gate checklist (suíte verde / reflexão / confiança) and the badge "GATE FECHADO ★" when `gate.badge`; "Marcar todas as missões" (ConfirmDialog) → `api.markAllMissions`.

- [ ] **Step 1:** Types/API additions; `UnitView` renders the 4 tabs with placeholder bodies. `npm run typecheck` — Expected: PASS.
- [ ] **Step 2:** Implement `QuestLog` + `MissionCard`.
- [ ] **Step 3:** Implement `UnitBriefing` + `CloseUnit`; update `ProgressView`.
- [ ] **Step 4: Verify** `npm run typecheck && npm run lint && npm run build:web` — Expected: PASS.
- [ ] **Step 5: Verify in browser** — JS-09: 16 missions in 5 groups; `maxBy` card shows objective/example/rules/pitfalls; "Rodar teste desta missão" on `doubleAll` reports 1+ test and marks it passed; a mission whose test fails shows `✕`; marking `uniqueBy` by hand shows the dashed status; JS-12 shows the summary fallback; reflection save shows the checklist; both themes monochrome.
- [ ] **Step 6: Commit** `git add tools/forge-web/src/components/UnitView.tsx tools/forge-web/src/components/unit tools/forge-web/src/components/ProgressView.tsx tools/forge-web/src/styles/unit.css tools/forge-web/src/types.ts tools/forge-web/src/api.ts tools/forge-web/src/main.tsx && git commit -m "forge-web: unidade em abas com quest log e cartões de missão"`

---

### Task 9: Rules docs and UI registry

**Files:**
- Modify: `AGENTS.md` (Regras de progressão + fonte da verdade), `LEARNING_CONTRACT.md` (gate line, `PROXIMA_UNIDADE`, `SELECIONAR_TRILHA`), `ROADMAP.md` (status column: replace "bloqueada"/"BLOQUEADA — escolha permitida somente após o gate da Fase 9" with "disponível"; keep the student's other edits), `docs/tracks/POLYGLOT_BACKEND_TRACK.md`, `BACKEND_ENGINEERING_FORGE.md` (polyglot paragraph), `README.md` (estado atual table wording only), `ui-registry.md` (new patterns: Trail Node, Character Sheet, Mission Card, Quest Log)

**Interfaces:**
- Exact policy text to state (adapt wording per file):
  - "Toda unidade, fase, projeto e a trilha Java ficam abertos. O progresso é marcado livremente no painel."
  - "Gate = conquista (selo ★): suíte verde + reflexão (≥30 caracteres) + confiança ≥3. Recomendado, nunca obrigatório."
  - "`PROGRESS.md` prevalece para o estado narrativo e de mentoria; `.forge/forge.db` para as marcações de progresso do painel."
  - Keep unchanged: "Exercícios completos são preparados para a unidade atual e, no máximo, as duas seguintes", "Nenhuma solução completa é entregue antes da minha tentativa real", "Não altere exercícios concluídos".

- [ ] **Step 1:** `grep -rniE "bloquead|locked|somente após o gate|nenhuma fase avança" AGENTS.md LEARNING_CONTRACT.md ROADMAP.md README.md BACKEND_ENGINEERING_FORGE.md docs/tracks` — note every hit.
- [ ] **Step 2:** Edit each hit to the policy above; add the four ui-registry entries using the same table format as existing entries.
- [ ] **Step 3: Verify** the grep from Step 1 returns no progression-lock wording, and `npm run test:system` passes (`listPhases` still parses 28 rows from `ROADMAP.md`).
- [ ] **Step 4: Commit** `git add AGENTS.md LEARNING_CONTRACT.md ROADMAP.md README.md BACKEND_ENGINEERING_FORGE.md docs/tracks/POLYGLOT_BACKEND_TRACK.md ui-registry.md && git commit -m "docs: progressão livre, gate como conquista e padrões de UI da trilha"`

---

### Task 10: Full verification

- [ ] **Step 1:** Run `npm run test:system && npm run lint && npm run typecheck && npm run build:web && git diff --check` — Expected: all pass.
- [ ] **Step 2:** Start against the student's real DB (`npm run forge:web`), confirm: JS-01…08 missions show as passed, Phase 0 shows the 4 `[x]` items from `PROGRESS.md` checked, sheet shows LV1 with Fase 1 / JS-09, nothing reads "bloqueada".
- [ ] **Step 3:** Take fresh screenshots of Trilha and Unidade (dark) into `docs/screenshots/trail.png` and `docs/screenshots/unit-missions.png`; commit them with `git add docs/screenshots/trail.png docs/screenshots/unit-missions.png && git commit -m "docs: prints da trilha e das missões"`.
