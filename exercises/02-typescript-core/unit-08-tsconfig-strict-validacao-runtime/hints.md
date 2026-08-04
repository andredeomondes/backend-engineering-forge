# Dicas — Unidade 8 (TypeScript)

Use `DICA_1`, `DICA_2` ou `DICA_3` dizendo qual exercício travou. Abaixo
está o roteiro geral que a mentoria segue nesta unidade, para os
exercícios mais complicados.

## Nível 1 — direção, sem código

- Para `describeCaughtError`: `e` é `unknown` porque o `catch` não sabe o
  que foi lançado. Que operador do TypeScript permite perguntar "isso é
  uma instância dessa classe?" antes de acessar propriedades?
- Para `safeJsonParse`: pense no `Result` como uma forma de "trazer" a
  exceção para dentro do tipo de retorno, em vez de deixá-la propagar.
  O que precisa acontecer dentro do `catch` para transformar `e: unknown`
  em `error: string`?
- Para `isUserShape`: antes de checar `data.name`, o que precisa ser
  verdade sobre `data` para o TypeScript aceitar acessar propriedades
  nele? Pense em `typeof` e `=== null`.
- Para `chainValidations`: a diferença para `parseUserPayload` é que
  aqui você não pode retornar no primeiro erro — precisa continuar
  checando e juntar tudo num array.
- Para `divideSafe`: o sintoma diz que a função "quebra com uma exceção
  não tratada" — onde no código isso acontece, e o que a função deveria
  fazer no lugar (olhando o tipo de retorno dela)?
- Para `describeThrownValue`: `as Error` não checa nada em runtime, só
  "convence" o compilador. O que aconteceria se `e` não fosse
  realmente um `Error`?

## Nível 2 — pista mais direta

- `describeCaughtError`: `if (e instanceof ValidationError) { ... } else if (e instanceof Error) { ... } else { ... }`.
  Lembre que `ValidationError extends Error`, então a ordem dos `if`
  importa — cheque a subclasse mais específica primeiro.
- `safeJsonParse`: dentro do `catch (e: unknown)`, faça
  `const message = e instanceof Error ? e.message : String(e);` e
  devolva `{ ok: false, error: message }`.
- `isUserShape`: `if (typeof data !== "object" || data === null) return false;`
  depois trate `data` como `Record<string, unknown>` para checar
  `typeof data.name === "string"` e `typeof data.age === "number"`.
- `chainValidations`: crie `const errors: string[] = []`, empurre uma
  mensagem para cada regra violada, e só no final decida se retorna
  sucesso (`errors.length === 0`) ou falha (`errors`).
- `divideSafe`: troque o `throw new RangeError(...)` por
  `return { ok: false, error: "divisão por zero" };`.
- `describeThrownValue`: troque `const err = e as Error;` por uma
  checagem real: `e instanceof Error ? e.message : String(e)`.

## Nível 3 — quase o código, mas ainda não a solução

- `parseUserPayload` / `isUserShape` juntos:
  ```ts
  export function isUserShape(
    data: unknown,
  ): data is { name: string; age: number } {
    if (typeof data !== "object" || data === null) return false;
    const record = data as Record<string, unknown>;
    return typeof record.name === "string" && typeof record.age === "number";
  }
  ```
  `parseUserPayload` só precisa chamar `isUserShape(data)` e devolver o
  `Result` certo em cada ramo — o `data is { ... }` já faz a narrowing
  para você no `if`.
- `processBatch`: percorra com `inputs.forEach((item, i) => { ... })`,
  chame `typeof item === "string"` primeiro, e dentro reuse a mesma
  lógica de validação de `parsePositiveInteger` (ou chame a própria
  função) para decidir entre `successes.push(...)` e
  `failures.push(\`índice ${i}: ...\`)`.
- `parseIntOrThrow` (refatoração): a validação inteira cabe numa
  condição só —
  ```ts
  const trimmed = input.trim();
  const parsed = Number(trimmed);
  if (trimmed.length === 0 || !Number.isInteger(parsed)) {
    throw new TypeError(`entrada inválida para inteiro: "${input}"`);
  }
  return parsed;
  ```

Peça `MOSTRAR_SOLUCAO` apenas depois de registrar sua tentativa.
