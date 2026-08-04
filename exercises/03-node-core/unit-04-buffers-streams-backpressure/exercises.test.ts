import { test } from "node:test";
import assert from "node:assert/strict";
import { Buffer } from "node:buffer";
import { Readable, Writable } from "node:stream";

import {
  createBufferFromString,
  bufferToString,
  concatenateBuffers,
  sliceBuffer,
  buffersAreEqual,
  encodeHex,
  decodeHex,
  utf8ByteLength,
  parseChunkedMessage,
  createUppercaseTransform,
  collectViaPipeline,
  writeAllRespectingBackpressure,
  readSinkBeforePipelineFinishes,
  writeAllIgnoringBackpressure,
  joinBuffersUgly,
  processLogLines,
} from "./exercises.ts";

// --- Helpers de teste (não fazem parte dos exercícios) ----------------------

/** Readable em memória que entrega um item do array a cada `read()`. */
function arrayReadable(items: Array<string | Buffer>): Readable {
  let index = 0;
  return new Readable({
    read() {
      if (index < items.length) {
        this.push(items[index]);
        index++;
      } else {
        this.push(null);
      }
    },
  });
}

// --- createBufferFromString --------------------------------------------------

test("createBufferFromString: cria Buffer a partir de string utf8", () => {
  const buf = createBufferFromString("olá");
  assert.ok(Buffer.isBuffer(buf));
  assert.equal(buf.toString("utf8"), "olá");
});

// --- bufferToString -----------------------------------------------------

test("bufferToString: decodifica Buffer para string utf8", () => {
  assert.equal(bufferToString(Buffer.from("olá", "utf8")), "olá");
});

// --- concatenateBuffers -----------------------------------------------------

test("concatenateBuffers: concatena múltiplos buffers em ordem", () => {
  const result = concatenateBuffers([
    Buffer.from("ab"),
    Buffer.from("cd"),
    Buffer.from("ef"),
  ]);
  assert.equal(result.toString("utf8"), "abcdef");
});

test("concatenateBuffers: array vazio produz buffer vazio", () => {
  const result = concatenateBuffers([]);
  assert.equal(result.length, 0);
});

// --- sliceBuffer -------------------------------------------------------

test("sliceBuffer: retorna a fatia entre start e end", () => {
  const buf = Buffer.from("abcdefgh");
  assert.equal(sliceBuffer(buf, 2, 5).toString("utf8"), "cde");
});

// --- buffersAreEqual -------------------------------------------------------

test("buffersAreEqual: compara conteúdo byte a byte", () => {
  assert.equal(
    buffersAreEqual(Buffer.from("abc"), Buffer.from("abc")),
    true,
  );
  assert.equal(
    buffersAreEqual(Buffer.from("abc"), Buffer.from("abd")),
    false,
  );
  assert.equal(
    buffersAreEqual(Buffer.from("ab"), Buffer.from("abc")),
    false,
  );
});

// --- encodeHex / decodeHex -------------------------------------------------

test("encodeHex: codifica Buffer como string hexadecimal", () => {
  assert.equal(encodeHex(Buffer.from([0, 255, 16])), "00ff10");
});

test("decodeHex: decodifica string hexadecimal para Buffer", () => {
  assert.deepEqual(decodeHex("00ff10"), Buffer.from([0, 255, 16]));
});

test("encodeHex e decodeHex são inversas", () => {
  const original = Buffer.from("round trip", "utf8");
  assert.deepEqual(decodeHex(encodeHex(original)), original);
});

// --- utf8ByteLength -------------------------------------------------------

test("utf8ByteLength: conta bytes utf8, não caracteres", () => {
  assert.equal(utf8ByteLength("abc"), 3);
  assert.equal(utf8ByteLength("á"), 2); // 'á' ocupa 2 bytes em utf8
});

// --- parseChunkedMessage -------------------------------------------------------

test("parseChunkedMessage: concatena chunks e parseia o formato binário", () => {
  const message = "mensagem de teste";
  const header = Buffer.alloc(4);
  header.writeUInt32BE(Buffer.byteLength(message, "utf8"), 0);
  const full = Buffer.concat([header, Buffer.from(message, "utf8")]);

  // Simula os bytes chegando divididos em pedaços arbitrários.
  const chunks = [full.subarray(0, 3), full.subarray(3, 10), full.subarray(10)];

  const parsed = parseChunkedMessage(chunks);
  assert.equal(parsed.length, Buffer.byteLength(message, "utf8"));
  assert.equal(parsed.message, message);
});

test("parseChunkedMessage: lança RangeError se faltam bytes", () => {
  const header = Buffer.alloc(4);
  header.writeUInt32BE(100, 0);
  assert.throws(
    () => parseChunkedMessage([header, Buffer.from("curto demais")]),
    RangeError,
  );
});

// --- createUppercaseTransform -------------------------------------------------------

test("createUppercaseTransform: emite os chunks em maiúsculas", async () => {
  const transform = createUppercaseTransform();
  const source = arrayReadable(["ola ", "mundo"]);
  const result = await collectViaPipeline(source, transform);
  assert.equal(result, "OLA MUNDO");
});

// --- collectViaPipeline -------------------------------------------------------

test("collectViaPipeline: coleta o resultado só depois do pipeline terminar", async () => {
  const source = arrayReadable(["a", "b", "c"]);
  const result = await collectViaPipeline(source, createUppercaseTransform());
  assert.equal(result, "ABC");
});

test("collectViaPipeline: propaga o array vazio corretamente", async () => {
  const source = arrayReadable([]);
  const result = await collectViaPipeline(source, createUppercaseTransform());
  assert.equal(result, "");
});

// --- writeAllRespectingBackpressure -------------------------------------------------------

test("writeAllRespectingBackpressure: escreve todos os chunks respeitando drain", async () => {
  const sinkChunks: Buffer[] = [];
  // highWaterMark pequeno força `write()` a retornar `false` com frequência.
  const writable = new Writable({
    highWaterMark: 4,
    write(chunk: Buffer, _encoding, callback) {
      sinkChunks.push(chunk);
      setImmediate(callback);
    },
  });

  const chunks = [
    Buffer.from("aaaa"),
    Buffer.from("bbbb"),
    Buffer.from("cccc"),
    Buffer.from("dddd"),
  ];

  await writeAllRespectingBackpressure(writable, chunks);

  assert.equal(Buffer.concat(sinkChunks).toString("utf8"), "aaaabbbbccccdddd");
});

// --- readSinkBeforePipelineFinishes (debugging) -------------------------------------------------------

test("readSinkBeforePipelineFinishes: deveria devolver todas as linhas juntas", async () => {
  const result = await readSinkBeforePipelineFinishes(["um", "dois", "tres"]);
  assert.equal(result, "umdoistres");
});

// --- writeAllIgnoringBackpressure (debugging) -------------------------------------------------------

test("writeAllIgnoringBackpressure: todos os chunks devem estar escritos quando a Promise resolver", async () => {
  const sinkChunks: Buffer[] = [];
  const writable = new Writable({
    highWaterMark: 4,
    write(chunk: Buffer, _encoding, callback) {
      // Escrita assíncrona (como um socket ou arquivo real seria).
      setImmediate(() => {
        sinkChunks.push(chunk);
        callback();
      });
    },
  });

  const chunks = [Buffer.from("aa"), Buffer.from("bb"), Buffer.from("cc")];

  await writeAllIgnoringBackpressure(writable, chunks);

  assert.equal(Buffer.concat(sinkChunks).toString("utf8"), "aabbcc");
});

// --- joinBuffersUgly (refatoração) -------------------------------------------------------

test("joinBuffersUgly: concatena buffers corretamente (comportamento a preservar)", () => {
  const result = joinBuffersUgly([
    Buffer.from("foo"),
    Buffer.from("bar"),
    Buffer.from("baz"),
  ]);
  assert.equal(result.toString("utf8"), "foobarbaz");
});

test("joinBuffersUgly: array vazio produz buffer vazio", () => {
  assert.equal(joinBuffersUgly([]).length, 0);
});

// --- processLogLines (desafio integrador) -------------------------------------------------------

test("processLogLines: separa linhas divididas entre chunks e uppercase cada uma", async () => {
  // "ola mundo" fica dividido entre o primeiro e o segundo chunk.
  const source = arrayReadable(["ola mun", "do\nteste\nfim"]);
  const result = await processLogLines(source);
  assert.deepEqual(result, ["OLA MUNDO", "TESTE", "FIM"]);
});

test("processLogLines: ignora linhas vazias e não trava sem newline final", async () => {
  const source = arrayReadable(["a\n\nb\nc"]);
  const result = await processLogLines(source);
  assert.deepEqual(result, ["A", "B", "C"]);
});
