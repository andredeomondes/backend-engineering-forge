# Unidade 7 — Processos, worker threads, graceful shutdown e logs

Fase 3, Unidade 7 (capstone). Cobre: `node:child_process` em nível
introdutório (`spawn`/`execFile`), `node:worker_threads` em nível
conceitual, graceful shutdown (esperar trabalho em andamento antes de
encerrar), e logging estruturado em linha única (JSON lines).

## Antes de começar

Responda por escrito:

1. Qual a diferença entre `spawn` e `execFile`? Quando você preferiria
   coletar stdout aos poucos (stream) em vez de tudo de uma vez?
2. Por que "graceful shutdown" não é simplesmente "responder ao sinal e
   encerrar"? O que precisa acontecer entre receber o sinal e encerrar de
   verdade?
   R =
3. Um `Worker` de `worker_threads` compartilha memória com a thread
   principal? Como os dois se comunicam?
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
   npx tsc --noEmit --strict exercises/03-node-core/unit-07-processos-graceful-shutdown-logs/exercises.ts
   ```

6. **Importante:** nesta unidade nunca registramos listeners no `process`
   real nem enviamos sinais reais (`process.on("SIGINT", ...)`,
   `process.kill(...)`). Todo "sinal" é um `EventEmitter` comum injetado
   como parâmetro (um "fake signal emitter") — isso deixa os testes no
   controle total de quando um sinal acontece, sem nunca afetar o processo
   que roda `node --test`. Todo `Worker`/child process criado deve ser
   encerrado (`worker.terminate()`, aguardar `"exit"`) para o teste nunca
   travar.
7. Não use `any`.

## Exercícios fundamentais (8)

1. **`buildNodeEvalArgs(script: string): string[]`** — monta o array de
   argumentos para rodar `script` via `node -e`, ex.:
   `["-e", script]`.
2. **`runNodeScript(script: string): Promise<{ stdout: string; exitCode: number }>`**
   — usa `spawn(process.execPath, buildNodeEvalArgs(script))`, coleta todo
   o stdout (mesmo em múltiplos pedaços) e retorna junto com o `exitCode`
   real, esperando o evento `"exit"` antes de resolver.
3. **`execNodeScript(script: string): Promise<string>`** — mesma ideia,
   mas usando `execFile` (que já entrega o stdout completo via callback).
4. **`createEchoWorkerSource(): string`** — retorna uma string de código
   JavaScript que, quando rodada como `Worker`, escuta `"message"` via
   `parentPort` e devolve (`postMessage`) o mesmo valor recebido.
5. **`runWorkerEcho(payload: string): Promise<string>`** — cria um
   `Worker` com o source de `createEchoWorkerSource()` (via `eval: true`),
   envia `payload`, espera a resposta, termina o worker e retorna o valor
   recebido.
6. **`isLogLevel(value: string): value is LogLevel`** — type guard que
   confirma se `value` é um dos 4 níveis válidos (`"debug"|"info"|"warn"|"error"`).
7. **`formatLogLine(level, message, meta?): string`** — retorna uma linha
   JSON única com `timestamp` (ISO), `level`, `message` e as chaves de
   `meta` (se fornecido) misturadas no mesmo objeto.
8. **`waitForSignal(emitter: EventEmitter, signalNames: string[]): Promise<string>`**
   — resolve com o nome do primeiro sinal (de `signalNames`) emitido pelo
   `emitter` fake.

## Exercícios intermediários (4)

9. **`createLogger(minLevel: LogLevel)`** — retorna uma função de log que
   só produz saída (usando `formatLogLine`) quando o nível da chamada é
   igual ou mais severo que `minLevel`; caso contrário retorna `null`.
   Ordem de severidade: `debug < info < warn < error`.
10. **`createInFlightTracker(): InFlightTracker`** — objeto com
    `increment`/`decrement`/`count`/`onIdle`; `onIdle(callback)` dispara
    `callback` assim que `count()` chega a zero (ou imediatamente, se já
    estiver zerado no momento da chamada).
11. **`waitForInFlightToSettle(count, pollDelayMs, scheduler): Promise<void>`**
    — usa o `scheduler` injetado (`setTimeout`/`clearTimeout`) para
    verificar `count()` a cada `pollDelayMs`, resolvendo quando chegar a
    zero.
12. **`runWorkerBatch(payloads: string[]): Promise<string[]>`** — processa
    várias mensagens usando um único `Worker` (reaproveitado, não um por
    mensagem), retornando as respostas na mesma ordem de `payloads`, e
    encerrando o worker ao final.

## Debugging (2)

13. **`fixRunNodeScriptIncomplete`** — já implementada, mas resolve assim
    que o primeiro evento `"data"` do stdout chega (perdendo pedaços
    seguintes) e nunca espera o processo realmente terminar para refletir
    o `exitCode` correto. Corrija sem mudar a assinatura.
14. **`fixGracefulShutdown`** — já implementada, mas resolve assim que o
    sinal chega, mesmo com `tracker.count() > 0`. Corrija para só resolver
    depois que `tracker.onIdle(...)` disparar.

## Refatoração (1)

15. **`refactorLogPayload`** — a implementação atual funciona, mas monta o
    objeto de log com passos manuais redundantes (variável para `Date`,
    variável para o ISO string, atribuições campo a campo em vez de
    spread). Refatore para algo mais direto, mantendo a mesma saída JSON
    observável.

## Desafio integrador (1)

16. **`runGracefulWorkerJob(payload, emitter, tracker): Promise<{ result: string; logs: string[] }>`**
    — combina tudo: incrementa o `tracker` antes de rodar
    `runWorkerEcho(payload)` num worker, decrementa ao terminar, e só
    retorna depois que **tanto** o worker terminou **quanto** (se um sinal
    chegou via `emitter` antes disso) o tracker ficou ocioso — sempre
    esperando o trabalho em andamento, nunca cortando na marra. `logs`
    deve conter pelo menos uma linha formatada com `formatLogLine`
    registrando o início e o fim do trabalho.

## Critérios de aceitação

- `npm test` sem falhas.
- `npx tsc --noEmit --strict` no arquivo não acusa erro.
- Nenhuma função usa `any`.
- Nenhum teste registra listener no `process` real nem envia sinal real —
  tudo via `EventEmitter` fake injetado.
- Todo `Worker`/child process criado é encerrado — rodar os testes duas
  vezes seguidas não deixa processos pendurados nem trava o runner.
- Você consegue explicar, sem consultar o código, por que um "graceful
  shutdown" ingênuo (resolver assim que o sinal chega) pode derrubar
  trabalho em andamento.

## Dicas

Peça `DICA_1`, `DICA_2` ou `DICA_3` quando travar em um exercício
específico — ou veja `hints.md` para o roteiro geral por nível.

Não peça `MOSTRAR_SOLUCAO` antes de tentar de verdade.
