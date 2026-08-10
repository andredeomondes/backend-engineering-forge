# Unidade 1 — Valores, tipos e operadores (revisão)

Perguntas respondidas antes de começar os exercícios (`exercises/01-javascript-core/unit-01-values-types-operators/README.md`), com nota de correção onde necessário.

## 1. O que `typeof null` retorna? Por quê?

**Minha resposta:** Retorna um tipo `object`, devido aos bugs iniciais do JavaScript.

**Correção/reforço:** Certo. É um bug histórico do JS de 1995 — na representação interna de tipos, `null` foi codificado com a mesma tag de tipo usada para objetos (tag `0`). Nunca foi corrigido porque corrigir quebraria código existente na web. Pra checar `null` de verdade: `value === null`, nunca `typeof value === "object"` sozinho (isso também pega arrays, `{}`, etc).

## 2. `"5" + 3` e `"5" - 3` retornam a mesma coisa?

**Minha resposta:** Não — um concatena e o outro não.

**Correção/reforço:** Certo. `+` com string do lado esquerdo vira concatenação (`"53"`). `-` não tem significado como operador de string, então o JS força coerção pra número (`"5" - 3 = 2`). Regra prática: `+` é ambíguo (soma OU concatena), os outros operadores aritméticos (`-`, `*`, `/`) sempre coagem pra número.

## 3. `NaN === NaN` é `true` ou `false`? Por quê?

**Minha resposta:** `false`, porque `NaN` representa um valor indefinido.

**Correção:** Resultado certo (`false`), mas a razão não é "indefinido". `NaN` = "Not a Number", um valor numérico específico do IEEE 754 que representa resultado de operação matemática inválida (ex: `0/0`, `Math.sqrt(-1)`). Por definição da spec IEEE 754, `NaN` nunca é igual a nada, nem a si mesmo — é assim que se testa "é NaN?" sem `isNaN()`: `value !== value`.

## Outros conceitos-chave da unidade

- **Truthy/falsy manual** (`isTruthyManually`): só 8 valores são falsy — `false, 0, -0, 0n, "", null, undefined, NaN`. Todo o resto é truthy, incluindo `"0"`, `[]`, `{}`.
- **Coerção pra número** (`coerceToNumberManually`): string vazia → `0`; array vazio → `0`; array de 1 elemento numérico → esse número; array com 2+ elementos → `NaN`.
- **SameValueZero** (`isSameValueZero`): igual a `===` exceto que trata `NaN === NaN` como `true` (é o algoritmo que `Set`/`Map`/`Array.includes` usam por baixo).
- **`deepTypeOf` / `Object.prototype.toString.call`**: ponto onde travei mais ("muito difícil"). O que destravou foi rodar `Object.prototype.toString.call(valor)` isolado no console e ver a string crua (`"[object Array]"`) antes de qualquer teoria sobre `.call` — concreto primeiro, abstrato depois.

Status: unidade 1 completa, 16/16 exercícios, suíte verde.
