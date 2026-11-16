# Dicas — Unidade 2 (Java)

Use `DICA_1`, `DICA_2` ou `DICA_3` dizendo qual exercício travou.

## Nível 1 — direção, sem código

- `plus`/`minus`: um `record` é imutável. Se você não pode mudar
  `cents`, o que o método precisa devolver?
- `isDebit`: dentro de um `enum`, `this` é a constante atual. Como
  comparar com `WITHDRAWAL`?
- `withdraw`: em que ordem fazer as coisas para que um erro nunca deixe
  o saldo alterado?
- `PercentFee`: pontos-base são centésimos de porcentagem. Quanto é
  1% em pontos-base?
- `CustomerId`: o que um `record` gera automaticamente que essa classe
  não tem?
- `transfer`: valide **tudo** antes de mexer em qualquer conta.

## Nível 2 — pista mais direta

- `plus`: `return new Money(cents + other.cents());`
- `isDebit`: `return this == WITHDRAWAL || this == TRANSFER;` (em enum,
  `==` é seguro: cada constante existe uma vez só).
- `withdraw`: cheque `amount.cents() <= 0`, depois
  `amount.cents() > balance.cents()`, e só no fim faça
  `balance = balance.minus(amount)`.
- `PercentFee`: `amount.cents() * basisPoints / 10_000` (em `long`).
- `CustomerId`: troque a classe por `record CustomerId(String value)`
  ou implemente `equals` e `hashCode` com `Objects.equals`/`Objects.hash`.

## Nível 3 — quase o código, mas ainda não a solução

- `transfer`:
  ```java
  Money total = amount.plus(fee.apply(amount));
  if (total.cents() > from.balance().cents()) {
      throw new IllegalStateException("saldo insuficiente");
  }
  // só agora: debitar o total de `from` e creditar `amount` em `to`
  ```
