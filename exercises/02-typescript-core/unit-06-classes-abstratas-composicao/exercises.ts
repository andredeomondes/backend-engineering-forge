// Unidade 6 — Classes abstratas, interfaces e composição
//
// Implemente cada classe/método. Não use bibliotecas externas. Não use `any`.
// Node executa TypeScript em modo "strip-only": não use parameter
// properties (`constructor(public x: number)`) — declare os campos e
// atribua no corpo do construtor.
// Veja README.md para o enunciado completo de cada exercício.

// --- Fundamentais ---------------------------------------------------------

// test: node --test --test-name-pattern="Point" exercises/02-typescript-core/unit-06-classes-abstratas-composicao/exercises.test.ts
export class Point {
  readonly x: number;
  readonly y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  distanceTo(other: Point): number {
    throw new Error("not implemented: Point.distanceTo");
  }
}

// test: node --test --test-name-pattern="BankAccount" exercises/02-typescript-core/unit-06-classes-abstratas-composicao/exercises.test.ts
export class BankAccount {
  readonly owner: string;
  private balance: number;

  constructor(owner: string, initialBalance: number) {
    this.owner = owner;
    this.balance = initialBalance;
  }

  deposit(amount: number): void {
    throw new Error("not implemented: BankAccount.deposit");
  }

  withdraw(amount: number): void {
    throw new Error("not implemented: BankAccount.withdraw");
  }

  getBalance(): number {
    throw new Error("not implemented: BankAccount.getBalance");
  }
}

export interface Shape {
  area(): number;
  perimeter(): number;
}

// test: node --test --test-name-pattern="Rectangle" exercises/02-typescript-core/unit-06-classes-abstratas-composicao/exercises.test.ts
export class Rectangle implements Shape {
  readonly width: number;
  readonly height: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  area(): number {
    throw new Error("not implemented: Rectangle.area");
  }

  perimeter(): number {
    throw new Error("not implemented: Rectangle.perimeter");
  }
}

// test: node --test --test-name-pattern="Circle" exercises/02-typescript-core/unit-06-classes-abstratas-composicao/exercises.test.ts
export class Circle implements Shape {
  readonly radius: number;

  constructor(radius: number) {
    this.radius = radius;
  }

  area(): number {
    throw new Error("not implemented: Circle.area");
  }

  perimeter(): number {
    throw new Error("not implemented: Circle.perimeter");
  }
}

// test: node --test --test-name-pattern="Employee" exercises/02-typescript-core/unit-06-classes-abstratas-composicao/exercises.test.ts
export abstract class Employee {
  readonly name: string;
  protected readonly baseSalary: number;

  constructor(name: string, baseSalary: number) {
    this.name = name;
    this.baseSalary = baseSalary;
  }

  abstract calculateSalary(): number;

  describe(): string {
    throw new Error("not implemented: Employee.describe");
  }
}

// test: node --test --test-name-pattern="Manager" exercises/02-typescript-core/unit-06-classes-abstratas-composicao/exercises.test.ts
export class Manager extends Employee {
  private readonly teamSize: number;

  constructor(name: string, baseSalary: number, teamSize: number) {
    super(name, baseSalary);
    this.teamSize = teamSize;
  }

  calculateSalary(): number {
    throw new Error("not implemented: Manager.calculateSalary");
  }
}

export type SeniorityLevel = "junior" | "pleno" | "senior";

// test: node --test --test-name-pattern="Developer" exercises/02-typescript-core/unit-06-classes-abstratas-composicao/exercises.test.ts
export class Developer extends Employee {
  private readonly seniorityLevel: SeniorityLevel;

  constructor(name: string, baseSalary: number, seniorityLevel: SeniorityLevel) {
    super(name, baseSalary);
    this.seniorityLevel = seniorityLevel;
  }

  calculateSalary(): number {
    throw new Error("not implemented: Developer.calculateSalary");
  }
}

// test: node --test --test-name-pattern="Temperature" exercises/02-typescript-core/unit-06-classes-abstratas-composicao/exercises.test.ts
export class Temperature {
  readonly celsius: number;

  constructor(celsius: number) {
    this.celsius = celsius;
  }

  toFahrenheit(): number {
    throw new Error("not implemented: Temperature.toFahrenheit");
  }

  static fromFahrenheit(fahrenheit: number): Temperature {
    throw new Error("not implemented: Temperature.fromFahrenheit");
  }
}

// --- Intermediários --------------------------------------------------------

export interface Logger {
  log(message: string): void;
}

// test: node --test --test-name-pattern="OrderProcessor" exercises/02-typescript-core/unit-06-classes-abstratas-composicao/exercises.test.ts
export class OrderProcessor {
  private readonly logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
  }

  process(orderId: string, amount: number): string {
    throw new Error("not implemented: OrderProcessor.process");
  }
}

type CartItem = { name: string; price: number; quantity: number };

// test: node --test --test-name-pattern="ShoppingCart" exercises/02-typescript-core/unit-06-classes-abstratas-composicao/exercises.test.ts
export class ShoppingCart {
  private items: CartItem[] = [];

  addItem(name: string, price: number, quantity: number): void {
    throw new Error("not implemented: ShoppingCart.addItem");
  }

  removeItem(name: string): boolean {
    throw new Error("not implemented: ShoppingCart.removeItem");
  }

  getTotal(): number {
    throw new Error("not implemented: ShoppingCart.getTotal");
  }
}

export interface ShuffleStrategy {
  shuffle(songs: string[]): string[];
}

// test: node --test --test-name-pattern="Playlist" exercises/02-typescript-core/unit-06-classes-abstratas-composicao/exercises.test.ts
export class Playlist {
  private readonly songs: string[];
  private readonly strategy: ShuffleStrategy;

  constructor(songs: string[], strategy: ShuffleStrategy) {
    this.songs = songs;
    this.strategy = strategy;
  }

  play(): string[] {
    throw new Error("not implemented: Playlist.play");
  }
}

type Book = { title: string; author: string };

// test: node --test --test-name-pattern="Library" exercises/02-typescript-core/unit-06-classes-abstratas-composicao/exercises.test.ts
export class Library {
  private books: Book[] = [];

  addBook(title: string, author: string): void {
    throw new Error("not implemented: Library.addBook");
  }

  findByAuthor(author: string): string[] {
    throw new Error("not implemented: Library.findByAuthor");
  }

  removeBook(title: string): boolean {
    throw new Error("not implemented: Library.removeBook");
  }
}

// --- Debugging --------------------------------------------------------------
//
// As duas classes abaixo JÁ ESTÃO IMPLEMENTADAS, mas contêm um bug real.
// Sua tarefa não é reescrever do zero: é diagnosticar e corrigir.

// test: node --test --test-name-pattern="Wallet" exercises/02-typescript-core/unit-06-classes-abstratas-composicao/exercises.test.ts
export class Wallet {
  private balance: number;

  constructor(initialBalance: number) {
    // Sintoma relatado: toda carteira nova começa com saldo zero, mesmo
    // quando um valor inicial diferente de zero é passado no construtor.
    this.balance = 0;
  }

  deposit(amount: number): void {
    this.balance += amount;
  }

  getBalance(): number {
    return this.balance;
  }
}

// test: node --test --test-name-pattern="ClearanceItem" exercises/02-typescript-core/unit-06-classes-abstratas-composicao/exercises.test.ts
export abstract class Discountable {
  readonly price: number;

  constructor(price: number) {
    this.price = price;
  }

  abstract getDiscountRate(): number;

  finalPrice(): number {
    return this.price - this.price * this.getDiscountRate();
  }
}

export class ClearanceItem extends Discountable {
  private readonly discountPercent: number;

  constructor(price: number, discountPercent: number) {
    super(price);
    this.discountPercent = discountPercent;
  }

  getDiscountRate(): number {
    // Sintoma relatado: itens com 20% de desconto estão saindo de graça
    // (ou até com preço final negativo) em vez de sair 20% mais baratos.
    return this.discountPercent;
  }
}

// --- Refatoração -------------------------------------------------------------
//
// As duas classes abaixo já funcionam corretamente. A tarefa é refatorar a
// relação entre elas — de herança para composição — mantendo o mesmo
// comportamento observável (mesma API pública, mesmo resultado de `bark()`).
//
// `RobotDog` não é um tipo de `SoundMaker` (não é um "is-a"): ele apenas usa
// um som para latir. Herdar aqui só existe para reaproveitar código, o que é
// exatamente o tipo de hierarquia desnecessária que a filosofia deste curso
// pede para evitar.

// test: node --test --test-name-pattern="RobotDog" exercises/02-typescript-core/unit-06-classes-abstratas-composicao/exercises.test.ts
export class SoundMaker {
  makeSound(): string {
    return "bip-bip";
  }
}

export class RobotDog extends SoundMaker {
  bark(): string {
    return `Robot dog says: ${this.makeSound()}`;
  }
}

// --- Desafio integrador -------------------------------------------------------

// test: node --test --test-name-pattern="describeWorkforce" exercises/02-typescript-core/unit-06-classes-abstratas-composicao/exercises.test.ts
export function describeWorkforce(employees: Employee[]): {
  totalPayroll: number;
  highestPaid: string;
} {
  throw new Error("not implemented: describeWorkforce");
}
