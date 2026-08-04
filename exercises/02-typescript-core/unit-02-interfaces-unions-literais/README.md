# Unidade 2 — Interfaces, propriedades opcionais, readonly, unions, intersections e tipos literais

Fase 2, Unidade 2. Cobre: `interface`, propriedades opcionais (`?`),
`readonly`, tipos união (`|`), tipos interseção (`&`) e tipos literais.

## Antes de começar

Responda por escrito:

1. Qual a diferença prática entre marcar uma propriedade como `age?: number`
   e simplesmente omitir a checagem de `undefined` no corpo da função?
   R =
2. Se uma função recebe um parâmetro do tipo `A | B`, o que o TypeScript
   permite que você acesse nesse parâmetro sem antes checar de qual dos
   dois tipos ele é? E o que muda quando `A` e `B` compartilham uma
   propriedade com um tipo literal em comum (ex: `kind: "circle"`)?
   R =
3. `readonly` impede que a propriedade seja alterada em tempo de execução
   (como `Object.freeze`) ou é uma checagem que só existe durante a
   compilação?
   R =

Não pesquise ainda. Escreva sua hipótese antes de implementar qualquer
função — você vai comparar com o resultado real ao rodar os testes.

## Como trabalhar

1. Abra `exercises.ts`. Cada função tem `throw new Error("not implemented: <nome>")`.
2. Implemente uma função por vez, **com anotações de tipo explícitas** nos
   parâmetros e no retorno (não confie só em inferência aqui — o objetivo
   da unidade é praticar escrever os tipos).
3. Rode os testes:

   ```bash
   npm test
   ```

4. Todos os testes começam falhando. Isso é esperado.
5. Verifique os tipos (o `node --test` roda mas **não** typecheck; ele só
   apaga os tipos). Rode separadamente:

   ```bash
   npx tsc --noEmit --strict exercises/02-typescript-core/unit-02-interfaces-unions-literais/exercises.ts
   ```

6. Não use `any`. Se travar em um tipo, é sinal de que falta pensar no
   formato do dado, não de usar `any` para silenciar o erro.

## Exercícios fundamentais (8)

1. **`describeUser(user: User): string`** — retorna `"<name> <<email>>"`;
   se `age` estiver presente, retorna `"<name>, <age> anos <<email>>"`.
2. **`getFinalPrice(product: Product): number`** — se `discountPercent`
   estiver presente, aplica o desconto sobre `price`; senão retorna
   `price` cheio.
3. **`formatAddress(address: Address): string`** — retorna
   `"<street>, <city> - <zipCode>"`. `Address` tem todas as propriedades
   `readonly`.
4. **`rectangleArea(rect: Rectangle): number`** — `width * height`.
5. **`describeMembership(member: Member): string`** — retorna
   `"<name>: plano <tier em português>"` (`free` → "gratuito", `premium` →
   "premium", `enterprise` → "enterprise").
6. **`describeShape(shape: Shape): string`** — `Shape` é uma união
   discriminada (`Circle | Square | RectangleShape`) com campo literal
   `kind`. Retorna `"<forma> com área <valor com 2 casas>"` (ex:
   `"quadrado com área 9.00"`).
7. **`combineProfile(base: PersonalInfo, extra: ContactInfo): PersonalInfo & ContactInfo`**
   — combina os dois objetos num só, usando um tipo **interseção**.
8. **`getStatusMessage(status: Status): string`** — `Status` é um tipo
   literal (`"pending" | "active" | "cancelled"`). Retorna a mensagem
   correspondente em português.

## Exercícios intermediários (4)

9. **`sumReadonlyArray(values: readonly number[]): number`** — soma os
   elementos sem nunca tentar alterar o array recebido (nem
   `.push`, nem `.sort`, nem index assignment — o tipo `readonly number[]`
   proíbe isso em tempo de compilação).
10. **`renameCityImmutable(address: Address, newCity: string): Address`**
    — retorna um **novo** objeto `Address` com `city` trocado por
    `newCity`, sem mutar `address` (que é `readonly`, então mutar nem
    compilaria).
11. **`describePaymentMethod(method: PaymentMethod): string`** —
    `PaymentMethod` é `CreditCard | BankTransfer`, e as duas variantes
    **não** compartilham um campo `kind`. Use o operador `in` para
    descobrir qual variante você recebeu. Cartão: retorna
    `"Cartão terminado em <últimos 4 dígitos>"`. Transferência: retorna
    `"Transferência via <bankName>"`.
12. **`mergeConfigs(base: BaseConfig, overrides: ConfigOverrides): BaseConfig & ConfigOverrides`**
    — `ConfigOverrides` tem todas as propriedades opcionais. Retorna a
    combinação de `base` com `overrides`, onde os valores presentes em
    `overrides` sobrescrevem os de `base`.

## Debugging (2)

13. **`fixDiscountCalculation(product: Product): number`** — a
    implementação atual tem dois problemas: o percentual de desconto não
    é dividido por 100, e produtos sem `discountPercent` quebram porque o
    código assume que a propriedade opcional sempre existe. Corrija sem
    mudar a assinatura.
14. **`fixShapeAreaBug(shape: Shape): number`** — a implementação atual
    calcula a área errada para retângulos quando `width` e `height` são
    diferentes. Leia o `switch`, entenda o sintoma, corrija.

## Refatoração (1)

15. **`refactorFormatAddress(address: Address): string`** — a
    implementação atual já produz o resultado correto (mesmo formato do
    exercício 3), mas usa passos manuais e variáveis desnecessárias.
    Refatore para algo mais direto, **sem mudar o comportamento
    observável**.

## Desafio integrador (1)

16. **`summarizeOrder(order: Order): OrderSummary`** — recebe um pedido
    (itens `readonly`, cliente `User`, forma de pagamento
    `PaymentMethod`, `status` literal, `note` opcional) e retorna:
    - `total`: soma de `price * quantity` de todos os itens;
    - `status`: o mesmo `status` do pedido;
    - `paymentDescription`: mesma lógica do exercício 11;
    - `customerLine`: mesma lógica do exercício 1, aplicada a
      `order.customer`.

    Lança `RangeError` se `order.items` for um array vazio.

## Critérios de aceitação

- `npm test` sem falhas.
- `npx tsc --noEmit --strict` no arquivo não acusa erro.
- Nenhuma função usa `any`.
- Você consegue explicar, sem consultar o código, a diferença entre uma
  união discriminada (com campo literal em comum) e uma união comum (que
  exige `in` ou outra checagem de propriedade para ser estreitada).

## Dicas

Peça `DICA_1`, `DICA_2` ou `DICA_3` quando travar em um exercício
específico — ou veja `hints.md` para o roteiro geral por nível.

Não peça `MOSTRAR_SOLUCAO` antes de tentar de verdade.
