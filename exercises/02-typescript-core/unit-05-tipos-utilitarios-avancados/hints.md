# Dicas — Unidade 5 (TypeScript)

Use `DICA_1`, `DICA_2` ou `DICA_3` dizendo qual exercício travou. Abaixo
está o roteiro geral que a mentoria segue nesta unidade, para os
exercícios mais traiçoeiros.

## Nível 1 — direção, sem código

- Para `getProperty`: `K extends keyof T` diz "K é uma das chaves de T".
  Como isso deixa o TypeScript saber que `obj[key]` sempre existe, sem
  precisar de nenhuma checagem em tempo de execução?
- Para `describeStatus`/`HttpStatusCode`: `typeof HTTP_STATUS` dá o tipo
  do *objeto*. `keyof typeof HTTP_STATUS` dá as *chaves* desse tipo
  (`"OK" | "CREATED" | ...`). O que `(typeof HTTP_STATUS)[keyof typeof HTTP_STATUS]`
  dá, então — as chaves ou os valores?
- Para `nullifyFields`/`Nullable<T>`: um mapped type `{ [K in keyof T]: ... }`
  gera um campo novo para cada chave de `T`. O que muda se, ao construir o
  objeto de retorno, você decidir campo a campo se ele fica igual ao
  original ou vira `null`?
- Para `finalizeOrder`: você tem dois objetos com os "mesmos" campos, um
  opcional (`DraftOrder`) e um obrigatório (`Required<DraftOrder>`). Para
  cada campo, qual dos dois valores "vence" quando o do draft está
  definido? E quando não está?
- Para `assertPresent`/`Present<T>`: o tipo condicional `T extends null | undefined ? never : T`
  só existe em tempo de compilação. O que a função precisa fazer **em tempo
  de execução** para que o comportamento bata com o que o tipo promete?
- Para `applyProfileUpdate` (debugging): rode mentalmente
  `{ ...current, ...patch }` quando `patch = { email: undefined }`. O que o
  spread faz com uma chave que existe no objeto da direita, mas com valor
  `undefined`?

## Nível 2 — pista mais direta

- `getProperty`: `return obj[key];` — só isso, o trabalho todo é a
  assinatura genérica.
- `describeStatus`: monte um `switch (code)` ou um objeto de lookup
  `Record<HttpStatusCode, string>` mapeando cada código conhecido para sua
  descrição.
- `nullifyFields`: comece com `const result = { ...obj } as Nullable<T>;`
  depois, para cada `key` em `keys`, faça `result[key] = null;`.
- `finalizeOrder`: para cada campo, `draft.id ?? fallback.id`,
  `draft.total ?? fallback.total`, `draft.status ?? fallback.status`.
- `assertPresent`: `if (value === null || value === undefined) throw new TypeError(...)`;
  depois `return value as Present<T>;` (o `as` é necessário porque o
  TypeScript não consegue provar sozinho que, depois do `if`, `value` já
  não é `null`/`undefined` *para o tipo `Present<T>`* — ele só sabe disso
  para o tipo original de `value`).
- `applyProfileUpdate`: em vez de espalhar `patch` inteiro por cima de
  `current`, percorra as chaves de `patch` e só copie para o resultado as
  que **não** são `undefined`.
- `sumFieldValues`: o laço deveria percorrer `fields`, não
  `Object.keys(obj)` — o parâmetro `fields` já existe exatamente para
  isso, ele só não está sendo usado.

## Nível 3 — quase o código, mas ainda não a solução

- `describeStatus`:
  ```ts
  const descriptions: Record<HttpStatusCode, string> = {
    [HTTP_STATUS.OK]: "OK",
    [HTTP_STATUS.CREATED]: "Created",
    [HTTP_STATUS.NOT_FOUND]: "Not Found",
    [HTTP_STATUS.SERVER_ERROR]: "Server Error",
  };
  return descriptions[code];
  ```
- `applyProfileUpdate` corrigido:
  ```ts
  const result = { ...current };
  for (const key of Object.keys(patch) as (keyof T)[]) {
    if (patch[key] !== undefined) {
      result[key] = patch[key] as T[keyof T];
    }
  }
  return result;
  ```
- `sumFieldValues` corrigido:
  ```ts
  let total = 0;
  for (const key of fields) {
    total += obj[key];
  }
  return total;
  ```
- `buildPermissionMatrix`: comece com os três objetos padrão (`ADMIN`,
  `EDITOR`, `VIEWER`), depois, para cada papel presente em `overrides`,
  mescle campo a campo do mesmo jeito que `applyProfileUpdate` corrigido
  faz — ignorando campos `undefined` no override.

Peça `MOSTRAR_SOLUCAO` apenas depois de registrar sua tentativa.
