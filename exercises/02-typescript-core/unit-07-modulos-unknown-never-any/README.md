# Unidade 7 — Módulos com tipos, declarações ambientes, `unknown`, `never` e `any`

Fase 2, Unidade 7. Cobre: exportar/importar tipos vs valores (`export type`),
declarações ambientes (`declare`, descrever de forma mínima o formato de um
valor que chega em tempo de execução sem tipo próprio), a diferença entre
`unknown`, `never` e `any`, e como converter `unknown` em um tipo utilizável
por narrowing/validação — nunca por cast.

## Antes de começar

Responda por escrito:

1. Se uma função recebe `value: any`, o TypeScript verifica alguma coisa
   sobre o que você faz com `value` dentro da função? E se ela recebe
   `value: unknown`? Qual a diferença prática entre "desligar a checagem"
   e "checagem obrigatória antes de usar"?
   R =
2. Em que situação o **retorno** de uma função é legitimamente `never` (não
   `void`, não `undefined`)? Dê um exemplo mental antes de ver o código.
   R =
3. Um `type` ou `interface` exportado com `export type` existe em algum
   arquivo `.js` gerado depois da compilação? O que isso implica sobre
   misturar `export type { Foo }` com `export { bar }` no mesmo módulo?
   R =

Não pesquise ainda. Escreva sua hipótese antes de implementar qualquer
função — você vai comparar com o resultado real ao rodar os testes.

## Como trabalhar

1. Abra `exercises.ts`. Cada função tem `throw new Error("not implemented: <nome>")`.
2. Implemente uma função por vez, **com anotações de tipo explícitas** nos
   parâmetros e no retorno.
3. Rode os testes:

   ```bash
   npm test
   ```

4. Todos os testes começam falhando. Isso é esperado.
5. Verifique os tipos (o `node --test` roda mas **não** typecheck; ele só
   apaga os tipos). Rode separadamente:

   ```bash
   npx tsc --noEmit --strict exercises/02-typescript-core/unit-07-modulos-unknown-never-any/exercises.ts
   ```

6. **Não use `any` em nenhuma hipótese.** Essa unidade inteira existe para
   praticar o que fazer no lugar de `any`: se um valor chega sem tipo
   conhecido, ele é `unknown` até você provar (por narrowing, não por
   `as`) que formato ele tem. Se você se pegar escrevendo `as Xyz` para
   "resolver" um erro de tipo, pare — isso quase sempre é sinal de que
   falta uma checagem em tempo de execução, não de que falta um cast.

## Exercícios fundamentais (8)

1. **`isString(value: unknown): value is string`** — type guard que
   confirma se `value` é uma string.
2. **`isFiniteNumber(value: unknown): value is number`** — type guard que
   confirma se `value` é um `number` finito (rejeita `NaN`, `Infinity` e
   qualquer coisa que não seja `typeof value === "number"`).
3. **`isNonEmptyString(value: unknown): value is string`** — type guard que
   confirma se `value` é uma string com pelo menos um caractere não-espaço
   após `trim()`.
4. **`isStringArray(value: unknown): value is string[]`** — type guard que
   confirma se `value` é um array onde **todos** os elementos são strings.
5. **`describeUnknown(value: unknown): string`** — recebe um `unknown` e
   retorna uma das strings: `"string"`, `"number"`, `"boolean"`, `"null"`,
   `"undefined"`, `"array"` ou `"object"`, de acordo com o formato real do
   valor (sem usar `as`).
6. **`assertNever(x: never): never`** — helper clássico de exaustividade:
   lança um `Error` cuja mensagem inclui `JSON.stringify(x)`. Só compila
   quando chamado em uma posição onde o TypeScript já reduziu o tipo a
   `never`.
7. **`throwNotImplemented(featureName: string): never`** — sempre lança
   `new Error(\`Recurso não implementado: ${featureName}\`)`. Exemplo de
   `never` legítimo: a função nunca retorna um valor normalmente.
8. **`parseJsonOrThrow(input: string): unknown`** — faz `JSON.parse(input)`.
   Se o parse falhar, lança um `Error` cuja mensagem inclui o `input`
   original. O retorno é `unknown` de propósito: depois do `JSON.parse`
   você não sabe qual formato veio.

## Exercícios intermediários (4)

9. **`export interface UserPayload { id: string; email: string; age: number }`**
   (declare no topo do arquivo — é a "forma declarada" de um dado externo
   não confiável) e **`parseUserPayload(value: unknown): UserPayload`** —
   recebe um `unknown` (ex.: resultado de `JSON.parse` de uma requisição),
   valida campo a campo por narrowing e retorna um `UserPayload` tipado.
   Lança `TypeError` com mensagem indicando **qual campo** é inválido caso
   `id` não seja string, `email` não seja uma string contendo `"@"`, ou
   `age` não seja um número finito não-negativo.
10. **`isFeatureEnabled(flagName: string): boolean`** — o arquivo já tem uma
    declaração ambiente (`declare global { var __UNIT7_FEATURE_FLAGS__: ... }`)
    descrevendo, de forma mínima, o formato de um valor injetado em
    `globalThis` em tempo de execução por algo fora do seu controle (ex.:
    um script de bootstrap). Implemente a função lendo esse valor global:
    se ele não existir, retorna `false`; se existir, retorna se a flag
    `flagName` está presente e é `true`.
11. **`sumUnknownArray(values: unknown[]): number`** — soma um array de
    `unknown`. Cada elemento precisa ser validado como número finito antes
    de somar; se algum elemento não for, lança `TypeError` com o índice do
    elemento inválido na mensagem.
12. **`type Shape = "circle" | "square" | "triangle"`** (declare no topo)
    e **`shapeLabel(shape: Shape): string`** — retorna `"Círculo"`,
    `"Quadrado"` ou `"Triângulo"` conforme o valor. No `default` do
    `switch`, chame `assertNever(shape)` — isso só compila se o `switch`
    cobrir todos os casos de `Shape`.

## Debugging (2)

13. **`parseAgeUnknown(value: unknown): number`** — a implementação atual
    usa `as number` em vez de checar o valor de verdade, então entradas
    inválidas passam como se fossem idades válidas. Leia, entenda o
    sintoma, corrija substituindo o cast por narrowing real (reuse
    `isFiniteNumber`) e valide o intervalo (0 a 150).
14. **`isValidEmailUnknown(value: unknown): value is string`** — a
    implementação atual aceita qualquer string não vazia como e-mail
    válido, mesmo sem `"@"`. Corrija adicionando a checagem que falta.

## Refatoração (1)

15. **`refactorDescribeUnknownRecord(value: unknown): string`** — a
    implementação atual já funciona corretamente, mas repete
    `(value as Record<string, unknown>)` várias vezes em vez de usar um
    type guard/helper único. Refatore para eliminar os casts repetidos,
    **sem mudar o comportamento observável**.

## Desafio integrador (1)

16. **`export type OrderStatus = "pending" | "shipped" | "delivered" | "cancelled"`**,
    **`export interface Order { id: string; status: OrderStatus; total: number }`**,
    **`export interface OrderSummary { totalOrders: number; totalValue: number; countByStatus: Record<OrderStatus, number> }`**
    (declare os três no topo) e
    **`validateAndSummarizeOrders(value: unknown): OrderSummary`** —
    recebe um `unknown` (ex.: um array vindo de `JSON.parse`), valida que
    é um array e que cada elemento tem `id` (string), `status` (um dos
    quatro valores de `OrderStatus`) e `total` (número finito
    não-negativo). Lança `TypeError` com índice e campo do primeiro
    elemento inválido encontrado. Lança `RangeError` se o array for vazio.
    Caso tudo seja válido, retorna o resumo: total de pedidos, valor total
    somado e contagem por status.

## Critérios de aceitação

- `npm test` sem falhas.
- `npx tsc --noEmit --strict` no arquivo não acusa erro.
- Nenhuma função usa `any`, em nenhuma posição.
- Você consegue explicar, sem consultar o código, a diferença entre
  "aceitar `unknown` e narrow" e "aceitar `any` e confiar".

## Dicas

Peça `DICA_1`, `DICA_2` ou `DICA_3` quando travar em um exercício
específico — ou veja `hints.md` para o roteiro geral por nível.

Não peça `MOSTRAR_SOLUCAO` antes de tentar de verdade.
