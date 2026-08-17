import assert from "node:assert/strict";
import test from "node:test";

import {
  calculateOrderTotal,
  createProcessingCounter,
  processOrders,
  summarizeOrders,
  validateOrder,
} from "../src/order-workbench.js";

const validOrder = {
  id: "order-1001",
  status: "paid",
  items: [
    { sku: "BOOK-01", quantity: 2, unitPriceInCents: 4590 },
    { sku: "PEN-02", quantity: 3, unitPriceInCents: 250 },
  ],
};

test("validateOrder aceita um pedido completo", () => {
  assert.deepEqual(validateOrder(validOrder), { valid: true, errors: [] });
});

test("validateOrder acumula erros úteis", () => {
  const result = validateOrder({ id: "", status: "unknown", items: [] });
  assert.equal(result.valid, false);
  assert.ok(result.errors.length >= 3);
});

test("validateOrder rejeita quantidade e preço inválidos", () => {
  const result = validateOrder({
    id: "order-2",
    status: "pending",
    items: [{ sku: "A", quantity: 0, unitPriceInCents: -1 }],
  });
  assert.equal(result.valid, false);
  assert.match(result.errors.join(" "), /quantidade|preço/i);
});

test("validateOrder não altera a entrada", () => {
  const input = structuredClone(validOrder);
  validateOrder(input);
  assert.deepEqual(input, validOrder);
});

test("calculateOrderTotal soma itens em centavos", () => {
  assert.equal(calculateOrderTotal(validOrder), 9930);
});

test("calculateOrderTotal não altera os itens", () => {
  const input = structuredClone(validOrder);
  calculateOrderTotal(input);
  assert.deepEqual(input, validOrder);
});

test("createProcessingCounter mantém estado privado", () => {
  const next = createProcessingCounter();
  assert.equal(next(), 1);
  assert.equal(next(), 2);
  assert.equal(next(), 3);
});

test("contadores diferentes não compartilham estado", () => {
  const first = createProcessingCounter();
  const second = createProcessingCounter();
  assert.equal(first(), 1);
  assert.equal(first(), 2);
  assert.equal(second(), 1);
});

test("summarizeOrders agrupa quantidade e valor por status", () => {
  const orders = [
    validOrder,
    { id: "order-1002", status: "paid", items: [{ sku: "A", quantity: 1, unitPriceInCents: 70 }] },
    { id: "order-1003", status: "pending", items: [{ sku: "B", quantity: 1, unitPriceInCents: 100 }] },
  ];
  assert.deepEqual(summarizeOrders(orders), {
    paid: { orders: 2, totalInCents: 10000 },
    pending: { orders: 1, totalInCents: 100 },
  });
});

test("summarizeOrders retorna objeto vazio para lista vazia", () => {
  assert.deepEqual(summarizeOrders([]), {});
});

test("processOrders separa válidos e inválidos preservando a posição", () => {
  const invalid = { id: "", status: "paid", items: [] };
  const result = processOrders([validOrder, invalid]);
  assert.equal(result.validOrders.length, 1);
  assert.equal(result.invalidOrders.length, 1);
  assert.equal(result.invalidOrders[0].index, 1);
  assert.ok(result.invalidOrders[0].errors.length > 0);
});

test("processOrders informa o total processado", () => {
  const result = processOrders([validOrder, validOrder]);
  assert.equal(result.processedCount, 2);
});

