# Unidade 3 — Coleções e Streams

Fase 2, Unidade 3. Cobre: `List`, `Set`, `Map`, `Optional`, coleções
imutáveis (`List.of`) e a API de Streams (`map`, `filter`, `reduce`,
`anyMatch`, `collect`, `groupingBy`, `sorted`, `limit`).

Por que isso importa para backend: é o que você vai usar todo dia num
serviço Spring — transformar entidades em DTOs, somar transações,
agrupar extrato por categoria.

Ponte com o que você já sabe: é a **sua Unidade 9 de JS** em Java.
`map`/`filter`/`reduce` existem com o mesmo sentido; a diferença é que
você abre o fluxo com `.stream()` e fecha com um coletor
(`.toList()`, `Collectors.groupingBy`, `.sum()`).

## Antes de começar

Responda por escrito:

1. Em JS, `find` devolve `undefined` quando nada casa. O que Java
   devolve no lugar, e por que isso é melhor que `null`?
2. `List.of(3, 1, 2)` pode ser ordenada no lugar? O que acontece?
3. Por que `mapToLong(...).sum()` é melhor que `reduce` para somar
   centavos?

## Como trabalhar

1. Abra `exercises/13-java-core/src/main/java/forge/java/Unit03Exercises.java`.
2. Use Streams em vez de laços `for`, exceto no exercício de debugging,
   onde você só ajusta o necessário.
3. Rode os testes:

   ```bash
   mvn -q -f exercises/13-java-core/pom.xml test -Dtest=Unit03ExercisesTest
   ```

## Exercícios fundamentais (6)

1. **`doubleAll(List<Integer> numbers)`** — nova lista com cada número
   dobrado (`map`).
2. **`keepEven(List<Integer> numbers)`** — só os pares (`filter`).
3. **`sumAll(List<Integer> numbers)`** — soma; lista vazia dá `0`.
4. **`findFirstAbove(List<Integer> numbers, int threshold)`** — o
   primeiro número maior que `threshold`, como `Optional<Integer>`.
5. **`anyNegative(List<Integer> numbers)`** — `true` se existir algum
   negativo (`anyMatch`).
6. **`distinctSorted(List<Integer> numbers)`** — sem repetidos, em
   ordem crescente.

## Exercícios intermediários (2)

7. **`totalPaidCents(List<Transaction> transactions)`** — soma
   `amountCents` só das transações com status `"PAID"`.
8. **`sumByCategory(List<Transaction> transactions)`** — `Map` de
   categoria para total pago em centavos (só `"PAID"`).

## Debugging (1)

9. **`sortedCopy(List<Integer> numbers)`** — deveria devolver uma cópia
   ordenada, mas altera a lista recebida e quebra com `List.of(...)`.
   Corrija sem mudar a assinatura.

## Desafio (1)

10. **`topCategories(List<Transaction> transactions, int n)`** — as `n`
    categorias com maior total pago, do maior para o menor. Empate:
    ordem alfabética.

## Gate

Suíte verde + reflexão: compare `groupingBy` com o `groupByKey` que
você fez com `reduce` em JS. O que ficou mais simples? O que ficou mais
verboso?
