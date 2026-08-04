// Unidade 4 — Tipos de função, generics, constraints e overloads
//
// Implemente cada função. Não use bibliotecas externas. Não use `any`.
// Veja README.md para o enunciado completo de cada exercício.

// --- Aliases usados nesta unidade -------------------------------------------

export type Box<T> = {
  value: T;
};

export type Stack<T> = {
  push: (item: T) => void;
  pop: () => T | undefined;
  peek: () => T | undefined;
  size: () => number;
};

// --- Fundamentais ---------------------------------------------------------

// test: node --test --test-name-pattern="identity" exercises/02-typescript-core/unit-04-funcoes-generics/exercises.test.ts
export function identity<T>(x: T): T {
  throw new Error("not implemented: identity");
}

// test: node --test --test-name-pattern="firstOf" exercises/02-typescript-core/unit-04-funcoes-generics/exercises.test.ts
export function firstOf<T>(items: T[]): T | undefined {
  throw new Error("not implemented: firstOf");
}

// test: node --test --test-name-pattern="lastOf" exercises/02-typescript-core/unit-04-funcoes-generics/exercises.test.ts
export function lastOf<T>(items: T[]): T | undefined {
  throw new Error("not implemented: lastOf");
}

// test: node --test --test-name-pattern="wrapInArray" exercises/02-typescript-core/unit-04-funcoes-generics/exercises.test.ts
export function wrapInArray<T>(value: T): T[] {
  throw new Error("not implemented: wrapInArray");
}

// test: node --test --test-name-pattern="createBox" exercises/02-typescript-core/unit-04-funcoes-generics/exercises.test.ts
export function createBox<T>(value: T): Box<T> {
  throw new Error("not implemented: createBox");
}

// test: node --test --test-name-pattern="pair" exercises/02-typescript-core/unit-04-funcoes-generics/exercises.test.ts
export function pair<A, B>(a: A, b: B): [A, B] {
  throw new Error("not implemented: pair");
}

// test: node --test --test-name-pattern="pluck" exercises/02-typescript-core/unit-04-funcoes-generics/exercises.test.ts
export function pluck<T, K extends keyof T>(obj: T, key: K): T[K] {
  throw new Error("not implemented: pluck");
}

// test: node --test --test-name-pattern="applyFn" exercises/02-typescript-core/unit-04-funcoes-generics/exercises.test.ts
export function applyFn<T, R>(value: T, fn: (value: T) => R): R {
  throw new Error("not implemented: applyFn");
}

// --- Intermediários --------------------------------------------------------

// test: node --test --test-name-pattern="mapArray" exercises/02-typescript-core/unit-04-funcoes-generics/exercises.test.ts
export function mapArray<T, R>(items: T[], fn: (item: T) => R): R[] {
  throw new Error("not implemented: mapArray");
}

// test: node --test --test-name-pattern="findByKey" exercises/02-typescript-core/unit-04-funcoes-generics/exercises.test.ts
export function findByKey<T, K extends keyof T>(
  items: T[],
  key: K,
  value: T[K],
): T | undefined {
  throw new Error("not implemented: findByKey");
}

// test: node --test --test-name-pattern="createStack" exercises/02-typescript-core/unit-04-funcoes-generics/exercises.test.ts
export function createStack<T>(): Stack<T> {
  throw new Error("not implemented: createStack");
}

// test: node --test --test-name-pattern="doubleValue" exercises/02-typescript-core/unit-04-funcoes-generics/exercises.test.ts
export function doubleValue(x: number): number;
export function doubleValue(x: string): string;
export function doubleValue(x: number | string): number | string {
  throw new Error("not implemented: doubleValue");
}

// --- Debugging --------------------------------------------------------------
//
// As duas funções abaixo JÁ ESTÃO IMPLEMENTADAS, mas contêm um bug real.
// Sua tarefa não é reescrever do zero: é diagnosticar e corrigir.

// test: node --test --test-name-pattern="combineValues" exercises/02-typescript-core/unit-04-funcoes-generics/exercises.test.ts
export function combineValues(a: number, b: number): number;
export function combineValues(a: string, b: string): string;
export function combineValues(a: number | string, b: number | string): number | string {
  // Sintoma relatado: somar dois números com combineValues(2, 3) não
  // retorna 5. Concatenar strings funciona normalmente.
  if (typeof a === "string" && typeof b === "string") {
    return a + b;
  }
  return (a as number) - (b as number);
}

// test: node --test --test-name-pattern="mergeUnique" exercises/02-typescript-core/unit-04-funcoes-generics/exercises.test.ts
export function mergeUnique<T extends { id: number }>(a: T[], b: T[]): T[] {
  // Sintoma relatado: itens com o mesmo `id` aparecem duplicados no
  // resultado, mesmo que a constraint `T extends { id: number }` exista
  // exatamente para permitir identificar duplicatas por id.
  return [...a, ...b];
}

// --- Refatoração -------------------------------------------------------------
//
// As duas funções abaixo já funcionam corretamente, mas são quase idênticas
// — a única diferença é o tipo (`number[]` vs `string[]`). A tarefa é
// refatorar para eliminar a duplicação (por exemplo, com uma função
// genérica interna reaproveitada por ambas), sem mudar o comportamento
// observável nem os nomes exportados.

// test: node --test --test-name-pattern="maxNumber" exercises/02-typescript-core/unit-04-funcoes-generics/exercises.test.ts
export function maxNumber(values: number[]): number {
  let max = values[0];
  for (let i = 1; i < values.length; i++) {
    if (values[i] > max) {
      max = values[i];
    }
  }
  return max;
}

// test: node --test --test-name-pattern="maxString" exercises/02-typescript-core/unit-04-funcoes-generics/exercises.test.ts
export function maxString(values: string[]): string {
  let max = values[0];
  for (let i = 1; i < values.length; i++) {
    if (values[i] > max) {
      max = values[i];
    }
  }
  return max;
}

// --- Desafio integrador -------------------------------------------------------

// test: node --test --test-name-pattern="groupBy" exercises/02-typescript-core/unit-04-funcoes-generics/exercises.test.ts
export function groupBy<T, K extends string | number>(
  items: T[],
  keyFn: (item: T) => K,
): Record<K, T[]> {
  throw new Error("not implemented: groupBy");
}
