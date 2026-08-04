// Unidade 2 — Interfaces, propriedades opcionais, readonly, unions,
// intersections e tipos literais
//
// Implemente cada função. Não use bibliotecas externas. Não use `any`.
// Veja README.md para o enunciado completo de cada exercício.

// --- Aliases usados nesta unidade -------------------------------------------

export interface User {
  name: string;
  email: string;
  age?: number;
}

export interface Product {
  name: string;
  price: number;
  discountPercent?: number;
}

export interface Address {
  readonly street: string;
  readonly city: string;
  readonly zipCode: string;
}

export interface Rectangle {
  width: number;
  height: number;
}

export type MembershipTier = "free" | "premium" | "enterprise";

export interface Member {
  name: string;
  tier: MembershipTier;
}

export type Status = "pending" | "active" | "cancelled";

export interface Circle {
  kind: "circle";
  radius: number;
}

export interface Square {
  kind: "square";
  side: number;
}

export interface RectangleShape {
  kind: "rectangle";
  width: number;
  height: number;
}

export type Shape = Circle | Square | RectangleShape;

export interface CreditCard {
  cardNumber: string;
  expiry: string;
}

export interface BankTransfer {
  iban: string;
  bankName: string;
}

export type PaymentMethod = CreditCard | BankTransfer;

export interface PersonalInfo {
  name: string;
  birthYear: number;
}

export interface ContactInfo {
  email: string;
  phone: string;
}

export interface BaseConfig {
  timeout: number;
  retries: number;
}

export interface ConfigOverrides {
  retries?: number;
  verbose?: boolean;
}

export interface OrderItem {
  readonly name: string;
  readonly price: number;
  readonly quantity: number;
}

export interface Order {
  readonly items: readonly OrderItem[];
  customer: User;
  payment: PaymentMethod;
  status: Status;
  note?: string;
}

export interface OrderSummary {
  total: number;
  status: Status;
  paymentDescription: string;
  customerLine: string;
}

// --- Fundamentais ---------------------------------------------------------

// test: node --test --test-name-pattern="describeUser" exercises/02-typescript-core/unit-02-interfaces-unions-literais/exercises.test.ts
export function describeUser(user: User): string {
  throw new Error("not implemented: describeUser");
}

// test: node --test --test-name-pattern="getFinalPrice" exercises/02-typescript-core/unit-02-interfaces-unions-literais/exercises.test.ts
export function getFinalPrice(product: Product): number {
  throw new Error("not implemented: getFinalPrice");
}

// test: node --test --test-name-pattern="formatAddress" exercises/02-typescript-core/unit-02-interfaces-unions-literais/exercises.test.ts
export function formatAddress(address: Address): string {
  throw new Error("not implemented: formatAddress");
}

// test: node --test --test-name-pattern="rectangleArea" exercises/02-typescript-core/unit-02-interfaces-unions-literais/exercises.test.ts
export function rectangleArea(rect: Rectangle): number {
  throw new Error("not implemented: rectangleArea");
}

// test: node --test --test-name-pattern="describeMembership" exercises/02-typescript-core/unit-02-interfaces-unions-literais/exercises.test.ts
export function describeMembership(member: Member): string {
  throw new Error("not implemented: describeMembership");
}

// test: node --test --test-name-pattern="describeShape" exercises/02-typescript-core/unit-02-interfaces-unions-literais/exercises.test.ts
export function describeShape(shape: Shape): string {
  throw new Error("not implemented: describeShape");
}

// test: node --test --test-name-pattern="combineProfile" exercises/02-typescript-core/unit-02-interfaces-unions-literais/exercises.test.ts
export function combineProfile(
  base: PersonalInfo,
  extra: ContactInfo,
): PersonalInfo & ContactInfo {
  throw new Error("not implemented: combineProfile");
}

// test: node --test --test-name-pattern="getStatusMessage" exercises/02-typescript-core/unit-02-interfaces-unions-literais/exercises.test.ts
export function getStatusMessage(status: Status): string {
  throw new Error("not implemented: getStatusMessage");
}

// --- Intermediários --------------------------------------------------------

// test: node --test --test-name-pattern="sumReadonlyArray" exercises/02-typescript-core/unit-02-interfaces-unions-literais/exercises.test.ts
export function sumReadonlyArray(values: readonly number[]): number {
  throw new Error("not implemented: sumReadonlyArray");
}

// test: node --test --test-name-pattern="renameCityImmutable" exercises/02-typescript-core/unit-02-interfaces-unions-literais/exercises.test.ts
export function renameCityImmutable(address: Address, newCity: string): Address {
  throw new Error("not implemented: renameCityImmutable");
}

// test: node --test --test-name-pattern="describePaymentMethod" exercises/02-typescript-core/unit-02-interfaces-unions-literais/exercises.test.ts
export function describePaymentMethod(method: PaymentMethod): string {
  throw new Error("not implemented: describePaymentMethod");
}

// test: node --test --test-name-pattern="mergeConfigs" exercises/02-typescript-core/unit-02-interfaces-unions-literais/exercises.test.ts
export function mergeConfigs(
  base: BaseConfig,
  overrides: ConfigOverrides,
): BaseConfig & ConfigOverrides {
  throw new Error("not implemented: mergeConfigs");
}

// --- Debugging --------------------------------------------------------------
//
// As duas funções abaixo JÁ ESTÃO IMPLEMENTADAS, mas contêm um bug real.
// Sua tarefa não é reescrever do zero: é diagnosticar e corrigir.

// test: node --test --test-name-pattern="fixDiscountCalculation" exercises/02-typescript-core/unit-02-interfaces-unions-literais/exercises.test.ts
export function fixDiscountCalculation(product: Product): number {
  // Sintoma relatado: o valor do desconto sai absurdamente alto (e produtos
  // sem desconto ainda quebram), porque o código esqueceu de dividir o
  // percentual por 100 e também assume que `discountPercent` sempre existe.
  const discount = product.price * product.discountPercent!;
  return product.price - discount;
}

// test: node --test --test-name-pattern="fixShapeAreaBug" exercises/02-typescript-core/unit-02-interfaces-unions-literais/exercises.test.ts
export function fixShapeAreaBug(shape: Shape): number {
  // Sintoma relatado: a área calculada para retângulos está errada quando
  // width e height são diferentes — o valor retornado é sempre width ao
  // quadrado, como se fosse um quadrado.
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius * shape.radius;
    case "square":
      return shape.side * shape.side;
    case "rectangle":
      return shape.width * shape.width;
    default:
      return 0;
  }
}

// --- Refatoração -------------------------------------------------------------
//
// Esta função já funciona corretamente. A tarefa é refatorar para reduzir
// passos manuais, mantendo o mesmo comportamento observável.

// test: node --test --test-name-pattern="refactorFormatAddress" exercises/02-typescript-core/unit-02-interfaces-unions-literais/exercises.test.ts
export function refactorFormatAddress(address: Address): string {
  let result = "";
  const street = address.street;
  result = result + street;
  result = result + ", ";
  const city = address.city;
  result = result + city;
  result = result + " - ";
  const zip = address.zipCode;
  result = result + zip;
  return result;
}

// --- Desafio integrador -------------------------------------------------------

// test: node --test --test-name-pattern="summarizeOrder" exercises/02-typescript-core/unit-02-interfaces-unions-literais/exercises.test.ts
export function summarizeOrder(order: Order): OrderSummary {
  throw new Error("not implemented: summarizeOrder");
}
