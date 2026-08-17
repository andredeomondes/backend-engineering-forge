import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { processOrders, summarizeOrders } from "./order-workbench.js";

export async function run(argv = process.argv.slice(2)) {
  const [input] = argv;
  if (!input) throw new Error("Informe o caminho de um arquivo JSON.");

  const raw = await readFile(path.resolve(input), "utf8");
  const orders = JSON.parse(raw);
  if (!Array.isArray(orders)) throw new Error("O arquivo deve conter um array de pedidos.");

  const result = processOrders(orders);
  const summary = summarizeOrders(result.validOrders);
  process.stdout.write(`${JSON.stringify({ ...result, summary }, null, 2)}\n`);
}

const isEntryPoint = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isEntryPoint) {
  run().catch((error) => {
    process.stderr.write(`Erro: ${error.message}\n`);
    process.exitCode = 1;
  });
}

