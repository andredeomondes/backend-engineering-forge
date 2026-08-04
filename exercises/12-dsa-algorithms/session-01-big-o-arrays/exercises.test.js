import { test } from "node:test";
import assert from "node:assert/strict";

import {
  sumArray,
  findMax,
  countFrequency,
  hasDuplicate,
  reverseArrayInPlace,
  factorial,
  findFirstDuplicateQuadratic,
  topKFrequent,
} from "./exercises.js";

// --- sumArray ----------------------------------------------------------------

test("sumArray: soma elementos", () => {
  assert.equal(sumArray([1, 2, 3, 4]), 10);
  assert.equal(sumArray([]), 0);
});

// --- findMax -------------------------------------------------------------------

test("findMax: encontra o maior valor", () => {
  assert.equal(findMax([3, 7, 1, 9, 4]), 9);
  assert.equal(findMax([-5, -1, -10]), -1);
});

test("findMax: lança erro em array vazio", () => {
  assert.throws(() => findMax([]), RangeError);
});

// --- countFrequency --------------------------------------------------------------

test("countFrequency: conta ocorrências", () => {
  assert.deepEqual(countFrequency(["a", "b", "a", "c", "b", "a"]), {
    a: 3,
    b: 2,
    c: 1,
  });
});

test("countFrequency: array vazio retorna objeto vazio", () => {
  assert.deepEqual(countFrequency([]), {});
});

// --- hasDuplicate ------------------------------------------------------------------

test("hasDuplicate: detecta duplicado em O(n)", () => {
  assert.equal(hasDuplicate([1, 2, 3, 2]), true);
  assert.equal(hasDuplicate([1, 2, 3]), false);
  assert.equal(hasDuplicate([]), false);
});

// --- reverseArrayInPlace ------------------------------------------------------------

test("reverseArrayInPlace: inverte sem usar .reverse()", () => {
  const arr = [1, 2, 3, 4, 5];
  const result = reverseArrayInPlace(arr);
  assert.deepEqual(result, [5, 4, 3, 2, 1]);
  assert.equal(result, arr, "deve modificar o array original, não criar um novo");
});

test("reverseArrayInPlace: array vazio e de um elemento", () => {
  assert.deepEqual(reverseArrayInPlace([]), []);
  assert.deepEqual(reverseArrayInPlace([1]), [1]);
});

// --- factorial -----------------------------------------------------------------------

test("factorial: casos básicos", () => {
  assert.equal(factorial(0), 1);
  assert.equal(factorial(1), 1);
  assert.equal(factorial(5), 120);
});

test("factorial: rejeita negativo", () => {
  assert.throws(() => factorial(-1), RangeError);
});

// --- findFirstDuplicateQuadratic (já implementada, referência) ------------------------

test("findFirstDuplicateQuadratic: comportamento de referência (não mude este teste)", () => {
  assert.equal(findFirstDuplicateQuadratic([1, 2, 3, 2, 4]), 2);
  assert.equal(findFirstDuplicateQuadratic([1, 2, 3]), null);
});

// --- topKFrequent ----------------------------------------------------------------------

test("topKFrequent: retorna os k elementos mais frequentes, do mais pro menos frequente", () => {
  assert.deepEqual(topKFrequent(["a", "b", "a", "c", "b", "a", "d"], 2), ["a", "b"]);
});

test("topKFrequent: k maior que a quantidade de elementos distintos", () => {
  assert.deepEqual(topKFrequent(["x", "y", "x"], 5).sort(), ["x", "y"]);
});
