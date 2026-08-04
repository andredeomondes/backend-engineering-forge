import { test } from "node:test";
import assert from "node:assert/strict";

import {
  sum,
  repeatString,
  isEven,
  formatPriceFromCents,
  sumNumberArray,
  joinWords,
  getFirstAndLast,
  createPoint,
  distanceBetween,
  describeProduct,
  parseCoordinatePair,
  mergeTuples,
  fixAverageCalculation,
  fixTupleOrderBug,
  refactorPointDistance,
  summarizeInventory,
} from "./exercises.ts";

// --- sum --------------------------------------------------------------

test("sum: soma dois números", () => {
  assert.equal(sum(2, 3), 5);
  assert.equal(sum(-2, 2), 0);
});

// --- repeatString -------------------------------------------------------

test("repeatString: repete a string N vezes", () => {
  assert.equal(repeatString("ab", 3), "ababab");
  assert.equal(repeatString("x", 0), "");
});

// --- isEven -------------------------------------------------------------

test("isEven: identifica pares e ímpares", () => {
  assert.equal(isEven(4), true);
  assert.equal(isEven(7), false);
  assert.equal(isEven(0), true);
});

// --- formatPriceFromCents -----------------------------------------------

test("formatPriceFromCents: formata centavos como preço", () => {
  assert.equal(formatPriceFromCents(1234), "R$ 12.34");
  assert.equal(formatPriceFromCents(5), "R$ 0.05");
  assert.equal(formatPriceFromCents(0), "R$ 0.00");
});

// --- sumNumberArray -------------------------------------------------------

test("sumNumberArray: soma todos os elementos", () => {
  assert.equal(sumNumberArray([1, 2, 3]), 6);
  assert.equal(sumNumberArray([]), 0);
});

// --- joinWords -------------------------------------------------------------

test("joinWords: junta strings com separador", () => {
  assert.equal(joinWords(["a", "b", "c"], "-"), "a-b-c");
  assert.equal(joinWords(["only"], "-"), "only");
  assert.equal(joinWords([], "-"), "");
});

// --- getFirstAndLast -------------------------------------------------------

test("getFirstAndLast: retorna tupla [primeiro, último]", () => {
  assert.deepEqual(getFirstAndLast(["a", "b", "c"]), ["a", "c"]);
  assert.deepEqual(getFirstAndLast(["only"]), ["only", "only"]);
});

test("getFirstAndLast: lança em array vazio", () => {
  assert.throws(() => getFirstAndLast([]), RangeError);
});

// --- createPoint -------------------------------------------------------------

test("createPoint: retorna tupla [x, y]", () => {
  assert.deepEqual(createPoint(3, 4), [3, 4]);
});

// --- distanceBetween -------------------------------------------------------------

test("distanceBetween: distância euclidiana", () => {
  assert.equal(distanceBetween([0, 0], [3, 4]), 5);
  assert.equal(distanceBetween([1, 1], [1, 1]), 0);
});

// --- describeProduct -------------------------------------------------------------

test("describeProduct: descreve produto disponível e indisponível", () => {
  assert.equal(
    describeProduct({ name: "Caneca", price: 19.9, inStock: true }),
    "Caneca: R$ 19.90 (disponível)",
  );
  assert.equal(
    describeProduct({ name: "Caneca", price: 19.9, inStock: false }),
    "Caneca: R$ 19.90 (indisponível)",
  );
});

// --- parseCoordinatePair -------------------------------------------------------------

test("parseCoordinatePair: parseia string válida", () => {
  assert.deepEqual(parseCoordinatePair("3,4"), [3, 4]);
  assert.deepEqual(parseCoordinatePair("-1,2.5"), [-1, 2.5]);
});

test("parseCoordinatePair: retorna null em entradas inválidas", () => {
  assert.equal(parseCoordinatePair("abc"), null);
  assert.equal(parseCoordinatePair("3"), null);
  assert.equal(parseCoordinatePair("3,4,5"), null);
  assert.equal(parseCoordinatePair(""), null);
});

// --- mergeTuples -------------------------------------------------------------

test("mergeTuples: junta e ordena por segundo elemento", () => {
  assert.deepEqual(mergeTuples(["b", 2], ["a", 1]), [
    ["a", 1],
    ["b", 2],
  ]);
});

// --- fixAverageCalculation -------------------------------------------------------------

test("fixAverageCalculation: calcula média corretamente", () => {
  assert.equal(fixAverageCalculation([10, 20, 30]), 20);
  assert.equal(fixAverageCalculation([5]), 5);
});

test("fixAverageCalculation: lança em lista vazia", () => {
  assert.throws(() => fixAverageCalculation([]));
});

// --- fixTupleOrderBug -------------------------------------------------------------

test("fixTupleOrderBug: mensagem na ordem correta", () => {
  assert.equal(fixTupleOrderBug(["erros", 3]), "erros: 3");
});

// --- refactorPointDistance -------------------------------------------------------------

test("refactorPointDistance: mesmo resultado que a versão original", () => {
  assert.equal(refactorPointDistance([0, 0], [3, 4]), 5);
  assert.equal(refactorPointDistance([2, 2], [2, 2]), 0);
});

// --- summarizeInventory -------------------------------------------------------------

test("summarizeInventory: resume estoque", () => {
  const summary = summarizeInventory([
    { name: "Caneca", price: 10, quantity: 2 },
    { name: "Notebook", price: 3000, quantity: 1 },
    { name: "Caderno", price: 5, quantity: 4 },
  ]);
  assert.deepEqual(summary, {
    totalItems: 7,
    totalValue: 3040,
    mostExpensive: "Notebook",
  });
});

test("summarizeInventory: lança em lista vazia", () => {
  assert.throws(() => summarizeInventory([]), RangeError);
});
