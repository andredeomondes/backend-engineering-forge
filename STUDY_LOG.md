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
