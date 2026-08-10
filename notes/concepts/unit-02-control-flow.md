# Unidade 2 — Controle de fluxo (revisão)

Perguntas respondidas antes de começar os exercícios (`exercises/01-javascript-core/unit-02-control-flow/README.md`), com nota de correção onde necessário.

## 1. Qual a diferença entre `break` e `continue` dentro de um loop?

**Minha resposta:** `break` para tudo, `continue` vai pra próxima rodada do loop.

**Correção/reforço:** Certo. `break` sai do loop inteiro imediatamente (nenhuma iteração seguinte roda). `continue` pula só o resto do corpo da iteração atual e volta pra condição do loop, seguindo pra próxima rodada. Com loops aninhados, ambos afetam só o loop mais interno — a menos que se use um laço rotulado (`label:`), que permite `break label` / `continue label` para atingir o loop externo.

## 2. Um `switch` sem `break` em um `case` faz o quê exatamente?

**Minha resposta:** Executa todos os outros `case` abaixo até encontrar o `default` ou o `break`.

**Correção/reforço:** Certo — isso é "fallthrough". O `switch` não compara cada `case` de novo depois de entrar; uma vez que bate um `case` (ou cai no primeiro que combina), a execução simplesmente continua pra baixo, linha a linha, ignorando os `case` seguintes como se fossem só rótulos, até achar um `break`, um `return`, ou o fim do bloco. É bug comum esquecer o `break` — foi exatamente o bug proposital corrigido em `fixSwitchFallthroughBug` (unidade 2, exercício de debugging): faltava `break` depois do case `"pending"`.

## 3. `for...of` e `for...in` — o que cada um percorre em array e em objeto?

**Minha resposta:** `for...in` percorre os índices, `for...of` percorre os valores.

**Correção/reforço:** Certo. Mais preciso:
- `for...in` itera **chaves enumeráveis** — em array, os índices como string (`"0"`, `"1"`, ...); em objeto comum, as chaves (`"nome"`, `"idade"`, ...). Evitar em arrays (ordem não garantida, pega propriedades herdadas).
- `for...of` itera **valores** de qualquer iterável (array, string, Map, Set, generator) — em array, o valor de cada posição direto. Não funciona em objeto comum puro (objeto não é iterável por padrão).
- Regra prática: array/lista → `for...of`. Precisa da chave de um objeto → `for...in` (ou melhor, `Object.keys/entries`).

## Outros conceitos-chave da unidade

- **Curto-circuito** (`&&`, `||`, `??`): `&&` retorna o primeiro valor falsy ou o último; `||` retorna o primeiro valor truthy ou o último; `??` (nullish coalescing) só cai pro segundo valor se o primeiro for `null`/`undefined` — diferente de `||`, que cai também pra `0`, `""`, `false`.
- **Guard clauses**: refatorar condicionais aninhados (`if` dentro de `if` dentro de `if`) pra uma sequência de retornos antecipados no topo da função — feito em `refactorNestedConditionals`. Reduz nível de indentação e deixa o caminho "feliz" no final, sem aninhamento.
- **`for...of` + `switch` combinados** (integrador `classifyAndSummarizeOrders`): iterar itens de array e, por item, decidir ação com `switch` no status — usado pra contar por status e calcular `totalRevenue = soma(pagos) - soma(reembolsados)`. Pegadinha: não confundir esse padrão (array de itens irmãos, sem necessidade de rastrear caminho) com percorrer uma estrutura aninhada tipo `safeGetNested`, que precisa de uma variável `current` pra ir descendo nível a nível — são problemas diferentes.

Status: unidade 2 completa, 16/16 exercícios, 24/24 testes verdes.
