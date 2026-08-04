import { test } from "node:test";
import assert from "node:assert/strict";

import {
  Point,
  BankAccount,
  Rectangle,
  Circle,
  Manager,
  Developer,
  Temperature,
  OrderProcessor,
  ShoppingCart,
  Playlist,
  Library,
  Wallet,
  ClearanceItem,
  RobotDog,
  describeWorkforce,
} from "./exercises.ts";
import type { Logger, ShuffleStrategy } from "./exercises.ts";

// --- Point --------------------------------------------------------------

test("Point: distanceTo calcula distância euclidiana", () => {
  const a = new Point(0, 0);
  const b = new Point(3, 4);
  assert.equal(a.distanceTo(b), 5);
  assert.equal(a.distanceTo(a), 0);
});

// --- BankAccount ----------------------------------------------------------

test("BankAccount: começa com o saldo inicial informado", () => {
  const acc = new BankAccount("Ana", 100);
  assert.equal(acc.getBalance(), 100);
});

test("BankAccount: deposit aumenta o saldo", () => {
  const acc = new BankAccount("Ana", 100);
  acc.deposit(50);
  assert.equal(acc.getBalance(), 150);
});

test("BankAccount: deposit lança RangeError para valores não positivos", () => {
  const acc = new BankAccount("Ana", 100);
  assert.throws(() => acc.deposit(0), RangeError);
  assert.throws(() => acc.deposit(-5), RangeError);
});

test("BankAccount: withdraw diminui o saldo", () => {
  const acc = new BankAccount("Bruno", 100);
  acc.withdraw(40);
  assert.equal(acc.getBalance(), 60);
});

test("BankAccount: withdraw lança RangeError para saldo insuficiente", () => {
  const acc = new BankAccount("Bruno", 100);
  assert.throws(() => acc.withdraw(1000), RangeError);
});

// --- Rectangle -------------------------------------------------------------

test("Rectangle: area e perimeter", () => {
  const rect = new Rectangle(3, 4);
  assert.equal(rect.area(), 12);
  assert.equal(rect.perimeter(), 14);
});

// --- Circle -------------------------------------------------------------

test("Circle: area e perimeter", () => {
  const circle = new Circle(2);
  assert.ok(Math.abs(circle.area() - Math.PI * 2 * 2) < 1e-9);
  assert.ok(Math.abs(circle.perimeter() - 2 * Math.PI * 2) < 1e-9);
});

// --- Manager -------------------------------------------------------------

test("Manager: calculateSalary soma base + bônus por tamanho de time", () => {
  const manager = new Manager("Ana", 3000, 4);
  assert.equal(manager.calculateSalary(), 3800);
});

test("Manager: describe (herdado de Employee) formata nome e salário", () => {
  const manager = new Manager("Ana", 3000, 4);
  assert.equal(manager.describe(), "Ana: R$ 3800.00");
});

// --- Developer -------------------------------------------------------------

test("Developer: calculateSalary aplica multiplicador por senioridade", () => {
  assert.equal(new Developer("Bruno", 4000, "junior").calculateSalary(), 4000);
  assert.equal(new Developer("Bruno", 4000, "pleno").calculateSalary(), 5200);
  assert.equal(new Developer("Bruno", 4000, "senior").calculateSalary(), 6400);
});

// --- Temperature -------------------------------------------------------------

test("Temperature: toFahrenheit converte celsius para fahrenheit", () => {
  assert.equal(new Temperature(0).toFahrenheit(), 32);
  assert.equal(new Temperature(100).toFahrenheit(), 212);
});

test("Temperature: fromFahrenheit cria instância a partir de fahrenheit", () => {
  assert.equal(Temperature.fromFahrenheit(32).celsius, 0);
  assert.equal(Temperature.fromFahrenheit(212).celsius, 100);
});

// --- OrderProcessor -------------------------------------------------------------

test("OrderProcessor: processa pedido usando o Logger injetado (composição)", () => {
  const logs: string[] = [];
  const logger: Logger = { log: (message: string) => logs.push(message) };
  const processor = new OrderProcessor(logger);

  const result = processor.process("A1", 99.9);

  assert.equal(result, "Pedido A1 confirmado");
  assert.equal(logs.length, 1);
  assert.equal(logs[0], "Pedido A1 processado: R$ 99.90");
});

// --- ShoppingCart -------------------------------------------------------------

test("ShoppingCart: addItem, getTotal e removeItem", () => {
  const cart = new ShoppingCart();
  cart.addItem("Caneca", 10, 2);
  cart.addItem("Notebook", 3000, 1);

  assert.equal(cart.getTotal(), 3020);
  assert.equal(cart.removeItem("Caneca"), true);
  assert.equal(cart.getTotal(), 3000);
  assert.equal(cart.removeItem("Inexistente"), false);
});

// --- Playlist -------------------------------------------------------------

test("Playlist: play delega a ordenação para a ShuffleStrategy injetada", () => {
  const reverseStrategy: ShuffleStrategy = {
    shuffle: (songs: string[]) => [...songs].reverse(),
  };
  const playlist = new Playlist(["a", "b", "c"], reverseStrategy);

  assert.deepEqual(playlist.play(), ["c", "b", "a"]);
});

// --- Library -------------------------------------------------------------

test("Library: addBook, findByAuthor e removeBook", () => {
  const library = new Library();
  library.addBook("Clean Code", "Robert Martin");
  library.addBook("Refactoring", "Martin Fowler");
  library.addBook("Effective Java", "Joshua Bloch");

  assert.deepEqual(library.findByAuthor("Martin Fowler"), ["Refactoring"]);
  assert.equal(library.removeBook("Clean Code"), true);
  assert.deepEqual(library.findByAuthor("Robert Martin"), []);
  assert.equal(library.removeBook("Inexistente"), false);
});

// --- Wallet -------------------------------------------------------------

test("Wallet: mantém o saldo inicial informado no construtor", () => {
  const wallet = new Wallet(100);
  assert.equal(wallet.getBalance(), 100);
  wallet.deposit(50);
  assert.equal(wallet.getBalance(), 150);
});

// --- ClearanceItem -------------------------------------------------------------

test("ClearanceItem: finalPrice aplica a porcentagem de desconto corretamente", () => {
  const item = new ClearanceItem(100, 20);
  assert.equal(item.finalPrice(), 80);

  const halfOff = new ClearanceItem(200, 50);
  assert.equal(halfOff.finalPrice(), 100);
});

// --- RobotDog -------------------------------------------------------------

test("RobotDog: bark usa o som produzido internamente", () => {
  const dog = new RobotDog();
  assert.equal(dog.bark(), "Robot dog says: bip-bip");
});

// --- describeWorkforce -------------------------------------------------------------

test("describeWorkforce: soma a folha e aponta o maior salário", () => {
  const employees = [
    new Manager("Ana", 3000, 4),
    new Developer("Bruno", 4000, "pleno"),
    new Developer("Carla", 2000, "senior"),
  ];

  const summary = describeWorkforce(employees);

  assert.deepEqual(summary, {
    totalPayroll: 12200,
    highestPaid: "Bruno",
  });
});

test("describeWorkforce: lança RangeError em lista vazia", () => {
  assert.throws(() => describeWorkforce([]), RangeError);
});
