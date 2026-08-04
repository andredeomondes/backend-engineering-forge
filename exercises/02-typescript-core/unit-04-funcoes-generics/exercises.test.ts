import { test } from "node:test";
import assert from "node:assert/strict";

import {
  identity,
  firstOf,
  lastOf,
  wrapInArray,
  createBox,
  pair,
  pluck,
  applyFn,
  mapArray,
  findByKey,
  createStack,
  doubleValue,
  combineValues,
  mergeUnique,
  maxNumber,
  maxString,
  groupBy,
} from "./exercises.ts";

// --- identity --------------------------------------------------------

test("identity: retorna o mesmo valor, preservando o tipo", () => {
  assert.equal(identity(5), 5);
  assert.equal(identity("hello"), "hello");
  assert.deepEqual(identity([1, 2, 3]), [1, 2, 3]);
});

// --- firstOf -------------------------------------------------------------

test("firstOf: retorna o primeiro elemento", () => {
  assert.equal(firstOf([1, 2, 3]), 1);
  assert.equal(firstOf(["a", "b"]), "a");
});

test("firstOf: retorna undefined em array vazio", () => {
  assert.equal(firstOf([]), undefined);
});

// --- lastOf -------------------------------------------------------------

test("lastOf: retorna o último elemento", () => {
  assert.equal(lastOf([1, 2, 3]), 3);
  assert.equal(lastOf(["a", "b"]), "b");
});

test("lastOf: retorna undefined em array vazio", () => {
  assert.equal(lastOf([]), undefined);
});

// --- wrapInArray -------------------------------------------------------------

test("wrapInArray: envolve o valor em um array de um elemento", () => {
  assert.deepEqual(wrapInArray(5), [5]);
  assert.deepEqual(wrapInArray("x"), ["x"]);
});

// --- createBox -------------------------------------------------------------

test("createBox: cria um Box com o valor informado", () => {
  assert.deepEqual(createBox(42), { value: 42 });
  assert.deepEqual(createBox("hi"), { value: "hi" });
});

// --- pair -------------------------------------------------------------

test("pair: retorna uma tupla [A, B]", () => {
  assert.deepEqual(pair(1, "a"), [1, "a"]);
  assert.deepEqual(pair(true, [1, 2]), [true, [1, 2]]);
});

// --- pluck -------------------------------------------------------------

test("pluck: extrai o valor de uma propriedade do objeto", () => {
  const obj = { name: "Ana", age: 30 };
  assert.equal(pluck(obj, "name"), "Ana");
  assert.equal(pluck(obj, "age"), 30);
});

// --- applyFn -------------------------------------------------------------

test("applyFn: aplica a função sobre o valor", () => {
  assert.equal(
    applyFn(5, (x) => x * 2),
    10,
  );
  assert.equal(
    applyFn("hello", (x) => x.length),
    5,
  );
});

// --- mapArray -------------------------------------------------------------

test("mapArray: transforma cada elemento com a função", () => {
  assert.deepEqual(
    mapArray([1, 2, 3], (x) => x * 2),
    [2, 4, 6],
  );
  assert.deepEqual(
    mapArray(["a", "bb"], (x) => x.length),
    [1, 2],
  );
});

test("mapArray: array vazio retorna array vazio", () => {
  assert.deepEqual(
    mapArray([], (x) => x),
    [],
  );
});

// --- findByKey -------------------------------------------------------------

test("findByKey: encontra o item cujo campo bate com o valor", () => {
  const items = [
    { id: 1, name: "Ana" },
    { id: 2, name: "Bruno" },
  ];
  assert.deepEqual(findByKey(items, "id", 2), { id: 2, name: "Bruno" });
  assert.deepEqual(findByKey(items, "name", "Ana"), { id: 1, name: "Ana" });
});

test("findByKey: retorna undefined se não encontrar", () => {
  const items = [{ id: 1, name: "Ana" }];
  assert.equal(findByKey(items, "id", 99), undefined);
});

// --- createStack -------------------------------------------------------------

test("createStack: push, pop, peek e size funcionam em ordem LIFO", () => {
  const stack = createStack<number>();
  assert.equal(stack.size(), 0);
  assert.equal(stack.peek(), undefined);
  stack.push(1);
  stack.push(2);
  stack.push(3);
  assert.equal(stack.size(), 3);
  assert.equal(stack.peek(), 3);
  assert.equal(stack.pop(), 3);
  assert.equal(stack.pop(), 2);
  assert.equal(stack.size(), 1);
});

test("createStack: pop em pilha vazia retorna undefined", () => {
  const stack = createStack<string>();
  assert.equal(stack.pop(), undefined);
});

// --- doubleValue -------------------------------------------------------------

test("doubleValue: dobra números e duplica strings", () => {
  assert.equal(doubleValue(3), 6);
  assert.equal(doubleValue(-5), -10);
  assert.equal(doubleValue("ab"), "abab");
  assert.equal(doubleValue(""), "");
});

// --- combineValues -------------------------------------------------------------

test("combineValues: soma números e concatena strings", () => {
  assert.equal(combineValues(2, 3), 5);
  assert.equal(combineValues("a", "b"), "ab");
});

// --- mergeUnique -------------------------------------------------------------

test("mergeUnique: junta arrays removendo ids duplicados (mantém a primeira ocorrência)", () => {
  const a = [{ id: 1, name: "a" }];
  const b = [
    { id: 1, name: "b" },
    { id: 2, name: "c" },
  ];
  assert.deepEqual(mergeUnique(a, b), [
    { id: 1, name: "a" },
    { id: 2, name: "c" },
  ]);
});

// --- maxNumber -------------------------------------------------------------

test("maxNumber: retorna o maior número", () => {
  assert.equal(maxNumber([3, 7, 2]), 7);
  assert.equal(maxNumber([-5, -1, -10]), -1);
  assert.equal(maxNumber([4]), 4);
});

// --- maxString -------------------------------------------------------------

test("maxString: retorna a maior string (ordem lexicográfica)", () => {
  assert.equal(maxString(["b", "a", "c"]), "c");
  assert.equal(maxString(["banana"]), "banana");
});

// --- groupBy -------------------------------------------------------------

test("groupBy: agrupa itens pelo resultado da função de chave", () => {
  const people = [
    { name: "Ana", role: "eng" },
    { name: "Bruno", role: "design" },
    { name: "Carla", role: "eng" },
  ];
  assert.deepEqual(
    groupBy(people, (p) => p.role),
    {
      eng: [
        { name: "Ana", role: "eng" },
        { name: "Carla", role: "eng" },
      ],
      design: [{ name: "Bruno", role: "design" }],
    },
  );
});

test("groupBy: aceita chave numérica", () => {
  assert.deepEqual(
    groupBy([1, 2, 3, 4, 5], (n) => n % 2),
    {
      1: [1, 3, 5],
      0: [2, 4],
    },
  );
});

test("groupBy: array vazio retorna objeto vazio", () => {
  assert.deepEqual(
    groupBy([], (x: number) => x),
    {},
  );
});
