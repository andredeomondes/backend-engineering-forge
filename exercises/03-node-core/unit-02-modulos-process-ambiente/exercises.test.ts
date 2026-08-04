import { test } from "node:test";
import assert from "node:assert/strict";

import {
  parseArgvFlag,
  getEnvOrDefault,
  isEnvTruthy,
  requireEnvVar,
  parseIntEnv,
  formatExitMessage,
  normalizeInteropDefault,
  buildShutdownSignalMessage,
  parseDotEnv,
  mergeEnvWithDefaults,
  validateRequiredEnvVars,
  createGracefulShutdown,
  fixParseDotEnvLine,
  fixExitCodeFromError,
  refactorBuildEnvSummary,
  bootstrapApp,
  type SignalListener,
} from "./exercises.ts";

// --- parseArgvFlag -------------------------------------------------------

test("parseArgvFlag: encontra valor de uma flag --key=value", () => {
  assert.equal(
    parseArgvFlag(["node", "script.js", "--env=production"], "env"),
    "production",
  );
  assert.equal(parseArgvFlag(["node", "script.js"], "env"), null);
  assert.equal(
    parseArgvFlag(["--port=3000", "--env=dev"], "port"),
    "3000",
  );
});

// --- getEnvOrDefault -------------------------------------------------------

test("getEnvOrDefault: retorna valor do env ou fallback", () => {
  assert.equal(getEnvOrDefault({ PORT: "8080" }, "PORT", "3000"), "8080");
  assert.equal(getEnvOrDefault({}, "PORT", "3000"), "3000");
  assert.equal(getEnvOrDefault({ PORT: undefined }, "PORT", "3000"), "3000");
});

// --- isEnvTruthy -------------------------------------------------------

test("isEnvTruthy: reconhece valores truthy comuns, case-insensitive", () => {
  assert.equal(isEnvTruthy({ DEBUG: "true" }, "DEBUG"), true);
  assert.equal(isEnvTruthy({ DEBUG: "TRUE" }, "DEBUG"), true);
  assert.equal(isEnvTruthy({ DEBUG: "1" }, "DEBUG"), true);
  assert.equal(isEnvTruthy({ DEBUG: "yes" }, "DEBUG"), true);
  assert.equal(isEnvTruthy({ DEBUG: "false" }, "DEBUG"), false);
  assert.equal(isEnvTruthy({ DEBUG: "0" }, "DEBUG"), false);
  assert.equal(isEnvTruthy({}, "DEBUG"), false);
});

// --- requireEnvVar -------------------------------------------------------

test("requireEnvVar: retorna valor quando presente", () => {
  assert.equal(requireEnvVar({ API_KEY: "abc123" }, "API_KEY"), "abc123");
});

test("requireEnvVar: lança quando ausente ou vazia", () => {
  assert.throws(() => requireEnvVar({}, "API_KEY"));
  assert.throws(() => requireEnvVar({ API_KEY: "" }, "API_KEY"));
});

// --- parseIntEnv -------------------------------------------------------

test("parseIntEnv: converte string para inteiro", () => {
  assert.equal(parseIntEnv({ PORT: "3000" }, "PORT", 8080), 3000);
});

test("parseIntEnv: usa fallback quando ausente ou inválido", () => {
  assert.equal(parseIntEnv({}, "PORT", 8080), 8080);
  assert.equal(parseIntEnv({ PORT: "abc" }, "PORT", 8080), 8080);
});

// --- formatExitMessage -------------------------------------------------------

test("formatExitMessage: mensagens para sucesso e erro", () => {
  assert.equal(
    formatExitMessage(0),
    "Processo finalizado com sucesso (code 0)",
  );
  assert.equal(
    formatExitMessage(1),
    "Processo finalizado com erro (code 1)",
  );
  assert.equal(
    formatExitMessage(2),
    "Processo finalizado com erro (code 2)",
  );
});

// --- normalizeInteropDefault -------------------------------------------------------

test("normalizeInteropDefault: desembrulha interop de CJS/ESM", () => {
  assert.equal(normalizeInteropDefault({ default: "valor" }), "valor");
  assert.equal(normalizeInteropDefault("direto"), "direto");
  assert.deepEqual(normalizeInteropDefault({ default: { a: 1 } }), { a: 1 });
});

// --- buildShutdownSignalMessage -------------------------------------------------------

test("buildShutdownSignalMessage: formata mensagem do sinal recebido", () => {
  assert.equal(
    buildShutdownSignalMessage("SIGINT"),
    "Sinal recebido: SIGINT. Encerrando graciosamente...",
  );
  assert.equal(
    buildShutdownSignalMessage("SIGTERM"),
    "Sinal recebido: SIGTERM. Encerrando graciosamente...",
  );
});

// --- parseDotEnv -------------------------------------------------------

test("parseDotEnv: parseia conteúdo estilo .env", () => {
  const content = [
    "# comentário",
    "",
    "PORT=3000",
    'NAME="Minha App"',
    "DEBUG=true",
    "  SPACED = valor  ",
  ].join("\n");

  assert.deepEqual(parseDotEnv(content), {
    PORT: "3000",
    NAME: "Minha App",
    DEBUG: "true",
    SPACED: "valor",
  });
});

test("parseDotEnv: ignora linhas malformadas", () => {
  assert.deepEqual(parseDotEnv("sem_igual\n=sem_chave\nOK=1"), { OK: "1" });
});

// --- mergeEnvWithDefaults -------------------------------------------------------

test("mergeEnvWithDefaults: env tem precedência sobre defaults", () => {
  assert.deepEqual(
    mergeEnvWithDefaults(
      { PORT: "8080" },
      { PORT: "3000", HOST: "localhost" },
    ),
    { PORT: "8080", HOST: "localhost" },
  );
});

test("mergeEnvWithDefaults: ignora valores undefined do env", () => {
  assert.deepEqual(
    mergeEnvWithDefaults({ PORT: undefined }, { PORT: "3000" }),
    { PORT: "3000" },
  );
});

// --- validateRequiredEnvVars -------------------------------------------------------

test("validateRequiredEnvVars: válido quando todas presentes", () => {
  assert.deepEqual(
    validateRequiredEnvVars({ A: "1", B: "2" }, ["A", "B"]),
    { missing: [], valid: true },
  );
});

test("validateRequiredEnvVars: aponta as ausentes ou vazias", () => {
  assert.deepEqual(
    validateRequiredEnvVars({ A: "1", B: "" }, ["A", "B", "C"]),
    { missing: ["B", "C"], valid: false },
  );
});

// --- createGracefulShutdown -------------------------------------------------------

test("createGracefulShutdown: executa cleanup e depois exit(0)", () => {
  const calls: string[] = [];
  const cleanup = () => calls.push("cleanup");
  const exit = (code: number) => calls.push(`exit:${code}`);

  const handler = createGracefulShutdown(cleanup, exit);
  handler("SIGINT");

  assert.deepEqual(calls, ["cleanup", "exit:0"]);
});

test("createGracefulShutdown: não chama exit antes do cleanup terminar", () => {
  const order: string[] = [];
  const handler = createGracefulShutdown(
    () => order.push("cleanup"),
    () => order.push("exit"),
  );
  handler("SIGTERM");
  assert.deepEqual(order, ["cleanup", "exit"]);
});

// --- fixParseDotEnvLine -------------------------------------------------------

test("fixParseDotEnvLine: preserva valores com '=' depois da chave", () => {
  assert.deepEqual(
    fixParseDotEnvLine(
      "DATABASE_URL=postgres://user:pass@host/db?ssl=true",
    ),
    ["DATABASE_URL", "postgres://user:pass@host/db?ssl=true"],
  );
});

test("fixParseDotEnvLine: ignora comentários e linhas vazias", () => {
  assert.equal(fixParseDotEnvLine("# comentário"), null);
  assert.equal(fixParseDotEnvLine("   "), null);
  assert.equal(fixParseDotEnvLine(""), null);
});

test("fixParseDotEnvLine: parseia linha simples normalmente", () => {
  assert.deepEqual(fixParseDotEnvLine("PORT=3000"), ["PORT", "3000"]);
});

// --- fixExitCodeFromError -------------------------------------------------------

test("fixExitCodeFromError: retorna 1 quando há erro, 0 quando não há", () => {
  assert.equal(fixExitCodeFromError(new Error("boom")), 1);
  assert.equal(fixExitCodeFromError(null), 0);
  assert.equal(fixExitCodeFromError(undefined), 0);
});

// --- refactorBuildEnvSummary -------------------------------------------------------

test("refactorBuildEnvSummary: monta resumo apenas com chaves definidas", () => {
  assert.equal(
    refactorBuildEnvSummary(
      { PORT: "3000", HOST: "localhost" },
      ["PORT", "HOST", "MISSING"],
    ),
    "PORT=3000; HOST=localhost",
  );
});

test("refactorBuildEnvSummary: retorna string vazia quando nada existe", () => {
  assert.equal(refactorBuildEnvSummary({}, ["A", "B"]), "");
});

// --- bootstrapApp -------------------------------------------------------

test("bootstrapApp: junta defaults, .env e process.env com a precedência correta", () => {
  const registered: Array<{ event: string; listener: SignalListener }> = [];
  const fakeSignalTarget = {
    on(event: "SIGINT" | "SIGTERM", listener: SignalListener) {
      registered.push({ event, listener });
      return undefined;
    },
  };
  const calls: string[] = [];

  const result = bootstrapApp({
    dotEnvContent: "PORT=4000\nHOST=fromdotenv",
    processEnv: { PORT: "9000" },
    required: ["PORT", "HOST", "API_KEY"],
    defaults: { HOST: "localhost", API_KEY: "" },
    signalTarget: fakeSignalTarget,
    cleanup: () => calls.push("cleanup"),
    exit: (code: number) => calls.push(`exit:${code}`),
  });

  assert.equal(result.config.PORT, "9000");
  assert.equal(result.config.HOST, "fromdotenv");
  assert.deepEqual(result.missing, ["API_KEY"]);
  assert.equal(result.ready, false);
});

test("bootstrapApp: registra handlers de SIGINT e SIGTERM que rodam cleanup e exit", () => {
  const registered: Array<{ event: string; listener: SignalListener }> = [];
  const fakeSignalTarget = {
    on(event: "SIGINT" | "SIGTERM", listener: SignalListener) {
      registered.push({ event, listener });
      return undefined;
    },
  };
  const calls: string[] = [];

  bootstrapApp({
    dotEnvContent: "",
    processEnv: { PORT: "3000" },
    required: ["PORT"],
    defaults: {},
    signalTarget: fakeSignalTarget,
    cleanup: () => calls.push("cleanup"),
    exit: (code: number) => calls.push(`exit:${code}`),
  });

  const events = registered.map((r) => r.event).sort();
  assert.deepEqual(events, ["SIGINT", "SIGTERM"]);

  for (const { listener } of registered) {
    listener();
  }
  assert.deepEqual(calls, ["cleanup", "exit:0", "cleanup", "exit:0"]);
});

test("bootstrapApp: ready true quando todas as required existem", () => {
  const fakeSignalTarget = {
    on(_event: "SIGINT" | "SIGTERM", _listener: SignalListener) {
      return undefined;
    },
  };

  const result = bootstrapApp({
    dotEnvContent: "API_KEY=abc",
    processEnv: {},
    required: ["API_KEY"],
    defaults: {},
    signalTarget: fakeSignalTarget,
    cleanup: () => {},
    exit: () => {},
  });

  assert.equal(result.ready, true);
  assert.deepEqual(result.missing, []);
});
