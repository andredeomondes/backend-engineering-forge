// Unidade 4 — Escopo léxico
//
// Implemente cada função. Não use bibliotecas externas.
// Veja README.md para o enunciado completo de cada exercício.

// --- Fundamentais ---------------------------------------------------------

// test: node --test --test-name-pattern="sumUsingBlockScope" exercises/01-javascript-core/unit-04-lexical-scope/exercises.test.js
export function sumUsingBlockScope(a, b) {
  let result;
  {
    let sum = a + b;
    result = sum;
  }
  return result;
}

// test: node --test --test-name-pattern="maxOfThreeBlockScoped" exercises/01-javascript-core/unit-04-lexical-scope/exercises.test.js
export function maxOfThreeBlockScoped(a, b, c) {
  {
    let maior = a;

    if (b > maior) {
      maior = b;
    }

    if (c > maior) {
      maior = c;
    }

    return maior;
  }
}
// test: node --test --test-name-pattern="describeShadowing" exercises/01-javascript-core/unit-04-lexical-scope/exercises.test.js
export function describeShadowing(outerValue) {
  const original = outerValue;
  let inner;
  {
    let outerValue = original + 10;
    inner = outerValue;
  }
  return {
    outer: outerValue,
    inner: inner,
  };
}

// test: node --test --test-name-pattern="trackLastEvenFunctionScoped" exercises/01-javascript-core/unit-04-lexical-scope/exercises.test.js
export function trackLastEvenFunctionScoped(numbers) {
  var lastEven;

  for (let i = 0; i < numbers.length; i++) {
    if (numbers[i] % 2 === 0) {
      lastEven = numbers[i];
    }
  }

  return lastEven;
}

// test: node --test --test-name-pattern="pushIntoConstArray" exercises/01-javascript-core/unit-04-lexical-scope/exercises.test.js
export function pushIntoConstArray(items) {
  throw new Error("not implemented: pushIntoConstArray");
}

// test: node --test --test-name-pattern="reassignLetInLoop" exercises/01-javascript-core/unit-04-lexical-scope/exercises.test.js
export function reassignLetInLoop(start, times) {
  throw new Error("not implemented: reassignLetInLoop");
}

// test: node --test --test-name-pattern="attemptConstReassignment" exercises/01-javascript-core/unit-04-lexical-scope/exercises.test.js
export function attemptConstReassignment() {
  throw new Error("not implemented: attemptConstReassignment");
}

// test: node --test --test-name-pattern="nestedBlockCounter" exercises/01-javascript-core/unit-04-lexical-scope/exercises.test.js
export function nestedBlockCounter(operations) {
  throw new Error("not implemented: nestedBlockCounter");
}

// --- Intermediários --------------------------------------------------------

// test: node --test --test-name-pattern="hoistedFunctionCall" exercises/01-javascript-core/unit-04-lexical-scope/exercises.test.js
export function hoistedFunctionCall() {
  throw new Error("not implemented: hoistedFunctionCall");
}

// test: node --test --test-name-pattern="varDeclaredValueBeforeAssignment" exercises/01-javascript-core/unit-04-lexical-scope/exercises.test.js
export function varDeclaredValueBeforeAssignment() {
  throw new Error("not implemented: varDeclaredValueBeforeAssignment");
}

// test: node --test --test-name-pattern="compareVarAndLetLeak" exercises/01-javascript-core/unit-04-lexical-scope/exercises.test.js
export function compareVarAndLetLeak(shouldRun) {
  throw new Error("not implemented: compareVarAndLetLeak");
}

// test: node --test --test-name-pattern="createIifeCounter" exercises/01-javascript-core/unit-04-lexical-scope/exercises.test.js
export function createIifeCounter() {
  throw new Error("not implemented: createIifeCounter");
}

// --- Debugging --------------------------------------------------------------
//
// As duas funções abaixo JÁ ESTÃO IMPLEMENTADAS, mas contêm um bug real.
// Sua tarefa não é reescrever do zero: é diagnosticar e corrigir.

// test: node --test --test-name-pattern="sumOrderTotals" exercises/01-javascript-core/unit-04-lexical-scope/exercises.test.js
export function sumOrderTotals(items) {
  // Sintoma relatado: o total final vem sempre igual ao valor do último
  // item da lista, como se os anteriores tivessem sido ignorados.
  var total = 0;
  for (var i = 0; i < items.length; i++) {
    if (items[i].hasFee) {
      var total = items[i].price * 1.1;
    } else {
      var total = items[i].price;
    }
  }
  return total;
}

// test: node --test --test-name-pattern="computeDiscountedPrice" exercises/01-javascript-core/unit-04-lexical-scope/exercises.test.js
export function computeDiscountedPrice(price, isMember) {
  // Sintoma relatado: chamar a função com isMember = true lança
  // "Cannot access 'discount' before initialization" em vez de aplicar o
  // desconto normalmente.
  let finalPrice;
  if (isMember) {
    finalPrice = price * (1 - discount);
    let discount = 0.1;
  } else {
    finalPrice = price;
  }
  return finalPrice;
}

// --- Refatoração -------------------------------------------------------------
//
// Esta função já funciona corretamente. A tarefa é refatorar para usar
// `const`/`let` no lugar de `var`, restringindo cada variável ao menor
// escopo possível, mantendo o mesmo comportamento observável.

// test: node --test --test-name-pattern="refactorScoreSummary" exercises/01-javascript-core/unit-04-lexical-scope/exercises.test.js
export function refactorScoreSummary(scores) {
  var total = 0;
  var max = -Infinity;
  var min = Infinity;
  for (var i = 0; i < scores.length; i++) {
    var s = scores[i];
    total = total + s;
    if (s > max) {
      max = s;
    }
    if (s < min) {
      min = s;
    }
  }
  var avg = total / scores.length;
  return { total: total, max: max, min: min, average: avg };
}

// --- Desafio integrador -------------------------------------------------------

// test: node --test --test-name-pattern="createSequentialIdGenerator" exercises/01-javascript-core/unit-04-lexical-scope/exercises.test.js
export function createSequentialIdGenerator(prefix) {
  throw new Error("not implemented: createSequentialIdGenerator");
}
