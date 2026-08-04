# Dicas — Unidade 4 (Buffer, streams, pipeline, backpressure)

Use `DICA_1`, `DICA_2` ou `DICA_3` dizendo qual exercício travou. Abaixo
está o roteiro geral que a mentoria segue nesta unidade.

## Nível 1 — direção, sem código

- Para os fundamentais de `Buffer`: quase tudo tem um método pronto em
  `Buffer.prototype` ou em `Buffer.*` (estático). Antes de escrever
  lógica manual, pergunte: "isso já existe como método do Buffer?"
- Para `parseChunkedMessage`: se você tem vários `Buffer` pequenos que
  juntos formam uma mensagem, qual função junta tudo em um só antes de
  começar a interpretar os bytes?
- Para `createUppercaseTransform`: um `Transform` recebe `(chunk,
  encoding, callback)`. O que você precisa fazer com `chunk` antes de
  poder chamar `.toUpperCase()` nele (que é um Buffer, não uma string)?
- Para `collectViaPipeline`: `pipeline` aceita quantos streams você
  quiser encadear, na ordem `origem -> ... -> destino`. Que tipo de
  `Writable` você precisa construir para "coletar" ao invés de escrever
  em algum lugar externo?
- Para `writeAllRespectingBackpressure`: o retorno de `write()` é um
  `boolean`. O que ele significa quando é `false`? Que evento avisa que
  já é seguro escrever de novo?
- Para `readSinkBeforePipelineFinishes`: `pipeline(...)` retorna uma
  Promise. O que precisa acontecer com essa Promise antes de você poder
  confiar no conteúdo que os streams produziram?
- Para `writeAllIgnoringBackpressure`: a função atual faz `return
  Promise.resolve()` logo depois de `writable.end()`. Isso espera o
  stream terminar de escrever, ou só devolve controle imediatamente?
- Para `processLogLines`: quantos `Transform` diferentes você precisa
  encadear para ir de "chunks brutos" até "linhas em maiúsculas"?

## Nível 2 — pista mais direta

- `createBufferFromString` / `bufferToString`: `Buffer.from(str,
  "utf8")` e `buf.toString("utf8")`.
- `concatenateBuffers`: `Buffer.concat(buffers)`.
- `sliceBuffer`: `buf.subarray(start, end)` (prefira `subarray` a
  `slice`, que está com uso desencorajado para Buffer).
- `buffersAreEqual`: `a.equals(b)` (ou `Buffer.compare(a, b) === 0`).
- `encodeHex` / `decodeHex`: `buf.toString("hex")` e `Buffer.from(hex,
  "hex")`.
- `utf8ByteLength`: `Buffer.byteLength(str, "utf8")`.
- `parseChunkedMessage`: concatene tudo primeiro; `full.readUInt32BE(0)`
  dá o tamanho; `full.subarray(4, 4 + length).toString("utf8")` dá a
  mensagem. Valide o tamanho total antes de tentar ler.
- `createUppercaseTransform`: dentro de `transform(chunk, encoding,
  callback)`, faça `callback(null, Buffer.from(chunk.toString("utf8").toUpperCase()))`.
- `collectViaPipeline`: crie um array `collected: Buffer[]`, um
  `Writable` cujo `write(chunk, enc, cb) { collected.push(chunk); cb(); }`,
  chame `await pipeline(readable, transform, sink)`, e só depois retorne
  `Buffer.concat(collected).toString("utf8")`.
- `writeAllRespectingBackpressure`: dentro do loop, `if (!writable.write(chunk)) { await new Promise(r => writable.once("drain", r)); }`.
  Depois do loop: `writable.end(); await finished(writable);`.
- `readSinkBeforePipelineFinishes`: o bug é `void pipeline(source, sink)`
  sem `await`. Adicione `await`.
- `writeAllIgnoringBackpressure`: aplique a mesma correção do exercício
  12 — respeite o retorno de `write`, espere `"drain"`, e espere
  `finished(writable)` antes de resolver.
- `processLogLines`: um `Transform` com `readableObjectMode: true` pode
  acumular texto num closure, fazer `.split("\n")`, dar `push` em cada
  parte completa e guardar a última parte (incompleta) para a próxima
  chamada; libere a sobra final em `flush(callback)`.

## Nível 3 — quase o código, mas ainda não a solução

- `parseChunkedMessage`:
  ```ts
  const full = Buffer.concat(chunks);
  if (full.length < 4) throw new RangeError("...");
  const length = full.readUInt32BE(0);
  if (full.length < 4 + length) throw new RangeError("...");
  const message = full.subarray(4, 4 + length).toString("utf8");
  return { length, message };
  ```
- `writeAllRespectingBackpressure`:
  ```ts
  for (const chunk of chunks) {
    const ok = writable.write(chunk);
    if (!ok) {
      await new Promise<void>((resolve) => writable.once("drain", resolve));
    }
  }
  writable.end();
  await finished(writable);
  ```
- `processLogLines` (splitter):
  ```ts
  let buffered = "";
  const splitter = new Transform({
    readableObjectMode: true,
    transform(chunk, _enc, callback) {
      buffered += chunk.toString("utf8");
      const parts = buffered.split("\n");
      buffered = parts.pop() ?? "";
      for (const part of parts) this.push(part);
      callback();
    },
    flush(callback) {
      if (buffered.length > 0) this.push(buffered);
      callback();
    },
  });
  ```

Peça `MOSTRAR_SOLUCAO` apenas depois de registrar sua tentativa.
