import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { writeFile, rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import { tmpdir } from "node:os";

import {
  recordSyncMicroMacroOrder,
  recordMicrotaskFifoOrder,
  recordNestedMicrotaskBeforeMacrotask,
  recordSetImmediateInsideIOCallback,
  readFileNonBlocking,
  recordEventEmitterListenersRunSynchronously,
  recordNextTickBeforePromiseMicrotask,
  recordSetImmediateVsPromiseMicrotask,
  resolveInInputOrderRegardlessOfCompletion,
  chainSequentialAsyncTasks,
  recordThreadPoolCallbackAfterMicrotasks,
  recordTimerChainOrder,
  fixMicrotaskOrderingBug,
  fixBlockingFileRead,
  refactorScheduledLabelsOrder,
  simulateEventLoopPipeline,
} from "./exercises.ts";

// --- helper: isola o bloco-fonte de um exercício para checagens estruturais -

const exercisesSourcePath = fileURLToPath(
  new URL("./exercises.ts", import.meta.url),
);
const exercisesSource = readFileSync(exercisesSourcePath, "utf8");

function extractExerciseSource(exerciseName: string): string {
  const marker = `--test-name-pattern="${exerciseName}"`;
  const markerIndex = exercisesSource.indexOf(marker);
  if (markerIndex === -1) {
    throw new Error(`marcador de teste não encontrado para ${exerciseName}`);
  }
  const blockStart = exercisesSource.lastIndexOf("\n// test:", markerIndex) + 1;
  const nextMarkerIndex = exercisesSource.indexOf(
    "\n// test:",
    markerIndex + marker.length,
  );
  const blockEnd =
    nextMarkerIndex === -1 ? exercisesSource.length : nextMarkerIndex;
  return exercisesSource.slice(blockStart, blockEnd);
}

// --- recordSyncMicroMacroOrder ---------------------------------------------

test("recordSyncMicroMacroOrder: sync roda antes de microtask, microtask antes de macrotask", async () => {
  const order = await recordSyncMicroMacroOrder();
  assert.deepEqual(order, ["sync", "microtask", "macrotask"]);
});

// --- recordMicrotaskFifoOrder ------------------------------------------------

test("recordMicrotaskFifoOrder: microtasks rodam na ordem em que foram enfileiradas (FIFO)", async () => {
  const order = await recordMicrotaskFifoOrder();
  assert.deepEqual(order, ["first", "second", "third"]);
});

// --- recordNestedMicrotaskBeforeMacrotask -----------------------------------

test("recordNestedMicrotaskBeforeMacrotask: microtask aninhada roda antes do macrotask", async () => {
  const order = await recordNestedMicrotaskBeforeMacrotask();
  assert.deepEqual(order, ["outer", "inner", "macrotask"]);
});

// --- recordSetImmediateInsideIOCallback --------------------------------------

test("recordSetImmediateInsideIOCallback: dentro de um callback de I/O, setImmediate roda antes de um timer", async () => {
  const order = await recordSetImmediateInsideIOCallback();
  assert.deepEqual(order, ["io", "immediate", "timeout"]);
});

// --- readFileNonBlocking ------------------------------------------------------

test("readFileNonBlocking: resolve com o conteúdo do arquivo", async () => {
  const fixturePath = join(tmpdir(), `node-core-unit01-fixture-${Date.now()}.txt`);
  await writeFile(fixturePath, "conteudo-de-teste", "utf8");
  try {
    const content = await readFileNonBlocking(fixturePath);
    assert.equal(content, "conteudo-de-teste");
  } finally {
    await rm(fixturePath, { force: true });
  }
});

test("readFileNonBlocking: não usa API bloqueante (*Sync) na implementação", () => {
  const block = extractExerciseSource("readFileNonBlocking");
  assert.equal(/readFileSync\(/.test(block), false);
});

// --- recordEventEmitterListenersRunSynchronously -----------------------------

test("recordEventEmitterListenersRunSynchronously: listeners rodam de forma síncrona durante o emit", () => {
  const order = recordEventEmitterListenersRunSynchronously();
  assert.deepEqual(order, ["first", "second", "after-emit"]);
});

// --- recordNextTickBeforePromiseMicrotask -------------------------------------

test("recordNextTickBeforePromiseMicrotask: process.nextTick tem prioridade sobre a fila de microtasks de Promise", async () => {
  const order = await recordNextTickBeforePromiseMicrotask();
  assert.deepEqual(order, ["nextTick", "promise"]);
});

// --- recordSetImmediateVsPromiseMicrotask -------------------------------------

test("recordSetImmediateVsPromiseMicrotask: microtask sempre roda antes de setImmediate", async () => {
  const order = await recordSetImmediateVsPromiseMicrotask();
  assert.deepEqual(order, ["microtask", "immediate"]);
});

// --- resolveInInputOrderRegardlessOfCompletion --------------------------------

test("resolveInInputOrderRegardlessOfCompletion: Promise.all preserva a ordem de entrada, não a de conclusão", async () => {
  const order = await resolveInInputOrderRegardlessOfCompletion();
  assert.deepEqual(order, ["slow", "fast"]);
});

// --- chainSequentialAsyncTasks -------------------------------------------------

test("chainSequentialAsyncTasks: await sequencial preserva a ordem de chamada", async () => {
  const order = await chainSequentialAsyncTasks(["a", "b", "c"]);
  assert.deepEqual(order, ["a", "b", "c"]);
});

test("chainSequentialAsyncTasks: funciona com uma única label", async () => {
  const order = await chainSequentialAsyncTasks(["only"]);
  assert.deepEqual(order, ["only"]);
});

// --- recordThreadPoolCallbackAfterMicrotasks ----------------------------------

test("recordThreadPoolCallbackAfterMicrotasks: microtask roda antes do callback do thread pool", async () => {
  const order = await recordThreadPoolCallbackAfterMicrotasks();
  assert.deepEqual(order, ["microtask", "threadpool"]);
});

// --- recordTimerChainOrder ------------------------------------------------------

test("recordTimerChainOrder: um timer agendado dentro de outro roda numa volta seguinte do event loop", async () => {
  const order = await recordTimerChainOrder();
  assert.deepEqual(order, ["first-timer", "second-timer"]);
});

// --- fixMicrotaskOrderingBug ------------------------------------------------------

test("fixMicrotaskOrderingBug: middle roda como microtask, antes de qualquer timer", async () => {
  const order = await fixMicrotaskOrderingBug();
  assert.deepEqual(order, ["start", "middle", "end"]);
});

// --- fixBlockingFileRead ------------------------------------------------------

test("fixBlockingFileRead: resolve com o conteúdo correto do arquivo", async () => {
  const fixturePath = join(tmpdir(), `node-core-unit01-fixture-blocking-${Date.now()}.txt`);
  await writeFile(fixturePath, "outro-conteudo", "utf8");
  try {
    const content = await fixBlockingFileRead(fixturePath);
    assert.equal(content, "outro-conteudo");
  } finally {
    await rm(fixturePath, { force: true });
  }
});

test("fixBlockingFileRead: não usa readFileSync (API bloqueante)", () => {
  const block = extractExerciseSource("fixBlockingFileRead");
  assert.equal(/readFileSync\(/.test(block), false);
});

// --- refactorScheduledLabelsOrder ------------------------------------------------

test("refactorScheduledLabelsOrder: mantém a ordem final task-1, task-2, task-3", async () => {
  const order = await refactorScheduledLabelsOrder();
  assert.deepEqual(order, ["task-1", "task-2", "task-3"]);
});

// --- simulateEventLoopPipeline ------------------------------------------------

test("simulateEventLoopPipeline: sync, microtasks, timers e immediates na ordem determinística correta", async () => {
  const order = await simulateEventLoopPipeline();
  assert.deepEqual(order, [
    "sync-1",
    "microtask-1",
    "microtask-2",
    "timeout-1",
    "timeout-2",
    "immediate-1",
    "immediate-2",
  ]);
});
