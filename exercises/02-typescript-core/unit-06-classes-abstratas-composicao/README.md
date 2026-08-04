# Unidade 6 — Classes abstratas, interfaces e composição

Fase 2, Unidade 6. Cobre: classes com campos e construtores tipados,
`abstract class` e métodos abstratos, interfaces implementadas por classes,
e composição como alternativa à herança.

## Antes de começar

Responda por escrito:

1. Qual a diferença entre uma `abstract class` e uma `interface` — quando
   cada uma é a escolha certa?
   R =
2. Uma classe abstrata pode ter métodos com implementação concreta, além
   dos abstratos? O que isso muda em relação a uma interface (que não tem
   implementação nenhuma)?
   R =
3. Dado um cenário onde uma classe "precisa" reaproveitar comportamento de
   outra sem ser um subtipo dela (não é um "is-a"), por que composição
   costuma ser melhor que herança nesse caso?
   R =

Não pesquise ainda. Escreva sua hipótese antes de implementar qualquer
classe ou método — você vai comparar com o resultado real ao rodar os
testes.

## Como trabalhar

1. Abra `exercises.ts`. Cada método com lógica a implementar tem
   `throw new Error("not implemented: <nome>")`.
2. Implemente uma classe/método por vez, **com anotações de tipo explícitas**
   nos parâmetros e no retorno (não confie só em inferência aqui — o
   objetivo da unidade é praticar escrever os tipos).
3. Rode os testes:

   ```bash
   npm test
   ```

4. Todos os testes começam falhando, exceto o de refatoração. Isso é
   esperado.
5. Verifique os tipos (o `node --test` roda mas **não** typecheck; ele só
   apaga os tipos). Rode separadamente:

   ```bash
   npx tsc --noEmit --strict exercises/02-typescript-core/unit-06-classes-abstratas-composicao/exercises.ts
   ```

6. Não use `any`. Se travar em um tipo, é sinal de que falta pensar no
   formato do dado, não de usar `any` para silenciar o erro.
7. O `node --test` roda TypeScript em modo "strip-only": **não use a
   sintaxe de parameter properties** (`constructor(public x: number) {}`).
   Declare o campo (`readonly x: number;`) e atribua no corpo do
   construtor (`this.x = x;`).

## Exercícios fundamentais (8)

1. **`class Point`** — construtor `(x: number, y: number)` (campos
   públicos e somente leitura); método `distanceTo(other: Point): number`
   retorna a distância euclidiana entre os dois pontos.
2. **`class BankAccount`** — construtor `(owner: string, initialBalance: number)`;
   `deposit(amount: number): void` lança `RangeError` se `amount` não for
   positivo; `withdraw(amount: number): void` lança `RangeError` se
   `amount` não for positivo ou se o saldo for insuficiente;
   `getBalance(): number` retorna o saldo atual.
3. **`interface Shape { area(): number; perimeter(): number }`** (declare
   no topo do arquivo) e **`class Rectangle implements Shape`** —
   construtor `(width: number, height: number)`.
4. **`class Circle implements Shape`** — construtor `(radius: number)`.
5. **`abstract class Employee`** — construtor `(name: string, baseSalary: number)`
   (com `baseSalary` acessível às subclasses); método abstrato
   `calculateSalary(): number`; método concreto `describe(): string` que
   retorna `"<name>: R$ <calculateSalary().toFixed(2)>"`.
6. **`class Manager extends Employee`** — construtor
   `(name: string, baseSalary: number, teamSize: number)`;
   `calculateSalary()` retorna `baseSalary + teamSize * 200`.
7. **`type SeniorityLevel = "junior" | "pleno" | "senior"`** (declare o
   alias) e **`class Developer extends Employee`** — construtor
   `(name: string, baseSalary: number, seniorityLevel: SeniorityLevel)`;
   `calculateSalary()` multiplica `baseSalary` por `1.0` (junior), `1.3`
   (pleno) ou `1.6` (senior).
8. **`class Temperature`** — construtor `(celsius: number)`; método
   `toFahrenheit(): number`; método estático
   `fromFahrenheit(fahrenheit: number): Temperature` cria uma instância a
   partir de uma temperatura em Fahrenheit.

## Exercícios intermediários (4)

9. **`interface Logger { log(message: string): void }`** (declare no
   topo) e **`class OrderProcessor`** — recebe um `Logger` **via injeção
   no construtor** (não estende nada) e método
   `process(orderId: string, amount: number): string` que chama
   `logger.log("Pedido <orderId> processado: R$ <amount formatado>")` e
   retorna `"Pedido <orderId> confirmado"`. Este é um exemplo de
   composição: `OrderProcessor` *usa* um `Logger`, não *é* um `Logger`.
10. **`class ShoppingCart`** — mantém uma lista privada de itens;
    `addItem(name: string, price: number, quantity: number): void`;
    `removeItem(name: string): boolean` (retorna se removeu algo);
    `getTotal(): number` soma `price * quantity` de todos os itens.
11. **`interface ShuffleStrategy { shuffle(songs: string[]): string[] }`**
    (declare no topo) e **`class Playlist`** — construtor
    `(songs: string[], strategy: ShuffleStrategy)`; método
    `play(): string[]` delega a ordenação para `strategy.shuffle(songs)`.
    De novo: composição, não herança — a estratégia de embaralhar é
    plugável.
12. **`class Library`** — mantém uma lista privada de livros;
    `addBook(title: string, author: string): void`;
    `findByAuthor(author: string): string[]` retorna os títulos daquele
    autor; `removeBook(title: string): boolean`.

## Debugging (2)

13. **`class Wallet`** — a implementação atual tem um bug no construtor:
    o saldo inicial nunca é usado. Leia, entenda o sintoma, corrija sem
    mudar a assinatura pública.
14. **`class ClearanceItem extends Discountable`** — a implementação
    atual de `getDiscountRate()` está com um bug de escala (confunde
    porcentagem com fração decimal), fazendo `finalPrice()` sair muito
    errado. Corrija.

## Refatoração (1)

15. **`class RobotDog`** — atualmente `RobotDog extends SoundMaker`
    apenas para reaproveitar `makeSound()`, mas um `RobotDog` não é um
    tipo de `SoundMaker` (não é um "is-a" válido). Refatore a relação
    entre `SoundMaker` e `RobotDog` para **composição** (injeção via
    construtor) em vez de herança, **sem mudar a API pública nem o
    resultado observável de `bark()`**.

## Desafio integrador (1)

16. **`describeWorkforce(employees: Employee[]): { totalPayroll: number; highestPaid: string }`**
    — recebe uma lista de `Employee` (podem ser `Manager`, `Developer` ou
    qualquer outra subclasse) e retorna:
    - `totalPayroll`: soma de `calculateSalary()` de todos os
      funcionários, chamado polimorficamente;
    - `highestPaid`: `name` do funcionário com maior `calculateSalary()`
      (em empate, o primeiro na ordem original).

    Lança `RangeError` se `employees` for um array vazio.

## Critérios de aceitação

- `npm test` sem falhas.
- `npx tsc --noEmit --strict` no arquivo não acusa erro.
- Nenhuma classe ou método usa `any`.
- Você consegue explicar, sem consultar o código, quando escolher
  `abstract class`, quando escolher `interface`, e quando composição é
  preferível à herança — sem recorrer a hierarquias "porque no Java se
  faz assim".

## Dicas

Peça `DICA_1`, `DICA_2` ou `DICA_3` quando travar em um exercício
específico — ou veja `hints.md` para o roteiro geral por nível.

Não peça `MOSTRAR_SOLUCAO` antes de tentar de verdade.
