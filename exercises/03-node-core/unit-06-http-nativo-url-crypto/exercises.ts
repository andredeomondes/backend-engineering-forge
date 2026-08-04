// Unidade 6 — node:http nativo, node:url e node:crypto
//
// Implemente cada função. Não use bibliotecas externas — apenas módulos
// nativos do Node (`node:http`, `node:url`, `node:crypto`). Não use `any`.
// Veja README.md para o enunciado completo de cada exercício.

import * as http from "node:http";
import { URL, URLSearchParams } from "node:url";
import {
  createHash,
  createHmac,
  randomBytes,
  randomUUID,
  timingSafeEqual,
} from "node:crypto";

// --- Tipos usados nesta unidade ---------------------------------------------

export type RouteContext = {
  query: Record<string, string>;
  body: string;
};

export type RouteHandler = (
  req: http.IncomingMessage,
  res: http.ServerResponse,
  context: RouteContext,
) => void | Promise<void>;

export type RouteDefinition = {
  method: string;
  path: string;
  handler: RouteHandler;
};

// --- Fundamentais ---------------------------------------------------------

// test: node --test --test-name-pattern="sha256Hex" exercises/03-node-core/unit-06-http-nativo-url-crypto/exercises.test.ts
export function sha256Hex(input: string): string {
  throw new Error("not implemented: sha256Hex");
}

// test: node --test --test-name-pattern="hmacSign" exercises/03-node-core/unit-06-http-nativo-url-crypto/exercises.test.ts
export function hmacSign(secret: string, message: string): string {
  throw new Error("not implemented: hmacSign");
}

// test: node --test --test-name-pattern="randomToken" exercises/03-node-core/unit-06-http-nativo-url-crypto/exercises.test.ts
export function randomToken(length: number): string {
  throw new Error("not implemented: randomToken");
}

// test: node --test --test-name-pattern="generateRequestId" exercises/03-node-core/unit-06-http-nativo-url-crypto/exercises.test.ts
export function generateRequestId(): string {
  throw new Error("not implemented: generateRequestId");
}

// test: node --test --test-name-pattern="constantTimeEqual" exercises/03-node-core/unit-06-http-nativo-url-crypto/exercises.test.ts
export function constantTimeEqual(a: string, b: string): boolean {
  throw new Error("not implemented: constantTimeEqual");
}

// test: node --test --test-name-pattern="parseQueryParams" exercises/03-node-core/unit-06-http-nativo-url-crypto/exercises.test.ts
export function parseQueryParams(queryString: string): Record<string, string> {
  throw new Error("not implemented: parseQueryParams");
}

// test: node --test --test-name-pattern="parseUrlPath" exercises/03-node-core/unit-06-http-nativo-url-crypto/exercises.test.ts
export function parseUrlPath(rawUrl: string): string {
  throw new Error("not implemented: parseUrlPath");
}

// test: node --test --test-name-pattern="sendJson" exercises/03-node-core/unit-06-http-nativo-url-crypto/exercises.test.ts
export function sendJson(
  res: http.ServerResponse,
  statusCode: number,
  payload: unknown,
): void {
  throw new Error("not implemented: sendJson");
}

// --- Intermediários --------------------------------------------------------

// test: node --test --test-name-pattern="hmacVerify" exercises/03-node-core/unit-06-http-nativo-url-crypto/exercises.test.ts
export function hmacVerify(
  secret: string,
  message: string,
  signature: string,
): boolean {
  throw new Error("not implemented: hmacVerify");
}

// test: node --test --test-name-pattern="readRequestBody" exercises/03-node-core/unit-06-http-nativo-url-crypto/exercises.test.ts
export function readRequestBody(req: http.IncomingMessage): Promise<string> {
  throw new Error("not implemented: readRequestBody");
}

// test: node --test --test-name-pattern="parseTypedQuery" exercises/03-node-core/unit-06-http-nativo-url-crypto/exercises.test.ts
export function parseTypedQuery(rawUrl: string): {
  pathname: string;
  query: Record<string, string>;
} {
  throw new Error("not implemented: parseTypedQuery");
}

// test: node --test --test-name-pattern="createServer" exercises/03-node-core/unit-06-http-nativo-url-crypto/exercises.test.ts
export function createServer(routes: RouteDefinition[]): http.Server {
  throw new Error("not implemented: createServer");
}

// --- Debugging --------------------------------------------------------------
//
// As duas funções abaixo JÁ ESTÃO IMPLEMENTADAS, mas contêm um bug real.
// Sua tarefa não é reescrever do zero: é diagnosticar e corrigir.

// test: node --test --test-name-pattern="matchPath" exercises/03-node-core/unit-06-http-nativo-url-crypto/exercises.test.ts
export function matchPath(routePath: string, requestPath: string): boolean {
  // Sintoma relatado: uma rota cadastrada como "/users" deixa de responder
  // quando a requisição chega como "/users/" (com barra final) — o roteador
  // trata como "não encontrado", mesmo sendo o mesmo recurso.
  return routePath === requestPath;
}

// test: node --test --test-name-pattern="fixHmacVerification" exercises/03-node-core/unit-06-http-nativo-url-crypto/exercises.test.ts
export function fixHmacVerification(
  secret: string,
  message: string,
  signature: string,
): boolean {
  // Sintoma relatado: em produção, assinaturas erradas mas "curtas" estão
  // sendo aceitas como válidas — um token forjado com poucos caracteres
  // passa na verificação quando não deveria.
  const expected = hmacSign(secret, message);
  if (signature.length <= expected.length) {
    return true;
  }
  return expected === signature;
}

// --- Refatoração -------------------------------------------------------------
//
// Esta função já funciona corretamente. A tarefa é refatorar para reduzir
// passos manuais, mantendo o mesmo comportamento observável.

// test: node --test --test-name-pattern="refactorParseQuery" exercises/03-node-core/unit-06-http-nativo-url-crypto/exercises.test.ts
export function refactorParseQuery(queryString: string): Record<string, string> {
  const result: Record<string, string> = {};
  const trimmed = queryString.startsWith("?")
    ? queryString.slice(1)
    : queryString;
  if (trimmed.length === 0) {
    return result;
  }
  const pairs = trimmed.split("&");
  for (let i = 0; i < pairs.length; i++) {
    const pair = pairs[i];
    const eqIndex = pair.indexOf("=");
    let key: string;
    let value: string;
    if (eqIndex === -1) {
      key = pair;
      value = "";
    } else {
      key = pair.slice(0, eqIndex);
      value = pair.slice(eqIndex + 1);
    }
    const decodedKey = decodeURIComponent(key);
    const decodedValue = decodeURIComponent(value);
    result[decodedKey] = decodedValue;
  }
  return result;
}

// --- Desafio integrador -------------------------------------------------------

// test: node --test --test-name-pattern="createTokenServer" exercises/03-node-core/unit-06-http-nativo-url-crypto/exercises.test.ts
export function createTokenServer(secret: string): http.Server {
  // Combine o que você implementou nesta unidade em um único servidor:
  //
  // POST /tokens
  //   - lê o corpo da requisição como JSON: { "userId": string }
  //   - gera um token no formato "<userId>.<assinatura>", onde <assinatura>
  //     é o HMAC-SHA256 de <userId> usando `secret`.
  //   - responde 201 com JSON { "token": string }.
  //   - responde 400 com JSON { "error": string } se o corpo não tiver
  //     `userId` (string não vazia).
  //
  // GET /verify?token=<token>
  //   - separa o token no último "." em <userId> e <assinatura>.
  //   - verifica a assinatura com HMAC (comparação em tempo constante).
  //   - responde 200 com JSON { "valid": boolean, "userId": string | null }.
  //     `userId` é `null` quando `valid` é `false`.
  //
  // Qualquer outra rota: responde 404 com JSON { "error": "not found" }.
  throw new Error("not implemented: createTokenServer");
}
