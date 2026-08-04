import { test } from "node:test";
import assert from "node:assert/strict";

import {
  describeUser,
  getFinalPrice,
  formatAddress,
  rectangleArea,
  describeMembership,
  describeShape,
  combineProfile,
  getStatusMessage,
  sumReadonlyArray,
  renameCityImmutable,
  describePaymentMethod,
  mergeConfigs,
  fixDiscountCalculation,
  fixShapeAreaBug,
  refactorFormatAddress,
  summarizeOrder,
} from "./exercises.ts";

// --- describeUser --------------------------------------------------------

test("describeUser: usuário sem idade", () => {
  assert.equal(
    describeUser({ name: "Ana", email: "ana@example.com" }),
    "Ana <ana@example.com>",
  );
});

test("describeUser: usuário com idade", () => {
  assert.equal(
    describeUser({ name: "Ana", email: "ana@example.com", age: 30 }),
    "Ana, 30 anos <ana@example.com>",
  );
});

// --- getFinalPrice -----------------------------------------------------

test("getFinalPrice: sem desconto retorna preço cheio", () => {
  assert.equal(getFinalPrice({ name: "Caneca", price: 50 }), 50);
});

test("getFinalPrice: aplica percentual de desconto", () => {
  assert.equal(
    getFinalPrice({ name: "Caneca", price: 100, discountPercent: 10 }),
    90,
  );
});

// --- formatAddress -------------------------------------------------------

test("formatAddress: formata endereço", () => {
  assert.equal(
    formatAddress({ street: "Rua A", city: "Recife", zipCode: "50000-000" }),
    "Rua A, Recife - 50000-000",
  );
});

// --- rectangleArea -------------------------------------------------------

test("rectangleArea: calcula área", () => {
  assert.equal(rectangleArea({ width: 3, height: 4 }), 12);
});

// --- describeMembership ---------------------------------------------------

test("describeMembership: descreve cada tier", () => {
  assert.equal(
    describeMembership({ name: "Ana", tier: "free" }),
    "Ana: plano gratuito",
  );
  assert.equal(
    describeMembership({ name: "Beto", tier: "premium" }),
    "Beto: plano premium",
  );
  assert.equal(
    describeMembership({ name: "Caio", tier: "enterprise" }),
    "Caio: plano enterprise",
  );
});

// --- describeShape -------------------------------------------------------

test("describeShape: descreve círculo, quadrado e retângulo", () => {
  assert.equal(
    describeShape({ kind: "circle", radius: 2 }),
    `círculo com área ${(Math.PI * 4).toFixed(2)}`,
  );
  assert.equal(describeShape({ kind: "square", side: 3 }), "quadrado com área 9.00");
  assert.equal(
    describeShape({ kind: "rectangle", width: 3, height: 5 }),
    "retângulo com área 15.00",
  );
});

// --- combineProfile -------------------------------------------------------

test("combineProfile: combina dados pessoais e de contato", () => {
  assert.deepEqual(
    combineProfile(
      { name: "Ana", birthYear: 1995 },
      { email: "ana@example.com", phone: "9999-0000" },
    ),
    {
      name: "Ana",
      birthYear: 1995,
      email: "ana@example.com",
      phone: "9999-0000",
    },
  );
});

// --- getStatusMessage -------------------------------------------------------

test("getStatusMessage: mensagem por status", () => {
  assert.equal(getStatusMessage("pending"), "Aguardando processamento");
  assert.equal(getStatusMessage("active"), "Em andamento");
  assert.equal(getStatusMessage("cancelled"), "Cancelado");
});

// --- sumReadonlyArray -------------------------------------------------------

test("sumReadonlyArray: soma sem mutar o array original", () => {
  const values: readonly number[] = [1, 2, 3];
  assert.equal(sumReadonlyArray(values), 6);
  assert.deepEqual(values, [1, 2, 3]);
});

test("sumReadonlyArray: array vazio soma 0", () => {
  assert.equal(sumReadonlyArray([]), 0);
});

// --- renameCityImmutable -------------------------------------------------------

test("renameCityImmutable: retorna novo objeto sem mutar o original", () => {
  const original: Readonly<{ street: string; city: string; zipCode: string }> = {
    street: "Rua A",
    city: "Recife",
    zipCode: "50000-000",
  };
  const updated = renameCityImmutable(original, "Olinda");
  assert.equal(updated.city, "Olinda");
  assert.equal(updated.street, "Rua A");
  assert.equal(original.city, "Recife");
});

// --- describePaymentMethod -------------------------------------------------------

test("describePaymentMethod: descreve cartão de crédito", () => {
  assert.equal(
    describePaymentMethod({ cardNumber: "4111111111111111", expiry: "12/28" }),
    "Cartão terminado em 1111",
  );
});

test("describePaymentMethod: descreve transferência bancária", () => {
  assert.equal(
    describePaymentMethod({ iban: "BR1234567890", bankName: "Banco X" }),
    "Transferência via Banco X",
  );
});

// --- mergeConfigs -------------------------------------------------------

test("mergeConfigs: sobrescreve apenas as chaves informadas", () => {
  assert.deepEqual(mergeConfigs({ timeout: 1000, retries: 3 }, { retries: 5 }), {
    timeout: 1000,
    retries: 5,
  });
});

test("mergeConfigs: mantém base quando não há overrides", () => {
  assert.deepEqual(mergeConfigs({ timeout: 1000, retries: 3 }, {}), {
    timeout: 1000,
    retries: 3,
  });
});

// --- fixDiscountCalculation -------------------------------------------------------

test("fixDiscountCalculation: aplica desconto quando presente", () => {
  assert.equal(
    fixDiscountCalculation({ name: "X", price: 100, discountPercent: 10 }),
    90,
  );
});

test("fixDiscountCalculation: sem desconto retorna preço cheio, não NaN", () => {
  assert.equal(fixDiscountCalculation({ name: "Y", price: 50 }), 50);
});

// --- fixShapeAreaBug -------------------------------------------------------

test("fixShapeAreaBug: calcula área correta para cada forma", () => {
  assert.equal(fixShapeAreaBug({ kind: "circle", radius: 2 }), Math.PI * 4);
  assert.equal(fixShapeAreaBug({ kind: "square", side: 3 }), 9);
  assert.equal(fixShapeAreaBug({ kind: "rectangle", width: 3, height: 5 }), 15);
});

// --- refactorFormatAddress -------------------------------------------------------

test("refactorFormatAddress: mesmo resultado que a versão original", () => {
  assert.equal(
    refactorFormatAddress({ street: "Rua A", city: "Recife", zipCode: "50000-000" }),
    "Rua A, Recife - 50000-000",
  );
});

// --- summarizeOrder -------------------------------------------------------

test("summarizeOrder: resume o pedido", () => {
  const summary = summarizeOrder({
    items: [
      { name: "Caneca", price: 10, quantity: 2 },
      { name: "Notebook", price: 3000, quantity: 1 },
    ],
    customer: { name: "Ana", email: "ana@example.com", age: 30 },
    payment: { cardNumber: "4111111111111111", expiry: "12/28" },
    status: "active",
  });
  assert.deepEqual(summary, {
    total: 3020,
    status: "active",
    paymentDescription: "Cartão terminado em 1111",
    customerLine: "Ana, 30 anos <ana@example.com>",
  });
});

test("summarizeOrder: lança em pedido sem itens", () => {
  assert.throws(
    () =>
      summarizeOrder({
        items: [],
        customer: { name: "Ana", email: "ana@example.com" },
        payment: { iban: "BR1234567890", bankName: "Banco X" },
        status: "pending",
      }),
    RangeError,
  );
});
