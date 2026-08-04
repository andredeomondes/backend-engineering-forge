# Dicas — Unidade 6 (node:http, node:url, node:crypto)

Use `DICA_1`, `DICA_2` ou `DICA_3` dizendo qual exercício travou. Abaixo
está o roteiro geral que a mentoria segue nesta unidade.

## Nível 1 — direção, sem código

- Para `sha256Hex`/`hmacSign`: `createHash`/`createHmac` seguem o mesmo
  padrão — você cria o objeto, chama `.update(dado)` uma ou mais vezes, e
  finaliza com `.digest(encoding)`. Qual `encoding` devolve uma string
  legível em vez de um `Buffer`?
- Para `constantTimeEqual`: `timingSafeEqual` espera dois `Buffer`s do
  **mesmo tamanho** — o que ele faz se você passar tamanhos diferentes? O
  que sua função precisa checar *antes* de chamar `timingSafeEqual`?
- Para `parseQueryParams`/`parseTypedQuery`: `URLSearchParams` é iterável
  — como você percorre pares `[chave, valor]` com `for...of`?
- Para `parseUrlPath`: uma URL relativa como `/users?x=1` não é uma URL
  válida sozinha para o construtor `URL`. O que o segundo argumento de
  `new URL(input, base)` resolve?
- Para `readRequestBody`: um `IncomingMessage` é um stream. Quais três
  eventos você precisa ouvir para saber que os dados chegaram, que
  terminaram, ou que algo deu errado?
- Para `createServer`: pense na ordem de operações — primeiro descobrir
  método e path, depois procurar a rota, depois ler o corpo, depois
  chamar o handler. O que acontece se a rota não existir? Você ainda
  precisa ler o corpo nesse caso?
- Para `matchPath`: o bug é sobre uma barra a mais no final. Que operação
  de string normalizaria `"/users/"` para `"/users"` sem quebrar o caso
  `"/"` sozinho?
- Para `fixHmacVerification`: a condição `signature.length <= expected.length`
  está decidindo o resultado cedo demais — ela deveria influenciar a
  segurança da comparação, não decidir sozinha que é válido.

## Nível 2 — pista mais direta

- `sha256Hex`: `createHash("sha256").update(input).digest("hex")`.
- `hmacSign`: `createHmac("sha256", secret).update(message).digest("hex")`.
- `randomToken`: `randomBytes(length).toString("hex")`.
- `constantTimeEqual`: converta `a` e `b` para `Buffer` com
  `Buffer.from(str, "utf8")`; se `.length` diferir, retorne `false` antes
  de chamar `timingSafeEqual`.
- `parseQueryParams`: `new URLSearchParams(queryString)` já ignora um `?`
  inicial sozinho; monte o objeto com um `for (const [k, v] of params)`.
- `parseUrlPath`: `new URL(rawUrl, "http://localhost").pathname`.
- `readRequestBody`: acumule `Buffer`s num array no evento `"data"`,
  resolva com `Buffer.concat(chunks).toString("utf8")` no `"end"`,
  rejeite no `"error"`.
- `createServer`: use `req.method ?? "GET"` e `parseTypedQuery(req.url ?? "/")`
  para achar `pathname`/`query`; `routes.find(r => r.method === method && r.path === pathname)`.
- `matchPath`: normalize removendo uma barra final só se o resultado não
  ficar vazio (`path.length > 1 && path.endsWith("/") ? path.slice(0, -1) : path`),
  aplique nos dois lados antes de comparar.
- `fixHmacVerification`: recalcule `expected` com `hmacSign` e retorne
  `constantTimeEqual(expected, signature)` — descarte a checagem de
  tamanho que retorna `true` sozinha.

## Nível 3 — quase o código, mas ainda não a solução

- `constantTimeEqual`:
  ```ts
  const bufferA = Buffer.from(a, "utf8");
  const bufferB = Buffer.from(b, "utf8");
  if (bufferA.length !== bufferB.length) return false;
  return timingSafeEqual(bufferA, bufferB);
  ```
- `createServer` (esqueleto):
  ```ts
  return http.createServer((req, res) => {
    void (async () => {
      const method = req.method ?? "GET";
      const { pathname, query } = parseTypedQuery(req.url ?? "/");
      const route = routes.find((r) => r.method === method && r.path === pathname);
      if (!route) {
        sendJson(res, 404, { error: "not found" });
        return;
      }
      const body = await readRequestBody(req);
      await route.handler(req, res, { query, body });
    })();
  });
  ```
- `matchPath`:
  ```ts
  function normalize(path: string): string {
    return path.length > 1 && path.endsWith("/") ? path.slice(0, -1) : path;
  }
  return normalize(routePath) === normalize(requestPath);
  ```
- `createTokenServer`: reaproveite o esqueleto de `createServer`, mas
  como o body do `/tokens` precisa ser `JSON.parse`ado, valide com
  `try/catch` e verifique se `userId` é `string` e não vazia antes de
  gerar o token com `hmacSign(secret, userId)`. Em `/verify`, use
  `token.lastIndexOf(".")` para separar `userId` de `assinatura` sem
  quebrar `userId`s que já contenham pontos.

Peça `MOSTRAR_SOLUCAO` apenas depois de registrar sua tentativa.
