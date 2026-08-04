# Unidade 8 — tsconfig, strict mode, erros tipados e validação em runtime

Fase 2, Unidade 8. Cobre: configuração do `tsconfig` e `strict` mode,
tipagem de erros lançados e capturados (`catch (e: unknown)`, subclasses
de `Error` com campos tipados), tipagem de dados externos/não confiáveis
nas fronteiras de função, a diferença entre validação em tempo de
compilação e validação em runtime, e um padrão `Result<T, E>` para
representar falhas esperadas sem lançar exceção. Esta é a última unidade
da Fase 2 — ela amarra o que as unidades anteriores construíram, antes do
Projeto 2 (domínio tipado de marketplace).

## Antes de começar

Responda por escrito:

1. Se um objeto é anotado como `interface User`, isso garante que ele
   realmente tem esse formato em runtime? Por quê?
   R =
2. O que a flag `strict` do `tsconfig.json` realmente ativa? Cite pelo
   menos duas checagens específicas que ela liga (por exemplo,
   `strictNullChecks`, `noImplicitAny`) e o que cada uma pega.
   R =
3. Qual a diferença entre lançar uma exceção (`throw`) e retornar um
   `Result<T, E>` para representar uma falha? Quando cada abordagem faz
   mais sentido?
   R =

Não pesquise ainda. Escreva sua hipótese antes de implementar qualquer
função — você vai comparar com o resultado real ao rodar os testes.

## Como trabalhar

1. Abra `exercises.ts`. Cada função tem `throw new Error("not implemented: <nome>")`.
2. Implemente uma função por vez, **com anotações de tipo explícitas** nos
   parâmetros e no retorno. As classes `ValidationError`, `NotFoundError`
   e o alias `Result<T, E>` já estão prontos no topo do arquivo — use-os.
3. Diferente das outras unidades, esta tem perguntas conceituais em
   "Antes de começar" (`tsconfig`/`strict`) que são respondidas por
   escrito, não em código — não existe teste automatizado para elas. Já
   os 16 exercícios numerados abaixo são todos código e **precisam**
   passar em `npm test`.
4. Rode os testes:

   ```bash
   npm test
   ```

5. Todos os exercícios não implementados começam falhando. Isso é
   esperado.
6. Verifique os tipos (o `node --test` roda mas **não** typecheck; ele só
   apaga os tipos). Rode separadamente:

   ```bash
   npx tsc --noEmit --strict exercises/02-typescript-core/unit-08-tsconfig-strict-validacao-runtime/exercises.ts
   ```

7. Não use `any`. Se travar em um tipo, é sinal de que falta pensar no
   formato do dado, não de usar `any` para silenciar o erro. Em
   particular: dado `unknown`, **estreite (`narrow`) antes de usar** —
   não faça `as X` "às cegas" para fazer o compilador calar a boca.

## Exercícios fundamentais (8)

1. **`validateAge(age: number): void`** — lança `ValidationError` (campo
   `"age"`) se `age` não for um inteiro entre `0` e `120` (inclusive). Se
   for válido, não retorna nada (não lança).
2. **`findUserOrThrow(id: string, users: User[]): User`** — procura o
   usuário com o `id` dado. Se encontrar, retorna. Se não, lança
   `NotFoundError` com `resourceId` igual ao `id` procurado.
3. **`describeCaughtError(e: unknown): string`** — recebe algo capturado
   em um `catch (e: unknown)` e retorna uma descrição textual: se for
   `ValidationError`, `"campo inválido (<field>): <message>"`; se for
   outro `Error`, `"erro: <message>"`; caso contrário (valor lançado que
   não é `Error`), `"valor lançado não é um Error: <String(e)>"`.
4. **`safeJsonParse(input: string): Result<unknown, string>`** — chama
   `JSON.parse(input)` dentro de um `try`/`catch (e: unknown)`. Em
   sucesso, retorna `{ ok: true, value: ... }`. Em erro, retorna
   `{ ok: false, error: <mensagem como string> }` — nunca deixa a
   exceção escapar.
5. **`parsePositiveInteger(input: string): Result<number, string>`** —
   converte `input` para inteiro positivo. Retorna `Result` de erro (com
   mensagem descritiva) se `input` não representar um inteiro `> 0`.
6. **`divide(a: number, b: number): Result<number, string>`** — divide
   `a` por `b`. Se `b` for `0`, retorna `{ ok: false, error: "divisão por zero" }`
   em vez de lançar.
7. **`isUserShape(data: unknown): data is { name: string; age: number }`**
   — *type guard*: verifica em runtime se `data` tem o formato
   `{ name: string; age: number }`, sem assumir nada antes de checar.
8. **`parseUserPayload(data: unknown): Result<{ name: string; age: number }, string>`**
   — recebe dado externo não confiável (`unknown`) e usa `isUserShape`
   para validar antes de aceitar. Retorna `Result` de sucesso com o
   objeto tipado, ou de erro com mensagem, se o formato for inválido.

## Exercícios intermediários (4)

9. **`unwrapOrThrow<T, E>(result: Result<T, E>): T`** — genérico: se
   `result.ok`, retorna `result.value`; senão, lança um `Error` cuja
   mensagem inclui `result.error` convertido para string.
10. **`mapResult<T, U, E>(result: Result<T, E>, fn: (value: T) => U): Result<U, E>`**
    — genérico: aplica `fn` ao valor apenas se `result` for sucesso;
    propaga o erro sem alterar se for falha.
11. **`chainValidations(input: unknown): Result<{ name: string; age: number }, string[]>`**
    — valida `input` como um objeto `{ name: string; age: number }`
    **acumulando todos os erros encontrados** num array (não para no
    primeiro problema): `name` precisa ser string não vazia, `age`
    precisa ser inteiro entre `0` e `120`. Se `input` nem for um objeto,
    retorna erro com uma única mensagem descrevendo isso.
12. **`parseConfigFromEnv(env: Record<string, string | undefined>): Result<{ port: number; host: string }, string>`**
    — lê `env.PORT` e `env.HOST` (dado externo não confiável — variáveis
    de ambiente são sempre `string | undefined`), valida que `PORT` é um
    inteiro entre `1` e `65535` e que `HOST` é uma string não vazia.
    Retorna `Result` com a config tipada ou com mensagem de erro.

## Debugging (2)

13. **`divideSafe(a: number, b: number): Result<number, string>`** — a
    implementação atual tem um bug: em vez de retornar um `Result` de
    erro controlado na divisão por zero, ela lança uma exceção não
    tratada. Leia o comentário de sintoma, entenda por que isso quebra o
    contrato da função, e corrija sem mudar a assinatura.
14. **`describeThrownValue(fn: () => void): string`** — a implementação
    atual captura com `catch (e: unknown)`, mas assume sem checar que
    `e` é uma instância de `Error` (`as Error`). Quando `fn` lança algo
    que não é `Error` (uma `string`, por exemplo), o resultado vem
    errado. Corrija a narrowing.

## Refatoração (1)

15. **`parseIntOrThrow(input: string): number`** — a implementação atual
    funciona corretamente (lança `TypeError` para entrada inválida,
    retorna o inteiro para entrada válida), mas tem passos manuais e uma
    flag `isValid` desnecessária. Refatore para algo mais direto, **sem
    mudar o comportamento observável** (continua lançando, não vira
    `Result` — essa troca não faz sentido aqui, veja a Unidade 8 do README
    principal da fase sobre quando usar cada abordagem).

## Desafio integrador (1)

16. **`processBatch(inputs: unknown[]): { successes: number[]; failures: string[] }`**
    — recebe uma lista de entradas de formato desconhecido (`unknown[]`).
    Para cada item, no índice `i`:
    - se não for uma `string`, adiciona `"índice <i>: não é uma string"`
      a `failures`;
    - se for uma `string`, usa a mesma lógica de `parsePositiveInteger`
      para validar; se válida, adiciona o número a `successes`; se
      inválida, adiciona `"índice <i>: <mensagem de erro>"` a `failures`.

    Retorna `{ successes, failures }` ao final, preservando a ordem em
    que os itens foram processados dentro de cada lista.

## Critérios de aceitação

- `npm test` sem falhas.
- `npx tsc --noEmit --strict` no arquivo não acusa erro.
- Nenhuma função usa `any`.
- Você respondeu por escrito as 3 perguntas de "Antes de começar".
- Você consegue explicar, sem consultar o código, por que um `type` ou
  `interface` não garante nada em runtime, e o que de fato garante.

## Dicas

Peça `DICA_1`, `DICA_2` ou `DICA_3` quando travar em um exercício
específico — ou veja `hints.md` para o roteiro geral por nível.

Não peça `MOSTRAR_SOLUCAO` antes de tentar de verdade.
