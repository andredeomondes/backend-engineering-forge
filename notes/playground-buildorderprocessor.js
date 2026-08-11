function buildOrderProcessor(taxRate = 0) {
  return function processOrders(orders) {
    let total = 0;
    let processedCount = 0;

    for (const order of orders) {
      if (order.status !== "cancelled") {
        total += order.amount;
        processedCount++;
      }
    }

    let totalWithTax = total * (1 + taxRate);
    return { totalWithTax: totalWithTax, processedCount: processedCount };
  };
}

const processOrders = buildOrderProcessor(0.1);
console.log(
  processOrders([
    { status: "paid", amount: 100 },
    { status: "cancelled", amount: 50 },
    { status: "pending", amount: 20 },
  ]),
);
