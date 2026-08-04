import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile, mkdir, readFile, stat } from "node:fs/promises";
import { join, resolve } from "node:path";
import { tmpdir } from "node:os";

import {
  joinSegments,
  resolveAbsolutePath,
  getFileExtension,
  getFileNameWithoutExtension,
  getDirectoryName,
  parsePathInfo,
  writeTextFile,
  readTextFile,
  listDirectoryEntries,
  ensureDirectoryExists,
  pathExists,
  resolveSafePath,
  fixListFilesFullPaths,
  fixSafeFileExists,
  refactorReadJsonFile,
  mergeTextFiles,
} from "./exercises.ts";

// Helper: cria um diretório temporário real para um teste e devolve o
// caminho. O chamador é responsável por limpar (try/finally) no próprio
// teste, mantendo a criação/limpeza visível e localizada.
async function makeTempDir(): Promise<string> {
  return mkdtemp(join(tmpdir(), "node-unit-03-"));
}

// --- joinSegments -------------------------------------------------------

test("joinSegments: junta segmentos de path", () => {
  assert.equal(joinSegments("a", "b", "c.txt"), join("a", "b", "c.txt"));
  assert.equal(joinSegments("a", "..", "b"), join("a", "..", "b"));
  assert.equal(joinSegments("only"), join("only"));
});

// --- resolveAbsolutePath -------------------------------------------------------

test("resolveAbsolutePath: resolve caminho absoluto a partir de uma base", () => {
  assert.equal(
    resolveAbsolutePath("base", "a", "b.txt"),
    resolve("base", "a", "b.txt"),
  );
});

// --- getFileExtension -------------------------------------------------------

test("getFileExtension: extrai a extensão do caminho", () => {
  assert.equal(getFileExtension("foo/bar.txt"), ".txt");
  assert.equal(getFileExtension("foo/bar"), "");
  assert.equal(getFileExtension("foo/bar.tar.gz"), ".gz");
  assert.equal(getFileExtension(".gitignore"), "");
});

// --- getFileNameWithoutExtension -------------------------------------------------------

test("getFileNameWithoutExtension: nome do arquivo sem extensão", () => {
  assert.equal(getFileNameWithoutExtension("foo/bar.txt"), "bar");
  assert.equal(getFileNameWithoutExtension("foo/bar"), "bar");
  assert.equal(getFileNameWithoutExtension("foo/bar.tar.gz"), "bar.tar");
});

// --- getDirectoryName -------------------------------------------------------

test("getDirectoryName: diretório pai do caminho", () => {
  assert.equal(getDirectoryName(join("a", "b", "c.txt")), join("a", "b"));
});

// --- parsePathInfo -------------------------------------------------------

test("parsePathInfo: decompõe o caminho em partes", () => {
  const filePath = join("a", "b", "c.txt");
  assert.deepEqual(parsePathInfo(filePath), {
    dir: join("a", "b"),
    base: "c.txt",
    name: "c",
    ext: ".txt",
  });
});

// --- writeTextFile / readTextFile -------------------------------------------------------

test("writeTextFile: escreve conteúdo em um arquivo dentro do diretório", async () => {
  const dir = await makeTempDir();
  try {
    await writeTextFile(dir, "hello.txt", "Olá mundo");
    const content = await readFile(join(dir, "hello.txt"), "utf8");
    assert.equal(content, "Olá mundo");
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("readTextFile: lê conteúdo de um arquivo existente", async () => {
  const dir = await makeTempDir();
  try {
    await writeFile(join(dir, "data.txt"), "conteúdo de teste", "utf8");
    const content = await readTextFile(dir, "data.txt");
    assert.equal(content, "conteúdo de teste");
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

// --- listDirectoryEntries -------------------------------------------------------

test("listDirectoryEntries: lista nomes de entradas ordenados", async () => {
  const dir = await makeTempDir();
  try {
    await writeFile(join(dir, "b.txt"), "b", "utf8");
    await writeFile(join(dir, "a.txt"), "a", "utf8");
    await mkdir(join(dir, "sub"));
    assert.deepEqual(await listDirectoryEntries(dir), ["a.txt", "b.txt", "sub"]);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

// --- ensureDirectoryExists -------------------------------------------------------

test("ensureDirectoryExists: cria diretório aninhado e é idempotente", async () => {
  const dir = await makeTempDir();
  try {
    const nested = join(dir, "sub", "deep");
    await ensureDirectoryExists(nested);
    const info = await stat(nested);
    assert.equal(info.isDirectory(), true);

    // chamar de novo não deve lançar erro
    await ensureDirectoryExists(nested);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

// --- pathExists -------------------------------------------------------

test("pathExists: true para caminho existente, false para inexistente", async () => {
  const dir = await makeTempDir();
  try {
    await writeFile(join(dir, "exists.txt"), "x", "utf8");
    assert.equal(await pathExists(join(dir, "exists.txt")), true);
    assert.equal(await pathExists(join(dir, "missing.txt")), false);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

// --- resolveSafePath -------------------------------------------------------

test("resolveSafePath: resolve caminho seguro dentro da base", () => {
  const base = join(tmpdir(), "base-fake");
  assert.equal(
    resolveSafePath(base, join("sub", "file.txt")),
    join(base, "sub", "file.txt"),
  );
});

test("resolveSafePath: lança erro quando o caminho escapa da base", () => {
  const base = join(tmpdir(), "base-fake");
  assert.throws(() => resolveSafePath(base, join("..", "..", "etc", "passwd")));
  assert.throws(() => resolveSafePath(base, join("..", "secret.txt")));
});

// --- fixListFilesFullPaths -------------------------------------------------------

test("fixListFilesFullPaths: retorna caminhos completos e corretos por plataforma", async () => {
  const dir = await makeTempDir();
  try {
    await writeFile(join(dir, "b.txt"), "b", "utf8");
    await writeFile(join(dir, "a.txt"), "a", "utf8");
    assert.deepEqual(await fixListFilesFullPaths(dir), [
      join(dir, "a.txt"),
      join(dir, "b.txt"),
    ]);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

// --- fixSafeFileExists -------------------------------------------------------

test("fixSafeFileExists: retorna true/false corretamente (não invertido)", async () => {
  const dir = await makeTempDir();
  try {
    await writeFile(join(dir, "here.txt"), "x", "utf8");
    assert.equal(await fixSafeFileExists(join(dir, "here.txt")), true);
    assert.equal(await fixSafeFileExists(join(dir, "not-here.txt")), false);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

// --- refactorReadJsonFile -------------------------------------------------------

test("refactorReadJsonFile: lê e parseia um arquivo JSON", async () => {
  const dir = await makeTempDir();
  try {
    await writeFile(
      join(dir, "data.json"),
      JSON.stringify({ ok: true, count: 3 }),
      "utf8",
    );
    const result = await refactorReadJsonFile(dir, "data.json");
    assert.deepEqual(result, { ok: true, count: 3 });
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

// --- mergeTextFiles -------------------------------------------------------

test("mergeTextFiles: junta arquivos de origem em um único arquivo de destino", async () => {
  const dir = await makeTempDir();
  try {
    await mkdir(join(dir, "source"));
    await writeFile(join(dir, "source", "a.txt"), "Hello", "utf8");
    await writeFile(join(dir, "source", "b.txt"), "World", "utf8");

    const result = await mergeTextFiles(
      dir,
      "source",
      ["a.txt", "b.txt"],
      join("dest", "merged.txt"),
    );

    assert.deepEqual(result.mergedFiles, ["a.txt", "b.txt"]);
    assert.equal(result.totalBytes, Buffer.byteLength("Hello\nWorld"));

    const merged = await readFile(join(dir, "dest", "merged.txt"), "utf8");
    assert.equal(merged, "Hello\nWorld");
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("mergeTextFiles: lança RangeError quando a lista de arquivos é vazia", async () => {
  const dir = await makeTempDir();
  try {
    await mkdir(join(dir, "source"));
    await assert.rejects(
      () => mergeTextFiles(dir, "source", [], join("dest", "merged.txt")),
      RangeError,
    );
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("mergeTextFiles: lança erro quando o destino tenta escapar da base", async () => {
  const dir = await makeTempDir();
  try {
    await mkdir(join(dir, "source"));
    await writeFile(join(dir, "source", "a.txt"), "Hello", "utf8");
    await assert.rejects(() =>
      mergeTextFiles(dir, "source", ["a.txt"], join("..", "escape.txt")),
    );
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
