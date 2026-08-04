// Unidade 3 — Narrowing, type guards e discriminated unions
//
// Implemente cada função. Não use bibliotecas externas. Não use `any`.
// Veja README.md para o enunciado completo de cada exercício.

// --- Aliases usados nesta unidade -------------------------------------------

export type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; side: number }
  | { kind: "rectangle"; width: number; height: number };

export type Result<T> = { ok: true; value: T } | { ok: false; error: string };

export type Product = { name: string; price: number };

export type DiscountedProduct = Product & { discountPercent: number };

export class ValidationError extends Error {}

// Nota sobre `enum`: o Node roda os arquivos `.ts` desta unidade em modo
// "strip-only" (só apaga anotações de tipo, não transpila), e um `enum`
// de verdade gera código em runtime — por isso não roda direto aqui.
// A forma equivalente seria:
//
//   export enum PaymentMethod {
//     Cash = "CASH",
//     Card = "CARD",
//     Pix = "PIX",
//   }
//
// Nesta unidade usamos a alternativa mais comum em TypeScript moderno:
// uma união de literais de string. Compare as duas na sua resposta da
// pergunta 3 de "Antes de começar".
export type PaymentMethod = "CASH" | "CARD" | "PIX";

// --- Fundamentais ---------------------------------------------------------

// test: node --test --test-name-pattern="isNonEmptyString" exercises/02-typescript-core/unit-03-narrowing-guards-discriminated-unions/exercises.test.ts
export function isNonEmptyString(value: unknown): value is string {
  throw new Error("not implemented: isNonEmptyString");
}

// test: node --test --test-name-pattern="describePrimitive" exercises/02-typescript-core/unit-03-narrowing-guards-discriminated-unions/exercises.test.ts
export function describePrimitive(value: string | number | boolean): string {
  throw new Error("not implemented: describePrimitive");
}

// test: node --test --test-name-pattern="formatQuantity" exercises/02-typescript-core/unit-03-narrowing-guards-discriminated-unions/exercises.test.ts
export function formatQuantity(value: number | "unlimited"): string {
  throw new Error("not implemented: formatQuantity");
}

// test: node --test --test-name-pattern="greetUser" exercises/02-typescript-core/unit-03-narrowing-guards-discriminated-unions/exercises.test.ts
export function greetUser(name: string | null | undefined): string {
  throw new Error("not implemented: greetUser");
}

// test: node --test --test-name-pattern="shapeArea" exercises/02-typescript-core/unit-03-narrowing-guards-discriminated-unions/exercises.test.ts
export function shapeArea(shape: Shape): number {
  throw new Error("not implemented: shapeArea");
}

// test: node --test --test-name-pattern="shapePerimeter" exercises/02-typescript-core/unit-03-narrowing-guards-discriminated-unions/exercises.test.ts
export function shapePerimeter(shape: Shape): number {
  throw new Error("not implemented: shapePerimeter");
}

// test: node --test --test-name-pattern="computeFinalPrice" exercises/02-typescript-core/unit-03-narrowing-guards-discriminated-unions/exercises.test.ts
export function computeFinalPrice(product: Product | DiscountedProduct): number {
  throw new Error("not implemented: computeFinalPrice");
}

// test: node --test --test-name-pattern="formatCaughtError" exercises/02-typescript-core/unit-03-narrowing-guards-discriminated-unions/exercises.test.ts
export function formatCaughtError(err: unknown): string {
  throw new Error("not implemented: formatCaughtError");
}

// --- Intermediários --------------------------------------------------------

// test: node --test --test-name-pattern="unwrapResult" exercises/02-typescript-core/unit-03-narrowing-guards-discriminated-unions/exercises.test.ts
export function unwrapResult<T>(result: Result<T>): T {
  throw new Error("not implemented: unwrapResult");
}

// test: node --test --test-name-pattern="isShape" exercises/02-typescript-core/unit-03-narrowing-guards-discriminated-unions/exercises.test.ts
export function isShape(value: unknown): value is Shape {
  throw new Error("not implemented: isShape");
}

// test: node --test --test-name-pattern="totalArea" exercises/02-typescript-core/unit-03-narrowing-guards-discriminated-unions/exercises.test.ts
export function totalArea(values: unknown[]): number {
  throw new Error("not implemented: totalArea");
}

// test: node --test --test-name-pattern="describePaymentMethod" exercises/02-typescript-core/unit-03-narrowing-guards-discriminated-unions/exercises.test.ts
export function describePaymentMethod(method: PaymentMethod): string {
  throw new Error("not implemented: describePaymentMethod");
}

// --- Debugging --------------------------------------------------------------
//
// As duas funções abaixo JÁ ESTÃO IMPLEMENTADAS, mas contêm um bug real.
// Sua tarefa não é reescrever do zero: é diagnosticar e corrigir.

// test: node --test --test-name-pattern="fixShapeAreaBug" exercises/02-typescript-core/unit-03-narrowing-guards-discriminated-unions/exercises.test.ts
export function fixShapeAreaBug(shape: Shape): number {
  // Sintoma relatado: a área de retângulos vem errada sempre que largura
  // e altura são diferentes (círculo e quadrado calculam certo).
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius * shape.radius;
    case "square":
      return shape.side * shape.side;
    case "rectangle":
      return shape.width * shape.width;
  }
}

// test: node --test --test-name-pattern="fixIsPositiveNumberGuard" exercises/02-typescript-core/unit-03-narrowing-guards-discriminated-unions/exercises.test.ts
export function fixIsPositiveNumberGuard(value: unknown): value is number {
  // Sintoma relatado: números positivos válidos estão sendo rejeitados
  // pelo guard, e valores inválidos (strings, negativos, zero) estão
  // sendo aceitos como se fossem números positivos.
  return typeof value !== "number" || value <= 0;
}

// --- Refatoração -------------------------------------------------------------
//
// Esta função já funciona corretamente. A tarefa é refatorar para reduzir
// aninhamento, mantendo o mesmo comportamento observável.

// test: node --test --test-name-pattern="refactorDescribeInput" exercises/02-typescript-core/unit-03-narrowing-guards-discriminated-unions/exercises.test.ts
export function refactorDescribeInput(value: unknown): string {
  let result = "";
  if (typeof value === "string") {
    result = `string: "${value}"`;
  } else {
    if (typeof value === "number") {
      result = `number: ${value}`;
    } else {
      if (typeof value === "boolean") {
        result = `boolean: ${value}`;
      } else {
        if (value instanceof Date) {
          result = `date: ${value.toISOString()}`;
        } else {
          if (Array.isArray(value)) {
            result = `array: ${value.length} itens`;
          } else {
            if (value === null) {
              result = "null";
            } else {
              result = "desconhecido";
            }
          }
        }
      }
    }
  }
  return result;
}

// --- Desafio integrador -------------------------------------------------------

// test: node --test --test-name-pattern="summarizeShapes" exercises/02-typescript-core/unit-03-narrowing-guards-discriminated-unions/exercises.test.ts
export function summarizeShapes(shapes: Shape[]): {
  totalArea: number;
  totalPerimeter: number;
  mostCommonKind: Shape["kind"];
} {
  throw new Error("not implemented: summarizeShapes");
}
