# Dicas — Unidade 7 (TypeScript)

Use `DICA_1`, `DICA_2` ou `DICA_3` dizendo qual exercício travou. Abaixo
está o roteiro geral que a mentoria segue nesta unidade.

## Nível 1 — direção, sem código

- Para `isStringArray`: você precisa checar duas coisas em sequência —
  primeiro que `value` é um array, depois que **cada** elemento dentro
  dele é string. Qual método de array percorre todos os elementos e
  retorna um único `boolean`?
- Para `parseUserPayload`: pense nos três campos como três checagens
  independentes. O que precisa ser verdade sobre `value` **antes** de
  você tentar ler `value.id`?
- Para `isFeatureEnabled`: o valor de `globalThis.__UNIT7_FEATURE_FLAGS__`
  pode ser `undefined` ou um objeto. O que acontece se você tentar acessar
  uma propriedade de `undefined` sem checar antes?
- Para `sumUnknownArray`: você já tem `isFiniteNumber` pronta de um
  exercício anterior — reaproveite-a em vez de reescrever a checagem.
- Para `shapeLabel`: um `switch` sobre um `type` união de literais só é
  exaustivo se cobrir todos os literais. O que sobra no `default` quando
  todos os `case` já trataram todos os valores possíveis?
- Para `validateAndSummarizeOrders`: pense em quatro etapas separadas —
  validar que é array, validar que não é vazio, validar cada elemento, e
  só então acumular o resumo. Misturar validação com acumulação costuma
  gerar bugs difíceis de rastrear.

## Nível 2 — pista mais direta

- `isStringArray`: `Array.isArray(value) && value.every((item) => typeof item === "string")`.
- `parseUserPayload`: comece com
  `if (typeof value !== "object" || value === null) throw new TypeError(...)`,
  depois leia os campos de `value` como `Record<string, unknown>` (você vai
  precisar de **um** cast estrutural nesse ponto de entrada — o resto da
  função deve trabalhar com os campos já validados, não com casts
  repetidos).
- `isFeatureEnabled`: `const flags = globalThis.__UNIT7_FEATURE_FLAGS__;`
  seguido de `if (flags === undefined) return false;` — depois disso o
  TypeScript já sabe que `flags` é `Record<string, boolean>`.
- `sumUnknownArray`: `values.forEach((value, index) => { if (!isFiniteNumber(value)) throw new TypeError(...) })`
  acumulando a soma junto.
- `shapeLabel`: no `default`, o TypeScript já reduziu `shape` a `never`
  porque todos os `case` anteriores esgotaram `Shape` — chame
  `return assertNever(shape);`.
- `parseAgeUnknown` (debugging): troque `value as number` por
  `if (!isFiniteNumber(value)) throw new TypeError(...)`, depois valide o
  intervalo `0 <= value && value <= 150`.
- `isValidEmailUnknown` (debugging): depois de confirmar que é string,
  falta checar `value.includes("@")` e que há conteúdo antes e depois do
  `@`.

## Nível 3 — quase o código, mas ainda não a solução

- `parseUserPayload`:
  ```ts
  if (typeof value !== "object" || value === null) {
    throw new TypeError("payload não é um objeto");
  }
  const record = value as Record<string, unknown>;
  if (typeof record.id !== "string") {
    throw new TypeError("id inválido: esperado string");
  }
  if (typeof record.email !== "string" || !record.email.includes("@")) {
    throw new TypeError("email inválido");
  }
  if (!isFiniteNumber(record.age) || record.age < 0) {
    throw new TypeError("age inválida: esperado número >= 0");
  }
  return { id: record.id, email: record.email, age: record.age };
  ```
- `validateAndSummarizeOrders`: valide `Array.isArray(value)`, depois
  `value.length === 0` (lance `RangeError`), depois percorra com índice
  checando `id`/`status`/`total` um a um (lance `TypeError` incluindo o
  índice e o campo no primeiro erro encontrado) e só então monte o
  `OrderSummary` acumulando `totalOrders`, `totalValue` e
  `countByStatus[order.status]++`.
- `refactorDescribeUnknownRecord`: escreva um helper único
  `function asRecord(value: unknown): Record<string, unknown> | null` que
  faz a checagem de objeto uma vez só, e reaproveite o resultado em vez de
  repetir `(value as Record<string, unknown>)`.

Peça `MOSTRAR_SOLUCAO` apenas depois de registrar sua tentativa.
