# Dicas — Unidade 3 (Java)

Use `DICA_1`, `DICA_2` ou `DICA_3` dizendo qual exercício travou.

## Nível 1 — direção, sem código

- Todo exercício começa com `numbers.stream()` e termina com algo que
  "fecha" o fluxo. Qual fechamento devolve lista? E número?
- `findFirstAbove`: qual operação de Stream devolve o primeiro elemento
  já como `Optional`?
- `totalPaidCents`: filtre antes de somar. Como transformar um Stream
  de objetos em Stream de `long`?
- `sumByCategory`: procure em `Collectors` um coletor que agrupa e
  outro que soma dentro do grupo.
- `sortedCopy`: quem é o dono da lista recebida? O método pode
  mexer nela?
- `topCategories`: reaproveite `sumByCategory` e ordene as entradas do
  mapa.

## Nível 2 — pista mais direta

- `doubleAll`: `numbers.stream().map(n -> n * 2).toList()`.
- `sumAll`: `mapToInt(Integer::intValue).sum()`.
- `findFirstAbove`: `.filter(n -> n > threshold).findFirst()`.
- `distinctSorted`: `.distinct().sorted().toList()`.
- `totalPaidCents`: `.filter(t -> "PAID".equals(t.status())).mapToLong(Transaction::amountCents).sum()`.
- `sumByCategory`: `Collectors.groupingBy(Transaction::category, Collectors.summingLong(Transaction::amountCents))`.
- `sortedCopy`: crie uma lista nova antes de ordenar, ou use
  `stream().sorted()`.

## Nível 3 — quase o código, mas ainda não a solução

- `topCategories`:
  ```java
  return sumByCategory(transactions).entrySet().stream()
      .sorted(/* total desc, depois chave asc */)
      .limit(n)
      .map(Map.Entry::getKey)
      .toList();
  ```
  Para o comparador, olhe `Map.Entry.comparingByValue(Comparator.reverseOrder())`
  e `.thenComparing(Map.Entry.comparingByKey())`.
