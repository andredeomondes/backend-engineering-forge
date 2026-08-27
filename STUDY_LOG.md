# Study Log

Diário de sessões. Uma entrada por sessão (`INICIAR_SESSAO` /
`ENCERRAR_SESSAO`).

## Formato de cada entrada

```md
## AAAA-MM-DD — duração

### Objetivo da sessão

### O que fiz

### Dificuldades

### Ajuda utilizada (dica 1/2/3, solução, nenhuma)

### Entrega concreta

### Próximo passo
```

---

<!-- Novas entradas abaixo desta linha -->

## 2026-07-21

### Objetivo da sessão

Unidade 1 — valores, tipos e operadores.

### O que fiz

Avançado nos exercícios da unidade 1.

### Próximo passo

Continuar unidade 1.

## 2026-07-22

### Objetivo da sessão

Unidade 1 — valores, tipos e operadores.

### O que fiz

Concluída unidade 1 (16/16 exercícios, suite verde). Corrigido bug
pré-existente em `refactorDiscountTier`.

### Próximo passo

Iniciar unidade 2 (controle de fluxo) e definir cadência de DSA em
paralelo (Fase 12).

## 2026-07-24

### Objetivo da sessão

Unidade 2 — controle de fluxo.

### O que fiz

Respondidas as 3 perguntas de pré-estudo (break/continue, switch
fallthrough, for...of vs for...in). Implementado e fechado
`classifyTriangle` (1/16): corrigidos 4 bugs — retorno `null` em vez
de `"invalid"`, desigualdade triangular invertida, comparação
`(a===b)===c` sem sentido, checagem de isósceles cobrindo só um par.
Adicionado comando `node --test --test-name-pattern=...` como
comentário acima de cada função do arquivo.

### Dificuldades

for...of vs for...in (resolvido com exemplo concreto). Desigualdade
triangular invertida — custou pra enxergar a inversão de lógica.

### Ajuda utilizada

Guiado por perguntas/exemplos, sem solução colada — usuário escreveu
o fix.

### Entrega concreta

`classifyTriangle`: 2/2 testes verdes.

### Próximo passo

Exercício 2, `fizzBuzzRange(start, end)` — explicado o enunciado,
ainda não tentado.

## 2026-08-04

### Objetivo da sessão

Unidade 2 — controle de fluxo (fechamento).

### O que fiz

Retomados os exercícios pendentes de unidade 2 na ordem: exercícios
2-13 (fizzBuzzRange até safeGetNested) já estavam feitos entre
sessões. Resolvidos os 3 restantes:
- `fixOffByOneLoop` (debugging): loop `i <= items.length` corrigido
  para `i < items.length`.
- `fixSwitchFallthroughBug` (debugging): fallthrough do case
  `"pending"` faltando `break` — corrigido.
- `refactorNestedConditionals` (refactor): convertido de 4 ifs
  aninhados para guard clauses; um erro de sintaxe no meio do
  processo (função fechada sem `return` final nem `}`) identificado
  e corrigido pelo usuário.
- `classifyAndSummarizeOrders` (desafio integrador): implementado do
  zero com `for...of` + `switch`, contagem por status e
  `totalRevenue = soma(paid) - soma(refunded)`. Usuário confundiu
  inicialmente a fórmula (achou que era soma simples de paid+refunded)
  e also confundiu com o padrão de `safeGetNested` (path/current) —
  esclarecido que aqui é array de itens irmãos, não navegação
  aninhada, então não precisa de `current`/path, só `for...of` direto.

### Dificuldades

Fórmula de `totalRevenue` (paid menos refunded, não soma). Diferença
entre `for...of` (valores) vs percorrer um único objeto aninhado
(`safeGetNested`). Um case morto (`case "totalRevenue"`) adicionado
por engano no rascunho, removido antes de colar no arquivo final.

### Ajuda utilizada

Guiado por perguntas/exemplos e passo a passo pedido pelo próprio
usuário antes de codar; nenhuma solução colada — usuário escreveu
todo o código.

### Entrega concreta

Unidade 2 completa: 16/16 exercícios, suite verde (24/24 testes).

### Próximo passo

Unidade 3 — funções (já gerada, aguardando início). Cadência
combinada: 2-3 unidades/semana.

## 2026-08-05 — dia 005 de estudo

### Objetivo da sessão

Unidade 3 — funções.

### O que fiz

Implementados 10/16 exercícios: `sum`, `greet` (parâmetros default
nativos), `multiplyAll` (rest params + `for...of`), `isEven`,
`makeAdder` (função retornando função), `describePerson`,
`applyDiscount`, `firstArgumentType` — corrigido bug de índice
inexistente (`args[i]` sem `i` declarado) e checagem errada de "sem
argumentos" (`!args[0]` falha para `0`/`""` como primeiro argumento
válido; corrigido para checar `args.length`).

### Dificuldades

Hoisting de `function` vs `const` com arrow function (resolvido com
exemplos ao vivo). Diferença entre `for` clássico (`let i`,
reatribuído) e `for...of` (`const x`, variável nova a cada volta —
tabela de rodadas usada pra fixar). Confusão inicial se `let`/`const`
afetava performance/Big O — esclarecido que não, são independentes.

### Ajuda utilizada

Guiado por perguntas/exemplos, sem solução colada — usuário escreveu
todo o código.

### Entrega concreta

10/16 exercícios da unidade 3, suite com 16 testes passando (13
ainda falhando: `composeTwo` em andamento, `invokeNTimes`,
`curriedAdd`, `formatPrice`, `averageOrZero`, `makeMultiplier`,
`buildOrderProcessor`).

### Próximo passo

Continuar unidade 3: `composeTwo` (composição de funções), depois
`invokeNTimes`, `curriedAdd`, `formatPrice`, debugging
(`averageOrZero`, `makeMultiplier`) e desafio integrador
(`buildOrderProcessor`).

## 2026-08-10 — dia 006 de estudo

### Objetivo da sessão

Unidade 3 — funções (fechamento).

### O que fiz

Concluídos os 6 exercícios restantes: `invokeNTimes` (loop + push,
coleta `fn(i)` para i de 0 a n-1), `curriedAdd` (currying com arrows
encadeadas `(a) => (b) => (c) => a+b+c`), `formatPrice` (bracket
notation em objeto de símbolos + `??` como fallback pra moeda
desconhecida). Debugging: `averageOrZero` (bug de divisão por zero em
lista vazia, corrigido com guard `if (numbers.length === 0) return
0`), `makeMultiplier` (bug de arrow sem `return` dentro de bloco
`{}`, corrigido). Refatoração: `refactorOrderTotal` (convertido de
`var` + `if(=== undefined)` repetido 3x para desestruturação com
parâmetros default). Desafio integrador: `buildOrderProcessor`
(closure que retorna função processadora, filtra `cancelled` via
`if` dentro do loop, soma `amount`, aplica `taxRate`, retorna
`{ totalWithTax, processedCount }`).

### Dificuldades

Currying — sintaxe de arrows aninhadas custou pra fixar (tentativa
inicial usou recursão infinita chamando a própria função). Bracket
vs dot notation em objetos (`symbols.currency` vs `symbols[currency]`)
— confusão entre chave literal e valor de variável. `.filter()` como
conceito novo, evitado no exercício final em favor de loop único com
`if` (ferramenta já dominada). Erro de posicionamento de `return`
dentro do loop no primeiro rascunho de `buildOrderProcessor`
(retornava na primeira iteração).

### Ajuda utilizada

Guiado por perguntas/exemplos e esqueleto em passos, sem solução
colada — usuário escreveu todo o código dos exercícios avaliados.

### Entrega concreta

Unidade 3 completa: 16/16 exercícios, suite verde (29/29 testes).

### Próximo passo

Iniciar unidade 4 (a definir). Considerar retomar DSA (sessão 01
preparada desde 23/07, ainda não tentada) em paralelo.

## 2026-08-12

### Objetivo da sessão

Unidade 4 (lexical scope), continuando exercícios básicos.

### O que fiz

Trabalhado em `pushIntoConstArray`, `reassignLetInLoop`,
`attemptConstReassignment`, `nestedBlockCounter` (em progresso, não
fechado).

### Dificuldades

`reassignLetInLoop`: `return` posicionado dentro do `while` (saía na
1ª iteração); depois condição de loop usando `counter < times` em vez
de contador de iterações separado (`i`) — só funcionava por acidente
com `start=0`. `attemptConstReassignment`: `catch (TypeError)`
tratado como filtro de tipo — na verdade é só nome de variável;
corrigido para `catch (erro)` + `erro instanceof TypeError`.
`nestedBlockCounter`: ainda com bug (soma string em vez de número
via `count += operations[i]`, sem número real "+1"/"-1" parseado; e
falta `return`) — não fechado, retomar próxima sessão.

### Ajuda utilizada

Guiado por perguntas, sem solução colada — exceção: usuário pediu
resposta direta 1x em `reassignLetInLoop` (regra "no direct answers"
segurou, expliquei em passos/palavras em vez de código).

### Entrega concreta

Unidade 4 em progresso: 3 exercícios corrigidos e prontos
(`pushIntoConstArray` correto desde início; `reassignLetInLoop` e
`attemptConstReassignment` corrigidos), `nestedBlockCounter` ainda
com bug pendente.

### Próximo passo

Fechar `nestedBlockCounter` (converter string pra número, adicionar
`return`), seguir pros demais exercícios da unidade 4.

## 2026-08-12 — sessão

### Objetivo da sessão

Fechar unidade 4 (lexical scope): 6 exercícios restantes.

### O que fiz

`nestedBlockCounter` já veio corrigido de sessão anterior (achado
passando ao rodar suite). Resolvido: `varDeclaredValueBeforeAssignment`,
`compareVarAndLetLeak`, `createIifeCounter`, `sumOrderTotals` (bug fix),
`computeDiscountedPrice` (bug fix), `createSequentialIdGenerator`.

### Dificuldades

`compareVarAndLetLeak`: várias rodadas — `let scopedLet` fora do bloco
(não testava vazamento de verdade), `return` com sintaxe de string
literal em vez de objeto, lógica de `typeof x !== "undefined"`
invertida (`==` em vez de `!==`) por duas vezes, typo `scopedLeat`,
`return` com valores hardcoded (`true`/`false`) em vez das variáveis
calculadas. `createIifeCounter`: nunca tinha visto IIFE — pediu
explicação do mecanismo (`(function(){})()`) do zero; primeiro rascunho
com chaves desbalanceadas, shorthand de objeto `{increment, getValue}`
sem definir os métodos, faltou `export` e `return` na IIFE externa,
depois `count = count += 1` redundante. `sumOrderTotals`/
`computeDiscountedPrice`: fixes diretos, sem atrito — usuário já sacou
a causa (bug de `var` redeclarado, TDZ de `let`) antes de escrever.
`createSequentialIdGenerator`: confundiu retorno de objeto com retorno
de função (`return { count+=1, ... }` não é sintaxe válida), variável
inventada `contador` em vez de `count` (repetiu erro 2x mesmo após
correção apontada), esqueceu `export` 2x, e no teste manual esqueceu
parênteses de chamada (`console.log(nextId)` vs `nextId()`) —
perguntou por que precisava do `const` pra chamar, resolvido explicando
diferença entre referência de função e invocação.

### Ajuda utilizada

Guiado por perguntas em todos os 6 exercícios, sem solução colada —
usuário pediu solução pronta 1x (`compareVarAndLetLeak`), recusado
conforme regra "no direct answers"; oferecido esqueleto com `???` no
lugar em vez de código pronto.

### Entrega concreta

Unidade 4 completa: 16/16 exercícios, suite verde (21/21 testes).
Commit e push pendentes até usuário confirmar.

### Próximo passo

Unidade 5 (closures) — já entregue, aguardando início.

## 2026-08-17 — dia 011 de estudo

### Objetivo da sessão

Fechar unidade 5 (closures): 7 exercícios restantes (9-16, exceto
refatoração que já estava pronta).

### O que fiz

Resolvido passo a passo, guiado por perguntas: `createLoopClosuresFixed`,
`memoize`, `createEventEmitter` (on/off/emit), `limitCalls`,
`createRateLimiter`. `createLoopClosuresBuggy`, `createSharedCounterPair`
e `refactorCreateValidator` já vieram corrigidos/prontos de sessão
anterior (confirmados passando ao rodar suíte).

### Dificuldades

`createLoopClosuresFixed`: dúvida sobre converter function expression pra
arrow function (`() => i` sem `return`/chaves). `memoize`: nunca tinha
usado `Map` — explicado `.has/.get/.set` do zero; primeiro rascunho não
declarava o `cache`, depois tentou `cache.set(fn(arg))` com 1 argumento só
(confundiu retorno de `.set()`, que é o Map, com o valor guardado) —
corrigido separando em `result`/`set`/`return`. Muitas perguntas
conceituais sobre memoização vs Redis (TTL, eviction, persistência) e
sobre bancos relacionais vs chave-valor — respondidas sem entrar no
código. `createEventEmitter`: confusão inicial sobre `on`/`off`/`emit`
serem métodos de objeto (shorthand) — relacionado ao que já tinha visto
em `createBankAccount`; `off` copiado do corpo de `on` por engano (não
removia, adicionava de nulo); `emit` com `listeners.has(handler)` em vez
de `listeners.has(event)`, e sem chamar as funções (só fazia `.get`).
`limitCalls`: primeira tentativa usava `for` dentro do `wrapped` (rodava
`fn` `maxCalls` vezes numa chamada só, em vez de contar entre chamadas) —
corrigido reaproveitando o padrão de `onceFn` já resolvido. `createRateLimiter`:
typo `attemp` (faltou `t`) e faltou vírgula entre métodos do objeto,
corrigidos rápido.

### Ajuda utilizada

Guiado por perguntas em todos os exercícios ativos, sem solução colada.

### Entrega concreta

Unidade 5 completa: 16/16 exercícios, suite verde (24/24 testes).

### Próximo passo

Unidade 6 (arrays e objetos) — já entregue, aguardando início.

## 2026-08-25 — dia 013 de estudo

### Objetivo da sessão

Terminar o Project 01 (Order Workbench CLI): implementar `summarizeOrders`
e `processOrders`, fechar o gate.

### O que fiz

Resolvido passo a passo, guiado por perguntas: `summarizeOrders`
(acumulador indexado por status, reaproveitando `calculateOrderTotal`) e
`processOrders` (separação de válidos/inválidos preservando índice
original, via `for` clássico). Suite do Project 01 fechou 12/12. Retro
registrada em `notes/project-retrospectives/01-order-workbench-cli.md`.
Explicação oral do fluxo completo (`cli.js` → `processOrders` →
`summarizeOrders`) feita e corrigida ao vivo — fecha o gate do projeto.

### Dificuldades

`summarizeOrders`: tentou `result.has(...)` (método de `Map`) num objeto
plain, que não tem esse método — corrigido pra `=== undefined`; depois
somou `totalInCents++` (fixo, +1) em vez de `+= calculateOrderTotal(order)`;
depois tentou somar direto no grupo (`result[status] += x`) em vez de no
campo (`result[status].totalInCents += x`). `processOrders`: acessou
`_orders.order` em vez de `_orders[i]`; tratou o retorno de `validateOrder`
(objeto `{valid, errors}`) como booleano; esqueceu o `else` (push em
`invalidOrders` rodando sempre); empurrou o pedido cru em vez do objeto
`{index, order, errors}` esperado pelo teste. Na explicação oral, inverteu
a ordem de `processOrders`/`summarizeOrders` e inventou que
`createProcessingCounter` seria usado no fluxo do CLI (na real não é usada
em lugar nenhum fora dos testes) — corrigido ao apontar que ela nem é
importada em `cli.js`.

### Ajuda utilizada

Guiado por perguntas em todos os pontos, sem solução colada. Retrospectiva
foi rascunhada com base no que aconteceu na sessão (usuário pediu
diretamente) e revisada/ajustada por ele.

### Entrega concreta

Project 01 (Order Workbench CLI) completo: suíte 12/12 verde, retro
registrada, explicação oral validada. Commits `7e1e2e1` (summarizeOrders +
processOrders) e `fc555fd` (retrospectiva), push feito.

### Próximo passo

Unidade 7 (referências, mutabilidade e cópias) — já entregue, aguardando
início. Split do Project 01 pra repo próprio no GitHub segue pendente,
sem pressa. Próximo projeto prático de verdade (Project 04, Marketplace
Database Lab) só depois da Fase 4 de SQL.

## 2026-08-27

### Objetivo da sessão

Unidade 7 — referências, mutabilidade e cópias.

### O que fiz

Respondidas as 3 perguntas de hipótese do README antes de codar. Implementados
8/8 exercícios fundamentais (`isPrimitiveValue`, `sameReference`,
`shallowCopyArray`, `shallowCopyObject`, `mutateInPlacePush`,
`appendImmutable`, `updateNestedPropertyMutating`,
`updateNestedPropertyImmutable`) e 2/4 intermediários
(`shallowCopyKeepsNestedReference`, `deepCloneJSON`). 10/16 exercícios da
unidade, todos os testes rodados individualmente e verdes.

### Dificuldades

- Confundiu posição do `typeof` numa expressão (`typeof arr.includes(x)` vs
  `arr.includes(typeof x)`).
- Esqueceu `typeof null === "object"` (pegadinha clássica) até ser lembrado.
- Usou `.push()` esperando que retornasse o array (retorna o novo `length`).
- Trocou `mutateInPlacePush` e `appendImmutable` uma pela outra na primeira
  tentativa de cada.
- Usou `obj.key` (propriedade literal `"key"`) em vez de `obj[key]`
  (notação de colchetes pra nome de propriedade dinâmico/variável) —
  dúvida real sobre quando usar ponto vs colchetes, esclarecida com
  exemplos.
- Confundiu diferença `==`/`===` (achava que era "valor vs referência";
  na real só importa coerção de tipo em primitivos — em objetos os dois
  comparam referência igual).

### Ajuda utilizada

Guiado por perguntas e exemplos concretos em todos os pontos (pediu
"explica com exemplo, sou ruim de entender assim" mais de uma vez — grupo
de exemplo antes de teoria funcionou bem). Nenhuma solução colada
diretamente.

### Entrega concreta

10/16 testes verdes na unidade 7. Ainda não commitado.

### Próximo passo

Continuar unidade 7: `deepCloneManual` (recursão, sem JSON/structuredClone),
`hasSideEffect`, os 2 exercícios de debugging (`fixMutatingSortBug`,
`fixSharedDefaultArrayBug`), a refatoração (`refactorDeepUpdateChain`) e o
desafio integrador (`applyPatchImmutable`). `deepCloneManual` é o próximo
mais difícil — usuário pediu pra deixar pra próxima sessão.
