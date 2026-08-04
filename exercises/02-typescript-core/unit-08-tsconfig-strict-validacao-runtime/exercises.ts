// Unidade 8 — tsconfig, strict mode, erros tipados e validação em runtime
//
// Implemente cada função. Não use bibliotecas externas. Não use `any`.
// Veja README.md para o enunciado completo de cada exercício.
//
// As classes de erro e o alias `Result` abaixo já estão implementados —
// eles são a base usada pelos exercícios numerados.

// --- Base desta unidade ------------------------------------------------

export class ValidationError extends Error {
  field: string;

  constructor(field: string, message: string) {
    super(message);
    this.name = "ValidationError";
    this.field = field;
  }
}

export class NotFoundError extends Error {
  resourceId: string;

  constructor(resourceId: string, message: string) {
    super(message);
    this.name = "NotFoundError";
    this.resourceId = resourceId;
  }
}

export type Result<T, E> = { ok: true; value: T } | { ok: false; error: E };

export type User = { id: string; name: string };

// --- Fundamentais ---------------------------------------------------------

// test: node --test --test-name-pattern="validateAge" exercises/02-typescript-core/unit-08-tsconfig-strict-validacao-runtime/exercises.test.ts
export function validateAge(age: number): void {
  throw new Error("not implemented: validateAge");
}

// test: node --test --test-name-pattern="findUserOrThrow" exercises/02-typescript-core/unit-08-tsconfig-strict-validacao-runtime/exercises.test.ts
export function findUserOrThrow(id: string, users: User[]): User {
  throw new Error("not implemented: findUserOrThrow");
}

// test: node --test --test-name-pattern="describeCaughtError" exercises/02-typescript-core/unit-08-tsconfig-strict-validacao-runtime/exercises.test.ts
export function describeCaughtError(e: unknown): string {
  throw new Error("not implemented: describeCaughtError");
}

// test: node --test --test-name-pattern="safeJsonParse" exercises/02-typescript-core/unit-08-tsconfig-strict-validacao-runtime/exercises.test.ts
export function safeJsonParse(input: string): Result<unknown, string> {
  throw new Error("not implemented: safeJsonParse");
}

// test: node --test --test-name-pattern="parsePositiveInteger" exercises/02-typescript-core/unit-08-tsconfig-strict-validacao-runtime/exercises.test.ts
export function parsePositiveInteger(input: string): Result<number, string> {
  throw new Error("not implemented: parsePositiveInteger");
}

// test: node --test --test-name-pattern="^divide:" exercises/02-typescript-core/unit-08-tsconfig-strict-validacao-runtime/exercises.test.ts
export function divide(a: number, b: number): Result<number, string> {
  throw new Error("not implemented: divide");
}

// test: node --test --test-name-pattern="isUserShape" exercises/02-typescript-core/unit-08-tsconfig-strict-validacao-runtime/exercises.test.ts
export function isUserShape(
  data: unknown,
): data is { name: string; age: number } {
  throw new Error("not implemented: isUserShape");
}

// test: node --test --test-name-pattern="parseUserPayload" exercises/02-typescript-core/unit-08-tsconfig-strict-validacao-runtime/exercises.test.ts
export function parseUserPayload(
  data: unknown,
): Result<{ name: string; age: number }, string> {
  throw new Error("not implemented: parseUserPayload");
}

// --- Intermediários --------------------------------------------------------

// test: node --test --test-name-pattern="unwrapOrThrow" exercises/02-typescript-core/unit-08-tsconfig-strict-validacao-runtime/exercises.test.ts
export function unwrapOrThrow<T, E>(result: Result<T, E>): T {
  throw new Error("not implemented: unwrapOrThrow");
}

// test: node --test --test-name-pattern="mapResult" exercises/02-typescript-core/unit-08-tsconfig-strict-validacao-runtime/exercises.test.ts
export function mapResult<T, U, E>(
  result: Result<T, E>,
  fn: (value: T) => U,
): Result<U, E> {
  throw new Error("not implemented: mapResult");
}

// test: node --test --test-name-pattern="chainValidations" exercises/02-typescript-core/unit-08-tsconfig-strict-validacao-runtime/exercises.test.ts
export function chainValidations(
  input: unknown,
): Result<{ name: string; age: number }, string[]> {
  throw new Error("not implemented: chainValidations");
}

// test: node --test --test-name-pattern="parseConfigFromEnv" exercises/02-typescript-core/unit-08-tsconfig-strict-validacao-runtime/exercises.test.ts
export function parseConfigFromEnv(
  env: Record<string, string | undefined>,
): Result<{ port: number; host: string }, string> {
  throw new Error("not implemented: parseConfigFromEnv");
}

// --- Debugging --------------------------------------------------------------
//
// As duas funções abaixo JÁ ESTÃO IMPLEMENTADAS, mas contêm um bug real.
// Sua tarefa não é reescrever do zero: é diagnosticar e corrigir.

// test: node --test --test-name-pattern="divideSafe" exercises/02-typescript-core/unit-08-tsconfig-strict-validacao-runtime/exercises.test.ts
export function divideSafe(a: number, b: number): Result<number, string> {
  // Sintoma relatado: ao chamar divideSafe com b = 0, o programa quebra com
  // uma exceção não tratada (RangeError) em vez de retornar um Result de
  // erro controlado, como o restante da unidade espera dessa função.
  if (b === 0) {
    throw new RangeError("divisão por zero");
  }
  return { ok: true, value: a / b };
}

// test: node --test --test-name-pattern="describeThrownValue" exercises/02-typescript-core/unit-08-tsconfig-strict-validacao-runtime/exercises.test.ts
export function describeThrownValue(fn: () => void): string {
  // Sintoma relatado: quando a função passada lança algo que não é uma
  // instância de Error (por exemplo, uma string ou um número), a mensagem
  // retornada vem como "erro: undefined" em vez de descrever o valor
  // realmente lançado.
  try {
    fn();
    return "nenhum erro lançado";
  } catch (e: unknown) {
    const err = e as Error;
    return `erro: ${err.message}`;
  }
}

// --- Refatoração -------------------------------------------------------------
//
// Esta função já funciona corretamente. A tarefa é refatorar para reduzir
// passos manuais, mantendo o mesmo comportamento observável (inclusive o
// fato de lançar exceção, em vez de retornar Result, para esta falha
// recuperável específica).

// test: node --test --test-name-pattern="parseIntOrThrow" exercises/02-typescript-core/unit-08-tsconfig-strict-validacao-runtime/exercises.test.ts
export function parseIntOrThrow(input: string): number {
  const trimmed = input.trim();
  let isValid = true;
  if (trimmed.length === 0) {
    isValid = false;
  }
  const parsed = Number(trimmed);
  if (Number.isNaN(parsed)) {
    isValid = false;
  }
  if (!Number.isInteger(parsed)) {
    isValid = false;
  }
  if (isValid === false) {
    throw new TypeError(`entrada inválida para inteiro: "${input}"`);
  }
  return parsed;
}

// --- Desafio integrador -------------------------------------------------------

// test: node --test --test-name-pattern="processBatch" exercises/02-typescript-core/unit-08-tsconfig-strict-validacao-runtime/exercises.test.ts
export function processBatch(inputs: unknown[]): {
  successes: number[];
  failures: string[];
} {
  throw new Error("not implemented: processBatch");
}
