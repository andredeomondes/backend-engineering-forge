# Unidade 2 — Módulos (ESM/CJS), process, sinais de OS e variáveis de ambiente

Fase 3, Unidade 2. Cobre: ESM vs CommonJS (`import`/`export` vs
`require`/`module.exports`, `import.meta.url`, armadilhas de interop), o
global `process` (`process.argv`, `process.env`, `process.exit`,
`process.cwd`, `process.on("exit"|"uncaughtException")`), sinais de OS
(`SIGINT`/`SIGTERM` e desligamento gracioso), e variáveis de ambiente
(leitura, valores padrão, validação de obrigatórias, e um parser de
`.env` escrito à mão).

## Antes de começar

Responda por escrito:

1. Qual a diferença fundamental entre um módulo ESM (`import`/`export`) e
   um módulo CommonJS (`require`/`module.exports`)? Por que você não pode
   simplesmente misturar os dois sem cuidado?
   R =
2. `process.exit(1)` dentro de uma função que você está testando é
   perigoso para os testes. Por quê? O que acontece com o test runner se
   uma função sob teste chamar `process.exit` de verdade?
   R =
3. Qual a diferença entre o processo receber `SIGINT` (ex.: `Ctrl+C`) e
   receber `SIGTERM` (ex.: `kill <pid>`)? Por que um servidor deveria
   tratar os dois para fazer "graceful shutdown"?
   R =

Não pesquise ainda. Escreva sua hipótese antes de implementar qualquer
função — você vai comparar com o resultado real ao rodar os testes.

## Como trabalhar

1. Abra `exercises.ts`. Cada função tem `throw new Error("not implemented: <nome>")`.
2. Implemente uma função por vez, **com anotações de tipo explícitas**.
3. Note que nenhuma função aqui usa `process.env`, `process.exit` ou
   `process.on` diretamente — tudo entra por parâmetro (`EnvSource`,
   `ExitFn`, `SignalSource`). Isso é proposital: em produção você passa
   `process.env`, `process.exit.bind(process)` e o próprio `process`;
   nos testes você passa objetos fake e espiões, para nunca matar o
   test runner de verdade.
4. Rode os testes:

   ```bash
   npm test
   ```

5. Todos os testes começam falhando (exceto o de refatoração, que já
   passa). Isso é esperado.
6. Verifique os tipos separadamente (o `node --test` não faz typecheck,
   só apaga os tipos):

   ```bash
   npx tsc --noEmit --strict exercises/03-node-core/unit-02-modulos-process-ambiente/exercises.ts
   ```

7. Não use `any`. Se travar em um tipo, é sinal de que falta pensar no
   formato do dado, não de usar `any` para silenciar o erro.

## Exercícios fundamentais (8)

1. **`parseArgvFlag(argv: string[], flag: string): string | null`** —
   procura em `argv` um item no formato `--<flag>=<valor>` e retorna
   `<valor>`. Retorna `null` se a flag não existir.
2. **`getEnvOrDefault(env: EnvSource, key: string, fallback: string): string`**
   — retorna `env[key]` se existir e não for `undefined`, senão
   `fallback`.
3. **`isEnvTruthy(env: EnvSource, key: string): boolean`** — retorna
   `true` se o valor da variável (case-insensitive) for `"true"`, `"1"`
   ou `"yes"`. Qualquer outro valor (incluindo ausente) é `false`.
4. **`requireEnvVar(env: EnvSource, key: string): string`** — retorna o
   valor da variável. Lança erro se estiver ausente ou for string vazia.
5. **`parseIntEnv(env: EnvSource, key: string, fallback: number): number`**
   — converte o valor da variável para inteiro. Se estiver ausente ou
   não for um número válido, retorna `fallback`.
6. **`formatExitMessage(code: number): string`** — retorna
   `"Processo finalizado com sucesso (code 0)"` quando `code === 0`, ou
   `"Processo finalizado com erro (code <code>)"` caso contrário.
7. **`normalizeInteropDefault<T>(mod: T | { default: T }): T`** —
   resolve uma armadilha clássica de interop ESM/CommonJS: às vezes um
   módulo importado vem "embrulhado" como `{ default: valor }` em vez do
   valor direto. Retorna o valor desembrulhado nos dois casos.
8. **`buildShutdownSignalMessage(signal: string): string`** — retorna
   `"Sinal recebido: <signal>. Encerrando graciosamente..."`.

## Exercícios intermediários (4)

9. **`parseDotEnv(content: string): Record<string, string>`** — seu
   próprio parser de arquivo `.env`, sem biblioteca. Regras: ignora
   linhas vazias e linhas que começam com `#` (depois de `trim`); ignora
   linhas sem `=`; separa em `chave=valor` no **primeiro** `=`
   encontrado; faz `trim` de chave e valor; se o valor estiver entre
   aspas duplas (`"..."`), remove as aspas.
10. **`mergeEnvWithDefaults(env: EnvSource, defaults: Record<string, string>): Record<string, string>`**
    — retorna um objeto combinando `defaults` com `env`, onde `env` tem
    precedência (mas só para chaves cujo valor não seja `undefined`).
11. **`validateRequiredEnvVars(env: EnvSource, required: string[]): { missing: string[]; valid: boolean }`**
    — verifica se cada chave de `required` existe em `env` com valor não
    vazio. Retorna as que estão faltando (`missing`) e se está tudo certo
    (`valid`).
12. **`createGracefulShutdown(cleanup: () => void, exit: ExitFn): (signal: string) => void`**
    — retorna uma função handler que, ao ser chamada com o nome de um
    sinal, executa `cleanup()` e **depois** `exit(0)`, nessa ordem.

## Debugging (2)

13. **`fixParseDotEnvLine(line: string): [string, string] | null`** — a
    implementação atual tem um bug: valores que contêm `=` depois da
    chave (como uma URL de banco de dados com query string) são
    cortados no lugar errado. Leia o sintoma no comentário, entenda a
    causa, corrija sem mudar a assinatura.
14. **`fixExitCodeFromError(err: unknown): number`** — a implementação
    atual inverteu a lógica: está retornando `0` quando há erro e `1`
    quando não há. Corrija.

## Refatoração (1)

15. **`refactorBuildEnvSummary(env: EnvSource, keys: string[]): string`**
    — a implementação atual monta a string com um laço manual, uma
    flag `first` e concatenação passo a passo. Refatore para algo mais
    direto (dica: `Array.prototype.filter` + `map` + `join`), **sem
    mudar o comportamento observável**.

## Desafio integrador (1)

16. **`bootstrapApp(options: BootstrapOptions): BootstrapResult`** —
    junta tudo que você implementou nesta unidade:
    - parseia `options.dotEnvContent` como um arquivo `.env`;
    - monta a configuração final com a precedência
      `defaults` < `.env` < `options.processEnv` (variável de ambiente
      real do processo sempre vence);
    - calcula `missing`: quais chaves de `options.required` não têm
      valor definido e não vazio na configuração final;
    - `ready` é `true` quando `missing` está vazio;
    - registra, em `options.signalTarget`, um handler para `"SIGINT"` e
      outro para `"SIGTERM"` — cada um deve rodar `options.cleanup()` e
      depois `options.exit(0)`;
    - retorna `{ config, missing, ready }`.

    Veja os tipos `BootstrapOptions` e `BootstrapResult` já declarados em
    `exercises.ts`.

## Critérios de aceitação

- `npm test` sem falhas.
- `npx tsc --noEmit --strict` no arquivo não acusa erro.
- Nenhuma função usa `any`.
- Nenhuma função chama `process.exit`, lê `process.env` ou registra
  listeners em `process.on` diretamente — tudo é injetado por parâmetro.
- Você consegue explicar, sem consultar o código, por que testar código
  que depende de `process.exit` ou de sinais de OS exige esse tipo de
  injeção de dependência.

## Dicas

Peça `DICA_1`, `DICA_2` ou `DICA_3` quando travar em um exercício
específico — ou veja `hints.md` para o roteiro geral por nível.

Não peça `MOSTRAR_SOLUCAO` antes de tentar de verdade.
