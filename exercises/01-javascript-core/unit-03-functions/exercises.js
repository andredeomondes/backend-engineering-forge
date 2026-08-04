// Unidade 3 — Funções
//
// Implemente cada função. Não use bibliotecas externas.
// Veja README.md para o enunciado completo de cada exercício.

// --- Fundamentais ---------------------------------------------------------

// test: node --test --test-name-pattern="sum" exercises/01-javascript-core/unit-03-functions/exercises.test.js
export function sum(a, b) {
  throw new Error("not implemented: sum");
}

// test: node --test --test-name-pattern="greet" exercises/01-javascript-core/unit-03-functions/exercises.test.js
export function greet(name) {
  throw new Error("not implemented: greet");
}

// test: node --test --test-name-pattern="multiplyAll" exercises/01-javascript-core/unit-03-functions/exercises.test.js
export const multiplyAll = (...numbers) => {
  throw new Error("not implemented: multiplyAll");
};

// test: node --test --test-name-pattern="isEven" exercises/01-javascript-core/unit-03-functions/exercises.test.js
export const isEven = (n) => {
  throw new Error("not implemented: isEven");
};

// test: node --test --test-name-pattern="makeAdder" exercises/01-javascript-core/unit-03-functions/exercises.test.js
export function makeAdder(x) {
  throw new Error("not implemented: makeAdder");
}

// test: node --test --test-name-pattern="describePerson" exercises/01-javascript-core/unit-03-functions/exercises.test.js
export function describePerson({ name, age, city = "cidade não informada" } = {}) {
  throw new Error("not implemented: describePerson");
}

// test: node --test --test-name-pattern="applyDiscount" exercises/01-javascript-core/unit-03-functions/exercises.test.js
export function applyDiscount(price, discountPercent = 0) {
  throw new Error("not implemented: applyDiscount");
}

// test: node --test --test-name-pattern="firstArgumentType" exercises/01-javascript-core/unit-03-functions/exercises.test.js
export function firstArgumentType(...args) {
  throw new Error("not implemented: firstArgumentType");
}

// --- Intermediários --------------------------------------------------------

// test: node --test --test-name-pattern="composeTwo" exercises/01-javascript-core/unit-03-functions/exercises.test.js
export function composeTwo(f, g) {
  throw new Error("not implemented: composeTwo");
}

// test: node --test --test-name-pattern="invokeNTimes" exercises/01-javascript-core/unit-03-functions/exercises.test.js
export function invokeNTimes(fn, n) {
  throw new Error("not implemented: invokeNTimes");
}

// test: node --test --test-name-pattern="curriedAdd" exercises/01-javascript-core/unit-03-functions/exercises.test.js
export function curriedAdd(a) {
  throw new Error("not implemented: curriedAdd");
}

// test: node --test --test-name-pattern="formatPrice" exercises/01-javascript-core/unit-03-functions/exercises.test.js
export function formatPrice(amount, currency = "BRL") {
  throw new Error("not implemented: formatPrice");
}

// --- Debugging --------------------------------------------------------------
//
// As duas funções abaixo JÁ ESTÃO IMPLEMENTADAS, mas contêm um bug real.
// Sua tarefa não é reescrever do zero: é diagnosticar e corrigir.

// test: node --test --test-name-pattern="averageOrZero" exercises/01-javascript-core/unit-03-functions/exercises.test.js
export function averageOrZero(numbers = []) {
  // Sintoma relatado: chamar averageOrZero() sem argumentos, ou com uma lista
  // vazia, deveria retornar 0, mas está retornando NaN.
  let total = 0;
  for (const n of numbers) {
    total += n;
  }
  return total / numbers.length;
}

// test: node --test --test-name-pattern="makeMultiplier" exercises/01-javascript-core/unit-03-functions/exercises.test.js
export function makeMultiplier(factor) {
  // Sintoma relatado: a função retornada por makeMultiplier sempre devolve
  // undefined, em vez do produto esperado.
  const multiplier = (n) => {
    n * factor;
  };
  return multiplier;
}

// --- Refatoração -------------------------------------------------------------
//
// Esta função já funciona corretamente. A tarefa é refatorar para reduzir
// repetição e usar parâmetros default, mantendo o mesmo comportamento
// observável.

// test: node --test --test-name-pattern="refactorOrderTotal" exercises/01-javascript-core/unit-03-functions/exercises.test.js
export function refactorOrderTotal(order) {
  var quantity = order.quantity;
  if (quantity === undefined) {
    quantity = 1;
  }
  var price = order.price;
  if (price === undefined) {
    price = 0;
  }
  var discount = order.discount;
  if (discount === undefined) {
    discount = 0;
  }
  var total = price * quantity * (1 - discount);
  if (total < 0) {
    total = 0;
  }
  return total;
}

// --- Desafio integrador -------------------------------------------------------

// test: node --test --test-name-pattern="buildOrderProcessor" exercises/01-javascript-core/unit-03-functions/exercises.test.js
export function buildOrderProcessor(taxRate = 0) {
  throw new Error("not implemented: buildOrderProcessor");
}
