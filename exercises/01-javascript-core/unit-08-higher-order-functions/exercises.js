// Unidade 8 — Funções de alta ordem
//
// Implemente cada função. Não use bibliotecas externas.
// Veja README.md para o enunciado completo de cada exercício.

// --- Fundamentais ---------------------------------------------------------

// test: node --test --test-name-pattern="applyOperation" exercises/01-javascript-core/unit-08-higher-order-functions/exercises.test.js
export function applyOperation(a, b, operation) {
  throw new Error("not implemented: applyOperation");
}

// test: node --test --test-name-pattern="makeAdder" exercises/01-javascript-core/unit-08-higher-order-functions/exercises.test.js
export function makeAdder(x) {
  throw new Error("not implemented: makeAdder");
}

// test: node --test --test-name-pattern="makeMultiplier" exercises/01-javascript-core/unit-08-higher-order-functions/exercises.test.js
export function makeMultiplier(factor) {
  throw new Error("not implemented: makeMultiplier");
}

// test: node --test --test-name-pattern="invertPredicate" exercises/01-javascript-core/unit-08-higher-order-functions/exercises.test.js
export function invertPredicate(predicate) {
  throw new Error("not implemented: invertPredicate");
}

// test: node --test --test-name-pattern="repeatCall" exercises/01-javascript-core/unit-08-higher-order-functions/exercises.test.js
export function repeatCall(n, fn) {
  throw new Error("not implemented: repeatCall");
}

// test: node --test --test-name-pattern="pipeTwo" exercises/01-javascript-core/unit-08-higher-order-functions/exercises.test.js
export function pipeTwo(f, g) {
  throw new Error("not implemented: pipeTwo");
}

// test: node --test --test-name-pattern="composeTwo" exercises/01-javascript-core/unit-08-higher-order-functions/exercises.test.js
export function composeTwo(f, g) {
  throw new Error("not implemented: composeTwo");
}

// test: node --test --test-name-pattern="once" exercises/01-javascript-core/unit-08-higher-order-functions/exercises.test.js
export function once(fn) {
  throw new Error("not implemented: once");
}

// --- Intermediários --------------------------------------------------------

// test: node --test --test-name-pattern="makeCounter" exercises/01-javascript-core/unit-08-higher-order-functions/exercises.test.js
export function makeCounter(start) {
  throw new Error("not implemented: makeCounter");
}

// test: node --test --test-name-pattern="curry3" exercises/01-javascript-core/unit-08-higher-order-functions/exercises.test.js
export function curry3(fn) {
  throw new Error("not implemented: curry3");
}

// test: node --test --test-name-pattern="memoize" exercises/01-javascript-core/unit-08-higher-order-functions/exercises.test.js
export function memoize(fn) {
  throw new Error("not implemented: memoize");
}

// test: node --test --test-name-pattern="pipeAll" exercises/01-javascript-core/unit-08-higher-order-functions/exercises.test.js
export function pipeAll(...fns) {
  throw new Error("not implemented: pipeAll");
}

// --- Debugging --------------------------------------------------------------
//
// As duas funções abaixo JÁ ESTÃO IMPLEMENTADAS, mas contêm um bug real.
// Sua tarefa não é reescrever do zero: é diagnosticar e corrigir.

// test: node --test --test-name-pattern="fixOnceBug" exercises/01-javascript-core/unit-08-higher-order-functions/exercises.test.js
export function fixOnceBug(fn) {
  // Sintoma relatado: a função retornada por `fixOnceBug` deveria executar
  // `fn` apenas na primeira chamada e devolver o mesmo resultado guardado
  // nas chamadas seguintes, mas `fn` está sendo executada toda vez.
  let called = false;
  let result;
  return function (...args) {
    if (!called) {
      result = fn(...args);
    }
    return result;
  };
}

// test: node --test --test-name-pattern="fixCounterClosureBug" exercises/01-javascript-core/unit-08-higher-order-functions/exercises.test.js
export function fixCounterClosureBug() {
  // Sintoma relatado: a função `increment` retornada deveria aumentar e
  // lembrar o valor de `count` a cada chamada, mas ela sempre retorna 1,
  // como se `count` fosse reiniciado toda vez.
  let count = 0;
  function increment() {
    let count = count + 1;
    return count;
  }
  return increment;
}

// --- Refatoração -------------------------------------------------------------
//
// Esta função já funciona corretamente. A tarefa é refatorar para reduzir
// duplicação usando composição de funções, mantendo o mesmo comportamento
// observável.

// test: node --test --test-name-pattern="refactorMessyPipeline" exercises/01-javascript-core/unit-08-higher-order-functions/exercises.test.js
export function refactorMessyPipeline(value) {
  let step1 = value + 1;
  let step2 = step1 * 2;
  let step3 = step2 + 1;
  let step4 = step3 * 2;
  let step5 = step4 + 1;
  return step5;
}

// --- Desafio integrador -------------------------------------------------------

// test: node --test --test-name-pattern="buildValidationPipeline" exercises/01-javascript-core/unit-08-higher-order-functions/exercises.test.js
export function buildValidationPipeline(rules) {
  throw new Error("not implemented: buildValidationPipeline");
}
