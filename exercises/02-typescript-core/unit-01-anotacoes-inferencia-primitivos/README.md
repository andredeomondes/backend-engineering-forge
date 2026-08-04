# Unidade 1 — Anotações, inferência, tipos primitivos, arrays e tuplas

Fase 2, Unidade 1. Cobre: inferência de tipo, anotações explícitas, tipos
primitivos, arrays tipados, tuplas e `type` aliases.

## Antes de começar

Responda por escrito:

1. Se você escreve `let x = 5;` sem anotação, o TypeScript sabe o tipo de
   `x`? Como ele descobre isso sem você dizer?
   R =
2. Qual a diferença entre `string[]` e `[string, number]`?
   R =
3. Um `type` alias cria um tipo novo em tempo de execução (como uma
   `class`) ou só existe durante a compilação?
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
   npx tsc --noEmit --strict exercises/02-typescript-core/unit-01-anotacoes-inferencia-primitivos/exercises.ts
   ```

6. Não use `any`. Se travar em um tipo, é sinal de que falta pensar no
   formato do dado, não de usar `any` para silenciar o erro.

## Exercícios fundamentais (8)

1. **`sum(a: number, b: number): number`** — soma dois números.
2. **`repeatString(str: string, times: number): string`** — repete `str`
   `times` vezes concatenado (sem `String.prototype.repeat`).
3. **`isEven(n: number): boolean`** — retorna se `n` é par.
4. **`formatPriceFromCents(cents: number): string`** — converte centavos
   (inteiro) para uma string `"R$ 12.34"` (sempre duas casas decimais).
5. **`sumNumberArray(values: number[]): number`** — soma todos os
   elementos de um array de números.
6. **`joinWords(words: string[], separator: string): string`** — junta as
   strings do array usando `separator` entre elas (sem `Array.prototype.join`).
7. **`getFirstAndLast(items: string[]): [string, string]`** — retorna uma
   **tupla** `[primeiro, último]`. Se o array tiver um único elemento,
   retorna `[item, item]`. Lança `RangeError` se o array for vazio.
8. **`createPoint(x: number, y: number): [number, number]`** — retorna uma
   tupla `[x, y]`.

## Exercícios intermediários (4)

9. **`type Coordinates = [number, number]`** (declare o alias no topo do
   arquivo) e **`distanceBetween(a: Coordinates, b: Coordinates): number`**
   — distância euclidiana entre dois pontos.
10. **`type Product = { name: string; price: number; inStock: boolean }`**
    (declare o alias) e **`describeProduct(product: Product): string`** —
    retorna `"<name>: R$ <price> (disponível|indisponível)"`, com `price`
    formatado com duas casas decimais.
11. **`parseCoordinatePair(input: string): [number, number] | null`** —
    recebe uma string `"3,4"` e retorna a tupla `[3, 4]`. Retorna `null`
    se o formato for inválido (não tem vírgula, alguma parte não é
    número válido).
12. **`mergeTuples(a: [string, number], b: [string, number]): [string, number][]`**
    — retorna um array com as duas tuplas, ordenado pelo segundo elemento
    (o `number`) de forma crescente.

## Debugging (2)

13. **`fixAverageCalculation(scores: number[]): number`** — a
    implementação atual tem um bug de cálculo de média. Leia, entenda o
    sintoma, corrija sem mudar a assinatura.
14. **`fixTupleOrderBug(pair: [string, number]): string`** — a
    implementação atual desestrutura a tupla na ordem errada, produzindo
    uma mensagem com os valores trocados. Corrija.

## Refatoração (1)

15. **`refactorPointDistance(a: Coordinates, b: Coordinates): number`** —
    a implementação atual calcula distância euclidiana com passos manuais
    e nomes de variável ruins. Refatore para algo mais direto (dica:
    `Math.hypot`), **sem mudar o comportamento observável**.

## Desafio integrador (1)

16. **`summarizeInventory(items: { name: string; price: number; quantity: number }[]): { totalItems: number; totalValue: number; mostExpensive: string }`**
    — recebe uma lista de itens de estoque e retorna:
    - `totalItems`: soma de todas as `quantity`;
    - `totalValue`: soma de `price * quantity` de todos os itens;
    - `mostExpensive`: `name` do item com maior `price` (em empate, o
      primeiro na ordem original).

    Lança `RangeError` se `items` for um array vazio.

## Critérios de aceitação

- `npm test` sem falhas.
- `npx tsc --noEmit --strict` no arquivo não acusa erro.
- Nenhuma função usa `any`.
- Você consegue explicar, sem consultar o código, quando o TypeScript
  infere um tipo sozinho e quando você precisa anotar explicitamente.

## Dicas

Peça `DICA_1`, `DICA_2` ou `DICA_3` quando travar em um exercício
específico — ou veja `hints.md` para o roteiro geral por nível.

Não peça `MOSTRAR_SOLUCAO` antes de tentar de verdade.
