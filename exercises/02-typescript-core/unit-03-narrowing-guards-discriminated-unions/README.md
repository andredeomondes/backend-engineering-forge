# Unidade 3 — Narrowing, type guards e discriminated unions

Fase 2, Unidade 3. Cobre: type narrowing (`typeof`, `instanceof`, `in`,
truthiness, equality), custom type guards (`value is X`), discriminated
unions (uniões com campo literal discriminador, tratadas com `switch`) e
`enum` (o suficiente para reconhecer e comparar com união de literais).

## Antes de começar

Responda por escrito:

1. O que significa "estreitar" (narrow) um tipo em TypeScript? Dê um
   exemplo de uma verificação em tempo de execução que muda o tipo que o
   compilador enxerga para uma variável.
   R =
2. Qual a diferença entre uma função comum que retorna `boolean` e uma
   função de type guard (`function isX(v: unknown): v is X`)? O que muda
   para quem chama a função, depois do `if`?
3. Compare um `enum` com uma união de literais de string (`"a" | "b" | "c"`)
   para representar um conjunto fixo de opções. Que trade-offs (código
   gerado em tempo de execução, comparação estrutural, uso em outras
   linguagens/serialização) cada abordagem tem?

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

4. Todos os testes começam falhando (exceto o de refatoração). Isso é
   esperado.
5. Verifique os tipos (o `node --test` roda mas **não** typecheck; ele só
   apaga os tipos). Rode separadamente:

   ```bash
   npx tsc --noEmit --strict exercises/02-typescript-core/unit-03-narrowing-guards-discriminated-unions/exercises.ts
   ```

6. Não use `any`. Se travar em um tipo, é sinal de que falta uma
   verificação de narrowing, não de usar `any` para silenciar o erro.

## Exercícios fundamentais (8)

1. **`isNonEmptyString(value: unknown): value is string`** — type guard
   que retorna `true` apenas se `value` for uma `string` com pelo menos um
   caractere.
2. **`describePrimitive(value: string | number | boolean): string`** —
   usa narrowing por `typeof` para retornar `"string: \"<v>\""`,
   `"number: <v>"` ou `"boolean: <v>"` de acordo com o tipo em runtime.
3. **`formatQuantity(value: number | "unlimited"): string`** — usa
   narrowing por igualdade (`===`) contra o literal `"unlimited"`.
   Retorna `"ilimitado"` nesse caso, senão `"<value> unidades"`.
4. **`greetUser(name: string | null | undefined): string`** — usa
   narrowing por truthiness. Se `name` for `null`, `undefined` ou string
   vazia, retorna `"Olá, visitante!"`; senão `"Olá, <name>!"`.
5. **`shapeArea(shape: Shape): number`** — `Shape` é uma discriminated
   union (declarada no topo do arquivo) com campo `kind`. Use `switch
   (shape.kind)` para calcular a área de círculo, quadrado ou retângulo.
6. **`shapePerimeter(shape: Shape): number`** — mesma ideia de
   `shapeArea`, mas calculando o perímetro de cada variante de `Shape`.
7. **`computeFinalPrice(product: Product | DiscountedProduct): number`**
   — usa narrowing com o operador `in` para checar se `product` tem o
   campo `discountPercent`. Se tiver, aplica o desconto sobre `price`;
   senão retorna `price` sem alteração.
8. **`formatCaughtError(err: unknown): string`** — usa narrowing por
   `instanceof`. Se `err` for `ValidationError` (declarada no topo do
   arquivo), retorna `"Erro de validação: <message>"`. Se for um `Error`
   comum (mas não `ValidationError`), retorna `"Erro: <message>"`. Senão,
   retorna `"Erro desconhecido: <String(err)>"`.

## Exercícios intermediários (4)

9. **`unwrapResult<T>(result: Result<T>): T`** — `Result<T>` é uma
   discriminated union `{ ok: true; value: T } | { ok: false; error:
   string }`. Se `result.ok` for `true`, retorna `result.value`. Senão,
   lança `new Error(result.error)`.
10. **`isShape(value: unknown): value is Shape`** — type guard que
    verifica, em runtime, se `value` tem o formato de um `Shape` válido
    (campo `kind` com um dos três valores esperados, e os campos
    numéricos correspondentes presentes e do tipo `number`). Deve
    rejeitar qualquer outra coisa (incluindo objetos parecidos, mas com
    campos faltando ou do tipo errado).
11. **`totalArea(values: unknown[]): number`** — recebe um array de
    valores desconhecidos, filtra apenas os que são `Shape` válidos
    (usando `isShape`) e retorna a soma das áreas (usando `shapeArea`).
    Valores que não são `Shape` são ignorados.
12. **`describePaymentMethod(method: PaymentMethod): string`** —
    `PaymentMethod` é uma união de literais de string (declarada no topo
    do arquivo, com um comentário mostrando como seria como `enum`). Use
    `switch` para retornar `"Dinheiro"`, `"Cartão"` ou `"Pix"`.

## Debugging (2)

13. **`fixShapeAreaBug(shape: Shape): number`** — a implementação atual
    tem um bug em um dos `case` do `switch`: para retângulos, o cálculo
    usa a mesma dimensão duas vezes em vez de multiplicar largura por
    altura. Leia, entenda o sintoma, corrija sem mudar a assinatura.
14. **`fixIsPositiveNumberGuard(value: unknown): value is number`** — a
    implementação atual é um type guard com a lógica invertida: números
    positivos são rejeitados e valores inválidos são aceitos. Corrija a
    condição.

## Refatoração (1)

15. **`refactorDescribeInput(value: unknown): string`** — a implementação
    atual funciona corretamente (identifica `string`, `number`,
    `boolean`, `Date`, array e `null`), mas usa uma cadeia de `if/else`
    aninhada difícil de ler. Refatore para uma sequência de checagens com
    `return` antecipado (ou `switch`/lookup, se preferir), **sem mudar o
    comportamento observável**.

## Desafio integrador (1)

16. **`summarizeShapes(shapes: Shape[]): { totalArea: number; totalPerimeter: number; mostCommonKind: Shape["kind"] }`**
    — recebe uma lista de formas e retorna:
    - `totalArea`: soma das áreas de todas as formas (`shapeArea`);
    - `totalPerimeter`: soma dos perímetros de todas as formas (`shapePerimeter`);
    - `mostCommonKind`: o `kind` que aparece com mais frequência na lista
      (em empate, o primeiro `kind` a atingir a maior contagem, na ordem
      original).

    Lança `RangeError` se `shapes` for um array vazio.

## Critérios de aceitação

- `npm test` sem falhas (exceto onde o próprio enunciado exige uma
  correção).
- `npx tsc --noEmit --strict` no arquivo não acusa erro.
- Nenhuma função usa `any`.
- Você consegue explicar, sem consultar o código, a diferença entre
  narrowing por `typeof`, `instanceof`, `in`, truthiness e igualdade — e
  quando usar cada um.

## Dicas

Peça `DICA_1`, `DICA_2` ou `DICA_3` quando travar em um exercício
específico — ou veja `hints.md` para o roteiro geral por nível.

Não peça `MOSTRAR_SOLUCAO` antes de tentar de verdade.
