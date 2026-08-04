import { test } from "node:test";
import assert from "node:assert/strict";

import {
  getProperty,
  getPropertyNames,
  pick,
  omit,
  sumRecordValues,
  makeReadonly,
  HTTP_STATUS,
  describeStatus,
  applyPatch,
  nullifyFields,
  finalizeOrder,
  assertPresent,
  getCity,
  applyProfileUpdate,
  sumFieldValues,
  buildUserVariants,
  ROLE,
  buildPermissionMatrix,
} from "./exercises.ts";

// --- getProperty --------------------------------------------------------

test("getProperty: acessa uma propriedade existente pelo nome", () => {
  const product = { name: "Caneca", price: 19.9 };
  assert.equal(getProperty(product, "name"), "Caneca");
  assert.equal(getProperty(product, "price"), 19.9);
});

// --- getPropertyNames -------------------------------------------------------

test("getPropertyNames: retorna as chaves do objeto", () => {
  assert.deepEqual(getPropertyNames({ a: 1, b: 2 }), ["a", "b"]);
  assert.deepEqual(getPropertyNames({}), []);
});

// --- pick -------------------------------------------------------------

test("pick: retorna apenas as chaves selecionadas", () => {
  const product = { name: "Caneca", price: 19.9, inStock: true };
  assert.deepEqual(pick(product, ["name", "price"]), {
    name: "Caneca",
    price: 19.9,
  });
});

test("pick: com lista vazia de chaves retorna objeto vazio", () => {
  assert.deepEqual(pick({ a: 1, b: 2 }, []), {});
});

// --- omit -------------------------------------------------------------

test("omit: remove as chaves selecionadas", () => {
  const product = { name: "Caneca", price: 19.9, inStock: true };
  assert.deepEqual(omit(product, ["inStock"]), {
    name: "Caneca",
    price: 19.9,
  });
});

test("omit: com lista vazia de chaves retorna cópia completa", () => {
  assert.deepEqual(omit({ a: 1, b: 2 }, []), { a: 1, b: 2 });
});

// --- sumRecordValues -------------------------------------------------------

test("sumRecordValues: soma todos os valores de um Record", () => {
  assert.equal(sumRecordValues({ ana: 10, bruno: 20, carla: 5 }), 35);
  assert.equal(sumRecordValues({}), 0);
});

// --- makeReadonly -------------------------------------------------------

test("makeReadonly: retorna um objeto congelado com os mesmos valores", () => {
  const original = { name: "Ana", age: 30 };
  const frozen = makeReadonly(original);
  assert.deepEqual(frozen, { name: "Ana", age: 30 });
  assert.equal(Object.isFrozen(frozen), true);
});

test("makeReadonly: tentativa de mutação não altera o valor", () => {
  const frozen = makeReadonly({ count: 1 });
  assert.throws(() => {
    "use strict";
    (frozen as { count: number }).count = 2;
  });
  assert.equal(frozen.count, 1);
});

// --- describeStatus -------------------------------------------------------

test("describeStatus: descreve códigos HTTP conhecidos", () => {
  assert.equal(describeStatus(HTTP_STATUS.OK), "OK");
  assert.equal(describeStatus(HTTP_STATUS.CREATED), "Created");
  assert.equal(describeStatus(HTTP_STATUS.NOT_FOUND), "Not Found");
  assert.equal(describeStatus(HTTP_STATUS.SERVER_ERROR), "Server Error");
});

// --- applyPatch -------------------------------------------------------

test("applyPatch: combina original com patch", () => {
  const original = { name: "Ana", age: 30 };
  assert.deepEqual(applyPatch(original, { age: 31 }), {
    name: "Ana",
    age: 31,
  });
});

test("applyPatch: patch vazio mantém o original", () => {
  const original = { name: "Ana", age: 30 };
  assert.deepEqual(applyPatch(original, {}), original);
});

// --- nullifyFields -------------------------------------------------------

test("nullifyFields: transforma os campos pedidos em null", () => {
  const user = { name: "Ana", age: 30, city: "SP" };
  assert.deepEqual(nullifyFields(user, ["age"]), {
    name: "Ana",
    age: null,
    city: "SP",
  });
});

test("nullifyFields: com múltiplas chaves", () => {
  const user = { name: "Ana", age: 30, city: "SP" };
  assert.deepEqual(nullifyFields(user, ["age", "city"]), {
    name: "Ana",
    age: null,
    city: null,
  });
});

// --- finalizeOrder -------------------------------------------------------

test("finalizeOrder: usa valores do draft quando presentes", () => {
  const result = finalizeOrder(
    { id: "o1" },
    { id: "fallback-id", total: 0, status: "pending" },
  );
  assert.deepEqual(result, { id: "o1", total: 0, status: "pending" });
});

test("finalizeOrder: preenche tudo com fallback quando draft é vazio", () => {
  const result = finalizeOrder(
    {},
    { id: "fallback-id", total: 100, status: "pending" },
  );
  assert.deepEqual(result, {
    id: "fallback-id",
    total: 100,
    status: "pending",
  });
});

// --- assertPresent -------------------------------------------------------

test("assertPresent: retorna o valor quando presente", () => {
  assert.equal(assertPresent(5), 5);
  assert.equal(assertPresent("ok"), "ok");
});

test("assertPresent: lança TypeError para null ou undefined", () => {
  assert.throws(() => assertPresent(null), TypeError);
  assert.throws(() => assertPresent(undefined), TypeError);
});

// --- getCity -------------------------------------------------------

test("getCity: retorna a cidade do endereço do usuário", () => {
  const user = {
    name: "Ana",
    address: { street: "Rua A", city: "São Paulo", zipCode: "00000-000" },
  };
  assert.equal(getCity(user), "São Paulo");
});

// --- applyProfileUpdate -------------------------------------------------------

test("applyProfileUpdate: atualiza apenas os campos definidos no patch", () => {
  const current = { name: "Ana", email: "ana@example.com" };
  const result = applyProfileUpdate(current, { email: "nova@example.com" });
  assert.deepEqual(result, { name: "Ana", email: "nova@example.com" });
});

test("applyProfileUpdate: campo explicitamente undefined não apaga o valor original", () => {
  const current = { name: "Ana", email: "ana@example.com" };
  const result = applyProfileUpdate(current, { email: undefined });
  assert.deepEqual(result, { name: "Ana", email: "ana@example.com" });
});

// --- sumFieldValues -------------------------------------------------------

test("sumFieldValues: soma apenas os campos pedidos", () => {
  const scores = { math: 10, physics: 20, art: 100 };
  assert.equal(sumFieldValues(scores, ["math", "physics"]), 30);
});

test("sumFieldValues: com lista vazia retorna 0", () => {
  const scores = { math: 10, physics: 20 };
  assert.equal(sumFieldValues(scores, []), 0);
});

// --- buildUserVariants -------------------------------------------------------

test("buildUserVariants: gera draft, full e locked a partir do usuário", () => {
  const user = { name: "Ana", email: "ana@example.com", age: 30 };
  const variants = buildUserVariants(user);
  assert.deepEqual(variants.draft, user);
  assert.deepEqual(variants.full, user);
  assert.deepEqual(variants.locked, user);
  assert.equal(Object.isFrozen(variants.locked), true);
});

// --- buildPermissionMatrix -------------------------------------------------------

test("buildPermissionMatrix: retorna a matriz padrão sem overrides", () => {
  assert.deepEqual(buildPermissionMatrix({}), {
    [ROLE.ADMIN]: { read: true, write: true, delete: true },
    [ROLE.EDITOR]: { read: true, write: true, delete: false },
    [ROLE.VIEWER]: { read: true, write: false, delete: false },
  });
});

test("buildPermissionMatrix: aplica overrides parciais por papel", () => {
  const result = buildPermissionMatrix({
    [ROLE.VIEWER]: { write: true },
  });
  assert.deepEqual(result[ROLE.VIEWER], {
    read: true,
    write: true,
    delete: false,
  });
  assert.deepEqual(result[ROLE.ADMIN], {
    read: true,
    write: true,
    delete: true,
  });
});

test("buildPermissionMatrix: campo undefined em override não sobrescreve o padrão", () => {
  const result = buildPermissionMatrix({
    [ROLE.EDITOR]: { delete: undefined },
  });
  assert.deepEqual(result[ROLE.EDITOR], {
    read: true,
    write: true,
    delete: false,
  });
});
