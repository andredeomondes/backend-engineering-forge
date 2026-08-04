# Dicas — Unidade 1 (Node.js: runtime e event loop)

Use `DICA_1`, `DICA_2` ou `DICA_3` dizendo qual exercício travou. Abaixo
está o roteiro geral que a mentoria segue nesta unidade.

## Nível 1 — direção, sem código

- Para `recordSyncMicroMacroOrder`: existem três "filas" diferentes aqui —
  código síncrono, a fila de microtasks e a fila de macrotasks. Em que
  ordem elas são drenadas?
- Para `recordSetImmediateInsideIOCallback`: por que `setImmediate` roda
  antes de um `setTimeout(...,0)` especificamente quando os dois são
  agendados de dentro de um callback de I/O (e não no topo do script)?
- Para `readFileNonBlocking`/`fixBlockingFileRead`: qual módulo do Node
  tem as mesmas funções de `fs`, mas retornando Promises em vez de exigir
  callback ou rodar de forma síncrona?
- Para `recordNextTickBeforePromiseMicrotask`: `process.nextTick` não é a
  mesma fila que `.then()` de Promise — qual delas o Node sempre esvazia
  primeiro?
- Para `recordThreadPoolCallbackAfterMicrotasks`: qual parte do Node
  (V8 ou libuv) processa microtasks, e qual processa o resultado de uma
  operação da thread pool?
- Para `fixMicrotaskOrderingBug`: o bug agenda algo como macrotask quando
  deveria ser microtask — qual API transforma um valor num microtask
  imediatamente resolvido?

## Nível 2 — pista mais direta

- `recordSyncMicroMacroOrder`: `order.push("sync")` direto,
  `Promise.resolve().then(() => order.push("microtask"))`,
  `setTimeout(() => order.push("macrotask"), 0)`; resolva a Promise externa
  dentro do `setTimeout` (ele sempre roda por último).
- `readFileNonBlocking`/`fixBlockingFileRead`: use
  `readFile` de `"node:fs/promises"` com `"utf8"` — retorna uma Promise
  diretamente, sem precisar envolver em `new Promise(...)`.
- `recordNextTickBeforePromiseMicrotask`:
  `process.nextTick(() => order.push("nextTick"))` seguido de
  `Promise.resolve().then(() => { order.push("promise"); resolve(order); })`.
- `recordTimerChainOrder`: o timer interno só deve ser agendado **dentro**
  do callback do primeiro `setTimeout`, nunca antes.
- `fixMicrotaskOrderingBug`: troque o segundo `setTimeout` (o de "middle")
  por `Promise.resolve().then(() => { order.push("middle"); ... })`,
  mantendo o controle de quantas tarefas faltam terminar.
- `refactorScheduledLabelsOrder`: um `setTimeout` que agenda o próximo
  dentro do seu próprio callback, sem variáveis de flag, já preserva a
  ordem — três `setTimeout` aninhados sem checagens booleanas extras.

## Nível 3 — quase o código, mas ainda não a solução

- `recordSetImmediateInsideIOCallback`:
  ```ts
  return new Promise((resolve) => {
    const order: string[] = [];
    fs.readFile(someExistingFile, () => {
      order.push("io");
      setTimeout(() => order.push("timeout"), 0);
      setImmediate(() => {
        order.push("immediate");
        // dentro de um callback de I/O, immediate sempre vem antes do timeout
        setImmediate(() => resolve(order)); // ou controle de contagem
      });
    });
  });
  ```
  (adapte para não depender de resolver antes do timeout rodar também —
  use um contador `remaining` como no exemplo de debugging.)
- `chainSequentialAsyncTasks`: um `for...of` com `await` dentro do laço
  (não `Promise.all`/`map`) garante que cada label só processa depois que
  a anterior resolveu.
- `simulateEventLoopPipeline`: registre o valor síncrono primeiro; depois
  duas chamadas encadeadas de `Promise.resolve().then(...)` (uma dentro da
  outra, para gerar `microtask-1` e `microtask-2` antes de qualquer
  timer); depois dois `setTimeout(...,0)` na ordem de registro; depois
  dois `setImmediate` na ordem de registro; resolva no último callback a
  rodar (use um contador de tarefas pendentes, não encadeamento por tempo).

Peça `MOSTRAR_SOLUCAO` apenas depois de registrar sua tentativa.
