/*

```json
{
  "id": "order-1001",
  "status": "paid",
  "items": [
    { "sku": "BOOK-01", "quantity": 2, "unitPriceInCents": 4590 }
  ]
}
```
*/

const ALLOWED_STATUSES = new Set(["pending", "paid", "cancelled"]);

export function validateOrder(_order) {
  const errors = [];

  if (!_order.id) {
    errors.push("id é obrigatório");
  }

  if (!isAllowedStatus(_order.status)) {
    errors.push("status fora de escopo");
  }

  if (_order.items.length === 0) {
    errors.push("item é obrigatório");
  }

  for (const item of _order.items) {
    if (item.quantity <= 0) {
      errors.push("item precisa ter quantidade maior que 0");
    }
    if (item.unitPriceInCents < 0) {
      errors.push("item precisa ter o preço a partir de 0");
    }
  }
  return { valid: errors.length === 0, errors };
}

export function calculateOrderTotal(_order) {
  let total = 0;
  for (const item of _order.items) {
    total += item.quantity * item.unitPriceInCents;
  }
  return total;
}

export function createProcessingCounter() {
  let count = 0;
  return function () {
    count++;
    return count;
  };
}

export function summarizeOrders(_orders) {
  throw new Error("not implemented: summarizeOrders");
}

export function processOrders(_orders) {
  throw new Error("not implemented: processOrders");
}

export function isAllowedStatus(status) {
  return ALLOWED_STATUSES.has(status);
}
