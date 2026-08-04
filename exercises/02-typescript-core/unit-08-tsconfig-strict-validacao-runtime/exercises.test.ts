import { test } from "node:test";
import assert from "node:assert/strict";

import {
  ValidationError,
  NotFoundError,
  validateAge,
  findUserOrThrow,
  describeCaughtError,
  safeJsonParse,
  parsePositiveInteger,
  divide,
  isUserShape,
  parseUserPayload,
  unwrapOrThrow,
  mapResult,
  chainValidations,
  parseConfigFromEnv,
  divideSafe,
  describeThrownValue,
  parseIntOrThrow,
  processBatch,
} from "./exercises.ts";

// --- validateAge ------------------------------------------------------

test("validateAge: não lança para idade válida", () => {
  assert.doesNotThrow(() => validateAge(30));
  assert.doesNotThrow(() => validateAge(0));
  assert.doesNotThrow(() => validateAge(120));
});

test("validateAge: lança ValidationError com campo 'age' para idade inválida", () => {
  assert.throws(() => validateAge(-1), ValidationError);
  assert.throws(() => validateAge(121), ValidationError);
  try {
    validateAge(-5);
    assert.fail("deveria ter lançado");
  } catch (e: unknown) {
    assert.ok(e instanceof ValidationError);
    assert.equal((e as ValidationError).field, "age");
  }
});

// --- findUserOrThrow -------------------------------------------------------

const users = [
  { id: "1", name: "Ana" },
  { id: "2", name: "Bruno" },
];

test("findUserOrThrow: retorna o usuário quando encontrado", () => {
  assert.deepEqual(findUserOrThrow("2", users), { id: "2", name: "Bruno" });
});

test("findUserOrThrow: lança NotFoundError com resourceId quando não encontrado", () => {
  try {
    findUserOrThrow("999", users);
    assert.fail("deveria ter lançado");
  } catch (e: unknown) {
    assert.ok(e instanceof NotFoundError);
    assert.equal((e as NotFoundError).resourceId, "999");
  }
});

// --- describeCaughtError -------------------------------------------------------

test("describeCaughtError: narra ValidationError, Error genérico e valor não-Error", () => {
  assert.equal(
    describeCaughtError(new ValidationError("age", "idade inválida")),
    "campo inválido (age): idade inválida",
  );
  assert.equal(describeCaughtError(new Error("falhou")), "erro: falhou");
  assert.equal(
    describeCaughtError("boom"),
    "valor lançado não é um Error: boom",
  );
});

// --- safeJsonParse -------------------------------------------------------

test("safeJsonParse: retorna Result de sucesso para JSON válido", () => {
  const result = safeJsonParse('{"a":1}');
  assert.deepEqual(result, { ok: true, value: { a: 1 } });
});

test("safeJsonParse: retorna Result de erro para JSON inválido", () => {
  const result = safeJsonParse("{invalid");
  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.equal(typeof result.error, "string");
  }
});

// --- parsePositiveInteger -------------------------------------------------------

test("parsePositiveInteger: aceita inteiros positivos", () => {
  assert.deepEqual(parsePositiveInteger("5"), { ok: true, value: 5 });
});

test("parsePositiveInteger: rejeita negativos, decimais e não-números", () => {
  assert.equal(parsePositiveInteger("-3").ok, false);
  assert.equal(parsePositiveInteger("3.5").ok, false);
  assert.equal(parsePositiveInteger("abc").ok, false);
  assert.equal(parsePositiveInteger("0").ok, false);
});

// --- divide -------------------------------------------------------

test("divide: divide dois números normalmente", () => {
  assert.deepEqual(divide(10, 2), { ok: true, value: 5 });
});

test("divide: retorna Result de erro na divisão por zero (sem lançar)", () => {
  assert.deepEqual(divide(1, 0), { ok: false, error: "divisão por zero" });
});

// --- isUserShape -------------------------------------------------------

test("isUserShape: reconhece o formato correto e rejeita o resto", () => {
  assert.equal(isUserShape({ name: "Ana", age: 30 }), true);
  assert.equal(isUserShape({ name: "Ana" }), false);
  assert.equal(isUserShape(null), false);
  assert.equal(isUserShape("Ana"), false);
  assert.equal(isUserShape({ name: 42, age: 30 }), false);
});

// --- parseUserPayload -------------------------------------------------------

test("parseUserPayload: valida dado externo antes de confiar nele", () => {
  assert.deepEqual(parseUserPayload({ name: "Ana", age: 30 }), {
    ok: true,
    value: { name: "Ana", age: 30 },
  });
  assert.equal(parseUserPayload({ name: "Ana" }).ok, false);
  assert.equal(parseUserPayload(null).ok, false);
  assert.equal(parseUserPayload("Ana").ok, false);
});

// --- unwrapOrThrow -------------------------------------------------------

test("unwrapOrThrow: retorna o valor em caso de sucesso", () => {
  assert.equal(unwrapOrThrow({ ok: true, value: 5 }), 5);
});

test("unwrapOrThrow: lança em caso de erro", () => {
  assert.throws(() => unwrapOrThrow({ ok: false, error: "falhou" }), /falhou/);
});

// --- mapResult -------------------------------------------------------

test("mapResult: aplica a função apenas no caminho de sucesso", () => {
  assert.deepEqual(
    mapResult({ ok: true, value: 2 }, (x: number) => x * 10),
    { ok: true, value: 20 },
  );
  assert.deepEqual(
    mapResult({ ok: false, error: "e" }, (x: number) => x * 10),
    { ok: false, error: "e" },
  );
});

// --- chainValidations -------------------------------------------------------

test("chainValidations: aceita objeto válido", () => {
  assert.deepEqual(chainValidations({ name: "Ana", age: 30 }), {
    ok: true,
    value: { name: "Ana", age: 30 },
  });
});

test("chainValidations: acumula todos os erros encontrados", () => {
  const result = chainValidations({ name: "", age: 200 });
  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.equal(result.error.length, 2);
  }
});

test("chainValidations: entrada que não é objeto vira Result de erro", () => {
  const result = chainValidations(null);
  assert.equal(result.ok, false);
});

// --- parseConfigFromEnv -------------------------------------------------------

test("parseConfigFromEnv: monta config válida a partir de variáveis de ambiente", () => {
  assert.deepEqual(
    parseConfigFromEnv({ PORT: "3000", HOST: "localhost" }),
    { ok: true, value: { port: 3000, host: "localhost" } },
  );
});

test("parseConfigFromEnv: falha quando PORT ou HOST estão ausentes/inválidos", () => {
  assert.equal(parseConfigFromEnv({ HOST: "localhost" }).ok, false);
  assert.equal(parseConfigFromEnv({ PORT: "3000" }).ok, false);
  assert.equal(
    parseConfigFromEnv({ PORT: "abc", HOST: "localhost" }).ok,
    false,
  );
});

// --- divideSafe -------------------------------------------------------

test("divideSafe: divide normalmente", () => {
  assert.deepEqual(divideSafe(10, 2), { ok: true, value: 5 });
});

test("divideSafe: retorna Result de erro em vez de lançar na divisão por zero", () => {
  assert.deepEqual(divideSafe(1, 0), {
    ok: false,
    error: "divisão por zero",
  });
});

// --- describeThrownValue -------------------------------------------------------

test("describeThrownValue: descreve Error normalmente e reporta ausência de erro", () => {
  assert.equal(
    describeThrownValue(() => {
      throw new Error("oops");
    }),
    "erro: oops",
  );
  assert.equal(
    describeThrownValue(() => {}),
    "nenhum erro lançado",
  );
});

test("describeThrownValue: descreve valores lançados que não são Error", () => {
  assert.equal(
    describeThrownValue(() => {
      throw "boom";
    }),
    "erro: boom",
  );
});

// --- parseIntOrThrow -------------------------------------------------------

test("parseIntOrThrow: converte string válida", () => {
  assert.equal(parseIntOrThrow("42"), 42);
});

test("parseIntOrThrow: lança TypeError para entrada inválida", () => {
  assert.throws(() => parseIntOrThrow(""), TypeError);
  assert.throws(() => parseIntOrThrow("4.5"), TypeError);
  assert.throws(() => parseIntOrThrow("abc"), TypeError);
});

// --- processBatch -------------------------------------------------------

test("processBatch: separa sucessos e falhas de uma lista de entradas variadas", () => {
  const result = processBatch(["3", "abc", "10", 5, "-1", "0"]);
  assert.deepEqual(result.successes, [3, 10]);
  assert.equal(result.failures.length, 4);
  assert.equal(result.failures[1], "índice 3: não é uma string");
});
