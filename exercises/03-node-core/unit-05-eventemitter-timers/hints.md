# Dicas — Unidade 5 (EventEmitter e Timers)

Use `DICA_1`, `DICA_2` ou `DICA_3` dizendo qual exercício travou. Abaixo
está o roteiro geral que a mentoria segue nesta unidade.

## Nível 1 — direção, sem código

- Para `onceValue`: qual método do `EventEmitter` já garante que o
  listener só executa uma vez, sem você precisar remover manualmente?
- Para `addTemporaryListener`: para remover um listener específico depois
  (e não todos), o que você precisa guardar uma referência de — a função
  em si, ou algo derivado dela?
- Para `guardAgainstUnhandledError`: o que o Node faz quando um
  `EventEmitter` emite `"error"` e não há nenhum listener para esse
  evento? Isso muda o que precisa acontecer *antes* de qualquer `emit("error", ...)`.
- Para `createRepeatingCounter`: `setInterval` continua rodando para
  sempre até algo dizer o contrário. O que a função `stop` retornada
  precisa fazer, e com qual valor (o que `setInterval` retorna)?
- Para `TaskQueue.runTask`: pense na ordem — o evento `"started"` precisa
  disparar antes ou depois de `work()` começar a rodar? E `"completed"`
  ou `"failed"`, antes ou depois da Promise retornada resolver/rejeitar?
- Para `debounce`: cada nova chamada deveria "esquecer" o agendamento
  anterior. Qual par de funções (`setTimeout`/`clearTimeout`) resolve
  isso, e o que precisa ser guardado entre uma chamada e outra (dica:
  uma variável fora da função retornada, mas dentro de `debounce`)?
- Para `cancelableDelay`: `node:timers/promises` `setTimeout` aceita uma
  terceira opção com `signal`. O que acontece com a Promise quando esse
  `signal` é abortado?
- Para `notifyOnFirstCompletion` (bug): rode mentalmente com duas
  tarefas completando em sequência. O `.on` usado no código dispara
  quantas vezes? O que precisaria ser diferente para disparar só uma?
- Para `scheduleOnce` (bug): cada chamada da função retornada cria um
  novo `setTimeout` sem guardar nem cancelar o anterior. O que falta
  guardar entre chamadas, e qual função cancela um timeout pendente?

## Nível 2 — pista mais direta

- `onceValue`: `emitter.once(event, (value) => resolve(value))` dentro de
  `new Promise<T>((resolve) => { ... })`.
- `addTemporaryListener`: registre com `emitter.on(event, listener)` e
  retorne `() => emitter.off(event, listener)`.
- `setListenerLimit`: `emitter.setMaxListeners(max)` e depois retorne
  `emitter.getMaxListeners()`.
- `guardAgainstUnhandledError`: `emitter.on("error", onError)` — é só
  isso; o ponto do exercício é entender *por que* isso é necessário, não
  a complexidade do código.
- `runOnNextTick`: `return setImmediate(callback)`.
- `createRepeatingCounter`: guarde `count = 0` fora do callback, use
  `setInterval(() => { count += 1; onTick(count); }, intervalMs)`,
  guarde o handle retornado e devolva `() => clearInterval(handle)`.
- `TaskQueue.runTask`: `this.emit("started", taskName)` antes do
  `try`; dentro do `try`, `const result = await work()`, emita
  `"completed"` e `return result`; no `catch`, emita `"failed"` com o
  erro e relance (`throw error`).
- `waitForCompletion`: `new Promise((resolve) => queue.once("completed", (taskName, result) => resolve({ taskName, result })))`.
- `debounce`: guarde `let handle: NodeJS.Timeout | undefined` no
  fechamento; a cada chamada, `if (handle) clearTimeout(handle)`, depois
  `handle = setTimeout(() => fn(...args), waitMs)`.
- `cancelableDelay`: crie um `AbortController`, chame
  `sleep(ms, undefined, { signal: controller.signal })` (onde `sleep` é
  o `setTimeout` de `node:timers/promises`), trate o `.then` como
  `"completed"` e capture o erro de abort (`err.name === "AbortError"`)
  no `.catch` como `"cancelled"`; `cancel` é `() => controller.abort()`.
- `notifyOnFirstCompletion`: troque `queue.on("completed", ...)` por
  `queue.once("completed", ...)`.
- `scheduleOnce`: guarde `let handle: NodeJS.Timeout | undefined` fora da
  função retornada; dentro dela, `if (handle) clearTimeout(handle)` antes
  de criar o novo `setTimeout`.

## Nível 3 — quase o código, mas ainda não a solução

- `cancelableDelay`:
  ```ts
  export function cancelableDelay(ms: number) {
    const controller = new AbortController();
    const promise = sleep(ms, undefined, { signal: controller.signal })
      .then(() => "completed" as const)
      .catch((err: unknown) => {
        if (err instanceof Error && err.name === "AbortError") {
          return "cancelled" as const;
        }
        throw err;
      });
    return { promise, cancel: () => controller.abort() };
  }
  ```
- `runTasksSequentially`:
  ```ts
  const outcomes: TaskOutcome[] = [];
  for (const task of tasks) {
    try {
      const result = await queue.runTask(task.name, task.work);
      outcomes.push({ name: task.name, status: "completed", detail: result });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      outcomes.push({ name: task.name, status: "failed", detail: message });
    }
  }
  return outcomes;
  ```
- `waitForEventArgs` (refatoração): a versão atual faz manualmente o que
  `once` já faz:
  ```ts
  export function waitForEventArgs(emitter: EventEmitter, event: string): Promise<unknown[]> {
    return new Promise((resolve) => {
      emitter.once(event, (...args: unknown[]) => resolve(args));
    });
  }
  ```

Peça `MOSTRAR_SOLUCAO` apenas depois de registrar sua tentativa.
