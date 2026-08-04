// Unidade 1 — Anotações, inferência, tipos primitivos, arrays e tuplas
//
// Implemente cada função. Não use bibliotecas externas. Não use `any`.
// Veja README.md para o enunciado completo de cada exercício.

// --- Aliases usados nesta unidade -------------------------------------------

export type Coordinates = [number, number];

export type Product = {
  name: string;
  price: number;
  inStock: boolean;
};

// --- Fundamentais ---------------------------------------------------------

// test: node --test --test-name-pattern="sum" exercises/02-typescript-core/unit-01-anotacoes-inferencia-primitivos/exercises.test.ts
export function sum(a: number, b: number): number {
  throw new Error("not implemented: sum");
}

// test: node --test --test-name-pattern="repeatString" exercises/02-typescript-core/unit-01-anotacoes-inferencia-primitivos/exercises.test.ts
export function repeatString(str: string, times: number): string {
  throw new Error("not implemented: repeatString");
}

// test: node --test --test-name-pattern="isEven" exercises/02-typescript-core/unit-01-anotacoes-inferencia-primitivos/exercises.test.ts
export function isEven(n: number): boolean {
  throw new Error("not implemented: isEven");
}

// test: node --test --test-name-pattern="formatPriceFromCents" exercises/02-typescript-core/unit-01-anotacoes-inferencia-primitivos/exercises.test.ts
export function formatPriceFromCents(cents: number): string {
  throw new Error("not implemented: formatPriceFromCents");
}

// test: node --test --test-name-pattern="sumNumberArray" exercises/02-typescript-core/unit-01-anotacoes-inferencia-primitivos/exercises.test.ts
export function sumNumberArray(values: number[]): number {
  throw new Error("not implemented: sumNumberArray");
}

// test: node --test --test-name-pattern="joinWords" exercises/02-typescript-core/unit-01-anotacoes-inferencia-primitivos/exercises.test.ts
export function joinWords(words: string[], separator: string): string {
  throw new Error("not implemented: joinWords");
}

// test: node --test --test-name-pattern="getFirstAndLast" exercises/02-typescript-core/unit-01-anotacoes-inferencia-primitivos/exercises.test.ts
export function getFirstAndLast(items: string[]): [string, string] {
  throw new Error("not implemented: getFirstAndLast");
}

// test: node --test --test-name-pattern="createPoint" exercises/02-typescript-core/unit-01-anotacoes-inferencia-primitivos/exercises.test.ts
export function createPoint(x: number, y: number): [number, number] {
  throw new Error("not implemented: createPoint");
}

// --- Intermediários --------------------------------------------------------

// test: node --test --test-name-pattern="distanceBetween" exercises/02-typescript-core/unit-01-anotacoes-inferencia-primitivos/exercises.test.ts
export function distanceBetween(a: Coordinates, b: Coordinates): number {
  throw new Error("not implemented: distanceBetween");
}

// test: node --test --test-name-pattern="describeProduct" exercises/02-typescript-core/unit-01-anotacoes-inferencia-primitivos/exercises.test.ts
export function describeProduct(product: Product): string {
  throw new Error("not implemented: describeProduct");
}

// test: node --test --test-name-pattern="parseCoordinatePair" exercises/02-typescript-core/unit-01-anotacoes-inferencia-primitivos/exercises.test.ts
export function parseCoordinatePair(input: string): [number, number] | null {
  throw new Error("not implemented: parseCoordinatePair");
}

// test: node --test --test-name-pattern="mergeTuples" exercises/02-typescript-core/unit-01-anotacoes-inferencia-primitivos/exercises.test.ts
export function mergeTuples(
  a: [string, number],
  b: [string, number],
): [string, number][] {
  throw new Error("not implemented: mergeTuples");
}

// --- Debugging --------------------------------------------------------------
//
// As duas funções abaixo JÁ ESTÃO IMPLEMENTADAS, mas contêm um bug real.
// Sua tarefa não é reescrever do zero: é diagnosticar e corrigir.

// test: node --test --test-name-pattern="fixAverageCalculation" exercises/02-typescript-core/unit-01-anotacoes-inferencia-primitivos/exercises.test.ts
export function fixAverageCalculation(scores: number[]): number {
  // Sintoma relatado: a média de uma lista vazia deveria ser tratada como
  // erro, mas em vez disso o código retorna NaN silenciosamente, e a média
  // de listas não vazias também vem errada.
  let total = 0;
  for (const score of scores) {
    total += score;
  }
  return total / (scores.length + 1);
}

// test: node --test --test-name-pattern="fixTupleOrderBug" exercises/02-typescript-core/unit-01-anotacoes-inferencia-primitivos/exercises.test.ts
export function fixTupleOrderBug(pair: [string, number]): string {
  // Sintoma relatado: a mensagem gerada mostra o número no lugar do nome
  // e vice-versa, porque a tupla foi desestruturada na ordem errada.
  const [count, label] = pair;
  return `${label}: ${count}`;
}

// --- Refatoração -------------------------------------------------------------
//
// Esta função já funciona corretamente. A tarefa é refatorar para reduzir
// passos manuais, mantendo o mesmo comportamento observável.

// test: node --test --test-name-pattern="refactorPointDistance" exercises/02-typescript-core/unit-01-anotacoes-inferencia-primitivos/exercises.test.ts
export function refactorPointDistance(a: Coordinates, b: Coordinates): number {
  const deltaX = a[0] - b[0];
  const deltaY = a[1] - b[1];
  const squaredDeltaX = deltaX * deltaX;
  const squaredDeltaY = deltaY * deltaY;
  const sumOfSquares = squaredDeltaX + squaredDeltaY;
  const result = Math.sqrt(sumOfSquares);
  return result;
}

// --- Desafio integrador -------------------------------------------------------

type InventoryItem = { name: string; price: number; quantity: number };

type InventorySummary = {
  totalItems: number;
  totalValue: number;
  mostExpensive: string;
};

// test: node --test --test-name-pattern="summarizeInventory" exercises/02-typescript-core/unit-01-anotacoes-inferencia-primitivos/exercises.test.ts
export function summarizeInventory(items: InventoryItem[]): InventorySummary {
  throw new Error("not implemented: summarizeInventory");
}
