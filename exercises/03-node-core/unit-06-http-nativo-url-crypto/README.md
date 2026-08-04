# Unidade 6 — `node:http` nativo, `node:url` e `node:crypto`

Fase 3, Unidade 6. Cobre: `node:http` (`http.createServer`, objetos de
requisição/resposta, leitura de corpo, cabeçalhos e status, roteamento "na
mão"), `node:url` (`URL`/`URLSearchParams`, query strings) e `node:crypto`
(hash com `createHash`, HMAC com `createHmac`, tokens aleatórios com
`randomBytes`/`randomUUID`, comparação em tempo constante com
`timingSafeEqual`).

## Antes de começar

Responda por escrito:

1. Por que comparar dois hashes ou assinaturas com `===` é considerado
   inseguro quando um deles vem de uma fonte não confiável (ex: um header
   `Authorization` enviado pelo cliente)?
   R =
2. O que `server.listen(0)` faz de diferente de `server.listen(3000)`? Por
   que isso importa para testes automatizados?
   R =
3. `URLSearchParams` e um objeto `Record<string, string>` armazenam a mesma
   informação (pares chave/valor). O que `URLSearchParams` sabe fazer que um
   objeto comum não sabe (pense em chaves repetidas e serialização)?
   R =

Não pesquise ainda. Escreva sua hipótese antes de implementar qualquer
função — você vai comparar com o resultado real ao rodar os testes.

## Por que `===` é inseguro para comparar segredos

Comparar duas strings com `===` (ou qualquer laço `for` que retorna assim
que encontra a primeira diferença) tem um tempo de execução que depende de
**quantos caracteres iniciais coincidem** antes da primeira diferença. Um
atacante que consiga medir o tempo de resposta de um servidor (mesmo que a
diferença seja de microssegundos, com estatística suficiente sobre muitas
tentativas) pode usar esse tempo para descobrir a assinatura/token correto
byte a byte, sem nunca precisar adivinhar o valor inteiro de uma vez —
esse é o ataque de **timing attack**.

`crypto.timingSafeEqual` compara dois `Buffer`s sempre no mesmo tempo,
independente de onde a diferença aparece, porque percorre todos os bytes
sem interromper a comparação antecipadamente. Ele **lança uma exceção** se
os dois buffers tiverem tamanhos diferentes — por isso qualquer wrapper
seguro precisa checar (e igualar) o tamanho antes de chamar
`timingSafeEqual`, tratando tamanhos diferentes como "não é igual" em vez
de deixar a exceção vazar.

## Como trabalhar

1. Abra `exercises.ts`. Cada função tem `throw new Error("not implemented: <nome>")`.
2. Implemente uma função por vez, com anotações de tipo explícitas.
3. Rode os testes:

   ```bash
   node --test exercises/03-node-core/unit-06-http-nativo-url-crypto/exercises.test.ts
   ```

4. Todos os testes começam falhando (exceto o de refatoração). Isso é
   esperado.
5. Verifique os tipos separadamente (o `node --test` não faz typecheck):

   ```bash
   npx tsc --noEmit --strict exercises/03-node-core/unit-06-http-nativo-url-crypto/exercises.ts
   ```

6. Não use `any`. Se travar em um tipo, pense no formato exato do dado
   (o que `req.url` pode ser? o que `server.address()` devolve?).

## Regra dos testes de servidor HTTP

Todo teste que sobe um `http.Server` nesta unidade:

- Usa `server.listen(0, ...)` — porta efêmera, nunca uma porta fixa (evita
  conflitos quando os testes rodam em paralelo ou em CI).
- Lê a porta real atribuída via `server.address()`.
- Fecha o servidor com `server.close()` dentro de um `finally`, garantindo
  que o handle não vaze mesmo se uma asserção falhar no meio do teste.

Se você notar `node --test` travando (não termina o processo) depois de
rodar os testes, é sinal de um servidor que não foi fechado — corrija o
vazamento, não use `--test-force-exit` para mascarar o problema.

## Exercícios fundamentais (8)

1. **`sha256Hex(input: string): string`** — calcula o hash SHA-256 de
   `input` e retorna em hexadecimal (`createHash("sha256")`).
2. **`hmacSign(secret: string, message: string): string`** — calcula o
   HMAC-SHA256 de `message` usando `secret` como chave, retorna em
   hexadecimal (`createHmac("sha256", secret)`).
3. **`randomToken(length: number): string`** — gera `length` bytes
   aleatórios (`randomBytes`) e retorna como string hexadecimal (o
   resultado terá `length * 2` caracteres).
4. **`generateRequestId(): string`** — gera um identificador único usando
   `randomUUID()`.
5. **`constantTimeEqual(a: string, b: string): boolean`** — compara duas
   strings em tempo constante usando `timingSafeEqual`. Deve retornar
   `false` (sem lançar exceção) quando os tamanhos forem diferentes.
6. **`parseQueryParams(queryString: string): Record<string, string>`** —
   recebe uma query string (com ou sem `?` inicial) e retorna um objeto
   simples de chave/valor, usando `URLSearchParams`.
7. **`parseUrlPath(rawUrl: string): string`** — recebe uma URL absoluta ou
   relativa (como vem em `req.url`) e retorna apenas o `pathname`, usando
   `URL` (dica: uma URL relativa precisa de uma base para ser parseada).
8. **`sendJson(res: http.ServerResponse, statusCode: number, payload: unknown): void`**
   — define `Content-Type: application/json`, o `statusCode` recebido, e
   escreve `payload` serializado como corpo da resposta, encerrando-a.

## Exercícios intermediários (4)

9. **`hmacVerify(secret: string, message: string, signature: string): boolean`**
   — recalcula a assinatura esperada com `hmacSign` e compara com
   `signature` usando `constantTimeEqual` (nunca com `===`).
10. **`readRequestBody(req: http.IncomingMessage): Promise<string>`** — lê
    todos os chunks do corpo da requisição e resolve com o conteúdo
    completo como string (ouça os eventos `"data"`, `"end"` e `"error"`).
11. **`parseTypedQuery(rawUrl: string): { pathname: string; query: Record<string, string> }`**
    — combina `URL` e `URLSearchParams` para devolver o `pathname` e a
    query já convertida em objeto tipado.
12. **`createServer(routes: RouteDefinition[]): http.Server`** — cria um
    servidor com `http.createServer` que faz roteamento "na mão": para
    cada requisição, extrai método e `pathname` (com `parseTypedQuery`),
    procura uma rota em `routes` cujo `method` e `path` batem exatamente,
    lê o corpo com `readRequestBody`, e chama o `handler` correspondente
    passando `{ query, body }` como contexto. Se nenhuma rota bater,
    responde `404` com `{ "error": "not found" }` via `sendJson`.

## Debugging (2)

13. **`matchPath(routePath: string, requestPath: string): boolean`** — a
    implementação atual tem um bug de comparação: rotas cadastradas sem
    barra final (`/users`) não respondem quando a requisição chega com
    barra final (`/users/`). Leia o sintoma no comentário e corrija sem
    mudar a assinatura (trate `/` como caso especial — não remova a única
    barra da raiz).
14. **`fixHmacVerification(secret: string, message: string, signature: string): boolean`**
    — a implementação atual tem um bug de verificação: qualquer assinatura
    com tamanho menor ou igual ao esperado é aceita como válida,
    independente do conteúdo. Leia o sintoma e corrija usando
    `constantTimeEqual`.

## Refatoração (1)

15. **`refactorParseQuery(queryString: string): Record<string, string>`** —
    a implementação atual faz o parsing de uma query string manualmente
    (`split`, `indexOf`, `decodeURIComponent` passo a passo). Ela já
    funciona corretamente. Refatore para usar `URLSearchParams`, mantendo
    o mesmo comportamento observável (inclusive para uma chave sem `=`,
    que deve virar string vazia).

## Desafio integrador (1)

16. **`createTokenServer(secret: string): http.Server`** — um servidor
    combinando tudo que você implementou nesta unidade:
    - `POST /tokens`: lê o corpo como JSON `{ "userId": string }`, gera um
      token `"<userId>.<assinatura>"` (assinatura = HMAC-SHA256 de
      `userId` com `secret`), responde `201` com `{ "token": string }`.
      Responde `400` com `{ "error": string }` se `userId` não vier como
      string não vazia.
    - `GET /verify?token=...`: separa o token no **último** `.` em
      `userId` e `assinatura`, verifica a assinatura em tempo constante,
      responde `200` com `{ "valid": boolean, "userId": string | null }`
      (`userId` é `null` quando `valid` é `false`).
    - Qualquer outra rota: `404` com `{ "error": "not found" }`.

## Critérios de aceitação

- `node --test exercises/03-node-core/unit-06-http-nativo-url-crypto/exercises.test.ts`
  sem falhas, e o processo termina sozinho (nenhum servidor fica aberto).
- `npx tsc --noEmit --strict` no arquivo não acusa erro.
- Nenhuma função usa `any`.
- Todo `http.Server` criado em teste usa `listen(0)` e é fechado no
  `finally`.
- Você consegue explicar, sem consultar o código, por que `===` é inseguro
  para comparar segredos e o que `timingSafeEqual` faz diferente.

## Dicas

Peça `DICA_1`, `DICA_2` ou `DICA_3` quando travar em um exercício
específico — ou veja `hints.md` para o roteiro geral por nível.

Não peça `MOSTRAR_SOLUCAO` antes de tentar de verdade.
