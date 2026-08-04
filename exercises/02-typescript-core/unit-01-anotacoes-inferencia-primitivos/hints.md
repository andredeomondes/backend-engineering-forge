# Dicas — Unidade 1 (TypeScript)

Use `DICA_1`, `DICA_2` ou `DICA_3` dizendo qual exercício travou. Abaixo
está o roteiro geral que a mentoria segue nesta unidade.

## Nível 1 — direção, sem código

- Para `formatPriceFromCents`: pense em centavos como um `number` inteiro.
  Como você separa a parte de reais da parte de centavos usando divisão e
  resto (`/` e `%`)?
- Para `getFirstAndLast`: uma tupla `[string, string]` é só um array de
  tamanho fixo — o TypeScript sabe que a posição 0 e a posição 1 existem.
  O que precisa acontecer antes de acessar `items[0]` e `items[items.length - 1]`?
- Para `distanceBetween`: qual fórmula relaciona `Coordinates` (uma tupla
  `[number, number]`) com a distância entre dois pontos no plano?
- Para `parseCoordinatePair`: quantas partes uma string `"3,4"` vira depois
  de um `split(",")`? O que precisa ser verdade sobre essas partes para o
  resultado ser válido?
- Para `fixAverageCalculation`: rode o código atual mentalmente com
  `scores = [10, 20, 30]`. Por quanto ele está dividindo o total, e por
  quanto deveria dividir?
- Para `summarizeInventory`: você precisa de três acumuladores diferentes
  enquanto percorre o array uma vez. Quais são?

## Nível 2 — pista mais direta

- `formatPriceFromCents`: `Math.floor(cents / 100)` dá os reais,
  `cents % 100` dá os centavos restantes — cuidado em preencher com zero
  à esquerda quando o resto for menor que 10.
- `getFirstAndLast`: se `items.length === 0`, lance `RangeError`. Senão,
  retorne `[items[0], items[items.length - 1]]`.
- `distanceBetween`: `Math.sqrt((a[0]-b[0])**2 + (a[1]-b[1])**2)`.
- `parseCoordinatePair`: `input.split(",")` deve ter exatamente 2 partes;
  converta cada parte com `Number(...)` e valide com `Number.isNaN`.
- `fixAverageCalculation`: o divisor correto é `scores.length`, não
  `scores.length + 1`; além disso, uma lista vazia deve lançar erro em vez
  de dividir por zero.
- `summarizeInventory`: acumule `totalItems` (soma de `quantity`),
  `totalValue` (soma de `price * quantity`) e rastreie o item com maior
  `price` visto até agora.

## Nível 3 — quase o código, mas ainda não a solução

- `parseCoordinatePair`:
  ```ts
  const parts = input.split(",");
  if (parts.length !== 2) return null;
  const x = Number(parts[0]);
  const y = Number(parts[1]);
  if (Number.isNaN(x) || Number.isNaN(y)) return null;
  return [x, y];
  ```
- `mergeTuples`: coloque as duas tuplas num array e use
  `.sort((a, b) => a[1] - b[1])`.
- `summarizeInventory`: percorra com `for...of`, mantenha
  `mostExpensivePrice` e `mostExpensiveName` atualizados a cada iteração
  onde `item.price > mostExpensivePrice`; lance `RangeError` antes do
  laço se `items.length === 0`.
- `fixTupleOrderBug`: a tupla é `[string, number]` — o primeiro elemento
  desestruturado já é a string (`count`, apesar do nome confuso) e o
  segundo já é o número (`label`). O bug está na ordem dos placeholders
  dentro do template string, não na desestruturação.

Peça `MOSTRAR_SOLUCAO` apenas depois de registrar sua tentativa.
