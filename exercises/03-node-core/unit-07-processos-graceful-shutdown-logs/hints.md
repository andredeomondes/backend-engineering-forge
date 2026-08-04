# Dicas — Unidade 7 (Node.js: processos, workers, shutdown, logs)

Use `DICA_1`, `DICA_2` ou `DICA_3` dizendo qual exercício travou. Abaixo
está o roteiro geral que a mentoria segue nesta unidade.

## Nível 1 — direção, sem código

- Para `runNodeScript`: quantos eventos `"data"` um `child.stdout` pode
  emitir para uma única execução? O que isso implica para onde você
  acumula o resultado?
- Para `runWorkerEcho`: como um `Worker` criado com `eval: true` recebe o
  código que ele deve rodar, e como ele conversa de volta com quem criou?
- Para `createInFlightTracker`/`waitForInFlightToSettle`: se `onIdle` é
  chamado quando a contagem já está em zero, o callback deve esperar um
  próximo decremento que nunca vai vir, ou disparar na hora?
- Para `fixRunNodeScriptIncomplete`: qual evento do child process garante
  que não vai chegar mais nenhum dado depois dele?
- Para `fixGracefulShutdown`: o que precisa estar zerado antes da função
  poder resolver, além do sinal ter chegado?
- Para `runGracefulWorkerJob`: quantas condições diferentes precisam ser
  verdadeiras ao mesmo tempo antes de resolver?

## Nível 2 — pista mais direta

- `runNodeScript`: acumule `stdout += chunk.toString()` a cada evento
  `"data"`, mas só chame `resolve({ stdout, exitCode })` dentro do
  callback de `"exit"` (nunca dentro de `"data"`).
- `runWorkerEcho`: `new Worker(createEchoWorkerSource(), { eval: true })`;
  `worker.postMessage(payload)`; escute `"message"` uma única vez
  (`worker.once("message", ...)`), depois `await worker.terminate()`.
- `createEchoWorkerSource`: o código do worker precisa importar
  `parentPort` de `"node:worker_threads"` e chamar
  `parentPort.on("message", (msg) => parentPort.postMessage(msg))`.
- `createInFlightTracker`: guarde `count` numa variável fechada (closure);
  em `onIdle`, se `count === 0` já na hora da chamada, dispare o callback
  de forma assíncrona (ex.: `queueMicrotask`) em vez de nunca disparar.
- `waitForInFlightToSettle`: use `scheduler.setTimeout` recursivamente —
  a cada disparo, cheque `count()`; se zero, `resolve()`; senão, agende
  de novo.
- `fixGracefulShutdown`: em vez de resolver dentro do listener do sinal,
  guarde que o sinal chegou e chame `tracker.onIdle(resolve)` — se o
  tracker já está ocioso, `onIdle` resolve na hora; se não, espera.

## Nível 3 — quase o código, mas ainda não a solução

- `fixRunNodeScriptIncomplete` (versão corrigida):
  ```ts
  return new Promise((resolve) => {
    const child = spawn(process.execPath, buildNodeEvalArgs(script));
    let stdout = "";
    child.stdout.on("data", (chunk: Buffer) => {
      stdout += chunk.toString();
    });
    child.on("exit", (code) => {
      resolve({ stdout, exitCode: code ?? 0 });
    });
  });
  ```
- `runGracefulWorkerJob`:
  ```ts
  return new Promise((resolve) => {
    tracker.increment();
    let workerResult: string | null = null;
    const logs: string[] = [logFormatted("info", "job started")];
    runWorkerEcho(payload).then((result) => {
      workerResult = result;
      logs.push(logFormatted("info", "job finished"));
      tracker.decrement();
    });
    tracker.onIdle(() => {
      resolve({ result: workerResult as string, logs });
    });
  });
  ```
  (ajuste para garantir que `workerResult` já está preenchido quando o
  tracker fica ocioso — a ordem `decrement()` depois de setar o resultado
  é o que garante isso.)
- `waitForInFlightToSettle`:
  ```ts
  export function waitForInFlightToSettle(count, pollDelayMs, scheduler) {
    return new Promise((resolve) => {
      const poll = () => {
        if (count() === 0) {
          resolve();
          return;
        }
        scheduler.setTimeout(poll, pollDelayMs);
      };
      poll();
    });
  }
  ```

Peça `MOSTRAR_SOLUCAO` apenas depois de registrar sua tentativa.
