# Unidade 2 — Classes, records, enums e interfaces

Fase 2, Unidade 2. Cobre: `record`, `class` com estado privado,
encapsulamento, `enum` com comportamento, `interface` e
polimorfismo, exceções de regra de negócio, `equals`/`hashCode`.

Por que isso importa para backend: uma API Spring é feita de objetos
com responsabilidade clara — entidades, value objects, serviços.
Esta unidade já usa o domínio do **LedgerFlow** (carteira digital):
dinheiro, conta, tarifa e transferência. O que você escrever aqui é o
rascunho mental das entidades da Fase 4.

Ponte com o que você já sabe: classes em JS (Unidade 13) existem, mas
lá qualquer campo é público e não há tipo. Em Java o compilador garante
quem pode mexer em quê.

## Antes de começar

Responda por escrito:

1. Qual a diferença entre um `record` e uma `class` comum? Quando um
   valor (como dinheiro) deveria ser imutável?
2. Por que `balance` de uma conta deve ser `private` e só mudar via
   `deposit`/`withdraw`?
3. Um `HashSet` decide se dois objetos são "o mesmo" usando quais
   métodos?

## Como trabalhar

1. Abra `exercises/13-java-core/src/main/java/forge/java/Unit02Exercises.java`.
   Os tipos já existem; os métodos com `TODO` lançam
   `UnsupportedOperationException`.
2. Rode os testes:

   ```bash
   mvn -q -f exercises/13-java-core/pom.xml test -Dtest=Unit02ExercisesTest
   ```

3. Valores em centavos (`long`), nunca `double`.

## Exercícios fundamentais (6)

1. **`plus(Money other)`** — em `Money`, devolve um **novo** `Money` com
   a soma. O original não muda.
2. **`minus(Money other)`** — devolve um novo `Money` com a diferença
   (pode ficar negativo).
3. **`isNegative()`** — `true` quando `cents < 0`.
4. **`isDebit()`** — em `TransactionType`, `true` para `WITHDRAWAL` e
   `TRANSFER`, `false` para `DEPOSIT`.
5. **`deposit(Money amount)`** — em `Account`, soma ao saldo. Valor
   zero ou negativo lança `IllegalArgumentException`.
6. **`withdraw(Money amount)`** — subtrai do saldo. Valor zero ou
   negativo lança `IllegalArgumentException`; saldo insuficiente lança
   `IllegalStateException` **sem alterar o saldo**.

## Exercícios intermediários (2)

7. **`FlatFee`** — implemente `apply`: a tarifa é sempre o valor fixo
   do record, qualquer que seja o valor da operação.
8. **`PercentFee`** — implemente `apply`: tarifa em pontos-base
   (`150` = 1,5%), arredondando para baixo em centavos.
   `PercentFee(150).apply(Money(10_000))` → `Money(150)`.

## Debugging (1)

9. **`CustomerId`** — dois `CustomerId` com o mesmo valor deveriam ser
   iguais, mas um `HashSet` guarda os dois e `equals` devolve `false`.
   Corrija (há mais de um jeito certo).

## Desafio (1)

10. **`transfer(Account from, Account to, Money amount, Fee fee)`** —
    debita `amount + tarifa` de `from` e credita só `amount` em `to`.
    Se `from` não tiver saldo para o total, lança
    `IllegalStateException` e **nenhuma das duas contas muda**.

## Gate

Suíte verde + reflexão: por que `Money` é `record` e `Account` é
`class`? O que garantiu que uma transferência falha sem deixar saldo
pela metade?
