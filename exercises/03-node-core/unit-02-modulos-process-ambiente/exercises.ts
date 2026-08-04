// Unidade 2 — Módulos (ESM/CJS), process, sinais de OS e variáveis de ambiente
//
// Implemente cada função. Não use bibliotecas externas. Não use `any`.
// Veja README.md para o enunciado completo de cada exercício.
//
// IMPORTANTE sobre testabilidade: nenhuma função aqui chama `process.exit`,
// `process.env` ou `process.on` diretamente. Tudo que seria uma dependência
// do ambiente real (variáveis de ambiente, a função de saída, o alvo que
// recebe sinais de OS) entra como parâmetro. Isso é injeção de dependência:
// em produção você passa `process.env`, `process.exit.bind(process)` e o
// próprio `process`; nos testes você passa fixtures e espiões (spies).

// --- Aliases usados nesta unidade -------------------------------------------

/** Um "env" é só um dicionário de string para string (ou undefined). */
export type EnvSource = Record<string, string | undefined>;

/** Assinatura de uma função de saída, equivalente a `process.exit`. */
export type ExitFn = (code: number) => void;

/** Um listener de sinal de OS não recebe argumentos. */
export type SignalListener = () => void;

/**
 * Um alvo que aceita registro de listeners para SIGINT/SIGTERM — em produção
 * isso é o próprio `process` (que é um EventEmitter), em teste é um objeto
 * fake que grava as chamadas.
 */
export interface SignalSource {
  on(event: "SIGINT" | "SIGTERM", listener: SignalListener): unknown;
}

// --- Fundamentais ---------------------------------------------------------

// test: node --test --test-name-pattern="parseArgvFlag" exercises/03-node-core/unit-02-modulos-process-ambiente/exercises.test.ts
export function parseArgvFlag(argv: string[], flag: string): string | null {
  throw new Error("not implemented: parseArgvFlag");
}

// test: node --test --test-name-pattern="getEnvOrDefault" exercises/03-node-core/unit-02-modulos-process-ambiente/exercises.test.ts
export function getEnvOrDefault(
  env: EnvSource,
  key: string,
  fallback: string,
): string {
  throw new Error("not implemented: getEnvOrDefault");
}

// test: node --test --test-name-pattern="isEnvTruthy" exercises/03-node-core/unit-02-modulos-process-ambiente/exercises.test.ts
export function isEnvTruthy(env: EnvSource, key: string): boolean {
  throw new Error("not implemented: isEnvTruthy");
}

// test: node --test --test-name-pattern="requireEnvVar" exercises/03-node-core/unit-02-modulos-process-ambiente/exercises.test.ts
export function requireEnvVar(env: EnvSource, key: string): string {
  throw new Error("not implemented: requireEnvVar");
}

// test: node --test --test-name-pattern="parseIntEnv" exercises/03-node-core/unit-02-modulos-process-ambiente/exercises.test.ts
export function parseIntEnv(
  env: EnvSource,
  key: string,
  fallback: number,
): number {
  throw new Error("not implemented: parseIntEnv");
}

// test: node --test --test-name-pattern="formatExitMessage" exercises/03-node-core/unit-02-modulos-process-ambiente/exercises.test.ts
export function formatExitMessage(code: number): string {
  throw new Error("not implemented: formatExitMessage");
}

// test: node --test --test-name-pattern="normalizeInteropDefault" exercises/03-node-core/unit-02-modulos-process-ambiente/exercises.test.ts
export function normalizeInteropDefault<T>(mod: T | { default: T }): T {
  throw new Error("not implemented: normalizeInteropDefault");
}

// test: node --test --test-name-pattern="buildShutdownSignalMessage" exercises/03-node-core/unit-02-modulos-process-ambiente/exercises.test.ts
export function buildShutdownSignalMessage(signal: string): string {
  throw new Error("not implemented: buildShutdownSignalMessage");
}

// --- Intermediários --------------------------------------------------------

// test: node --test --test-name-pattern="parseDotEnv" exercises/03-node-core/unit-02-modulos-process-ambiente/exercises.test.ts
export function parseDotEnv(content: string): Record<string, string> {
  throw new Error("not implemented: parseDotEnv");
}

// test: node --test --test-name-pattern="mergeEnvWithDefaults" exercises/03-node-core/unit-02-modulos-process-ambiente/exercises.test.ts
export function mergeEnvWithDefaults(
  env: EnvSource,
  defaults: Record<string, string>,
): Record<string, string> {
  throw new Error("not implemented: mergeEnvWithDefaults");
}

// test: node --test --test-name-pattern="validateRequiredEnvVars" exercises/03-node-core/unit-02-modulos-process-ambiente/exercises.test.ts
export function validateRequiredEnvVars(
  env: EnvSource,
  required: string[],
): { missing: string[]; valid: boolean } {
  throw new Error("not implemented: validateRequiredEnvVars");
}

// test: node --test --test-name-pattern="createGracefulShutdown" exercises/03-node-core/unit-02-modulos-process-ambiente/exercises.test.ts
export function createGracefulShutdown(
  cleanup: () => void,
  exit: ExitFn,
): (signal: string) => void {
  throw new Error("not implemented: createGracefulShutdown");
}

// --- Debugging --------------------------------------------------------------
//
// As duas funções abaixo JÁ ESTÃO IMPLEMENTADAS, mas contêm um bug real.
// Sua tarefa não é reescrever do zero: é diagnosticar e corrigir.

// test: node --test --test-name-pattern="fixParseDotEnvLine" exercises/03-node-core/unit-02-modulos-process-ambiente/exercises.test.ts
export function fixParseDotEnvLine(line: string): [string, string] | null {
  // Sintoma relatado: linhas como
  // `DATABASE_URL=postgres://user:pass@host/db?ssl=true` são cortadas no
  // primeiro "=" depois da chave, perdendo parte do valor (o valor vira
  // "postgres://user:pass@host/db?ssl" e o "=true" some).
  const trimmed = line.trim();
  if (trimmed === "" || trimmed.startsWith("#")) {
    return null;
  }
  const parts = trimmed.split("=");
  if (parts.length < 2) {
    return null;
  }
  const key = parts[0].trim();
  const value = parts[1].trim();
  if (key === "") {
    return null;
  }
  return [key, value];
}

// test: node --test --test-name-pattern="fixExitCodeFromError" exercises/03-node-core/unit-02-modulos-process-ambiente/exercises.test.ts
export function fixExitCodeFromError(err: unknown): number {
  // Sintoma relatado: o processo está saindo com código 0 mesmo quando
  // ocorreu um erro, e com código 1 quando NÃO ocorreu nenhum erro — os
  // códigos de saída estão invertidos.
  return err ? 0 : 1;
}

// --- Refatoração -------------------------------------------------------------
//
// Esta função já funciona corretamente. A tarefa é refatorar para reduzir
// passos manuais, mantendo o mesmo comportamento observável.

// test: node --test --test-name-pattern="refactorBuildEnvSummary" exercises/03-node-core/unit-02-modulos-process-ambiente/exercises.test.ts
export function refactorBuildEnvSummary(
  env: EnvSource,
  keys: string[],
): string {
  let result = "";
  let first = true;
  for (let i = 0; i < keys.length; i++) {
    const k = keys[i];
    const v = env[k];
    if (v !== undefined) {
      if (first === true) {
        result = result + k + "=" + v;
        first = false;
      } else {
        result = result + "; " + k + "=" + v;
      }
    }
  }
  return result;
}

// --- Desafio integrador -------------------------------------------------------

export type BootstrapOptions = {
  dotEnvContent: string;
  processEnv: EnvSource;
  required: string[];
  defaults: Record<string, string>;
  signalTarget: SignalSource;
  cleanup: () => void;
  exit: ExitFn;
};

export type BootstrapResult = {
  config: Record<string, string>;
  missing: string[];
  ready: boolean;
};

// test: node --test --test-name-pattern="bootstrapApp" exercises/03-node-core/unit-02-modulos-process-ambiente/exercises.test.ts
export function bootstrapApp(options: BootstrapOptions): BootstrapResult {
  throw new Error("not implemented: bootstrapApp");
}
