# Unidade 5 — Tipos utilitários avançados, keyof, typeof e tipos condicionais

Fase 2, Unidade 5. Cobre: `keyof`, `typeof` no sistema de tipos (derivar um
tipo a partir de um valor/objeto `const` em tempo de execução), tipos de
acesso indexado (`T[K]`), utility types nativos (`Partial`, `Required`,
`Pick`, `Omit`, `Record`, `Readonly`), mapped types (`{ [K in keyof T]: ... }`)
e tipos condicionais introdutórios (`T extends U ? X : Y`).

## Antes de começar

Responda por escrito:

1. `keyof T` produz o quê exatamente — um valor, um tipo, ou os dois? Dado
   `type Product = { name: string; price: number }`, o que é `keyof Product`?
   R =
2. Um mapped type como `{ [K in keyof T]: T[K] | null }` percorre o quê para
   construir o novo tipo? Ele executa em tempo de execução ou só existe
   durante a compilação?
   R =
3. Qual a diferença prática entre `Partial<T>` e `Required<T>`? Em que
   situação você usaria cada um ao escrever uma função de atualização
   parcial (`update`/`patch`) de um objeto?
   R =

Não pesquise ainda. Escreva sua hipótese antes de implementar qualquer
função — você vai comparar com o resultado real ao rodar os testes.

## Como trabalhar

1. Abra `exercises.ts`. Cada função tem `throw new Error("not implemented: <nome>")`.
2. Implemente uma função por vez, **com anotações de tipo explícitas** nos
   parâmetros e no retorno (não confie só em inferência aqui — o objetivo
   da unidade é praticar escrever os tipos, especialmente os genéricos
   restritos por `keyof`).
3. Rode os testes:

   ```bash
   npm test
   ```

4. Todos os testes começam falhando, exceto o de refatoração. Isso é
   esperado.
5. Verifique os tipos (o `node --test` roda mas **não** typecheck; ele só
   apaga os tipos). Rode separadamente:

   ```bash
   npx tsc --noEmit --strict exercises/02-typescript-core/unit-05-tipos-utilitarios-avancados/exercises.ts
   ```

6. Não use `any`. Se travar em um tipo, é sinal de que falta pensar no
   formato do dado, não de usar `any` para silenciar o erro.

## Exercícios fundamentais (8)

1. **`getProperty<T, K extends keyof T>(obj: T, key: K): T[K]`** — acessa
   `obj[key]` de forma segura, usando `keyof` e acesso indexado (`T[K]`)
   para que o tipo de retorno dependa da chave passada.
2. **`getPropertyNames<T extends object>(obj: T): (keyof T)[]`** — retorna
   as chaves de `obj` tipadas como `(keyof T)[]` (não apenas `string[]`).
3. **`pick<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K>`**
   — retorna um novo objeto contendo apenas as chaves passadas em `keys`.
4. **`omit<T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K>`**
   — retorna um novo objeto contendo todas as chaves de `obj` **exceto**
   as passadas em `keys`.
5. **`type ScoreBoard = Record<string, number>`** (declare o alias) e
   **`sumRecordValues(record: ScoreBoard): number`** — soma todos os
   valores de um `Record<string, number>`.
6. **`makeReadonly<T extends object>(obj: T): Readonly<T>`** — retorna uma
   cópia de `obj` congelada (`Object.freeze`), tipada como `Readonly<T>`.
7. **`HTTP_STATUS`** (objeto `const` com `as const`) + **`type HttpStatusCode`**
   (derivado de `typeof HTTP_STATUS` combinado com `keyof`) +
   **`describeStatus(code: HttpStatusCode): string`** — recebe um código
   HTTP e retorna sua descrição (`"OK"`, `"Created"`, `"Not Found"`,
   `"Server Error"`). Só aceita códigos que existem em `HTTP_STATUS`.
8. **`applyPatch<T extends object>(original: T, patch: Partial<T>): T`** —
   retorna um novo objeto combinando `original` com os campos definidos em
   `patch` (um patch parcial de atualização).

## Exercícios intermediários (4)

9. **`type Nullable<T> = { [K in keyof T]: T[K] | null }`** (declare o
   mapped type) e **`nullifyFields<T extends object, K extends keyof T>(obj: T, keys: K[]): Nullable<T>`**
   — retorna uma cópia de `obj` onde os campos listados em `keys` viram
   `null`, mantendo os demais campos como estavam.
10. **`type DraftOrder = { id?: string; total?: number; status?: string }`**
    (declare o alias) e **`finalizeOrder(draft: DraftOrder, fallback: Required<DraftOrder>): Required<DraftOrder>`**
    — para cada campo, usa o valor de `draft` se ele estiver definido,
    senão usa o valor correspondente de `fallback`. O retorno nunca tem
    campos `undefined`.
11. **`type Present<T> = T extends null | undefined ? never : T`** (declare
    o tipo condicional) e **`assertPresent<T>(value: T): Present<T>`** —
    lança `TypeError` se `value` for `null` ou `undefined`; caso contrário,
    retorna `value`.
12. **`type Address = { street: string; city: string; zipCode: string }`**,
    **`type UserWithAddress = { name: string; address: Address }`** e
    **`getCity(user: UserWithAddress): UserWithAddress["address"]["city"]`**
    — retorna a cidade do endereço do usuário, usando acesso indexado
    aninhado na assinatura de retorno (sem repetir `string` na mão).

## Debugging (2)

13. **`applyProfileUpdate<T extends object>(current: T, patch: Partial<T>): T`**
    — a implementação atual tem um bug: quando o `patch` inclui um campo
    explicitamente `undefined` (significando "não altere este campo"), o
    campo original é apagado em vez de preservado. Leia, entenda o
    sintoma, corrija sem mudar a assinatura.
14. **`sumFieldValues<T extends Record<string, number>>(obj: T, fields: (keyof T)[]): number`**
    — a implementação atual tem um bug: em vez de somar apenas os campos
    listados em `fields`, ela soma **todos** os campos de `obj`. Corrija
    para que apenas os campos pedidos sejam somados.

## Refatoração (1)

15. **`buildUserVariants(user: UserFull): { draft: UserDraft; full: UserFull; locked: UserLocked }`**
    — a implementação atual já funciona corretamente, mas os tipos
    `UserDraft`, `UserFull` e `UserLocked` foram escritos manualmente,
    repetindo os mesmos três campos três vezes. Refatore para derivar os
    três tipos de um único `BaseUser` usando `Partial`, `Required` e
    `Readonly`, **sem mudar o comportamento observável** da função.

## Desafio integrador (1)

16. **`ROLE`** (objeto `const` com `as const`) + **`type Role`** (derivado
    de `typeof ROLE` + `keyof`) + **`type Permission = { read: boolean; write: boolean; delete: boolean }`**
    + **`buildPermissionMatrix(overrides: Partial<Record<Role, Partial<Permission>>>): Record<Role, Permission>`**
    — recebe permissões padrão por papel (`ROLE.ADMIN` tem tudo liberado,
    `ROLE.EDITOR` pode ler e escrever mas não apagar, `ROLE.VIEWER` só pode
    ler) e aplica `overrides` por cima, mesclando campo a campo. Um campo
    ausente ou `undefined` em `overrides` **não** deve sobrescrever o valor
    padrão.

## Critérios de aceitação

- `npm test` sem falhas (exceto os stubs ainda não implementados — no
  estado inicial, só `buildUserVariants` passa).
- `npx tsc --noEmit --strict` no arquivo não acusa erro.
- Nenhuma função usa `any`.
- Você consegue explicar, sem consultar o código, a diferença entre
  `keyof T`, `typeof valor` e `T[K]`, e quando cada um se aplica.

## Dicas

Peça `DICA_1`, `DICA_2` ou `DICA_3` quando travar em um exercício
específico — ou veja `hints.md` para o roteiro geral por nível.

Não peça `MOSTRAR_SOLUCAO` antes de tentar de verdade.
