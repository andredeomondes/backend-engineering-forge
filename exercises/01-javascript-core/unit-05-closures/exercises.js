// Unidade 5 — Closures
//
// Implemente cada função. Não use bibliotecas externas.
// Veja README.md para o enunciado completo de cada exercício.

// --- Fundamentais ---------------------------------------------------------

// test: node --test --test-name-pattern="makeCounter" exercises/01-javascript-core/unit-05-closures/exercises.test.js
export function makeCounter(start = 0) {
  throw new Error("not implemented: makeCounter");
}

// test: node --test --test-name-pattern="makeGreeter" exercises/01-javascript-core/unit-05-closures/exercises.test.js
export function makeGreeter(greeting) {
  throw new Error("not implemented: makeGreeter");
}

// test: node --test --test-name-pattern="createBankAccount" exercises/01-javascript-core/unit-05-closures/exercises.test.js
export function createBankAccount(initialBalance = 0) {
  throw new Error("not implemented: createBankAccount");
}

// test: node --test --test-name-pattern="onceFn" exercises/01-javascript-core/unit-05-closures/exercises.test.js
export function onceFn(fn) {
  throw new Error("not implemented: onceFn");
}

// test: node --test --test-name-pattern="createToggle" exercises/01-javascript-core/unit-05-closures/exercises.test.js
export function createToggle(initial = false) {
  throw new Error("not implemented: createToggle");
}

// test: node --test --test-name-pattern="createAccumulator" exercises/01-javascript-core/unit-05-closures/exercises.test.js
export function createAccumulator(initial = 0) {
  throw new Error("not implemented: createAccumulator");
}

// test: node --test --test-name-pattern="createStack" exercises/01-javascript-core/unit-05-closures/exercises.test.js
export function createStack() {
  throw new Error("not implemented: createStack");
}

// test: node --test --test-name-pattern="rememberLastCall" exercises/01-javascript-core/unit-05-closures/exercises.test.js
export function rememberLastCall(fn) {
  throw new Error("not implemented: rememberLastCall");
}

// --- Intermediários --------------------------------------------------------

// test: node --test --test-name-pattern="createLoopClosuresFixed" exercises/01-javascript-core/unit-05-closures/exercises.test.js
export function createLoopClosuresFixed(n) {
  throw new Error("not implemented: createLoopClosuresFixed");
}

// test: node --test --test-name-pattern="memoize" exercises/01-javascript-core/unit-05-closures/exercises.test.js
export function memoize(fn) {
  throw new Error("not implemented: memoize");
}

// test: node --test --test-name-pattern="createEventEmitter" exercises/01-javascript-core/unit-05-closures/exercises.test.js
export function createEventEmitter() {
  throw new Error("not implemented: createEventEmitter");
}

// test: node --test --test-name-pattern="limitCalls" exercises/01-javascript-core/unit-05-closures/exercises.test.js
export function limitCalls(fn, maxCalls) {
  throw new Error("not implemented: limitCalls");
}

// --- Debugging --------------------------------------------------------------
//
// As duas funções abaixo JÁ ESTÃO IMPLEMENTADAS, mas contêm um bug real.
// Sua tarefa não é reescrever do zero: é diagnosticar e corrigir.

// test: node --test --test-name-pattern="createLoopClosuresBuggy" exercises/01-javascript-core/unit-05-closures/exercises.test.js
export function createLoopClosuresBuggy(n) {
  // Sintoma relatado: era esperado que a função na posição i do array
  // retornasse i quando chamada (fns[0]() === 0, fns[1]() === 1, etc.),
  // mas todas as funções retornam o mesmo valor, igual a n.
  const fns = [];
  for (var i = 0; i < n; i++) {
    fns.push(function () {
      return i;
    });
  }
  return fns;
}

// test: node --test --test-name-pattern="createSharedCounterPair" exercises/01-javascript-core/unit-05-closures/exercises.test.js
export function createSharedCounterPair() {
  // Sintoma relatado: era esperado que increment() e decrement() operassem
  // sobre o MESMO contador (compartilhado pela mesma closure), mas
  // decrement() sempre parece operar sobre um contador independente que
  // nunca é afetado por increment().
  function increment() {
    let count = 0;
    count += 1;
    return count;
  }
  function decrement() {
    let count = 0;
    count -= 1;
    return count;
  }
  return { increment, decrement };
}

// --- Refatoração -------------------------------------------------------------
//
// Esta função já funciona corretamente. A tarefa é refatorar para reduzir
// duplicação e deixar o uso da closure mais claro, mantendo o mesmo
// comportamento observável.

// test: node --test --test-name-pattern="refactorCreateValidator" exercises/01-javascript-core/unit-05-closures/exercises.test.js
export function refactorCreateValidator(min, max) {
  return function (value) {
    if (typeof value !== "number") {
      return false;
    }
    if (value < min) {
      return false;
    }
    if (value > max) {
      return false;
    }
    return true;
  };
}

// --- Desafio integrador -------------------------------------------------------

// test: node --test --test-name-pattern="createRateLimiter" exercises/01-javascript-core/unit-05-closures/exercises.test.js
export function createRateLimiter(maxCalls) {
  throw new Error("not implemented: createRateLimiter");
}
