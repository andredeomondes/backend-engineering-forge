// Unidade 5 — EventEmitter e Timers
//
// Implemente cada função. Não use bibliotecas externas. Não use `any`.
// Veja README.md para o enunciado completo de cada exercício.

import { EventEmitter } from "node:events";
import { setTimeout as sleep } from "node:timers/promises";

// --- Tipos e infraestrutura usados nesta unidade ----------------------------
//
// `TaskQueueEvents` é o "mapa de eventos" que descreve, por nome de evento,
// a assinatura do listener correspondente. `TaskQueue` é um EventEmitter
// tipado: a `declare interface TaskQueue` abaixo usa "declaration merging"
// para sobrescrever `on`/`once`/`off`/`emit` com overloads que só aceitam
// as chaves de `TaskQueueEvents`, então `queue.on("completed", (result) => ...)`
// tem `result` inferido como `string`, não `unknown[]`.

export interface TaskQueueEvents {
  started: (taskName: string) => void;
  completed: (taskName: string, result: string) => void;
  failed: (taskName: string, error: Error) => void;
}

export class TaskQueue extends EventEmitter {
  // test: node --test --test-name-pattern="TaskQueue.runTask" exercises/03-node-core/unit-05-eventemitter-timers/exercises.test.ts
  async runTask(taskName: string, work: () => Promise<string>): Promise<string> {
    throw new Error("not implemented: TaskQueue.runTask");
  }
}

export declare interface TaskQueue {
  on<K extends keyof TaskQueueEvents>(event: K, listener: TaskQueueEvents[K]): this;
  once<K extends keyof TaskQueueEvents>(event: K, listener: TaskQueueEvents[K]): this;
  off<K extends keyof TaskQueueEvents>(event: K, listener: TaskQueueEvents[K]): this;
  emit<K extends keyof TaskQueueEvents>(
    event: K,
    ...args: Parameters<TaskQueueEvents[K]>
  ): boolean;
}

// --- Fundamentais -----------------------------------------------------------

// test: node --test --test-name-pattern="onceValue" exercises/03-node-core/unit-05-eventemitter-timers/exercises.test.ts
export function onceValue<T>(emitter: EventEmitter, event: string): Promise<T> {
  throw new Error("not implemented: onceValue");
}

// test: node --test --test-name-pattern="countListenersFor" exercises/03-node-core/unit-05-eventemitter-timers/exercises.test.ts
export function countListenersFor(emitter: EventEmitter, event: string): number {
  throw new Error("not implemented: countListenersFor");
}

// test: node --test --test-name-pattern="addTemporaryListener" exercises/03-node-core/unit-05-eventemitter-timers/exercises.test.ts
export function addTemporaryListener(
  emitter: EventEmitter,
  event: string,
  listener: (...args: unknown[]) => void,
): () => void {
  throw new Error("not implemented: addTemporaryListener");
}

// test: node --test --test-name-pattern="setListenerLimit" exercises/03-node-core/unit-05-eventemitter-timers/exercises.test.ts
export function setListenerLimit(emitter: EventEmitter, max: number): number {
  throw new Error("not implemented: setListenerLimit");
}

// test: node --test --test-name-pattern="guardAgainstUnhandledError" exercises/03-node-core/unit-05-eventemitter-timers/exercises.test.ts
export function guardAgainstUnhandledError(
  emitter: EventEmitter,
  onError: (err: Error) => void,
): void {
  throw new Error("not implemented: guardAgainstUnhandledError");
}

// test: node --test --test-name-pattern="^delay" exercises/03-node-core/unit-05-eventemitter-timers/exercises.test.ts
export function delay(ms: number): Promise<void> {
  throw new Error("not implemented: delay");
}

// test: node --test --test-name-pattern="runOnNextTick" exercises/03-node-core/unit-05-eventemitter-timers/exercises.test.ts
export function runOnNextTick(callback: () => void): NodeJS.Immediate {
  throw new Error("not implemented: runOnNextTick");
}

// test: node --test --test-name-pattern="createRepeatingCounter" exercises/03-node-core/unit-05-eventemitter-timers/exercises.test.ts
export function createRepeatingCounter(
  intervalMs: number,
  onTick: (count: number) => void,
): () => void {
  throw new Error("not implemented: createRepeatingCounter");
}

// --- Intermediários ----------------------------------------------------------

// test: node --test --test-name-pattern="waitForCompletion" exercises/03-node-core/unit-05-eventemitter-timers/exercises.test.ts
export function waitForCompletion(
  queue: TaskQueue,
): Promise<{ taskName: string; result: string }> {
  throw new Error("not implemented: waitForCompletion");
}

// test: node --test --test-name-pattern="debounce" exercises/03-node-core/unit-05-eventemitter-timers/exercises.test.ts
export function debounce<Args extends unknown[]>(
  fn: (...args: Args) => void,
  waitMs: number,
): (...args: Args) => void {
  throw new Error("not implemented: debounce");
}

export type DelayOutcome = "completed" | "cancelled";

// test: node --test --test-name-pattern="cancelableDelay" exercises/03-node-core/unit-05-eventemitter-timers/exercises.test.ts
export function cancelableDelay(ms: number): {
  promise: Promise<DelayOutcome>;
  cancel: () => void;
} {
  throw new Error("not implemented: cancelableDelay");
}

// --- Debugging ----------------------------------------------------------------
//
// As duas funções abaixo JÁ ESTÃO IMPLEMENTADAS, mas contêm um bug real.
// Sua tarefa não é reescrever do zero: é diagnosticar e corrigir.

// test: node --test --test-name-pattern="notifyOnFirstCompletion" exercises/03-node-core/unit-05-eventemitter-timers/exercises.test.ts
export function notifyOnFirstCompletion(
  queue: TaskQueue,
  listener: (result: string) => void,
): void {
  // Sintoma relatado: o listener deveria ser notificado apenas na PRIMEIRA
  // conclusão de tarefa da fila e depois parar de ouvir, mas ele está
  // sendo chamado a cada "completed" emitido, mesmo depois da primeira vez.
  queue.on("completed", (_taskName, result) => {
    listener(result);
  });
}

// test: node --test --test-name-pattern="scheduleOnce" exercises/03-node-core/unit-05-eventemitter-timers/exercises.test.ts
export function scheduleOnce(callback: () => void, ms: number): () => void {
  // Sintoma relatado: chamar a função retornada várias vezes em sequência
  // deveria reiniciar o temporizador, de forma que só a chamada mais
  // recente dispare o callback (uma única execução). Em vez disso, o
  // callback é executado uma vez para CADA chamada, porque o temporizador
  // anterior nunca é cancelado antes de criar um novo.
  return () => {
    setTimeout(() => {
      callback();
    }, ms);
  };
}

// --- Refatoração ---------------------------------------------------------------
//
// Esta função já funciona corretamente. A tarefa é refatorar para reduzir
// passos manuais, mantendo o mesmo comportamento observável.

// test: node --test --test-name-pattern="waitForEventArgs" exercises/03-node-core/unit-05-eventemitter-timers/exercises.test.ts
export function waitForEventArgs(emitter: EventEmitter, event: string): Promise<unknown[]> {
  return new Promise((resolve) => {
    let hasResolved = false;
    const handler = (...args: unknown[]) => {
      if (hasResolved === false) {
        hasResolved = true;
        const collectedArgs: unknown[] = [];
        for (let i = 0; i < args.length; i++) {
          collectedArgs.push(args[i]);
        }
        emitter.removeListener(event, handler);
        resolve(collectedArgs);
      }
    };
    emitter.on(event, handler);
  });
}

// --- Desafio integrador -----------------------------------------------------

export interface TaskDefinition {
  name: string;
  work: () => Promise<string>;
}

export interface TaskOutcome {
  name: string;
  status: "completed" | "failed";
  detail: string;
}

// test: node --test --test-name-pattern="runTasksSequentially" exercises/03-node-core/unit-05-eventemitter-timers/exercises.test.ts
export async function runTasksSequentially(
  queue: TaskQueue,
  tasks: TaskDefinition[],
): Promise<TaskOutcome[]> {
  throw new Error("not implemented: runTasksSequentially");
}
