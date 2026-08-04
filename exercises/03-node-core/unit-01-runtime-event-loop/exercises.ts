// Unidade 1 — Runtime do Node, event loop, blocking vs non-blocking,
// microtasks vs macrotasks
//
// Implemente cada função. Use apenas built-ins do Node (`node:fs`,
// `node:fs/promises`, `node:events`, `node:crypto`, `node:url`, timers
// globais). Não use bibliotecas externas. Não use `any`.
// Veja README.md para o enunciado completo de cada exercício.
//
// IMPORTANTE sobre determinismo: nenhum teste desta unidade depende de qual
// callback "chega primeiro na corrida". Toda ordem exigida é garantida pela
// especificação do event loop do Node (microtask sempre antes de macrotask,
// filas FIFO, encadeamento explícito de timers), nunca por comparar
// duração em milissegundos.

import { readFileSync } from "node:fs";

// --- Fundamentais ---------------------------------------------------------

// test: node --test --test-name-pattern="recordSyncMicroMacroOrder" exercises/03-node-core/unit-01-runtime-event-loop/exercises.test.ts
export function recordSyncMicroMacroOrder(): Promise<string[]> {
  throw new Error("not implemented: recordSyncMicroMacroOrder");
}

// test: node --test --test-name-pattern="recordMicrotaskFifoOrder" exercises/03-node-core/unit-01-runtime-event-loop/exercises.test.ts
export function recordMicrotaskFifoOrder(): Promise<string[]> {
  throw new Error("not implemented: recordMicrotaskFifoOrder");
}

// test: node --test --test-name-pattern="recordNestedMicrotaskBeforeMacrotask" exercises/03-node-core/unit-01-runtime-event-loop/exercises.test.ts
export function recordNestedMicrotaskBeforeMacrotask(): Promise<string[]> {
  throw new Error("not implemented: recordNestedMicrotaskBeforeMacrotask");
}

// test: node --test --test-name-pattern="recordSetImmediateInsideIOCallback" exercises/03-node-core/unit-01-runtime-event-loop/exercises.test.ts
export function recordSetImmediateInsideIOCallback(): Promise<string[]> {
  throw new Error("not implemented: recordSetImmediateInsideIOCallback");
}

// test: node --test --test-name-pattern="readFileNonBlocking" exercises/03-node-core/unit-01-runtime-event-loop/exercises.test.ts
export function readFileNonBlocking(path: string): Promise<string> {
  throw new Error("not implemented: readFileNonBlocking");
}

// test: node --test --test-name-pattern="recordEventEmitterListenersRunSynchronously" exercises/03-node-core/unit-01-runtime-event-loop/exercises.test.ts
export function recordEventEmitterListenersRunSynchronously(): string[] {
  throw new Error(
    "not implemented: recordEventEmitterListenersRunSynchronously",
  );
}

// test: node --test --test-name-pattern="recordNextTickBeforePromiseMicrotask" exercises/03-node-core/unit-01-runtime-event-loop/exercises.test.ts
export function recordNextTickBeforePromiseMicrotask(): Promise<string[]> {
  throw new Error("not implemented: recordNextTickBeforePromiseMicrotask");
}

// test: node --test --test-name-pattern="recordSetImmediateVsPromiseMicrotask" exercises/03-node-core/unit-01-runtime-event-loop/exercises.test.ts
export function recordSetImmediateVsPromiseMicrotask(): Promise<string[]> {
  throw new Error("not implemented: recordSetImmediateVsPromiseMicrotask");
}

// --- Intermediários --------------------------------------------------------

// test: node --test --test-name-pattern="resolveInInputOrderRegardlessOfCompletion" exercises/03-node-core/unit-01-runtime-event-loop/exercises.test.ts
export function resolveInInputOrderRegardlessOfCompletion(): Promise<
  string[]
> {
  throw new Error(
    "not implemented: resolveInInputOrderRegardlessOfCompletion",
  );
}

// test: node --test --test-name-pattern="chainSequentialAsyncTasks" exercises/03-node-core/unit-01-runtime-event-loop/exercises.test.ts
export function chainSequentialAsyncTasks(
  labels: string[],
): Promise<string[]> {
  throw new Error("not implemented: chainSequentialAsyncTasks");
}

// test: node --test --test-name-pattern="recordThreadPoolCallbackAfterMicrotasks" exercises/03-node-core/unit-01-runtime-event-loop/exercises.test.ts
export function recordThreadPoolCallbackAfterMicrotasks(): Promise<string[]> {
  throw new Error("not implemented: recordThreadPoolCallbackAfterMicrotasks");
}

// test: node --test --test-name-pattern="recordTimerChainOrder" exercises/03-node-core/unit-01-runtime-event-loop/exercises.test.ts
export function recordTimerChainOrder(): Promise<string[]> {
  throw new Error("not implemented: recordTimerChainOrder");
}

// --- Debugging --------------------------------------------------------------
//
// As duas funções abaixo JÁ ESTÃO IMPLEMENTADAS, mas contêm um bug real.
// Sua tarefa não é reescrever do zero: é diagnosticar e corrigir.

// test: node --test --test-name-pattern="fixMicrotaskOrderingBug" exercises/03-node-core/unit-01-runtime-event-loop/exercises.test.ts
export function fixMicrotaskOrderingBug(): Promise<string[]> {
  // Sintoma relatado: o resultado esperado é ["start", "middle", "end"] —
  // "middle" deveria rodar antes de qualquer timer, como uma microtask.
  // Em vez disso, "middle" foi agendado como um SEGUNDO timer (macrotask),
  // então sua posição final depende da ordem de registro dos timers, não
  // do fato de que microtasks sempre rodam antes de macrotasks. Corrija
  // trocando o agendamento de "middle" para uma microtask de verdade.
  return new Promise((resolve) => {
    const order: string[] = [];
    let remaining = 2;
    const finishIfDone = (): void => {
      remaining -= 1;
      if (remaining === 0) {
        resolve(order);
      }
    };
    order.push("start");
    setTimeout(() => {
      order.push("end");
      finishIfDone();
    }, 0);
    setTimeout(() => {
      order.push("middle");
      finishIfDone();
    }, 0);
  });
}

// test: node --test --test-name-pattern="fixBlockingFileRead" exercises/03-node-core/unit-01-runtime-event-loop/exercises.test.ts
export function fixBlockingFileRead(path: string): Promise<string> {
  // Sintoma relatado: a função retorna o conteúdo certo do arquivo, mas usa
  // uma API bloqueante (síncrona) por baixo dos panos. Isso trava a thread
  // principal do event loop inteira enquanto o disco responde — em um
  // servidor real, nenhuma outra requisição é atendida durante essa leitura.
  // Reescreva usando o equivalente não-bloqueante, mantendo a assinatura e
  // o valor de retorno (uma Promise com o conteúdo do arquivo em utf8).
  const content = readFileSync(path, "utf8");
  return Promise.resolve(content);
}

// --- Refatoração -------------------------------------------------------------
//
// Esta função já funciona corretamente. A tarefa é refatorar para reduzir
// passos manuais e variáveis desnecessárias, mantendo o mesmo comportamento
// observável (a mesma ordem final).

// test: node --test --test-name-pattern="refactorScheduledLabelsOrder" exercises/03-node-core/unit-01-runtime-event-loop/exercises.test.ts
export function refactorScheduledLabelsOrder(): Promise<string[]> {
  return new Promise((resolve) => {
    const order: string[] = [];
    let isTask1Done = false;
    let isTask2Done = false;
    let isTask3Done = false;
    setTimeout(() => {
      order.push("task-1");
      isTask1Done = true;
      if (isTask1Done === true) {
        setTimeout(() => {
          order.push("task-2");
          isTask2Done = true;
          if (isTask2Done === true) {
            setTimeout(() => {
              order.push("task-3");
              isTask3Done = true;
              if (
                isTask1Done === true &&
                isTask2Done === true &&
                isTask3Done === true
              ) {
                resolve(order);
              }
            }, 0);
          }
        }, 0);
      }
    }, 0);
  });
}

// --- Desafio integrador -------------------------------------------------------

// test: node --test --test-name-pattern="simulateEventLoopPipeline" exercises/03-node-core/unit-01-runtime-event-loop/exercises.test.ts
export function simulateEventLoopPipeline(): Promise<string[]> {
  throw new Error("not implemented: simulateEventLoopPipeline");
}
