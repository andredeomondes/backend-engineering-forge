import { test } from "node:test";
import assert from "node:assert/strict";
import { EventEmitter } from "node:events";

import {
  buildNodeEvalArgs,
  runNodeScript,
  execNodeScript,
  createEchoWorkerSource,
  runWorkerEcho,
  isLogLevel,
  formatLogLine,
  waitForSignal,
  createLogger,
  createInFlightTracker,
  waitForInFlightToSettle,
  runWorkerBatch,
  fixRunNodeScriptIncomplete,
  fixGracefulShutdown,
  refactorLogPayload,
  runGracefulWorkerJob,
  type InFlightTracker,
  type Scheduler,
} from "./exercises.ts";

const ISO_TIMESTAMP = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

// --- buildNodeEvalArgs -------------------------------------------------------

test("buildNodeEvalArgs: monta argumentos para node -e", () => {
  assert.deepEqual(buildNodeEvalArgs("console.log(1)"), ["-e", "console.log(1)"]);
});

// --- runNodeScript -----------------------------------------------------------

test("runNodeScript: coleta stdout e exitCode de um processo filho curto", async () => {
  const { stdout, exitCode } = await runNodeScript("console.log('ola')");
  assert.equal(stdout.trim(), "ola");
  assert.equal(exitCode, 0);
});

test("runNodeScript: reflete exitCode diferente de zero", async () => {
  const { exitCode } = await runNodeScript("process.exit(3)");
  assert.equal(exitCode, 3);
});

// --- execNodeScript -----------------------------------------------------------

test("execNodeScript: executa e retorna stdout via execFile", async () => {
  const stdout = await execNodeScript("console.log('via execFile')");
  assert.equal(stdout.trim(), "via execFile");
});

// --- createEchoWorkerSource -----------------------------------------------------------

test("createEchoWorkerSource: gera código-fonte de worker que usa worker_threads", () => {
  const source = createEchoWorkerSource();
  assert.equal(typeof source, "string");
  assert.match(source, /worker_threads/);
  assert.match(source, /parentPort/);
});

// --- runWorkerEcho -----------------------------------------------------------

test("runWorkerEcho: round-trip de mensagem com um worker thread", async () => {
  const result = await runWorkerEcho("oi");
  assert.equal(result, "echo:oi");
});

// --- isLogLevel -----------------------------------------------------------

test("isLogLevel: identifica níveis válidos e inválidos", () => {
  assert.equal(isLogLevel("info"), true);
  assert.equal(isLogLevel("debug"), true);
  assert.equal(isLogLevel("warn"), true);
  assert.equal(isLogLevel("error"), true);
  assert.equal(isLogLevel("trace"), false);
  assert.equal(isLogLevel(""), false);
});

// --- formatLogLine -----------------------------------------------------------

test("formatLogLine: gera uma linha JSON com timestamp, level, message e meta", () => {
  const line = formatLogLine("info", "servidor iniciado", { port: 3000 });
  const parsed: Record<string, unknown> = JSON.parse(line);
  assert.equal(parsed["level"], "info");
  assert.equal(parsed["message"], "servidor iniciado");
  assert.equal(parsed["port"], 3000);
  assert.match(String(parsed["timestamp"]), ISO_TIMESTAMP);
});

test("formatLogLine: funciona sem meta", () => {
  const line = formatLogLine("error", "falhou");
  const parsed: Record<string, unknown> = JSON.parse(line);
  assert.equal(parsed["level"], "error");
  assert.equal(parsed["message"], "falhou");
});

// --- waitForSignal -----------------------------------------------------------

test("waitForSignal: resolve com o nome do primeiro sinal (fake emitter)", async () => {
  const emitter = new EventEmitter();
  const promise = waitForSignal(emitter, ["SIGINT", "SIGTERM"]);
  emitter.emit("SIGTERM");
  assert.equal(await promise, "SIGTERM");
});

test("waitForSignal: nunca usa o process real", async () => {
  const emitter = new EventEmitter();
  const promise = waitForSignal(emitter, ["SIGINT"]);
  emitter.emit("SIGINT");
  assert.equal(await promise, "SIGINT");
  // O processo de teste não deve ter sido afetado — se este teste rodou
  // até aqui, nenhum sinal real foi entregue ao runner.
});

// --- createLogger -----------------------------------------------------------

test("createLogger: filtra por nível mínimo de severidade", () => {
  const logger = createLogger("warn");
  assert.equal(logger("debug", "ignorado"), null);
  assert.equal(logger("info", "ignorado"), null);
  const warnLine = logger("warn", "atenção");
  assert.notEqual(warnLine, null);
  const errorLine = logger("error", "grave");
  assert.notEqual(errorLine, null);
});

// --- createInFlightTracker -----------------------------------------------------------

test("createInFlightTracker: incrementa, decrementa e conta tarefas em andamento", () => {
  const tracker = createInFlightTracker();
  assert.equal(tracker.count(), 0);
  tracker.increment();
  tracker.increment();
  assert.equal(tracker.count(), 2);
  tracker.decrement();
  assert.equal(tracker.count(), 1);
  tracker.decrement();
  assert.equal(tracker.count(), 0);
});

test("createInFlightTracker: onIdle dispara quando a contagem chega a zero", () => {
  const tracker = createInFlightTracker();
  tracker.increment();
  let fired = false;
  tracker.onIdle(() => {
    fired = true;
  });
  assert.equal(fired, false);
  tracker.decrement();
  assert.equal(fired, true);
});

test("createInFlightTracker: onIdle dispara imediatamente se já está ocioso", () => {
  const tracker = createInFlightTracker();
  let fired = false;
  tracker.onIdle(() => {
    fired = true;
  });
  assert.equal(fired, true);
});

// --- waitForInFlightToSettle -----------------------------------------------------------

test("waitForInFlightToSettle: usa timers falsos para esperar a contagem zerar", async (t) => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  const scheduler: Scheduler = {
    setTimeout: globalThis.setTimeout,
    clearTimeout: globalThis.clearTimeout,
  };

  let remaining = 2;
  const count = (): number => remaining;

  const settled = waitForInFlightToSettle(count, 10, scheduler);
  let resolved = false;
  settled.then(() => {
    resolved = true;
  });

  t.mock.timers.tick(10);
  await Promise.resolve();
  assert.equal(resolved, false);
  remaining = 1;

  t.mock.timers.tick(10);
  await Promise.resolve();
  assert.equal(resolved, false);
  remaining = 0;

  t.mock.timers.tick(10);
  await settled;
  assert.equal(resolved, true);
});

// --- runWorkerBatch -----------------------------------------------------------

test("runWorkerBatch: processa múltiplas mensagens em um único worker e o encerra", async () => {
  const results = await runWorkerBatch(["a", "b", "c"]);
  assert.deepEqual(results, ["echo:a", "echo:b", "echo:c"]);
});

// --- fixRunNodeScriptIncomplete -----------------------------------------------------------

test("fixRunNodeScriptIncomplete: captura stdout completo mesmo em múltiplos pedaços", async () => {
  const script =
    "console.log('primeira'); setTimeout(() => console.log('segunda'), 20);";
  const { stdout, exitCode } = await fixRunNodeScriptIncomplete(script);
  assert.equal(stdout.includes("primeira"), true);
  assert.equal(stdout.includes("segunda"), true);
  assert.equal(exitCode, 0);
});

// --- fixGracefulShutdown -----------------------------------------------------------

test("fixGracefulShutdown: só resolve depois que as tarefas em andamento terminam", async () => {
  const emitter = new EventEmitter();
  let idleCallback: (() => void) | null = null;
  let currentCount = 1;
  const tracker: InFlightTracker = {
    increment: () => {
      currentCount += 1;
    },
    decrement: () => {
      currentCount -= 1;
      if (currentCount <= 0 && idleCallback) {
        idleCallback();
      }
    },
    count: () => currentCount,
    onIdle: (callback) => {
      if (currentCount <= 0) {
        callback();
      } else {
        idleCallback = callback;
      }
    },
  };

  const shutdown = fixGracefulShutdown(emitter, tracker);
  let resolved = false;
  shutdown.then(() => {
    resolved = true;
  });

  emitter.emit("SIGTERM");
  await Promise.resolve();
  await Promise.resolve();
  assert.equal(resolved, false, "não deve resolver com tarefa ainda em andamento");

  tracker.decrement();
  await shutdown;
  assert.equal(resolved, true);
});

// --- refactorLogPayload -----------------------------------------------------------

test("refactorLogPayload: mesmo comportamento observável da versão original", () => {
  const line = refactorLogPayload("info", "pronto", { attempt: 1 });
  const parsed: Record<string, unknown> = JSON.parse(line);
  assert.equal(parsed["level"], "info");
  assert.equal(parsed["message"], "pronto");
  assert.equal(parsed["attempt"], 1);
  assert.match(String(parsed["timestamp"]), ISO_TIMESTAMP);
});

test("refactorLogPayload: funciona com meta padrão (vazio)", () => {
  const line = refactorLogPayload("debug", "sem meta");
  const parsed: Record<string, unknown> = JSON.parse(line);
  assert.equal(parsed["level"], "debug");
  assert.equal(parsed["message"], "sem meta");
});

// --- runGracefulWorkerJob -----------------------------------------------------------

test("runGracefulWorkerJob: retorna resultado e logs quando nenhum sinal chega", async () => {
  const emitter = new EventEmitter();
  let currentCount = 0;
  let idleCallback: (() => void) | null = null;
  const tracker: InFlightTracker = {
    increment: () => {
      currentCount += 1;
    },
    decrement: () => {
      currentCount -= 1;
      if (currentCount <= 0 && idleCallback) {
        idleCallback();
      }
    },
    count: () => currentCount,
    onIdle: (callback) => {
      if (currentCount <= 0) {
        callback();
      } else {
        idleCallback = callback;
      }
    },
  };

  const { result, logs } = await runGracefulWorkerJob("job-1", emitter, tracker);
  assert.equal(result, "echo:job-1");
  assert.equal(logs.length >= 2, true);
  assert.equal(tracker.count(), 0);
});

test("runGracefulWorkerJob: espera o worker terminar mesmo quando um sinal chega antes", async () => {
  const emitter = new EventEmitter();
  let currentCount = 0;
  let idleCallback: (() => void) | null = null;
  const tracker: InFlightTracker = {
    increment: () => {
      currentCount += 1;
    },
    decrement: () => {
      currentCount -= 1;
      if (currentCount <= 0 && idleCallback) {
        idleCallback();
      }
    },
    count: () => currentCount,
    onIdle: (callback) => {
      if (currentCount <= 0) {
        callback();
      } else {
        idleCallback = callback;
      }
    },
  };

  const jobPromise = runGracefulWorkerJob("job-2", emitter, tracker);
  emitter.emit("SIGTERM");

  const { result, logs } = await jobPromise;
  assert.equal(result, "echo:job-2");
  const hasWarnAboutSignal = logs.some((line) => {
    const parsed: Record<string, unknown> = JSON.parse(line);
    return parsed["level"] === "warn";
  });
  assert.equal(hasWarnAboutSignal, true);
});
