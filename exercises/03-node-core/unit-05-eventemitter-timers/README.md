# Unidade 5 — EventEmitter e Timers

Fase 3, Unidade 5. Cobre: `node:events` (`EventEmitter`, subclassá-lo com
eventos tipados, `on` vs `once`, remoção de listeners, o caso especial do
evento `"error"`, limite de listeners) e timers (`setTimeout`, `setInterval`,
`setImmediate`, cancelamento, e `node:timers/promises` para delays
"awaitable").

## Antes de começar

Responda por escrito:

1. Qual a diferença de comportamento entre `emitter.on("x", cb)` e
   `emitter.once("x", cb)` quando `"x"` é emitido três vezes?
   R =
2. Se um `EventEmitter` emite `"error"` e **nenhum** listener está
   registrado para esse evento, o que acontece? Por que esse evento é um
   caso especial em relação a todos os outros?
   R =
3. `setInterval` e `setTimeout` retornam um valor. Para que serve esse
   valor, e o que acontece se você perder essa referência antes de chamar
   `clearInterval`/`clearTimeout`?
   R =
4. Por que `node:timers/promises` existe, se já temos `setTimeout` com
   callback? O que muda ao usar `await setTimeout(ms)` em vez de
   `setTimeout(callback, ms)`?
   R =

Não pesquise ainda. Escreva sua hipótese antes de implementar qualquer
função — você vai comparar com o resultado real ao rodar os testes.

## Como trabalhar

1. Abra `exercises.ts`. Cada função (ou método) tem
   `throw new Error("not implemented: <nome>")`.
2. Implemente uma função por vez, com anotações de tipo explícitas.
3. Rode os testes:

   ```bash
   node --test exercises/03-node-core/unit-05-eventemitter-timers/exercises.test.ts
   ```

4. Todos os testes de exercícios não implementados começam falhando. Isso
   é esperado. Os dois exercícios de debugging também começam falhando
   (o bug é real). O exercício de refatoração já começa passando.
5. Verifique os tipos separadamente (o `node --test` só apaga os tipos,
   não faz typecheck):

   ```bash
   npx tsc --noEmit --strict exercises/03-node-core/unit-05-eventemitter-timers/exercises.ts
   ```

6. Não use `any`. Os testes usam apenas delays pequenos (poucos
   milissegundos) — se sua implementação depende de esperar "bastante
   tempo" para funcionar, o design está errado, não o timer.

## O que já vem pronto no arquivo

No topo de `exercises.ts` há um tipo `TaskQueueEvents` e uma classe
`TaskQueue extends EventEmitter`, com uma `declare interface TaskQueue`
que sobrescreve `on`/`once`/`off`/`emit` usando generics restritos a
`keyof TaskQueueEvents`. Isso é o padrão do TypeScript para tipar
`EventEmitter`: em vez de `on(event: string, listener: (...args: any[]) => void)`,
cada chave do mapa de eventos amarra o nome do evento à assinatura exata
do listener, então `queue.on("completed", (name, result) => ...)` já
infere `name: string` e `result: string` sem anotação manual.

Você só implementa o **método `runTask`** dessa classe (exercício 9) — a
infraestrutura de tipos já está pronta para você usar nos exercícios
seguintes.

## Exercícios fundamentais (8)

1. **`onceValue<T>(emitter: EventEmitter, event: string): Promise<T>`** —
   usa `emitter.once` para esperar um único disparo do evento e resolve a
   Promise com o primeiro argumento emitido. Disparos seguintes do mesmo
   evento não devem afetar o resultado.
2. **`countListenersFor(emitter: EventEmitter, event: string): number`**
   — retorna quantos listeners estão registrados para aquele evento
   específico.
3. **`addTemporaryListener(emitter: EventEmitter, event: string, listener: (...args: unknown[]) => void): () => void`**
   — registra `listener` no evento e retorna uma função "unsubscribe" que,
   quando chamada, remove **exatamente** esse listener (e nenhum outro).
4. **`setListenerLimit(emitter: EventEmitter, max: number): number`** —
   ajusta o número máximo de listeners permitido no emitter (o padrão do
   Node é 10; ultrapassar isso emite um aviso de possível memory leak) e
   retorna o novo limite configurado.
5. **`guardAgainstUnhandledError(emitter: EventEmitter, onError: (err: Error) => void): void`**
   — registra um handler para o evento `"error"`. Isso importa porque
   `"error"` é especial: se um `EventEmitter` emite `"error"` sem nenhum
   listener registrado, o Node **lança** o erro (derrubando o processo se
   não for capturado), diferente de qualquer outro evento.
6. **`delay(ms: number): Promise<void>`** — usa a função `setTimeout` de
   `node:timers/promises` (já importada no topo do arquivo como `sleep`)
   para retornar uma Promise que resolve depois de `ms` milissegundos.
7. **`runOnNextTick(callback: () => void): NodeJS.Immediate`** — agenda
   `callback` com `setImmediate` (executa assim que a fila de I/O atual
   termina, antes de qualquer timer) e retorna o handle criado.
8. **`createRepeatingCounter(intervalMs: number, onTick: (count: number) => void): () => void`**
   — usa `setInterval` para chamar `onTick` repetidamente com uma
   contagem crescente (1, 2, 3, ...) e retorna uma função `stop` que
   cancela o intervalo com `clearInterval`.

## Exercícios intermediários (4)

9. **`TaskQueue.runTask(taskName: string, work: () => Promise<string>): Promise<string>`**
   (método da classe `TaskQueue` já declarada no topo do arquivo) — deve:
   - emitir `"started"` com `taskName` antes de rodar `work`;
   - se `work()` resolver, emitir `"completed"` com `taskName` e o
     resultado, e resolver a Promise retornada com esse resultado;
   - se `work()` rejeitar, emitir `"failed"` com `taskName` e o erro, e
     rejeitar a Promise retornada com o mesmo erro (não engolir o erro).
10. **`waitForCompletion(queue: TaskQueue): Promise<{ taskName: string; result: string }>`**
    — usa `queue.once("completed", ...)` para esperar a próxima conclusão
    e resolve com um objeto `{ taskName, result }`.
11. **`debounce<Args extends unknown[]>(fn: (...args: Args) => void, waitMs: number): (...args: Args) => void`**
    — retorna uma função "debounced": cada chamada cancela o
    `setTimeout` pendente (se houver) e agenda um novo. `fn` só executa
    depois que `waitMs` passar **sem** novas chamadas, com os argumentos
    da última chamada.
12. **`cancelableDelay(ms: number): { promise: Promise<"completed" | "cancelled">; cancel: () => void }`**
    — usa `node:timers/promises` `setTimeout` com um `AbortController`/
    `AbortSignal` para criar um delay cancelável. Se `cancel()` for
    chamado antes de `ms` decorrer, `promise` resolve com `"cancelled"`.
    Caso contrário, resolve com `"completed"`.

## Debugging (2)

13. **`notifyOnFirstCompletion(queue: TaskQueue, listener: (result: string) => void): void`**
    — a implementação atual registra o listener mas nunca para de
    ouvir. Leia o sintoma relatado no comentário, entenda por que o
    listener é chamado mais de uma vez, e corrija usando o mecanismo do
    `EventEmitter` adequado para "ouvir só uma vez" (sem mudar a
    assinatura da função).
14. **`scheduleOnce(callback: () => void, ms: number): () => void`** — a
    implementação atual tem um bug de temporizador não cancelado: cada
    chamada da função retornada deveria reiniciar o timer, mas em vez
    disso todas as chamadas anteriores continuam agendadas. Leia o
    sintoma, entenda o que falta guardar entre chamadas, e corrija.

## Refatoração (1)

15. **`waitForEventArgs(emitter: EventEmitter, event: string): Promise<unknown[]>`**
    — a implementação atual funciona corretamente, mas usa uma flag
    manual (`hasResolved`), um loop manual para copiar os argumentos e
    `removeListener` explícito — tudo isso é o que `emitter.once` já faz
    sozinho. Refatore para usar `once` diretamente, **sem mudar o
    comportamento observável** (resolve com um array dos argumentos do
    primeiro disparo).

## Desafio integrador (1)

16. **`runTasksSequentially(queue: TaskQueue, tasks: TaskDefinition[]): Promise<TaskOutcome[]>`**
    (com `TaskDefinition = { name: string; work: () => Promise<string> }`
    e `TaskOutcome = { name: string; status: "completed" | "failed"; detail: string }`,
    ambos já declarados no arquivo) — executa cada tarefa da lista **em
    ordem** (uma de cada vez, não em paralelo) usando `queue.runTask`.
    Para cada tarefa:
    - se `runTask` resolver, adiciona `{ name, status: "completed", detail: <resultado> }`;
    - se `runTask` rejeitar, **não deixa o erro propagar** — adiciona
      `{ name, status: "failed", detail: <error.message> }` e continua
      para a próxima tarefa.

    Retorna o array de resultados na mesma ordem das tarefas de entrada.

## Critérios de aceitação

- `node --test exercises/03-node-core/unit-05-eventemitter-timers/exercises.test.ts`
  sem falhas.
- `npx tsc --noEmit --strict exercises/03-node-core/unit-05-eventemitter-timers/exercises.ts`
  não acusa erro.
- Nenhuma função usa `any`.
- Você consegue explicar, sem consultar o código, por que `"error"` é
  tratado de forma diferente de qualquer outro evento em um
  `EventEmitter`, e o que acontece com um timer cujo handle você perdeu
  antes de cancelar.

## Dicas

Peça `DICA_1`, `DICA_2` ou `DICA_3` quando travar em um exercício
específico — ou veja `hints.md` para o roteiro geral por nível.

Não peça `MOSTRAR_SOLUCAO` antes de tentar de verdade.
