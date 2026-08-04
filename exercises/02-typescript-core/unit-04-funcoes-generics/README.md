# Unidade 4 — Tipos de função, generics, constraints e overloads

Fase 2, Unidade 4. Cobre: tipos de função, generics (`<T>`), constraints em
generics (`extends`) e overloads de função em nível prático.

## Antes de começar

Responda por escrito:

1. Por que `function identity<T>(x: T): T` é mais útil do que
   `function identity(x: any): any`? O que você perde com `any` que o
   genérico preserva?
   R =
2. O que significa `<T, K extends keyof T>` numa assinatura como
   `pluck<T, K extends keyof T>(obj: T, key: K): T[K]`? Que garantia isso
   dá ao compilador que `any` não daria?
   R =
3. Quando você escreve duas assinaturas de overload mais uma assinatura de
   implementação (a terceira, com union types), por que quem chama a
   função só enxerga as duas primeiras?
   R =

Não pesquise ainda. Escreva sua hipótese antes de implementar qualquer
função — você vai comparar com o resultado real ao rodar os testes.

## Como trabalhar

1. Abra `exercises.ts`. Cada função tem `throw new Error("not implemented: <nome>")`.
2. Implemente uma função por vez, **com anotações de tipo explícitas** nos
   parâmetros e no retorno (não confie só em inferência aqui — o objetivo
   da unidade é praticar escrever os tipos, incluindo os genéricos).
3. Rode os testes:

   ```bash
   npm test
   ```

4. Todos os testes começam falhando, exceto os de `maxNumber` e
   `maxString` (exercício de refatoração — já estão corretos). Isso é
   esperado.
5. Verifique os tipos (o `node --test` roda mas **não** typecheck; ele só
   apaga os tipos). Rode separadamente:

   ```bash
   npx tsc --noEmit --strict exercises/02-typescript-core/unit-04-funcoes-generics/exercises.ts
   ```

6. Não use `any`. Se travar em um tipo, é sinal de que falta pensar no
   formato do dado (ou na constraint certa), não de usar `any` para
   silenciar o erro.

## Exercícios fundamentais (8)

1. **`identity<T>(x: T): T`** — retorna o valor recebido, sem alterar o
   tipo.
2. **`firstOf<T>(items: T[]): T | undefined`** — retorna o primeiro
   elemento do array, ou `undefined` se estiver vazio.
3. **`lastOf<T>(items: T[]): T | undefined`** — retorna o último elemento
   do array, ou `undefined` se estiver vazio.
4. **`wrapInArray<T>(value: T): T[]`** — envolve o valor num array de um
   único elemento.
5. **`type Box<T> = { value: T }`** (declare o alias no topo do arquivo) e
   **`createBox<T>(value: T): Box<T>`** — cria um `Box` contendo o valor.
6. **`pair<A, B>(a: A, b: B): [A, B]`** — retorna uma tupla `[a, b]`, cada
   posição com seu próprio tipo genérico.
7. **`pluck<T, K extends keyof T>(obj: T, key: K): T[K]`** — retorna o
   valor da propriedade `key` de `obj`, com o tipo de retorno inferido
   corretamente a partir de `T[K]`.
8. **`applyFn<T, R>(value: T, fn: (value: T) => R): R`** — aplica a
   função `fn` (um tipo de função como parâmetro) sobre `value` e retorna
   o resultado.

## Exercícios intermediários (4)

9. **`mapArray<T, R>(items: T[], fn: (item: T) => R): R[]`** — como
   `Array.prototype.map`, mas implementado manualmente com generics.
10. **`findByKey<T, K extends keyof T>(items: T[], key: K, value: T[K]): T | undefined`**
    — retorna o primeiro item do array cujo campo `key` seja igual a
    `value`. Retorna `undefined` se nenhum bater.
11. **`type Stack<T> = { push: (item: T) => void; pop: () => T | undefined; peek: () => T | undefined; size: () => number }`**
    (declare o alias) e **`createStack<T>(): Stack<T>`** — fábrica que
    retorna uma pilha genérica (LIFO) usando closures.
12. **`doubleValue`** (overload):
    `doubleValue(x: number): number` (dobra o número) e
    `doubleValue(x: string): string` (duplica a string, ex.: `"ab"` vira
    `"abab"`).

## Debugging (2)

13. **`combineValues`** (overload) — já implementado com
    `combineValues(a: number, b: number): number` e
    `combineValues(a: string, b: string): string`, mas o corpo da
    implementação resolve o branch numérico errado. Leia, entenda o
    sintoma, corrija sem mudar as assinaturas de overload.
14. **`mergeUnique<T extends { id: number }>(a: T[], b: T[]): T[]`** — a
    constraint garante que todo item tem um `id` numérico, mas a
    implementação atual não usa isso para remover duplicatas ao juntar os
    dois arrays. Corrija para manter apenas a primeira ocorrência de cada
    `id`.

## Refatoração (1)

15. **`maxNumber(values: number[]): number`** e
    **`maxString(values: string[]): string`** — as duas já funcionam
    corretamente, mas são quase idênticas (a única diferença real é o
    tipo). Refatore para eliminar a duplicação (por exemplo, com uma
    função genérica interna reaproveitada pelas duas), **sem mudar os
    nomes exportados nem o comportamento observável**.

## Desafio integrador (1)

16. **`groupBy<T, K extends string | number>(items: T[], keyFn: (item: T) => K): Record<K, T[]>`**
    — agrupa os itens de `items` num objeto, onde cada chave é o
    resultado de `keyFn(item)` e o valor é o array de itens que geraram
    aquela chave (na ordem original). Array vazio retorna objeto vazio.

## Critérios de aceitação

- `npm test` sem falhas (exceto os testes já esperados nesta unidade —
  veja "Como trabalhar").
- `npx tsc --noEmit --strict` no arquivo não acusa erro.
- Nenhuma função usa `any`.
- Você consegue explicar, sem consultar o código, a diferença entre um
  parâmetro de tipo genérico livre (`<T>`) e um restrito por constraint
  (`<K extends keyof T>`), e por que overloads escondem a assinatura de
  implementação de quem chama a função.

## Dicas

Peça `DICA_1`, `DICA_2` ou `DICA_3` quando travar em um exercício
específico — ou veja `hints.md` para o roteiro geral por nível.

Não peça `MOSTRAR_SOLUCAO` antes de tentar de verdade.
