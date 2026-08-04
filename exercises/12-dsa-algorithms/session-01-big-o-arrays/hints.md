# Dicas — DSA Sessão 01

Use `DICA_1`, `DICA_2` ou `DICA_3` dizendo qual exercício travou.

## Nível 1 — direção, sem código

- `sumArray`/`findMax`: um único laço percorrendo o array basta para os
  dois — a diferença está no que você acumula.
- `countFrequency`: que estrutura de dados representa naturalmente
  "chave → quantidade"? Um objeto simples resolve.
- `hasDuplicate`: qual estrutura garante que cada valor só existe uma vez
  e tem consulta O(1)?
- `reverseArrayInPlace`: pense em dois "ponteiros" (índices), um no
  começo e um no fim, que se aproximam trocando valores.
- `factorial`: qual é o caso base (quando a recursão para)? Qual é o
  caso recursivo (como o problema se reduz)?
- `topKFrequent`: depois de ter a contagem, o que ordena "do maior para o
  menor" e o que pega só os primeiros `k`?

## Nível 2 — pista mais direta

- `findMax`: comece com `let max = arr[0]`, valide array vazio antes, e
  compare cada elemento seguinte.
- `countFrequency`: `freq[valor] = (freq[valor] ?? 0) + 1` dentro do
  laço.
- `hasDuplicate`: crie um `Set`; para cada valor, se `set.has(valor)`
  retorne `true` direto; senão, `set.add(valor)`.
- `reverseArrayInPlace`: `let left = 0, right = arr.length - 1;` e um
  `while (left < right) { swap; left++; right--; }`.
- `factorial`: `if (n < 0) throw new RangeError(...); if (n === 0) return 1; return n * factorial(n - 1);`.
- `topKFrequent`: `Object.entries(freq)` vira um array de pares
  `[valor, contagem]`; ordene por `contagem` decrescente com `.sort()` e
  pegue os `k` primeiros com `.slice(0, k)`, depois extraia só os
  valores.

## Nível 3 — quase o código, mas ainda não a solução

- `reverseArrayInPlace`:
  ```js
  let left = 0;
  let right = arr.length - 1;
  while (left < right) {
    const temp = arr[left];
    arr[left] = arr[right];
    arr[right] = temp;
    left++;
    right--;
  }
  return arr;
  ```
- `topKFrequent`:
  ```js
  const freq = countFrequency(arr);
  const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]);
  return sorted.slice(0, k).map(([valor]) => valor);
  ```

Peça `MOSTRAR_SOLUCAO` apenas depois de registrar sua tentativa.
