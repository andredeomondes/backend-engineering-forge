// Unidade 4 — Buffer, node:stream, pipeline e backpressure
//
// Implemente cada função. Não use bibliotecas externas. Não use `any`.
// Todos os streams usados nesta unidade são construídos em memória: nenhum
// exercício lê arquivo ou rede. Veja README.md para o enunciado completo.

import { Buffer } from "node:buffer";
import { Readable, Writable, Transform } from "node:stream";
import type { TransformCallback } from "node:stream";
import { pipeline, finished } from "node:stream/promises";

// --- Tipos usados nesta unidade ---------------------------------------------

export type ParsedMessage = {
  length: number;
  message: string;
};

// --- Fundamentais (Buffer) ---------------------------------------------------

// test: node --test --test-name-pattern="createBufferFromString" exercises/03-node-core/unit-04-buffers-streams-backpressure/exercises.test.ts
export function createBufferFromString(str: string): Buffer {
  throw new Error("not implemented: createBufferFromString");
}

// test: node --test --test-name-pattern="bufferToString" exercises/03-node-core/unit-04-buffers-streams-backpressure/exercises.test.ts
export function bufferToString(buf: Buffer): string {
  throw new Error("not implemented: bufferToString");
}

// test: node --test --test-name-pattern="concatenateBuffers" exercises/03-node-core/unit-04-buffers-streams-backpressure/exercises.test.ts
export function concatenateBuffers(buffers: Buffer[]): Buffer {
  throw new Error("not implemented: concatenateBuffers");
}

// test: node --test --test-name-pattern="sliceBuffer" exercises/03-node-core/unit-04-buffers-streams-backpressure/exercises.test.ts
export function sliceBuffer(buf: Buffer, start: number, end: number): Buffer {
  throw new Error("not implemented: sliceBuffer");
}

// test: node --test --test-name-pattern="buffersAreEqual" exercises/03-node-core/unit-04-buffers-streams-backpressure/exercises.test.ts
export function buffersAreEqual(a: Buffer, b: Buffer): boolean {
  throw new Error("not implemented: buffersAreEqual");
}

// test: node --test --test-name-pattern="encodeHex" exercises/03-node-core/unit-04-buffers-streams-backpressure/exercises.test.ts
export function encodeHex(buf: Buffer): string {
  throw new Error("not implemented: encodeHex");
}

// test: node --test --test-name-pattern="decodeHex" exercises/03-node-core/unit-04-buffers-streams-backpressure/exercises.test.ts
export function decodeHex(hex: string): Buffer {
  throw new Error("not implemented: decodeHex");
}

// test: node --test --test-name-pattern="utf8ByteLength" exercises/03-node-core/unit-04-buffers-streams-backpressure/exercises.test.ts
export function utf8ByteLength(str: string): number {
  throw new Error("not implemented: utf8ByteLength");
}

// --- Intermediários (stream, Transform, pipeline, backpressure) ------------

// test: node --test --test-name-pattern="parseChunkedMessage" exercises/03-node-core/unit-04-buffers-streams-backpressure/exercises.test.ts
//
// `chunks` representa pedaços de um pequeno formato binário que chegaram
// separados (como aconteceria lendo de um socket). O formato é:
//   [4 bytes big-endian: tamanho da mensagem em bytes][N bytes: mensagem utf8]
// Concatene os pedaços com `Buffer.concat`, leia o prefixo de tamanho com
// `readUInt32BE`, e use slicing para extrair a mensagem. Lança `RangeError`
// se o total de bytes concatenados for menor que `4 + length`.
export function parseChunkedMessage(chunks: Buffer[]): ParsedMessage {
  throw new Error("not implemented: parseChunkedMessage");
}

// test: node --test --test-name-pattern="createUppercaseTransform" exercises/03-node-core/unit-04-buffers-streams-backpressure/exercises.test.ts
//
// Retorna um `Transform` que recebe chunks (Buffer) e emite o mesmo texto
// em maiúsculas, também como Buffer. Não use `objectMode`.
export function createUppercaseTransform(): Transform {
  throw new Error("not implemented: createUppercaseTransform");
}

// test: node --test --test-name-pattern="collectViaPipeline" exercises/03-node-core/unit-04-buffers-streams-backpressure/exercises.test.ts
//
// Usa `pipeline` de `node:stream/promises` para ligar `readable` ->
// `transform` -> um `Writable` de destino (sink) criado por você que
// coleta os chunks recebidos em um array. Depois que `pipeline` resolver
// (ou seja, depois que TODO o fluxo terminou), concatene os chunks
// coletados com `Buffer.concat` e retorne como string utf8.
export async function collectViaPipeline(
  readable: Readable,
  transform: Transform,
): Promise<string> {
  throw new Error("not implemented: collectViaPipeline");
}

// test: node --test --test-name-pattern="writeAllRespectingBackpressure" exercises/03-node-core/unit-04-buffers-streams-backpressure/exercises.test.ts
//
// Escreve cada chunk de `chunks` em `writable`. Se `writable.write(chunk)`
// retornar `false`, você DEVE esperar o evento `"drain"` antes de escrever
// o próximo chunk (não ignore o retorno). Depois de escrever tudo, chame
// `writable.end()` e espere o stream terminar de verdade (use `finished`
// de `node:stream/promises`) antes de resolver a Promise.
export async function writeAllRespectingBackpressure(
  writable: Writable,
  chunks: Buffer[],
): Promise<void> {
  throw new Error("not implemented: writeAllRespectingBackpressure");
}

// --- Debugging ----------------------------------------------------------
//
// As duas funções abaixo JÁ ESTÃO IMPLEMENTADAS, mas contêm um bug real.
// Sua tarefa não é reescrever do zero: é diagnosticar e corrigir.

// test: node --test --test-name-pattern="readSinkBeforePipelineFinishes" exercises/03-node-core/unit-04-buffers-streams-backpressure/exercises.test.ts
export async function readSinkBeforePipelineFinishes(
  lines: string[],
): Promise<string> {
  // Sintoma relatado: a função deveria devolver todas as `lines`
  // concatenadas, mas sempre devolve uma string vazia, mesmo quando
  // `lines` não está vazio.
  let index = 0;
  const source = new Readable({
    read() {
      if (index < lines.length) {
        this.push(lines[index]);
        index++;
      } else {
        this.push(null);
      }
    },
  });

  const collected: Buffer[] = [];
  const sink = new Writable({
    write(chunk: Buffer, _encoding, callback) {
      collected.push(chunk);
      callback();
    },
  });

  // BUG: dispara o pipeline mas não espera ele terminar antes de ler
  // `collected`. Como o `Readable` só entrega dados de forma assíncrona,
  // neste ponto `collected` ainda está vazio.
  void pipeline(source, sink);

  return Buffer.concat(collected).toString("utf8");
}

// test: node --test --test-name-pattern="writeAllIgnoringBackpressure" exercises/03-node-core/unit-04-buffers-streams-backpressure/exercises.test.ts
export async function writeAllIgnoringBackpressure(
  writable: Writable,
  chunks: Buffer[],
): Promise<void> {
  // Sintoma relatado: mesmo depois de "esperar" essa função terminar, nem
  // todos os chunks aparecem escritos no destino (`writable`).
  for (const chunk of chunks) {
    // BUG: ignora o retorno de `write` (que pode ser `false`, sinalizando
    // backpressure) e nunca espera o evento "drain".
    writable.write(chunk);
  }
  writable.end();
  // BUG: resolve a Promise imediatamente (microtask), sem esperar o
  // stream realmente terminar de escrever tudo (evento "finish").
  return Promise.resolve();
}

// --- Refatoração -------------------------------------------------------------
//
// Esta função já funciona corretamente. A tarefa é refatorar para reduzir
// passos manuais, mantendo o mesmo comportamento observável.

// test: node --test --test-name-pattern="joinBuffersUgly" exercises/03-node-core/unit-04-buffers-streams-backpressure/exercises.test.ts
export function joinBuffersUgly(chunks: Buffer[]): Buffer {
  let totalLen = 0;
  for (let i = 0; i < chunks.length; i++) {
    totalLen = totalLen + chunks[i].length;
  }
  const out = Buffer.alloc(totalLen);
  let offset = 0;
  for (let i = 0; i < chunks.length; i++) {
    const current = chunks[i];
    for (let j = 0; j < current.length; j++) {
      out[offset] = current[j];
      offset = offset + 1;
    }
  }
  return out;
}

// --- Desafio integrador -------------------------------------------------------

// test: node --test --test-name-pattern="processLogLines" exercises/03-node-core/unit-04-buffers-streams-backpressure/exercises.test.ts
//
// `readable` emite chunks (Buffer ou string) de um "log" em que linhas são
// separadas por "\n" — e uma linha pode ficar dividida entre dois chunks
// (isso é intencional: o exercício testa se seu splitter lida com isso).
//
// Construa, dentro desta função:
//   1. um `Transform` (objectMode na saída) que acumula os chunks recebidos
//      e emite uma string por linha completa, guardando qualquer sobra
//      parcial para o próximo chunk (e liberando a sobra final em `_flush`);
//   2. um `Transform` (objectMode) que recebe cada linha e emite a mesma
//      linha em maiúsculas;
//   3. um `Writable` (objectMode) que coleta cada linha recebida em um
//      array.
// Ligue os três com `readable` usando `pipeline` de `node:stream/promises`,
// espere terminar, e retorne o array de linhas (em maiúsculas, sem linhas
// vazias) na ordem em que apareceram.
export async function processLogLines(readable: Readable): Promise<string[]> {
  throw new Error("not implemented: processLogLines");
}
