# Dicas — Unidade 2 (Node.js: módulos, process, sinais, env)

Use `DICA_1`, `DICA_2` ou `DICA_3` dizendo qual exercício travou. Abaixo
está o roteiro geral que a mentoria segue nesta unidade.

## Nível 1 — direção, sem código

- Para `parseArgvFlag`: um item de `argv` no formato certo começa com
  `--<flag>=`. O que você precisa fazer depois de encontrar esse item
  para extrair só o valor?
- Para `isEnvTruthy`: como você normaliza um texto para comparação
  "case-insensitive"? O que `.toLowerCase()` resolve aqui?
- Para `parseDotEnv`: pense linha por linha. Antes de tentar separar
  `chave=valor`, quais linhas você deveria simplesmente pular?
- Para `mergeEnvWithDefaults`: se você espalhar (`...`) `defaults` e
  depois espalhar `env` por cima, o que acontece com chaves cujo valor
  em `env` é `undefined`? Isso é um problema?
- Para `createGracefulShutdown`: você está retornando uma função, não
  executando nada ainda. O que a função retornada precisa fazer, em que
  ordem, quando for chamada?
- Para `fixParseDotEnvLine`: rode mentalmente `"DATABASE_URL=postgres://a?ssl=true".split("=")`.
  Quantas partes isso vira? Qual delas é o valor de verdade?
- Para `bootstrapApp`: você já implementou `parseDotEnv`,
  `mergeEnvWithDefaults` e `validateRequiredEnvVars` — este exercício é
  costurar essas três peças, mais o registro de sinais.

## Nível 2 — pista mais direta

- `parseArgvFlag`: procure o item que começa com `` `--${flag}=` `` usando
  `.find(...)` ou um laço, depois use `.slice(...)` para pegar tudo
  depois do `=`.
- `parseDotEnv`: para cada linha, faça `trim()`; pule se ficar vazia ou
  começar com `#`; ache o índice do primeiro `=` com `indexOf("=")`;
  pule se não houver `=` (índice `-1`); separe chave e valor nesse
  índice; remova aspas duplas do início/fim do valor, se houver.
- `mergeEnvWithDefaults`: monte o resultado a partir de `defaults`,
  depois percorra as chaves de `env` e só sobrescreva quando
  `env[key] !== undefined`.
- `validateRequiredEnvVars`: para cada chave em `required`, verifique se
  `env[key]` é `undefined` ou string vazia; acumule as que falharem em
  `missing`.
- `createGracefulShutdown`: retorne `(signal: string) => { cleanup(); exit(0); }`.
- `fixParseDotEnvLine`: troque `trimmed.split("=")` por uma separação
  que usa `indexOf("=")` para achar só a primeira ocorrência, e depois
  `slice` para pegar o restante inteiro como valor.
- `bootstrapApp`: `parseDotEnv` primeiro, depois combine com
  `defaults` e `processEnv` respeitando a precedência
  `defaults < .env < processEnv`; calcule `missing`/`ready` com a mesma
  lógica de `validateRequiredEnvVars`; registre os dois handlers de
  sinal chamando `signalTarget.on("SIGINT", ...)` e
  `signalTarget.on("SIGTERM", ...)`, cada um executando `cleanup()` e
  `exit(0)`.

## Nível 3 — quase o código, mas ainda não a solução

- `parseDotEnv`:
  ```ts
  const result: Record<string, string> = {};
  for (const rawLine of content.split("\n")) {
    const line = rawLine.trim();
    if (line === "" || line.startsWith("#")) continue;
    const eqIndex = line.indexOf("=");
    if (eqIndex === -1) continue;
    const key = line.slice(0, eqIndex).trim();
    let value = line.slice(eqIndex + 1).trim();
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1);
    }
    if (key === "") continue;
    result[key] = value;
  }
  return result;
  ```
- `fixParseDotEnvLine`: aplique a mesma ideia de `indexOf("=")` +
  `slice` no lugar de `split("=")`, mantendo o resto da função igual.
- `bootstrapApp`:
  ```ts
  const parsed = parseDotEnv(options.dotEnvContent);
  const merged = mergeEnvWithDefaults(options.processEnv, {
    ...options.defaults,
    ...parsed,
  });
  const { missing, valid } = validateRequiredEnvVars(merged, options.required);
  const handler = createGracefulShutdown(options.cleanup, options.exit);
  options.signalTarget.on("SIGINT", () => handler("SIGINT"));
  options.signalTarget.on("SIGTERM", () => handler("SIGTERM"));
  return { config: merged, missing, ready: valid };
  ```

Peça `MOSTRAR_SOLUCAO` apenas depois de registrar sua tentativa.
