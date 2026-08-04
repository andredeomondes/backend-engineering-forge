# Dicas — Unidade 3 (TypeScript)

Use `DICA_1`, `DICA_2` ou `DICA_3` dizendo qual exercício travou. Abaixo
está o roteiro geral que a mentoria segue nesta unidade.

## Nível 1 — direção, sem código

- Para `unwrapResult`: `Result<T>` tem um campo `ok` literal (`true` ou
  `false`). O que acontece com o tipo de `result` dentro de um
  `if (result.ok) { ... }`? E no `else`?
- Para `isShape`: antes de checar `kind`, você precisa garantir que
  `value` é um objeto não nulo. Depois, para cada valor possível de
  `kind`, quais campos extras deveriam existir, e de que tipo?
- Para `totalArea`: como você filtra um array `unknown[]` mantendo apenas
  os elementos que passam num type guard, de um jeito que o TypeScript
  entenda o tipo resultante como `Shape[]`?
- Para `fixShapeAreaBug`: compare os três `case` do `switch`. Dois usam
  uma variável, um usa a mesma variável duas vezes onde deveria usar
  duas variáveis diferentes.
- Para `fixIsPositiveNumberGuard`: leia a condição em voz alta. Ela
  descreve "é número positivo" ou o oposto disso?
- Para `refactorDescribeInput`: cada `if/else` aninhado testa uma
  possibilidade e, se não for essa, cai no próximo. O que acontece se
  cada `if` simplesmente `return`ar direto, sem `else`?

## Nível 2 — pista mais direta

- `unwrapResult`: dentro de `if (result.ok)`, `result` é estreitado para
  a variante com `value`; fora desse `if` (ou no `else`), é a variante
  com `error`.
- `isShape`: primeiro `typeof value === "object" && value !== null`,
  depois um `switch` (ou cadeia de `if`) sobre `(value as { kind: unknown }).kind`
  checando os campos numéricos de cada variante com `typeof ... === "number"`.
- `totalArea`: `values.filter(isShape)` já retorna `Shape[]` se `isShape`
  for um type guard corretamente tipado — depois é só mapear com
  `shapeArea` e somar.
- `fixShapeAreaBug`: o `case "rectangle"` deveria multiplicar
  `shape.width` por `shape.height`, não `shape.width` por si mesmo.
- `fixIsPositiveNumberGuard`: a condição correta é
  `typeof value === "number" && value > 0` — sem negação.
- `refactorDescribeInput`: uma sequência de `if (condição) return ...;`
  um após o outro, terminando com um `return "desconhecido";` no final,
  produz o mesmo resultado sem aninhamento.

## Nível 3 — quase o código, mas ainda não a solução

- `isShape`:
  ```ts
  if (typeof value !== "object" || value === null || !("kind" in value)) {
    return false;
  }
  const candidate = value as { kind: unknown };
  switch (candidate.kind) {
    case "circle":
      return "radius" in value && typeof (value as { radius: unknown }).radius === "number";
    // ...os outros dois casos seguem o mesmo padrão
    default:
      return false;
  }
  ```
- `totalArea`:
  ```ts
  return values.filter(isShape).reduce((sum, shape) => sum + shapeArea(shape), 0);
  ```
- `summarizeShapes`: percorra as formas somando área e perímetro com
  `shapeArea`/`shapePerimeter`, e mantenha um contador por `kind` (por
  exemplo um `Record<Shape["kind"], number>` inicializado com zeros)
  para achar o mais frequente ao final; lance `RangeError` antes do laço
  se `shapes.length === 0`.

Peça `MOSTRAR_SOLUCAO` apenas depois de registrar sua tentativa.
