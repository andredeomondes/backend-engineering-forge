import { test } from "node:test";
import assert from "node:assert/strict";
import { EventEmitter } from "node:events";
import { setTimeout as sleep } from "node:timers/promises";

import {
  TaskQueue,
  onceValue,
  countListenersFor,
  addTemporaryListener,
  setListenerLimit,
  guardAgainstUnhandledError,
  delay,
  runOnNextTick,
  createRepeatingCounter,
  waitForCompletion,
  debounce,
  cancelableDelay,
  notifyOnFirstCompletion,
  scheduleOnce,
  waitForEventArgs,
  runTasksSequentially,
} from "./exercises.ts";

// --- onceValue --------------------------------------------------------

test("onceValue: resolve com o primeiro argumento emitido", async () => {
  const emitter = new EventEmitter();
  const promise = onceValue<string>(emitter, "greeting");
  emitter.emit("greeting", "olá");
  emitter.emit("greeting", "ignorado");
  assert.equal(await promise, "olá");
});

// --- countListenersFor -------------------------------------------------

test("countListenersFor: conta listeners registrados para o evento", () => {
  const emitter = new EventEmitter();
  assert.equal(countListenersFor(emitter, "tick"), 0);
  emitter.on("tick", () => {});
  emitter.on("tick", () => {});
  emitter.on("other", () => {});
  assert.equal(countListenersFor(emitter, "tick"), 2);
});

// --- addTemporaryListener -----------------------------------------------

test("addTemporaryListener: registra e permite remover o listener específico", () => {
  const emitter = new EventEmitter();
  const calls: string[] = [];
  const otherListener = () => calls.push("other");
  emitter.on("event", otherListener);

  const unsubscribe = addTemporaryListener(emitter, "event", () => calls.push("temp"));
  emitter.emit("event");
  assert.deepEqual(calls, ["other", "temp"]);

  unsubscribe();
  emitter.emit("event");
  assert.deepEqual(calls, ["other", "temp", "other"]);
});

// --- setListenerLimit -----------------------------------------------------

test("setListenerLimit: ajusta o máximo de listeners do emitter", () => {
  const emitter = new EventEmitter();
  assert.equal(setListenerLimit(emitter, 20), 20);
  assert.equal(emitter.getMaxListeners(), 20);
});

// --- guardAgainstUnhandledError --------------------------------------------

test("guardAgainstUnhandledError: evita que 'error' derrube o processo", () => {
  const emitter = new EventEmitter();
  let received: Error | null = null;
  guardAgainstUnhandledError(emitter, (err) => {
    received = err;
  });

  const boom = new Error("boom");
  assert.doesNotThrow(() => emitter.emit("error", boom));
  assert.equal(received, boom);
});

// --- delay -------------------------------------------------------------

test("delay: resolve depois de aproximadamente ms milissegundos", async () => {
  const start = Date.now();
  await delay(5);
  assert.ok(Date.now() - start >= 4);
});

// --- runOnNextTick -------------------------------------------------------

test("runOnNextTick: executa o callback de forma assíncrona via setImmediate", async () => {
  let called = false;
  runOnNextTick(() => {
    called = true;
  });
  assert.equal(called, false);
  await new Promise<void>((resolve) => setImmediate(resolve));
  assert.equal(called, true);
});

// --- createRepeatingCounter -----------------------------------------------

test("createRepeatingCounter: chama onTick a cada intervalo até ser parado", async () => {
  const ticks: number[] = [];
  await new Promise<void>((resolve) => {
    const stop = createRepeatingCounter(5, (count) => {
      ticks.push(count);
      if (count === 3) {
        stop();
        resolve();
      }
    });
  });
  assert.deepEqual(ticks, [1, 2, 3]);
});

// --- TaskQueue.runTask -------------------------------------------------------

test("TaskQueue.runTask: emite started/completed e resolve com o resultado", async () => {
  const queue = new TaskQueue();
  const events: string[] = [];
  queue.on("started", (name) => events.push(`started:${name}`));
  queue.on("completed", (name, result) => events.push(`completed:${name}:${result}`));

  const result = await queue.runTask("build", async () => "ok");

  assert.equal(result, "ok");
  assert.deepEqual(events, ["started:build", "completed:build:ok"]);
});

test("TaskQueue.runTask: emite failed e rejeita quando a tarefa lança erro", async () => {
  const queue = new TaskQueue();
  const events: string[] = [];
  queue.on("started", (name) => events.push(`started:${name}`));
  queue.on("failed", (name, error) => events.push(`failed:${name}:${error.message}`));

  await assert.rejects(
    () =>
      queue.runTask("deploy", async () => {
        throw new Error("falha de rede");
      }),
    /falha de rede/,
  );
  assert.deepEqual(events, ["started:deploy", "failed:deploy:falha de rede"]);
});

// --- waitForCompletion -------------------------------------------------------

test("waitForCompletion: resolve com o nome e resultado da primeira conclusão", async () => {
  const queue = new TaskQueue();
  const waiting = waitForCompletion(queue);
  await queue.runTask("build", async () => "ok");
  assert.deepEqual(await waiting, { taskName: "build", result: "ok" });
});

// --- debounce -------------------------------------------------------------

test("debounce: só executa uma vez, com os argumentos da última chamada", async () => {
  let callCount = 0;
  let lastArg = "";
  const debounced = debounce((value: string) => {
    callCount += 1;
    lastArg = value;
  }, 15);

  debounced("primeira");
  debounced("segunda");
  debounced("terceira");

  assert.equal(callCount, 0);
  await sleep(35);
  assert.equal(callCount, 1);
  assert.equal(lastArg, "terceira");
});

// --- cancelableDelay -------------------------------------------------------

test("cancelableDelay: resolve com 'completed' quando não é cancelado", async () => {
  const { promise } = cancelableDelay(5);
  assert.equal(await promise, "completed");
});

test("cancelableDelay: resolve com 'cancelled' quando cancel() é chamado", async () => {
  const { promise, cancel } = cancelableDelay(1000);
  cancel();
  assert.equal(await promise, "cancelled");
});

// --- notifyOnFirstCompletion (debugging) -----------------------------------

test("notifyOnFirstCompletion: só notifica na primeira conclusão", async () => {
  const queue = new TaskQueue();
  let callCount = 0;
  notifyOnFirstCompletion(queue, () => {
    callCount += 1;
  });

  await queue.runTask("um", async () => "a");
  await queue.runTask("dois", async () => "b");

  assert.equal(callCount, 1);
});

// --- scheduleOnce (debugging) -----------------------------------------------

test("scheduleOnce: reinicia o temporizador a cada chamada, executa uma única vez", async () => {
  let callCount = 0;
  const trigger = scheduleOnce(() => {
    callCount += 1;
  }, 10);

  trigger();
  trigger();
  trigger();

  await sleep(40);
  assert.equal(callCount, 1);
});

// --- waitForEventArgs (refatoração) -----------------------------------------

test("waitForEventArgs: resolve com todos os argumentos emitidos, uma única vez", async () => {
  const emitter = new EventEmitter();
  const promise = waitForEventArgs(emitter, "payload");
  emitter.emit("payload", "a", 2, true);
  emitter.emit("payload", "b", 3, false);
  assert.deepEqual(await promise, ["a", 2, true]);
});

// --- runTasksSequentially (desafio integrador) ------------------------------

test("runTasksSequentially: executa tarefas em ordem e resume sucesso/falha", async () => {
  const queue = new TaskQueue();
  const startedOrder: string[] = [];
  queue.on("started", (name) => startedOrder.push(name));

  const outcomes = await runTasksSequentially(queue, [
    { name: "um", work: async () => "resultado-um" },
    {
      name: "dois",
      work: async () => {
        throw new Error("erro-dois");
      },
    },
    { name: "tres", work: async () => "resultado-tres" },
  ]);

  assert.deepEqual(startedOrder, ["um", "dois", "tres"]);
  assert.deepEqual(outcomes, [
    { name: "um", status: "completed", detail: "resultado-um" },
    { name: "dois", status: "failed", detail: "erro-dois" },
    { name: "tres", status: "completed", detail: "resultado-tres" },
  ]);
});
