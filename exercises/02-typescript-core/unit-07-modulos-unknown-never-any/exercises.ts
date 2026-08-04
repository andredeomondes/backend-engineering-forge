// Unidade 7 — Módulos com tipos, declarações ambientes, unknown, never e any
//
// Implemente cada função. Não use bibliotecas externas. Não use `any` em
// nenhuma posição — este é o assunto central da unidade.
// Veja README.md para o enunciado completo de cada exercício.

// --- Declaração ambiente usada nesta unidade --------------------------------
//
// Descreve, de forma mínima, o formato de um valor que chega em `globalThis`
// em tempo de execução mas não tem tipo próprio (ex.: um script de bootstrap
// externo que injeta feature flags antes do app carregar). `declare global`
// não cria a variável — ela precisa existir de verdade em tempo de execução
// (os testes atribuem um valor a ela antes de chamar `isFeatureEnabled`).
declare global {
  // eslint-disable-next-line no-var
  var __UNIT7_FEATURE_FLAGS__: Record<string, boolean> | undefined;
}

// --- Fundamentais -----------------------------------------------------------

// test: node --test --test-name-pattern="isString" exercises/02-typescript-core/unit-07-modulos-unknown-never-any/exercises.test.ts
export function isString(value: unknown): value is string {
  throw new Error("not implemented: isString");
}

// test: node --test --test-name-pattern="isFiniteNumber" exercises/02-typescript-core/unit-07-modulos-unknown-never-any/exercises.test.ts
export function isFiniteNumber(value: unknown): value is number {
  throw new Error("not implemented: isFiniteNumber");
}

// test: node --test --test-name-pattern="isNonEmptyString" exercises/02-typescript-core/unit-07-modulos-unknown-never-any/exercises.test.ts
export function isNonEmptyString(value: unknown): value is string {
  throw new Error("not implemented: isNonEmptyString");
}

// test: node --test --test-name-pattern="isStringArray" exercises/02-typescript-core/unit-07-modulos-unknown-never-any/exercises.test.ts
export function isStringArray(value: unknown): value is string[] {
  throw new Error("not implemented: isStringArray");
}

// test: node --test --test-name-pattern="describeUnknown" exercises/02-typescript-core/unit-07-modulos-unknown-never-any/exercises.test.ts
export function describeUnknown(value: unknown): string {
  throw new Error("not implemented: describeUnknown");
}

// test: node --test --test-name-pattern="assertNever" exercises/02-typescript-core/unit-07-modulos-unknown-never-any/exercises.test.ts
export function assertNever(x: never): never {
  throw new Error("not implemented: assertNever");
}

// test: node --test --test-name-pattern="throwNotImplemented" exercises/02-typescript-core/unit-07-modulos-unknown-never-any/exercises.test.ts
export function throwNotImplemented(featureName: string): never {
  throw new Error("not implemented: throwNotImplemented");
}

// test: node --test --test-name-pattern="parseJsonOrThrow" exercises/02-typescript-core/unit-07-modulos-unknown-never-any/exercises.test.ts
export function parseJsonOrThrow(input: string): unknown {
  throw new Error("not implemented: parseJsonOrThrow");
}

// --- Intermediários ----------------------------------------------------------

export interface UserPayload {
  id: string;
  email: string;
  age: number;
}

// test: node --test --test-name-pattern="parseUserPayload" exercises/02-typescript-core/unit-07-modulos-unknown-never-any/exercises.test.ts
export function parseUserPayload(value: unknown): UserPayload {
  throw new Error("not implemented: parseUserPayload");
}

// test: node --test --test-name-pattern="isFeatureEnabled" exercises/02-typescript-core/unit-07-modulos-unknown-never-any/exercises.test.ts
export function isFeatureEnabled(flagName: string): boolean {
  throw new Error("not implemented: isFeatureEnabled");
}

// test: node --test --test-name-pattern="sumUnknownArray" exercises/02-typescript-core/unit-07-modulos-unknown-never-any/exercises.test.ts
export function sumUnknownArray(values: unknown[]): number {
  throw new Error("not implemented: sumUnknownArray");
}

export type Shape = "circle" | "square" | "triangle";

// test: node --test --test-name-pattern="shapeLabel" exercises/02-typescript-core/unit-07-modulos-unknown-never-any/exercises.test.ts
export function shapeLabel(shape: Shape): string {
  throw new Error("not implemented: shapeLabel");
}

// --- Debugging ----------------------------------------------------------------
//
// As duas funções abaixo JÁ ESTÃO IMPLEMENTADAS, mas contêm um bug real.
// Sua tarefa não é reescrever do zero: é diagnosticar e corrigir.

// test: node --test --test-name-pattern="parseAgeUnknown" exercises/02-typescript-core/unit-07-modulos-unknown-never-any/exercises.test.ts
export function parseAgeUnknown(value: unknown): number {
  // Sintoma relatado: valores inválidos (strings não numéricas, números
  // negativos, objetos, undefined) estão passando como se fossem idades
  // válidas, porque o código faz um cast em vez de checar o valor de
  // verdade em tempo de execução.
  const age = value as number;
  return age;
}

// test: node --test --test-name-pattern="isValidEmailUnknown" exercises/02-typescript-core/unit-07-modulos-unknown-never-any/exercises.test.ts
export function isValidEmailUnknown(value: unknown): value is string {
  // Sintoma relatado: strings sem "@" estão sendo aceitas como e-mail
  // válido — falta uma checagem.
  if (typeof value !== "string") {
    return false;
  }
  return value.length > 0;
}

// --- Refatoração ---------------------------------------------------------------
//
// Esta função já funciona corretamente. A tarefa é refatorar para eliminar
// os casts repetidos, mantendo o mesmo comportamento observável.

// test: node --test --test-name-pattern="refactorDescribeUnknownRecord" exercises/02-typescript-core/unit-07-modulos-unknown-never-any/exercises.test.ts
export function refactorDescribeUnknownRecord(value: unknown): string {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new TypeError("valor não é um objeto simples");
  }
  const idRaw = (value as Record<string, unknown>).id;
  const nameRaw = (value as Record<string, unknown>).name;
  const id =
    typeof idRaw === "string" || typeof idRaw === "number"
      ? String(idRaw)
      : "desconhecido";
  const name = typeof nameRaw === "string" ? nameRaw : "sem nome";
  return `${id}: ${name}`;
}

// --- Desafio integrador -----------------------------------------------------

export type OrderStatus = "pending" | "shipped" | "delivered" | "cancelled";

export interface Order {
  id: string;
  status: OrderStatus;
  total: number;
}

export interface OrderSummary {
  totalOrders: number;
  totalValue: number;
  countByStatus: Record<OrderStatus, number>;
}

// test: node --test --test-name-pattern="validateAndSummarizeOrders" exercises/02-typescript-core/unit-07-modulos-unknown-never-any/exercises.test.ts
export function validateAndSummarizeOrders(value: unknown): OrderSummary {
  throw new Error("not implemented: validateAndSummarizeOrders");
}
