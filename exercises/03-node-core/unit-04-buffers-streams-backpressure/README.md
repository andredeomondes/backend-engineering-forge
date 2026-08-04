# Unidade 4 — Buffer, streams, pipeline e backpressure

Fase 3, Unidade 4. Cobre: `Buffer` (criação, encode/decode, concatenação,
slicing), `node:stream` (`Readable`, `Writable`, `Transform`, `pipeline`),
e backpressure (o que significa `write()` retornar `false`, o evento
`"drain"`, e por que `pipe`/`pipeline` cuidam disso automaticamente
enquanto um loop manual de `.write()` que ignora o retorno não cuida).

Todo o material aqui roda 100% em memória — nenhum exercício lê arquivo
do disco ou abre socket de rede. Os streams são construídos sobre arrays,
strings e Buffers já disponíveis no processo.

## Antes de começar

Responda por escrito:

1. Quando `writable.write(chunk)` retorna `false`, os dados daquele
   `chunk` foram perdidos? O que esse retorno realmente sinaliza?
2. Por que `readable.pipe(writable)` não precisa que você escreva um loop
   manual de backpressure, mesmo que `writable` seja mais lento que
   `readable`?
3. Um `Buffer` e uma `string` em JavaScript representam a mesma coisa na
   memória? O que muda quando você chama `.toString("utf8")` num Buffer
   que contém bytes que não formam utf8 válido?

Não pesquise ainda. Escreva sua hipótese antes de implementar qualquer
função — você vai comparar com o resultado real ao rodar os testes.

## Como trabalhar

1. Abra `exercises.ts`. Cada função tem `throw new Error("not implemented: <nome>")`.
2. Implemente uma função por vez, com anotações de tipo explícitas.
3. Rode os testes:

   ```bash
   npm test
   ```

4. Todos os testes começam falhando, exceto o de refatoração
   (`joinBuffersUgly`), que já passa porque a função já está correta.
5. Verifique os tipos separadamente (o `node --test` não faz typecheck,
   só apaga os tipos):

   ```bash
   npx tsc --noEmit --strict exercises/03-node-core/unit-04-buffers-streams-backpressure/exercises.ts
   ```

6. Não use `any`. Se travar em um tipo de stream, pense no que
   `node:stream` já expõe (`Transform`, `TransformCallback`,
   `ReadableOptions`, `WritableOptions`) antes de recorrer a `any`.
7. Os testes de stream são `async` e usam `pipeline`/`finished` de
   `node:stream/promises` para esperar o fluxo terminar de verdade — não
   dependem de listeners de evento soltos nem de `setTimeout` para dar
   certo. Siga o mesmo princípio nas suas implementações.

## Exercícios fundamentais (8)

1. **`createBufferFromString(str: string): Buffer`** — cria um `Buffer` a
   partir de uma string, codificado como utf8.
2. **`bufferToString(buf: Buffer): string`** — decodifica um `Buffer`
   como string utf8.
3. **`concatenateBuffers(buffers: Buffer[]): Buffer`** — concatena uma
   lista de buffers em um só, na ordem dada.
4. **`sliceBuffer(buf: Buffer, start: number, end: number): Buffer`** —
   retorna a fatia de `buf` entre `start` (inclusive) e `end` (exclusive).
5. **`buffersAreEqual(a: Buffer, b: Buffer): boolean`** — compara dois
   buffers byte a byte.
6. **`encodeHex(buf: Buffer): string`** — codifica um `Buffer` como
   string hexadecimal.
7. **`decodeHex(hex: string): Buffer`** — decodifica uma string
   hexadecimal de volta para `Buffer`.
8. **`utf8ByteLength(str: string): number`** — retorna quantos bytes
   `str` ocupa quando codificada em utf8 (não é o mesmo que
   `str.length`, que conta caracteres UTF-16).

## Exercícios intermediários (4)

9. **`parseChunkedMessage(chunks: Buffer[]): ParsedMessage`** — `chunks`
   representa pedaços de um pequeno formato binário que chegaram
   separados (como aconteceria lendo de um socket): 4 bytes big-endian
   com o tamanho da mensagem, seguidos pelos bytes utf8 da mensagem.
   Concatene os pedaços com `Buffer.concat`, leia o prefixo com
   `readUInt32BE`, e use slicing para extrair a mensagem. Lança
   `RangeError` se faltarem bytes.
10. **`createUppercaseTransform(): Transform`** — retorna um `Transform`
    que recebe chunks (`Buffer`) e emite o mesmo texto em maiúsculas,
    também como `Buffer`.
11. **`collectViaPipeline(readable: Readable, transform: Transform): Promise<string>`**
    — usa `pipeline` de `node:stream/promises` para ligar `readable` ->
    `transform` -> um `Writable` de destino (criado por você) que coleta
    os chunks. Só depois que `pipeline` resolver (fluxo 100% terminado),
    concatene os chunks coletados e retorne como string.
12. **`writeAllRespectingBackpressure(writable: Writable, chunks: Buffer[]): Promise<void>`**
    — escreve cada chunk em `writable`. Se `write()` retornar `false`,
    espera o evento `"drain"` antes de escrever o próximo. No final,
    chama `writable.end()` e espera o stream terminar de verdade (use
    `finished` de `node:stream/promises`).

## Debugging (2)

13. **`readSinkBeforePipelineFinishes(lines: string[]): Promise<string>`**
    — a implementação atual dispara um `pipeline` mas não espera ele
    terminar antes de ler o resultado coletado. Leia o sintoma no
    comentário, entenda por que isso sempre retorna vazio (não é sorte
    de timing — é garantido, porque o `Readable` só entrega dados de
    forma assíncrona), e corrija.
14. **`writeAllIgnoringBackpressure(writable: Writable, chunks: Buffer[]): Promise<void>`**
    — a implementação atual ignora o retorno de `write()` e resolve a
    Promise antes do stream realmente terminar de escrever tudo. Leia o
    sintoma, entenda a ordem entre microtasks e macrotasks que causa
    isso, e corrija (contraste com o exercício 12, que já faz certo).

## Refatoração (1)

15. **`joinBuffersUgly(chunks: Buffer[]): Buffer`** — a implementação
    atual concatena buffers manualmente, byte a byte, com dois loops e
    nomes de variável genéricos. Refatore para algo mais direto (dica:
    `Buffer.concat`), **sem mudar o comportamento observável**.

## Desafio integrador (1)

16. **`processLogLines(readable: Readable): Promise<string[]>`** —
    `readable` emite chunks de um "log" onde linhas são separadas por
    `"\n"`, e uma linha pode ficar dividida entre dois chunks. Construa,
    dentro da função: um `Transform` que separa por linha (guardando
    sobra parcial entre chamadas e liberando o restante em `_flush`), um
    `Transform` que converte cada linha para maiúsculas, e um `Writable`
    que coleta as linhas em um array. Ligue tudo com `pipeline`, espere
    terminar, e retorne o array de linhas (sem linhas vazias) na ordem em
    que apareceram.

## Critérios de aceitação

- `npm test` sem falhas.
- `npx tsc --noEmit --strict` no arquivo não acusa erro.
- Nenhuma função usa `any`.
- Você consegue explicar, sem consultar o código, o que `write()`
  retornando `false` significa, o que o evento `"drain"` sinaliza, e por
  que um loop manual de `.write()` que ignora esse retorno pode terminar
  "antes da hora" mesmo que pareça ter escrito tudo.

## Dicas

Peça `DICA_1`, `DICA_2` ou `DICA_3` quando travar em um exercício
específico — ou veja `hints.md` para o roteiro geral por nível.

Não peça `MOSTRAR_SOLUCAO` antes de tentar de verdade.
