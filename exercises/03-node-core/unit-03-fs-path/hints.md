# Dicas — Unidade 3 (node:fs, node:path)

Use `DICA_1`, `DICA_2` ou `DICA_3` dizendo qual exercício travou. Abaixo
está o roteiro geral que a mentoria segue nesta unidade.

## Nível 1 — direção, sem código

- Para `getFileNameWithoutExtension`: você já tem `getFileExtension`
  (ou `path.extname`) e `path.basename`. Como combinar os dois?
- Para `listDirectoryEntries`: `fs/promises.readdir` retorna uma lista —
  em que ordem? O que falta fazer para garantir ordem alfabética?
- Para `ensureDirectoryExists`: `fs/promises.mkdir` tem uma opção que
  faz ela não reclamar se o diretório já existir e também criar
  diretórios intermediários. Qual?
- Para `pathExists`: qual é o único jeito de saber com certeza se um
  arquivo existe, sem introduzir uma janela de tempo entre "checar" e
  "usar"? (dica: tente a operação e trate o erro, em vez de checar antes)
- Para `resolveSafePath`: depois de resolver o caminho final com
  `path.resolve`, como você compara se ele "começa com" o `baseDir`
  resolvido? Cuidado com o caso `/base-evil` começar com a string
  `/base` sem ser de fato um subdiretório — comparar strings cruas não
  basta.
- Para `fixListFilesFullPaths`: rode mentalmente com `dir = "/tmp/x"` e
  `entry = "a.txt"`. O que a concatenação atual produz? O que deveria
  produzir?
- Para `fixSafeFileExists`: o que `stat` faz quando o caminho existe? E
  quando não existe? Compare com o que cada `return` está devolvendo.
- Para `mergeTextFiles`: você precisa validar dois caminhos (origem e
  destino), ler N arquivos em ordem, juntar o conteúdo e escrever em um
  só lugar, criando os diretórios do destino se não existirem.

## Nível 2 — pista mais direta

- `listDirectoryEntries`: `(await readdir(dir)).sort()`.
- `ensureDirectoryExists`: `await mkdir(dir, { recursive: true })` já
  não lança erro se o diretório existir.
- `pathExists`: use `try { await stat(targetPath); return true; } catch (err) { if (err.code === "ENOENT") return false; throw err; }`.
- `resolveSafePath`: resolva os dois caminhos com `path.resolve`,
  garanta que o `baseDir` resolvido termine com o separador do SO antes
  de comparar com `startsWith`, para não confundir `/base` com
  `/base-evil`.
- `fixListFilesFullPaths`: troque `dir + entry` por
  `path.join(dir, entry)`.
- `fixSafeFileExists`: os dois `return` do `try`/`catch` estão
  trocados — inverta-os.
- `refactorReadJsonFile`: `JSON.parse(await readFile(path.join(dir, filename), "utf8"))`
  substitui os passos manuais de `Buffer` → `toString` → `trim`.
- `mergeTextFiles`: se `fileNames.length === 0`, lance `RangeError`
  antes de tocar no sistema de arquivos.

## Nível 3 — quase o código, mas ainda não a solução

- `resolveSafePath`:
  ```ts
  const resolvedBase = resolve(baseDir) + sep;
  const resolvedTarget = resolve(baseDir, userPath);
  if (!(resolvedTarget + sep).startsWith(resolvedBase) && resolvedTarget !== resolve(baseDir)) {
    throw new Error(`caminho fora do diretório base: ${userPath}`);
  }
  return resolvedTarget;
  ```
  (ajuste os detalhes de borda — ex: quando `userPath` resolve para o
  próprio `baseDir` — para bater com os testes.)
- `mergeTextFiles`:
  ```ts
  if (fileNames.length === 0) throw new RangeError("fileNames vazio");
  const sourceDir = resolveSafePath(baseDir, sourceRelDir);
  const destPath = resolveSafePath(baseDir, destRelPath);
  const contents = await Promise.all(
    fileNames.map((name) => readFile(join(sourceDir, name), "utf8")),
  );
  const merged = contents.join("\n");
  await mkdir(dirname(destPath), { recursive: true });
  await writeFile(destPath, merged, "utf8");
  return { mergedFiles: fileNames, totalBytes: Buffer.byteLength(merged) };
  ```

Peça `MOSTRAR_SOLUCAO` apenas depois de registrar sua tentativa.
