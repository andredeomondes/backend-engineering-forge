import { test } from "node:test";
import assert from "node:assert/strict";

import {
  isNonEmptyString,
  describePrimitive,
  formatQuantity,
  greetUser,
  shapeArea,
  shapePerimeter,
  computeFinalPrice,
  formatCaughtError,
  unwrapResult,
  isShape,
  totalArea,
  describePaymentMethod,
  fixShapeAreaBug,
  fixIsPositiveNumberGuard,
  refactorDescribeInput,
  summarizeShapes,
  ValidationError,
} from "./exercises.ts";

// --- isNonEmptyString -------------------------------------------------------

test("isNonEmptyString: aceita string não vazia", () => {
  assert.equal(isNonEmptyString("olá"), true);
});

test("isNonEmptyString: rejeita string vazia e não-strings", () => {
  assert.equal(isNonEmptyString(""), false);
  assert.equal(isNonEmptyString(42), false);
  assert.equal(isNonEmptyString(null), false);
  assert.equal(isNonEmptyString(undefined), false);
});

// --- describePrimitive -------------------------------------------------------

test("describePrimitive: descreve string, number e boolean", () => {
  assert.equal(describePrimitive("abc"), 'string: "abc"');
  assert.equal(describePrimitive(42), "number: 42");
  assert.equal(describePrimitive(true), "boolean: true");
});

// --- formatQuantity -------------------------------------------------------

test("formatQuantity: trata o literal 'unlimited' separadamente", () => {
  assert.equal(formatQuantity("unlimited"), "ilimitado");
  assert.equal(formatQuantity(5), "5 unidades");
  assert.equal(formatQuantity(0), "0 unidades");
});

// --- greetUser -------------------------------------------------------

test("greetUser: cumprimenta pelo nome quando presente", () => {
  assert.equal(greetUser("Ana"), "Olá, Ana!");
});

test("greetUser: trata null, undefined e string vazia como visitante", () => {
  assert.equal(greetUser(null), "Olá, visitante!");
  assert.equal(greetUser(undefined), "Olá, visitante!");
  assert.equal(greetUser(""), "Olá, visitante!");
});

// --- shapeArea -------------------------------------------------------

test("shapeArea: calcula área de cada variante de Shape", () => {
  assert.equal(shapeArea({ kind: "circle", radius: 2 }), Math.PI * 4);
  assert.equal(shapeArea({ kind: "square", side: 3 }), 9);
  assert.equal(shapeArea({ kind: "rectangle", width: 4, height: 5 }), 20);
});

// --- shapePerimeter -------------------------------------------------------

test("shapePerimeter: calcula perímetro de cada variante de Shape", () => {
  assert.equal(shapePerimeter({ kind: "circle", radius: 2 }), 2 * Math.PI * 2);
  assert.equal(shapePerimeter({ kind: "square", side: 3 }), 12);
  assert.equal(
    shapePerimeter({ kind: "rectangle", width: 4, height: 5 }),
    18,
  );
});

// --- computeFinalPrice -------------------------------------------------------

test("computeFinalPrice: retorna preço cheio sem desconto", () => {
  assert.equal(computeFinalPrice({ name: "Caneca", price: 20 }), 20);
});

test("computeFinalPrice: aplica desconto quando presente", () => {
  assert.equal(
    computeFinalPrice({ name: "Caneca", price: 20, discountPercent: 25 }),
    15,
  );
});

// --- formatCaughtError -------------------------------------------------------

test("formatCaughtError: distingue ValidationError, Error comum e valor desconhecido", () => {
  assert.equal(
    formatCaughtError(new ValidationError("campo obrigatório")),
    "Erro de validação: campo obrigatório",
  );
  assert.equal(
    formatCaughtError(new Error("falhou")),
    "Erro: falhou",
  );
  assert.equal(formatCaughtError("boom"), "Erro desconhecido: boom");
});

// --- unwrapResult -------------------------------------------------------

test("unwrapResult: retorna o value quando ok", () => {
  assert.equal(unwrapResult<number>({ ok: true, value: 42 }), 42);
});

test("unwrapResult: lança com a mensagem de erro quando não ok", () => {
  assert.throws(
    () => unwrapResult<number>({ ok: false, error: "falhou feio" }),
    /falhou feio/,
  );
});

// --- isShape -------------------------------------------------------

test("isShape: aceita formas válidas de cada variante", () => {
  assert.equal(isShape({ kind: "circle", radius: 1 }), true);
  assert.equal(isShape({ kind: "square", side: 1 }), true);
  assert.equal(isShape({ kind: "rectangle", width: 1, height: 2 }), true);
});

test("isShape: rejeita objetos malformados e valores não-objeto", () => {
  assert.equal(isShape({ kind: "circle", radius: "1" }), false);
  assert.equal(isShape({ kind: "triangle", side: 1 }), false);
  assert.equal(isShape({ kind: "square" }), false);
  assert.equal(isShape(null), false);
  assert.equal(isShape("circle"), false);
  assert.equal(isShape(42), false);
});

// --- totalArea -------------------------------------------------------

test("totalArea: soma apenas os valores que são Shape válidos", () => {
  const values: unknown[] = [
    { kind: "square", side: 2 },
    { kind: "not-a-shape" },
    { kind: "circle", radius: 1 },
    "não é uma forma",
    { kind: "rectangle", width: 2, height: 3 },
  ];
  assert.equal(totalArea(values), 4 + Math.PI + 6);
});

test("totalArea: retorna 0 quando não há formas válidas", () => {
  assert.equal(totalArea(["a", 1, null]), 0);
});

// --- describePaymentMethod -------------------------------------------------------

test("describePaymentMethod: descreve os três métodos", () => {
  assert.equal(describePaymentMethod("CASH"), "Dinheiro");
  assert.equal(describePaymentMethod("CARD"), "Cartão");
  assert.equal(describePaymentMethod("PIX"), "Pix");
});

// --- fixShapeAreaBug -------------------------------------------------------

test("fixShapeAreaBug: calcula área de retângulo corretamente", () => {
  assert.equal(fixShapeAreaBug({ kind: "rectangle", width: 4, height: 5 }), 20);
  assert.equal(fixShapeAreaBug({ kind: "square", side: 3 }), 9);
});

// --- fixIsPositiveNumberGuard -------------------------------------------------------

test("fixIsPositiveNumberGuard: aceita apenas números positivos", () => {
  assert.equal(fixIsPositiveNumberGuard(5), true);
  assert.equal(fixIsPositiveNumberGuard(0), false);
  assert.equal(fixIsPositiveNumberGuard(-3), false);
  assert.equal(fixIsPositiveNumberGuard("5"), false);
});

// --- refactorDescribeInput -------------------------------------------------------

test("refactorDescribeInput: identifica cada tipo suportado", () => {
  assert.equal(refactorDescribeInput("abc"), 'string: "abc"');
  assert.equal(refactorDescribeInput(42), "number: 42");
  assert.equal(refactorDescribeInput(true), "boolean: true");
  assert.equal(refactorDescribeInput([1, 2, 3]), "array: 3 itens");
  assert.equal(refactorDescribeInput(null), "null");
  assert.equal(refactorDescribeInput({}), "desconhecido");
});

// --- summarizeShapes -------------------------------------------------------

test("summarizeShapes: soma área, perímetro e acha o kind mais comum", () => {
  const summary = summarizeShapes([
    { kind: "square", side: 2 },
    { kind: "square", side: 3 },
    { kind: "circle", radius: 1 },
  ]);
  assert.equal(summary.totalArea, 4 + 9 + Math.PI);
  assert.equal(summary.totalPerimeter, 8 + 12 + 2 * Math.PI);
  assert.equal(summary.mostCommonKind, "square");
});

test("summarizeShapes: lança em lista vazia", () => {
  assert.throws(() => summarizeShapes([]), RangeError);
});
