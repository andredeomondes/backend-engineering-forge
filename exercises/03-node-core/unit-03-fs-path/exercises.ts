// Unidade 3 — node:fs, node:path e segurança de caminhos
//
// Implemente cada função. Não use bibliotecas externas. Não use `any`.
// Veja README.md para o enunciado completo de cada exercício.
//
// Todas as funções que tocam o sistema de arquivos recebem o diretório
// base como parâmetro (injeção de dependência) — nunca hardcode caminhos.
// Os testes apontam esse parâmetro para um diretório temporário real.

import {
  readFile,
  writeFile,
  readdir,
  mkdir,
  stat,
} from "node:fs/promises";
import { join, resolve, extname, basename, dirname, parse, sep } from "node:path";

// --- Tipos usados nesta unidade ---------------------------------------------

export type PathInfo = {
  dir: string;
  base: string;
  name: string;
  ext: string;
};

// --- Fundamentais ------------------------------------------------------------

// test: node --test --test-name-pattern="joinSegments" exercises/03-node-core/unit-03-fs-path/exercises.test.ts
export function joinSegments(...segments: string[]): string {
  throw new Error("not implemented: joinSegments");
}

// test: node --test --test-name-pattern="resolveAbsolutePath" exercises/03-node-core/unit-03-fs-path/exercises.test.ts
export function resolveAbsolutePath(base: string, ...segments: string[]): string {
  throw new Error("not implemented: resolveAbsolutePath");
}

// test: node --test --test-name-pattern="getFileExtension" exercises/03-node-core/unit-03-fs-path/exercises.test.ts
export function getFileExtension(filePath: string): string {
  throw new Error("not implemented: getFileExtension");
}

// test: node --test --test-name-pattern="getFileNameWithoutExtension" exercises/03-node-core/unit-03-fs-path/exercises.test.ts
export function getFileNameWithoutExtension(filePath: string): string {
  throw new Error("not implemented: getFileNameWithoutExtension");
}

// test: node --test --test-name-pattern="getDirectoryName" exercises/03-node-core/unit-03-fs-path/exercises.test.ts
export function getDirectoryName(filePath: string): string {
  throw new Error("not implemented: getDirectoryName");
}

// test: node --test --test-name-pattern="parsePathInfo" exercises/03-node-core/unit-03-fs-path/exercises.test.ts
export function parsePathInfo(filePath: string): PathInfo {
  throw new Error("not implemented: parsePathInfo");
}

// test: node --test --test-name-pattern="writeTextFile" exercises/03-node-core/unit-03-fs-path/exercises.test.ts
export async function writeTextFile(
  dir: string,
  filename: string,
  content: string,
): Promise<void> {
  throw new Error("not implemented: writeTextFile");
}

// test: node --test --test-name-pattern="readTextFile" exercises/03-node-core/unit-03-fs-path/exercises.test.ts
export async function readTextFile(dir: string, filename: string): Promise<string> {
  throw new Error("not implemented: readTextFile");
}

// --- Intermediários ------------------------------------------------------------

// test: node --test --test-name-pattern="listDirectoryEntries" exercises/03-node-core/unit-03-fs-path/exercises.test.ts
export async function listDirectoryEntries(dir: string): Promise<string[]> {
  throw new Error("not implemented: listDirectoryEntries");
}

// test: node --test --test-name-pattern="ensureDirectoryExists" exercises/03-node-core/unit-03-fs-path/exercises.test.ts
export async function ensureDirectoryExists(dir: string): Promise<void> {
  throw new Error("not implemented: ensureDirectoryExists");
}

// test: node --test --test-name-pattern="pathExists" exercises/03-node-core/unit-03-fs-path/exercises.test.ts
export async function pathExists(targetPath: string): Promise<boolean> {
  throw new Error("not implemented: pathExists");
}

// test: node --test --test-name-pattern="resolveSafePath" exercises/03-node-core/unit-03-fs-path/exercises.test.ts
export function resolveSafePath(baseDir: string, userPath: string): string {
  throw new Error("not implemented: resolveSafePath");
}

// --- Debugging --------------------------------------------------------------
//
// As duas funções abaixo JÁ ESTÃO IMPLEMENTADAS, mas contêm um bug real.
// Sua tarefa não é reescrever do zero: é diagnosticar e corrigir.

// test: node --test --test-name-pattern="fixListFilesFullPaths" exercises/03-node-core/unit-03-fs-path/exercises.test.ts
export async function fixListFilesFullPaths(dir: string): Promise<string[]> {
  // Sintoma relatado: os caminhos completos retornados vêm colados, sem
  // separador nenhum entre o diretório e o nome do arquivo (ex:
  // "/tmp/pastaarquivo.txt" em vez de "/tmp/pasta/arquivo.txt"), porque o
  // código concatena as strings diretamente em vez de usar node:path.
  const entries = await readdir(dir);
  const fullPaths = entries.map((entry) => dir + entry);
  return fullPaths.sort();
}

// test: node --test --test-name-pattern="fixSafeFileExists" exercises/03-node-core/unit-03-fs-path/exercises.test.ts
export async function fixSafeFileExists(targetPath: string): Promise<boolean> {
  // Sintoma relatado: a checagem está invertida — a função diz que o
  // caminho existe quando na verdade não existe, e diz que não existe
  // quando na verdade existe.
  try {
    await stat(targetPath);
    return false;
  } catch {
    return true;
  }
}

// --- Refatoração -------------------------------------------------------------
//
// Esta função já funciona corretamente. A tarefa é refatorar para reduzir
// passos manuais e redundâncias, mantendo o mesmo comportamento observável.

// test: node --test --test-name-pattern="refactorReadJsonFile" exercises/03-node-core/unit-03-fs-path/exercises.test.ts
export async function refactorReadJsonFile(dir: string, filename: string): Promise<unknown> {
  const fullPath = join(dir, filename);
  const buffer = await readFile(fullPath);
  const rawString = buffer.toString();
  const stringData = rawString.toString();
  const trimmed = stringData.trim();
  const parsedResult = JSON.parse(trimmed);
  const finalResult = parsedResult;
  return finalResult;
}

// --- Desafio integrador -------------------------------------------------------

export type MergeResult = {
  mergedFiles: string[];
  totalBytes: number;
};

// test: node --test --test-name-pattern="mergeTextFiles" exercises/03-node-core/unit-03-fs-path/exercises.test.ts
export async function mergeTextFiles(
  baseDir: string,
  sourceRelDir: string,
  fileNames: string[],
  destRelPath: string,
): Promise<MergeResult> {
  throw new Error("not implemented: mergeTextFiles");
}
