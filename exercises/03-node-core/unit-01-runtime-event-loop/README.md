# Unidade 1 — Runtime do Node, event loop, blocking vs non-blocking

Fase 3, Unidade 1. Cobre: o modelo de runtime do Node (V8 executa JS, libuv
fornece o event loop e a thread pool), fases práticas do event loop,
operações bloqueantes vs não-bloqueantes, e a ordem entre microtasks
(`Promise`) e macrotasks (`setTimeout`/`setImmediate`).

## Antes de começar

Responda por escrito:

1. Se você chama `setTimeout(fn, 0)` e logo depois `Promise.resolve().then(fn2)`,
   qual roda primeiro — `fn` ou `fn2`? Por quê?
   R =
2. O que significa uma função "bloquear o event loop"? Dê um exemplo de API
   do Node que bloqueia e uma equivalente que não bloqueia.
   R =
3. `process.nextTick` e a fila de microtasks de `Promise` são a mesma fila?
   Qual tem prioridade?
   R =

Não pesquise ainda. Escreva sua hipótese antes de implementar qualquer
função — você vai comparar com o resultado real ao rodar os testes.

## Como trabalhar

1. Abra `exercises.ts`. Cada função tem `throw new Error("not implemented: <nome>")`.
2. Implemente uma função por vez, com anotações de tipo explícitas.
3. Rode os testes:

   ```bash
   npm test
   ```

4. Todos os testes começam falhando. Isso é esperado.
5. Verifique os tipos separadamente (o `node --test` só apaga os tipos,
   não faz typecheck):

   ```bash
   npx tsc --noEmit --strict exercises/03-node-core/unit-01-runtime-event-loop/exercises.ts
   ```

6. Nenhum teste desta unidade depende de "quem chega primeiro na corrida"
   por tempo de relógio — toda ordem exigida é garantida pela especificação
   do event loop (microtask sempre antes de macrotask, filas FIFO,
   encadeamento explícito de timers). Se sua implementação depender de
   comparar milissegundos, ela está errada mesmo que passe às vezes.
7. Não use `any`. Não use APIs bloqueantes (`*Sync`) nos exercícios que
   pedem uma versão não-bloqueante.

## Exercícios fundamentais (8)

1. **`recordSyncMicroMacroOrder(): Promise<string[]>`** — registra a ordem
   `["sync", "microtask", "macrotask"]`: um push síncrono, um push dentro
   de `Promise.resolve().then(...)`, e um push dentro de `setTimeout(...,0)`.
   Resolve depois que os três já rodaram.
2. **`recordMicrotaskFifoOrder(): Promise<string[]>`** — enfileira três
   microtasks (`Promise.resolve().then(...)`) e retorna a ordem em que
   rodaram: `["first", "second", "third"]`.
3. **`recordNestedMicrotaskBeforeMacrotask(): Promise<string[]>`** — de
   dentro de uma microtask, enfileira outra microtask; registra
   `["outer", "inner", "macrotask"]` — a microtask aninhada roda antes de
   qualquer timer.
4. **`recordSetImmediateInsideIOCallback(): Promise<string[]>`** — dentro
   de um callback de I/O real (ex.: `fs.readFile`), agenda um
   `setImmediate` e um `setTimeout`; registra `["io", "immediate", "timeout"]`
   (dentro de um ciclo de I/O, `setImmediate` sempre roda antes de um timer).
5. **`readFileNonBlocking(path: string): Promise<string>`** — lê um
   arquivo em utf8 **sem** usar `readFileSync`.
6. **`recordEventEmitterListenersRunSynchronously(): string[]`** — cria um
   `EventEmitter`, registra dois listeners para um evento, faz `emit`, e
   registra um valor depois do `emit`. Retorna
   `["first", "second", "after-emit"]` (listeners rodam de forma síncrona
   durante o `emit`, antes do código depois dele).
7. **`recordNextTickBeforePromiseMicrotask(): Promise<string[]>`** —
   agenda um `process.nextTick` e um `.then()` de Promise; registra
   `["nextTick", "promise"]` (nextTick tem prioridade sobre a fila de
   microtasks de Promise).
8. **`recordSetImmediateVsPromiseMicrotask(): Promise<string[]>`** —
   agenda um `setImmediate` e uma microtask; registra
   `["microtask", "immediate"]`.

## Exercícios intermediários (4)

9. **`resolveInInputOrderRegardlessOfCompletion(): Promise<string[]>`** —
   usa `Promise.all` com uma tarefa "lenta" e uma "rápida" (delays
   diferentes); retorna `["slow", "fast"]` — a ordem do array de entrada,
   não a ordem de conclusão.
10. **`chainSequentialAsyncTasks(labels: string[]): Promise<string[]>`** —
    processa `labels` sequencialmente com `await` (cada uma só começa
    depois que a anterior termina), retornando as labels na mesma ordem.
11. **`recordThreadPoolCallbackAfterMicrotasks(): Promise<string[]>`** —
    dispara uma operação que usa a thread pool do libuv (ex.: `crypto.pbkdf2`
    ou leitura de arquivo assíncrona) e uma microtask; registra
    `["microtask", "threadpool"]`.
12. **`recordTimerChainOrder(): Promise<string[]>`** — de dentro de um
    `setTimeout`, agenda outro `setTimeout`; registra
    `["first-timer", "second-timer"]` (o timer aninhado só roda numa volta
    seguinte do event loop).

## Debugging (2)

13. **`fixMicrotaskOrderingBug(): Promise<string[]>`** — a implementação
    atual agenda "middle" como um segundo `setTimeout` em vez de uma
    microtask de verdade, então sua posição depende da ordem de registro
    dos timers em vez de rodar garantidamente antes deles. Corrija para
    `["start", "middle", "end"]`.
14. **`fixBlockingFileRead(path: string): Promise<string>`** — a
    implementação atual usa `readFileSync` por baixo dos panos, travando o
    event loop inteiro enquanto o disco responde. Reescreva usando o
    equivalente não-bloqueante, mantendo a assinatura.

## Refatoração (1)

15. **`refactorScheduledLabelsOrder(): Promise<string[]>`** — a
    implementação atual encadeia três `setTimeout` aninhados com três
    flags booleanas manuais para saber quando resolver. Refatore para
    algo mais direto, mantendo a mesma ordem final
    `["task-1", "task-2", "task-3"]`.

## Desafio integrador (1)

16. **`simulateEventLoopPipeline(): Promise<string[]>`** — combina tudo:
    um valor síncrono, duas microtasks, dois timers e dois `setImmediate`,
    retornando a ordem determinística completa:
    `["sync-1", "microtask-1", "microtask-2", "timeout-1", "timeout-2", "immediate-1", "immediate-2"]`.

## Critérios de aceitação

- `npm test` sem falhas.
- `npx tsc --noEmit --strict` no arquivo não acusa erro.
- Nenhuma função usa `any`, e nenhum exercício de "não-bloqueante" usa uma
  API `*Sync`.
- Nenhum teste depende de comparar durações em milissegundos entre
  callbacks concorrentes — só de ordens garantidas pela especificação do
  event loop.
- Você consegue explicar, sem consultar o código, por que microtasks
  sempre rodam antes de macrotasks, e o que `process.nextTick` faz de
  diferente.

## Dicas

Peça `DICA_1`, `DICA_2` ou `DICA_3` quando travar em um exercício
específico — ou veja `hints.md` para o roteiro geral por nível.

Não peça `MOSTRAR_SOLUCAO` antes de tentar de verdade.
