# Unidade 3 — node:fs, node:path e segurança de caminhos

Fase 3, Unidade 3. Cobre: `node:path` (`join`, `resolve`, `extname`,
`basename`, `dirname`, `parse`), `node:fs/promises` (leitura/escrita de
arquivos, listagem e criação de diretórios, checagem segura de
existência) e segurança de caminhos (bloquear `..` que escapa de um
diretório base).

## Antes de começar

Responda por escrito:

1. Qual a diferença entre `path.join("a", "..", "b")` e
   `path.resolve("a", "..", "b")`?
2. Por que `fs.existsSync` seguido de `fs.readFile` é considerado uma má
   prática (dica: TOCTOU — "time of check to time of use")?
3. Se um usuário te manda o caminho `"../../etc/passwd"` para você ler
   "dentro" de um diretório de uploads, o que precisa acontecer antes de
   você abrir esse arquivo?

Não pesquise ainda. Escreva sua hipótese antes de implementar qualquer
função — você vai comparar com o resultado real ao rodar os testes.

## Como trabalhar

1. Abra `exercises.ts`. Cada função tem `throw new Error("not implemented: <nome>")`.
2. Implemente uma função por vez, com anotações de tipo explícitas.
3. Todas as funções que tocam o sistema de arquivos recebem o diretório
   base como **parâmetro** — nunca hardcode um caminho do seu computador.
   Os testes usam um diretório temporário real (criado com
   `fs/promises.mkdtemp`) e o apagam depois.
4. Rode os testes:

   ```bash
   npm test
   ```

5. Todos os testes começam falhando (exceto o de refatoração, que já
   passa). Isso é esperado.
6. Verifique os tipos separadamente:

   ```bash
   npx tsc --noEmit --strict exercises/03-node-core/unit-03-fs-path/exercises.ts
   ```

7. Não use `any`. Prefira `node:fs/promises` (API baseada em `Promise`)
   em vez das versões `*Sync` — só use `Sync` se o exercício pedir
   explicitamente. Não use bibliotecas externas.

## Exercícios fundamentais (8)

1. **`joinSegments(...segments: string[]): string`** — junta segmentos
   de caminho usando `path.join` (não concatene strings manualmente).
2. **`resolveAbsolutePath(base: string, ...segments: string[]): string`**
   — resolve um caminho absoluto a partir de uma base, usando
   `path.resolve`.
3. **`getFileExtension(filePath: string): string`** — retorna a extensão
   do arquivo (ex: `.txt`). Retorna `""` se não houver extensão.
4. **`getFileNameWithoutExtension(filePath: string): string`** — retorna
   o nome do arquivo sem a extensão (ex: `"bar.txt"` → `"bar"`).
5. **`getDirectoryName(filePath: string): string`** — retorna o
   diretório pai do caminho.
6. **`parsePathInfo(filePath: string): PathInfo`** (tipo `{ dir: string;
   base: string; name: string; ext: string }`, declare no topo do
   arquivo) — decompõe o caminho usando `path.parse` (sem o campo
   `root`).
7. **`writeTextFile(dir: string, filename: string, content: string): Promise<void>`**
   — escreve `content` em `<dir>/<filename>` usando `fs/promises`.
8. **`readTextFile(dir: string, filename: string): Promise<string>`** —
   lê o conteúdo de `<dir>/<filename>` como texto (`utf8`).

## Exercícios intermediários (4)

9. **`listDirectoryEntries(dir: string): Promise<string[]>`** — lista os
   nomes das entradas (arquivos e subdiretórios) de `dir`, **ordenados
   alfabeticamente**. Retorna só os nomes, não os caminhos completos.
10. **`ensureDirectoryExists(dir: string): Promise<void>`** — garante que
    `dir` (e todos os diretórios intermediários) exista. Não lança erro
    se o diretório já existir (idempotente).
11. **`pathExists(targetPath: string): Promise<boolean>`** — verifica com
    segurança se um caminho existe, **sem usar `fs.existsSync`**. Trate
    corretamente o erro de "não existe" (`ENOENT`) — outros erros devem
    continuar sendo propagados, não engolidos.
12. **`resolveSafePath(baseDir: string, userPath: string): string`** —
    resolve `userPath` dentro de `baseDir` e retorna o caminho absoluto
    resultante. **Lança um erro** se o caminho resolvido escapar de
    `baseDir` (ex: `userPath = "../../etc/passwd"`). Esta é a base de
    qualquer código que aceita um caminho vindo do usuário.

## Debugging (2)

13. **`fixListFilesFullPaths(dir: string): Promise<string[]>`** — a
    implementação atual lista os arquivos de `dir` e tenta montar os
    caminhos completos, mas tem um bug de montagem de caminho. Leia,
    entenda o sintoma, corrija sem mudar a assinatura.
14. **`fixSafeFileExists(targetPath: string): Promise<boolean>`** — a
    implementação atual verifica se um caminho existe, mas a lógica do
    retorno está invertida. Corrija.

## Refatoração (1)

15. **`refactorReadJsonFile(dir: string, filename: string): Promise<unknown>`**
    — a implementação atual lê e faz parse de um arquivo JSON
    corretamente, mas com passos manuais redundantes e nomes de variável
    ruins. Refatore para algo mais direto, **sem mudar o comportamento
    observável**.

## Desafio integrador (1)

16. **`mergeTextFiles(baseDir: string, sourceRelDir: string, fileNames: string[], destRelPath: string): Promise<MergeResult>`**
    (tipo `MergeResult = { mergedFiles: string[]; totalBytes: number }`)
    — junta o conteúdo dos arquivos em `fileNames` (nessa ordem), lidos
    de dentro de `baseDir/sourceRelDir`, separando cada um por `"\n"`, e
    escreve o resultado em `baseDir/destRelPath` (criando os diretórios
    intermediários necessários). Retorna a lista de arquivos mesclados e
    o total de bytes escritos.
    - Tanto `sourceRelDir` quanto `destRelPath` devem ser resolvidos com
      segurança dentro de `baseDir` (reaproveite `resolveSafePath`) —
      lança erro se qualquer um deles escapar da base.
    - Lança `RangeError` se `fileNames` for um array vazio.

## Critérios de aceitação

- `npm test` sem falhas.
- `npx tsc --noEmit --strict` no arquivo não acusa erro.
- Nenhuma função usa `any`.
- Nenhum teste cria ou apaga arquivos fora de um diretório temporário do
  sistema operacional.
- Você consegue explicar, sem consultar o código, por que `path.join` e
  `path.resolve` se comportam diferente com `..`, e por que checar
  existência de arquivo "na mão" antes de uma operação é arriscado.

## Dicas

Peça `DICA_1`, `DICA_2` ou `DICA_3` quando travar em um exercício
específico — ou veja `hints.md` para o roteiro geral por nível.

Não peça `MOSTRAR_SOLUCAO` antes de tentar de verdade.
