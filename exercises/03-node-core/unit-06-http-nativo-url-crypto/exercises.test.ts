import { test } from "node:test";
import assert from "node:assert/strict";
import * as http from "node:http";
import type { AddressInfo } from "node:net";

import {
  sha256Hex,
  hmacSign,
  randomToken,
  generateRequestId,
  constantTimeEqual,
  parseQueryParams,
  parseUrlPath,
  sendJson,
  hmacVerify,
  readRequestBody,
  parseTypedQuery,
  createServer,
  matchPath,
  fixHmacVerification,
  refactorParseQuery,
  createTokenServer,
  type RouteDefinition,
} from "./exercises.ts";

// Fecha o servidor esperando o evento de fechamento, para nunca deixar um
// handle aberto entre testes (o que travaria `node --test`).
async function closeServer(server: http.Server): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    server.close((err) => (err ? reject(err) : resolve()));
  });
}

// Sobe um servidor em porta efêmera (0) e devolve a URL base já resolvida.
async function listenEphemeral(server: http.Server): Promise<string> {
  await new Promise<void>((resolve) => {
    server.listen(0, "127.0.0.1", () => resolve());
  });
  const address = server.address() as AddressInfo;
  return `http://127.0.0.1:${address.port}`;
}

// --- sha256Hex --------------------------------------------------------

test("sha256Hex: calcula hash sha256 em hex", () => {
  assert.equal(
    sha256Hex(""),
    "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  );
  assert.equal(
    sha256Hex("abc"),
    "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad",
  );
});

// --- hmacSign -------------------------------------------------------------

test("hmacSign: gera HMAC-SHA256 em hex", () => {
  assert.equal(
    hmacSign("secret", "mensagem"),
    "1529ca64c265bd927feb8f7ac71aba707b8daea2d9b0c713fe6c373a6deb194",
  );
});

test("hmacSign: segredos diferentes geram assinaturas diferentes", () => {
  assert.notEqual(hmacSign("secret-a", "mensagem"), hmacSign("secret-b", "mensagem"));
});

// --- randomToken -------------------------------------------------------------

test("randomToken: gera token hex do tamanho esperado", () => {
  const token = randomToken(16);
  assert.equal(token.length, 32);
  assert.match(token, /^[0-9a-f]+$/);
});

test("randomToken: duas chamadas geram tokens diferentes", () => {
  assert.notEqual(randomToken(16), randomToken(16));
});

// --- generateRequestId -------------------------------------------------------------

test("generateRequestId: gera UUID v4 válido", () => {
  const id = generateRequestId();
  assert.match(
    id,
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  );
});

test("generateRequestId: duas chamadas geram ids diferentes", () => {
  assert.notEqual(generateRequestId(), generateRequestId());
});

// --- constantTimeEqual -------------------------------------------------------------

test("constantTimeEqual: compara strings iguais e diferentes", () => {
  assert.equal(constantTimeEqual("abc123", "abc123"), true);
  assert.equal(constantTimeEqual("abc123", "abc124"), false);
});

test("constantTimeEqual: strings de tamanhos diferentes não lançam erro", () => {
  assert.equal(constantTimeEqual("abc", "abcdef"), false);
  assert.equal(constantTimeEqual("", ""), true);
});

// --- parseQueryParams -------------------------------------------------------------

test("parseQueryParams: parseia string de query em objeto", () => {
  assert.deepEqual(parseQueryParams("a=1&b=2"), { a: "1", b: "2" });
  assert.deepEqual(parseQueryParams("?nome=ana&cidade=recife"), {
    nome: "ana",
    cidade: "recife",
  });
});

test("parseQueryParams: query vazia retorna objeto vazio", () => {
  assert.deepEqual(parseQueryParams(""), {});
});

// --- parseUrlPath -------------------------------------------------------------

test("parseUrlPath: extrai apenas o pathname", () => {
  assert.equal(parseUrlPath("/users?active=true"), "/users");
  assert.equal(parseUrlPath("http://example.com/orders/42"), "/orders/42");
  assert.equal(parseUrlPath("/"), "/");
});

// --- sendJson -------------------------------------------------------------

test("sendJson: escreve status, content-type e corpo JSON", async () => {
  const server = http.createServer((_req, res) => {
    sendJson(res, 201, { ok: true, value: 42 });
  });
  const baseUrl = await listenEphemeral(server);
  try {
    const response = await fetch(`${baseUrl}/qualquer`);
    assert.equal(response.status, 201);
    assert.equal(response.headers.get("content-type"), "application/json");
    assert.deepEqual(await response.json(), { ok: true, value: 42 });
  } finally {
    await closeServer(server);
  }
});

// --- hmacVerify -------------------------------------------------------------

test("hmacVerify: valida assinatura correta e rejeita incorreta", () => {
  const signature = hmacSign("segredo", "conteudo");
  assert.equal(hmacVerify("segredo", "conteudo", signature), true);
  assert.equal(hmacVerify("segredo", "conteudo", "0".repeat(64)), false);
  assert.equal(hmacVerify("segredo", "conteudo", ""), false);
});

// --- readRequestBody -------------------------------------------------------------

test("readRequestBody: lê o corpo completo da requisição", async () => {
  const server = http.createServer((req, res) => {
    void readRequestBody(req).then((body) => {
      sendJson(res, 200, { received: body });
    });
  });
  const baseUrl = await listenEphemeral(server);
  try {
    const response = await fetch(`${baseUrl}/echo`, {
      method: "POST",
      body: "olá mundo",
    });
    const payload = (await response.json()) as { received: string };
    assert.equal(payload.received, "olá mundo");
  } finally {
    await closeServer(server);
  }
});

// --- parseTypedQuery -------------------------------------------------------------

test("parseTypedQuery: separa pathname e query tipada", () => {
  assert.deepEqual(parseTypedQuery("/busca?termo=node&pagina=2"), {
    pathname: "/busca",
    query: { termo: "node", pagina: "2" },
  });
  assert.deepEqual(parseTypedQuery("/sem-query"), {
    pathname: "/sem-query",
    query: {},
  });
});

// --- createServer -------------------------------------------------------------

test("createServer: roteia por método e path, respondendo JSON", async () => {
  const routes: RouteDefinition[] = [
    {
      method: "GET",
      path: "/ping",
      handler: (_req, res) => {
        sendJson(res, 200, { pong: true });
      },
    },
    {
      method: "POST",
      path: "/echo",
      handler: (_req, res, context) => {
        sendJson(res, 201, { body: context.body, query: context.query });
      },
    },
  ];
  const server = createServer(routes);
  const baseUrl = await listenEphemeral(server);
  try {
    const pingResponse = await fetch(`${baseUrl}/ping`);
    assert.equal(pingResponse.status, 200);
    assert.deepEqual(await pingResponse.json(), { pong: true });

    const echoResponse = await fetch(`${baseUrl}/echo?x=1`, {
      method: "POST",
      body: "conteudo-teste",
    });
    assert.equal(echoResponse.status, 201);
    assert.deepEqual(await echoResponse.json(), {
      body: "conteudo-teste",
      query: { x: "1" },
    });

    const notFoundResponse = await fetch(`${baseUrl}/inexistente`);
    assert.equal(notFoundResponse.status, 404);
  } finally {
    await closeServer(server);
  }
});

// --- matchPath -------------------------------------------------------------

test("matchPath: trata barra final como equivalente", () => {
  assert.equal(matchPath("/users", "/users"), true);
  assert.equal(matchPath("/users", "/users/"), true);
  assert.equal(matchPath("/", "/"), true);
  assert.equal(matchPath("/users", "/orders"), false);
});

// --- fixHmacVerification -------------------------------------------------------------

test("fixHmacVerification: aceita apenas a assinatura correta", () => {
  const secret = "segredo";
  const message = "conteudo";
  const correct = hmacSign(secret, message);
  assert.equal(fixHmacVerification(secret, message, correct), true);
  assert.equal(fixHmacVerification(secret, message, "forjada"), false);
  assert.equal(fixHmacVerification(secret, message, ""), false);
});

// --- refactorParseQuery -------------------------------------------------------------

test("refactorParseQuery: mesmo comportamento da versão original", () => {
  assert.deepEqual(refactorParseQuery("a=1&b=2"), { a: "1", b: "2" });
  assert.deepEqual(refactorParseQuery("?nome=ana&cidade=recife"), {
    nome: "ana",
    cidade: "recife",
  });
  assert.deepEqual(refactorParseQuery(""), {});
  assert.deepEqual(refactorParseQuery("flag"), { flag: "" });
});

// --- createTokenServer -------------------------------------------------------------

test("createTokenServer: emite e verifica tokens assinados via HTTP", async () => {
  const server = createTokenServer("minha-chave");
  const baseUrl = await listenEphemeral(server);
  try {
    const createResponse = await fetch(`${baseUrl}/tokens`, {
      method: "POST",
      body: JSON.stringify({ userId: "user-123" }),
    });
    assert.equal(createResponse.status, 201);
    const { token } = (await createResponse.json()) as { token: string };
    assert.equal(typeof token, "string");
    assert.ok(token.startsWith("user-123."));

    const verifyResponse = await fetch(
      `${baseUrl}/verify?token=${encodeURIComponent(token)}`,
    );
    assert.equal(verifyResponse.status, 200);
    assert.deepEqual(await verifyResponse.json(), {
      valid: true,
      userId: "user-123",
    });

    const tamperedResponse = await fetch(
      `${baseUrl}/verify?token=${encodeURIComponent("user-123.assinatura-forjada")}`,
    );
    assert.equal(tamperedResponse.status, 200);
    assert.deepEqual(await tamperedResponse.json(), {
      valid: false,
      userId: null,
    });

    const badRequestResponse = await fetch(`${baseUrl}/tokens`, {
      method: "POST",
      body: JSON.stringify({}),
    });
    assert.equal(badRequestResponse.status, 400);

    const notFoundResponse = await fetch(`${baseUrl}/desconhecida`);
    assert.equal(notFoundResponse.status, 404);
  } finally {
    await closeServer(server);
  }
});
