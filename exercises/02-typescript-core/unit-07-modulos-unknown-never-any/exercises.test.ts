import { test } from "node:test";
import assert from "node:assert/strict";

import {
  isString,
  isFiniteNumber,
  isNonEmptyString,
  isStringArray,
  describeUnknown,
  assertNever,
  throwNotImplemented,
  parseJsonOrThrow,
  parseUserPayload,
  isFeatureEnabled,
  sumUnknownArray,
  shapeLabel,
  parseAgeUnknown,
  isValidEmailUnknown,
  refactorDescribeUnknownRecord,
  validateAndSummarizeOrders,
} from "./exercises.ts";

// --- isString ----------------------------------------------------------

test("isString: aceita strings", () => {
  assert.equal(isString("hello"), true);
  assert.equal(isString(""), true);
});

test("isString: rejeita valores que não são string", () => {
  assert.equal(isString(42), false);
  assert.equal(isString(null), false);
  assert.equal(isString(undefined), false);
  assert.equal(isString(["a"]), false);
});

// --- isFiniteNumber -------------------------------------------------------

test("isFiniteNumber: aceita números finitos", () => {
  assert.equal(isFiniteNumber(0), true);
  assert.equal(isFiniteNumber(-3.5), true);
});

test("isFiniteNumber: rejeita NaN, Infinity e não-números", () => {
  assert.equal(isFiniteNumber(NaN), false);
  assert.equal(isFiniteNumber(Infinity), false);
  assert.equal(isFiniteNumber(-Infinity), false);
  assert.equal(isFiniteNumber("5"), false);
  assert.equal(isFiniteNumber(null), false);
});

// --- isNonEmptyString -------------------------------------------------------

test("isNonEmptyString: aceita strings com conteúdo", () => {
  assert.equal(isNonEmptyString("ok"), true);
  assert.equal(isNonEmptyString("  ok  "), true);
});

test("isNonEmptyString: rejeita vazia, só espaços e não-string", () => {
  assert.equal(isNonEmptyString(""), false);
  assert.equal(isNonEmptyString("   "), false);
  assert.equal(isNonEmptyString(42), false);
  assert.equal(isNonEmptyString(null), false);
});

// --- isStringArray -------------------------------------------------------

test("isStringArray: aceita array só de strings (incluindo vazio)", () => {
  assert.equal(isStringArray(["a", "b"]), true);
  assert.equal(isStringArray([]), true);
});

test("isStringArray: rejeita array misto e não-array", () => {
  assert.equal(isStringArray(["a", 2]), false);
  assert.equal(isStringArray("a"), false);
  assert.equal(isStringArray(null), false);
  assert.equal(isStringArray(undefined), false);
});

// --- describeUnknown -------------------------------------------------------

test("describeUnknown: identifica cada formato", () => {
  assert.equal(describeUnknown("x"), "string");
  assert.equal(describeUnknown(1), "number");
  assert.equal(describeUnknown(true), "boolean");
  assert.equal(describeUnknown(null), "null");
  assert.equal(describeUnknown(undefined), "undefined");
  assert.equal(describeUnknown([1, 2]), "array");
  assert.equal(describeUnknown({ a: 1 }), "object");
});

// --- assertNever -------------------------------------------------------

test("assertNever: sempre lança com o valor na mensagem", () => {
  // O teste precisa forçar o caminho "impossível" que o TypeScript normalmente
  // bloqueia em tempo de compilação — por isso o cast aqui, só neste ponto.
  assert.throws(() => assertNever("valor-inesperado" as never), /valor-inesperado/);
});

// --- throwNotImplemented -------------------------------------------------------

test("throwNotImplemented: sempre lança com o nome do recurso", () => {
  assert.throws(() => throwNotImplemented("exportar-relatorio"), /exportar-relatorio/);
});

// --- parseJsonOrThrow -------------------------------------------------------

test("parseJsonOrThrow: parseia JSON válido", () => {
  assert.deepEqual(parseJsonOrThrow('{"a":1}'), { a: 1 });
  assert.deepEqual(parseJsonOrThrow("[1,2,3]"), [1, 2, 3]);
});

test("parseJsonOrThrow: lança em JSON inválido com o input na mensagem", () => {
  assert.throws(() => parseJsonOrThrow("{not-json"), /\{not-json/);
});

// --- parseUserPayload -------------------------------------------------------

test("parseUserPayload: aceita payload válido", () => {
  const result = parseUserPayload({
    id: "u1",
    email: "a@b.com",
    age: 30,
  });
  assert.deepEqual(result, { id: "u1", email: "a@b.com", age: 30 });
});

test("parseUserPayload: lança para id inválido", () => {
  assert.throws(() => parseUserPayload({ id: 1, email: "a@b.com", age: 30 }), TypeError);
});

test("parseUserPayload: lança para email sem @", () => {
  assert.throws(
    () => parseUserPayload({ id: "u1", email: "ab.com", age: 30 }),
    TypeError,
  );
});

test("parseUserPayload: lança para age negativa ou não finita", () => {
  assert.throws(() => parseUserPayload({ id: "u1", email: "a@b.com", age: -1 }), TypeError);
  assert.throws(
    () => parseUserPayload({ id: "u1", email: "a@b.com", age: "30" }),
    TypeError,
  );
});

test("parseUserPayload: lança para valor que nem é objeto", () => {
  assert.throws(() => parseUserPayload(null), TypeError);
  assert.throws(() => parseUserPayload("not-an-object"), TypeError);
});

// --- isFeatureEnabled -------------------------------------------------------

test("isFeatureEnabled: retorna false quando o global não foi definido", () => {
  globalThis.__UNIT7_FEATURE_FLAGS__ = undefined;
  assert.equal(isFeatureEnabled("beta"), false);
});

test("isFeatureEnabled: retorna conforme a flag definida", () => {
  globalThis.__UNIT7_FEATURE_FLAGS__ = { beta: true, legacy: false };
  assert.equal(isFeatureEnabled("beta"), true);
  assert.equal(isFeatureEnabled("legacy"), false);
  assert.equal(isFeatureEnabled("inexistente"), false);
  globalThis.__UNIT7_FEATURE_FLAGS__ = undefined;
});

// --- sumUnknownArray -------------------------------------------------------

test("sumUnknownArray: soma quando todos os elementos são números finitos", () => {
  assert.equal(sumUnknownArray([1, 2, 3]), 6);
  assert.equal(sumUnknownArray([]), 0);
});

test("sumUnknownArray: lança com o índice do elemento inválido", () => {
  assert.throws(() => sumUnknownArray([1, "2", 3]), /1/);
  assert.throws(() => sumUnknownArray([NaN]), TypeError);
});

// --- shapeLabel -------------------------------------------------------

test("shapeLabel: traduz cada forma", () => {
  assert.equal(shapeLabel("circle"), "Círculo");
  assert.equal(shapeLabel("square"), "Quadrado");
  assert.equal(shapeLabel("triangle"), "Triângulo");
});

// --- parseAgeUnknown -------------------------------------------------------

test("parseAgeUnknown: aceita idade válida", () => {
  assert.equal(parseAgeUnknown(25), 25);
  assert.equal(parseAgeUnknown(0), 0);
});

test("parseAgeUnknown: lança para valores inválidos", () => {
  assert.throws(() => parseAgeUnknown("25"));
  assert.throws(() => parseAgeUnknown(-1));
  assert.throws(() => parseAgeUnknown(200));
  assert.throws(() => parseAgeUnknown(null));
  assert.throws(() => parseAgeUnknown(undefined));
});

// --- isValidEmailUnknown -------------------------------------------------------

test("isValidEmailUnknown: aceita e-mail com formato básico válido", () => {
  assert.equal(isValidEmailUnknown("a@b.com"), true);
});

test("isValidEmailUnknown: rejeita string sem @ e não-string", () => {
  assert.equal(isValidEmailUnknown("naoehemail"), false);
  assert.equal(isValidEmailUnknown("@semUsuario"), false);
  assert.equal(isValidEmailUnknown("semDominio@"), false);
  assert.equal(isValidEmailUnknown(42), false);
  assert.equal(isValidEmailUnknown(null), false);
});

// --- refactorDescribeUnknownRecord -------------------------------------------------------

test("refactorDescribeUnknownRecord: descreve objeto com id e name", () => {
  assert.equal(refactorDescribeUnknownRecord({ id: "1", name: "Ana" }), "1: Ana");
  assert.equal(refactorDescribeUnknownRecord({ id: 2 }), "2: sem nome");
});

test("refactorDescribeUnknownRecord: lança para valores que não são objeto", () => {
  assert.throws(() => refactorDescribeUnknownRecord(null), TypeError);
  assert.throws(() => refactorDescribeUnknownRecord([1, 2]), TypeError);
  assert.throws(() => refactorDescribeUnknownRecord("x"), TypeError);
});

// --- validateAndSummarizeOrders -------------------------------------------------------

test("validateAndSummarizeOrders: resume pedidos válidos", () => {
  const summary = validateAndSummarizeOrders([
    { id: "o1", status: "pending", total: 10 },
    { id: "o2", status: "shipped", total: 20 },
    { id: "o3", status: "pending", total: 5 },
  ]);
  assert.deepEqual(summary, {
    totalOrders: 3,
    totalValue: 35,
    countByStatus: { pending: 2, shipped: 1, delivered: 0, cancelled: 0 },
  });
});

test("validateAndSummarizeOrders: lança em array vazio", () => {
  assert.throws(() => validateAndSummarizeOrders([]), RangeError);
});

test("validateAndSummarizeOrders: lança para valor que não é array", () => {
  assert.throws(() => validateAndSummarizeOrders({ id: "o1" }), TypeError);
});

test("validateAndSummarizeOrders: lança para status inválido", () => {
  assert.throws(
    () => validateAndSummarizeOrders([{ id: "o1", status: "done", total: 10 }]),
    TypeError,
  );
});

test("validateAndSummarizeOrders: lança para total inválido", () => {
  assert.throws(
    () => validateAndSummarizeOrders([{ id: "o1", status: "pending", total: "10" }]),
    TypeError,
  );
  assert.throws(
    () => validateAndSummarizeOrders([{ id: "o1", status: "pending", total: -5 }]),
    TypeError,
  );
});
