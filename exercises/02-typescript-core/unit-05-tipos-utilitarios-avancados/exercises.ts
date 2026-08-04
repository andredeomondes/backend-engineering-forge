// Unidade 5 — Tipos utilitários avançados, keyof, typeof e tipos condicionais
//
// Implemente cada função. Não use bibliotecas externas. Não use `any`.
// Veja README.md para o enunciado completo de cada exercício.

// --- Fundamentais ---------------------------------------------------------

// test: node --test --test-name-pattern="getProperty" exercises/02-typescript-core/unit-05-tipos-utilitarios-avancados/exercises.test.ts
export function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  throw new Error("not implemented: getProperty");
}

// test: node --test --test-name-pattern="getPropertyNames" exercises/02-typescript-core/unit-05-tipos-utilitarios-avancados/exercises.test.ts
export function getPropertyNames<T extends object>(obj: T): (keyof T)[] {
  throw new Error("not implemented: getPropertyNames");
}

// test: node --test --test-name-pattern="^pick" exercises/02-typescript-core/unit-05-tipos-utilitarios-avancados/exercises.test.ts
export function pick<T extends object, K extends keyof T>(
  obj: T,
  keys: K[],
): Pick<T, K> {
  throw new Error("not implemented: pick");
}

// test: node --test --test-name-pattern="^omit" exercises/02-typescript-core/unit-05-tipos-utilitarios-avancados/exercises.test.ts
export function omit<T extends object, K extends keyof T>(
  obj: T,
  keys: K[],
): Omit<T, K> {
  throw new Error("not implemented: omit");
}

// test: node --test --test-name-pattern="sumRecordValues" exercises/02-typescript-core/unit-05-tipos-utilitarios-avancados/exercises.test.ts
export type ScoreBoard = Record<string, number>;

export function sumRecordValues(record: ScoreBoard): number {
  throw new Error("not implemented: sumRecordValues");
}

// test: node --test --test-name-pattern="makeReadonly" exercises/02-typescript-core/unit-05-tipos-utilitarios-avancados/exercises.test.ts
export function makeReadonly<T extends object>(obj: T): Readonly<T> {
  throw new Error("not implemented: makeReadonly");
}

// test: node --test --test-name-pattern="describeStatus" exercises/02-typescript-core/unit-05-tipos-utilitarios-avancados/exercises.test.ts
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
} as const;

export type HttpStatusCode = (typeof HTTP_STATUS)[keyof typeof HTTP_STATUS];

export function describeStatus(code: HttpStatusCode): string {
  throw new Error("not implemented: describeStatus");
}

// test: node --test --test-name-pattern="applyPatch" exercises/02-typescript-core/unit-05-tipos-utilitarios-avancados/exercises.test.ts
export function applyPatch<T extends object>(original: T, patch: Partial<T>): T {
  throw new Error("not implemented: applyPatch");
}

// --- Intermediários --------------------------------------------------------

// test: node --test --test-name-pattern="nullifyFields" exercises/02-typescript-core/unit-05-tipos-utilitarios-avancados/exercises.test.ts
export type Nullable<T> = { [K in keyof T]: T[K] | null };

export function nullifyFields<T extends object, K extends keyof T>(
  obj: T,
  keys: K[],
): Nullable<T> {
  throw new Error("not implemented: nullifyFields");
}

// test: node --test --test-name-pattern="finalizeOrder" exercises/02-typescript-core/unit-05-tipos-utilitarios-avancados/exercises.test.ts
export type DraftOrder = { id?: string; total?: number; status?: string };

export function finalizeOrder(
  draft: DraftOrder,
  fallback: Required<DraftOrder>,
): Required<DraftOrder> {
  throw new Error("not implemented: finalizeOrder");
}

// test: node --test --test-name-pattern="assertPresent" exercises/02-typescript-core/unit-05-tipos-utilitarios-avancados/exercises.test.ts
export type Present<T> = T extends null | undefined ? never : T;

export function assertPresent<T>(value: T): Present<T> {
  throw new Error("not implemented: assertPresent");
}

// test: node --test --test-name-pattern="getCity" exercises/02-typescript-core/unit-05-tipos-utilitarios-avancados/exercises.test.ts
export type Address = { street: string; city: string; zipCode: string };

export type UserWithAddress = { name: string; address: Address };

export function getCity(
  user: UserWithAddress,
): UserWithAddress["address"]["city"] {
  throw new Error("not implemented: getCity");
}

// --- Debugging --------------------------------------------------------------
//
// As duas funções abaixo JÁ ESTÃO IMPLEMENTADAS, mas contêm um bug real.
// Sua tarefa não é reescrever do zero: é diagnosticar e corrigir.

// test: node --test --test-name-pattern="applyProfileUpdate" exercises/02-typescript-core/unit-05-tipos-utilitarios-avancados/exercises.test.ts
export function applyProfileUpdate<T extends object>(
  current: T,
  patch: Partial<T>,
): T {
  // Sintoma relatado: ao enviar um patch com um campo explicitamente
  // "undefined" (querendo dizer "não altere este campo"), o campo é
  // sobrescrito com undefined em vez de manter o valor original.
  return { ...current, ...patch };
}

// test: node --test --test-name-pattern="sumFieldValues" exercises/02-typescript-core/unit-05-tipos-utilitarios-avancados/exercises.test.ts
export function sumFieldValues<T extends Record<string, number>>(
  obj: T,
  fields: (keyof T)[],
): number {
  // Sintoma relatado: ao somar apenas os campos indicados em `fields`, o
  // resultado inclui valores de campos que não foram pedidos, porque o
  // código está iterando sobre todas as chaves de `obj` em vez de usar a
  // lista `fields`.
  let total = 0;
  for (const key of Object.keys(obj)) {
    total += obj[key as keyof T];
  }
  return total;
}

// --- Refatoração -------------------------------------------------------------
//
// Esta função já funciona corretamente. A tarefa é refatorar os tipos
// abaixo para reduzir repetição, mantendo o mesmo comportamento observável.

type UserDraftBad = { name?: string; email?: string; age?: number };
type UserFullBad = { name: string; email: string; age: number };
type UserLockedBad = {
  readonly name: string;
  readonly email: string;
  readonly age: number;
};

// test: node --test --test-name-pattern="buildUserVariants" exercises/02-typescript-core/unit-05-tipos-utilitarios-avancados/exercises.test.ts
export function buildUserVariants(user: UserFullBad): {
  draft: UserDraftBad;
  full: UserFullBad;
  locked: UserLockedBad;
} {
  return {
    draft: { ...user },
    full: { ...user },
    locked: Object.freeze({ ...user }),
  };
}

// --- Desafio integrador -------------------------------------------------------

export const ROLE = {
  ADMIN: "admin",
  EDITOR: "editor",
  VIEWER: "viewer",
} as const;

export type Role = (typeof ROLE)[keyof typeof ROLE];

export type Permission = { read: boolean; write: boolean; delete: boolean };

// test: node --test --test-name-pattern="buildPermissionMatrix" exercises/02-typescript-core/unit-05-tipos-utilitarios-avancados/exercises.test.ts
export function buildPermissionMatrix(
  overrides: Partial<Record<Role, Partial<Permission>>>,
): Record<Role, Permission> {
  throw new Error("not implemented: buildPermissionMatrix");
}
