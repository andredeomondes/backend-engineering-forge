# DSA — Sessão 01 — Big O e arrays

Fase 12 (trilha de estruturas de dados e algoritmos), Bloco 1 — Fundamentos.
Roda **em paralelo** à Fase 1 (JavaScript), sem competir com o ritmo das
unidades ou do projeto. Duração alvo: 45–60 minutos.

**Nota de linguagem:** o plano original pede DSA sempre em TypeScript, mas
você ainda não começou a Fase 2. Decisão registrada em 2026-07-23: esta
sessão e as próximas até a Fase 2 são em **JavaScript puro**; quando a
Fase 2 for liberada, os exercícios são migrados/reescritos em TypeScript.

## Aquecimento — análise de complexidade

Antes de codar, classifique a complexidade de tempo (Big O) destes três
trechos e explique o porquê em uma frase (pode escrever aqui mesmo):

```js
// Trecho A
function a(arr) {
  return arr[0];
}

// Trecho B
function b(arr) {
  let total = 0;
  for (const x of arr) total += x;
  return total;
}

// Trecho C
function c(arr) {
  let count = 0;
  for (const x of arr) {
    for (const y of arr) {
      if (x === y) count++;
    }
  }
  return count;
}
```

1. Trecho A: O(?) — por quê?
2. Trecho B: O(?) — por quê?
3. Trecho C: O(?) — por quê?

Não pesquise ainda. Depois de implementar os exercícios abaixo, volte aqui
e classifique também a complexidade de cada função que você escreveu.

## Como trabalhar

1. Abra `exercises.js`. Cada função tem `throw new Error("not implemented: <nome>")`.
2. Implemente uma função por vez.
3. Rode os testes:

   ```bash
   npm test
   ```

4. Para cada função implementada, diga em voz alta (ou escreva) a
   complexidade de tempo e espaço antes de seguir para a próxima.
5. Não use `Array.prototype.reverse()` em `reverseArrayInPlace` — o
   objetivo é praticar manipulação de índice manualmente.

## Exercícios fundamentais

1. **`sumArray(arr)`** — soma todos os números do array. O(n).
2. **`findMax(arr)`** — retorna o maior valor do array. Lança `RangeError`
   se o array estiver vazio. O(n).
3. **`countFrequency(arr)`** — retorna um objeto `{ valor: quantidade }`
   contando quantas vezes cada valor aparece. Esta é a base do padrão
   **frequency counter**, que você vai reusar bastante nos próximos
   blocos. O(n).
4. **`hasDuplicate(arr)`** — retorna `true`/`false` se existe algum valor
   repetido. Deve ser O(n) (uma `Set` resolve isso sem laços aninhados —
   compare com `findFirstDuplicateQuadratic` abaixo, que é O(n²)).
5. **`reverseArrayInPlace(arr)`** — inverte o array **modificando o
   array original** (não cria um novo array), trocando elementos das
   pontas para o centro. O(n) tempo, O(1) espaço extra.
6. **`factorial(n)`** — calcula `n!` recursivamente. Lança `RangeError`
   para `n < 0`. Caso base: `factorial(0) === 1`.

## Otimização de complexidade

7. **`findFirstDuplicateQuadratic`** já está implementada e os testes já
   passam — **não mude o comportamento nem o teste dela**. Ela existe
   como referência de uma solução O(n²) (dois laços aninhados). Depois de
   implementar `hasDuplicate` (O(n) com `Set`), compare mentalmente: para
   um array de 10.000 elementos, quantas comparações cada versão faz no
   pior caso?

## Desafio integrador (ligado a backend)

8. **`topKFrequent(arr, k)`** — retorna os `k` valores mais frequentes do
   array, do mais para o menos frequente. Combine `countFrequency` (que
   você já escreveu) com uma ordenação pelas contagens. Este é o mesmo
   princípio usado em ranking de produtos mais vendidos, tags mais usadas,
   ou "top erros" em um dashboard de observabilidade.

## Critérios de aceitação

- `npm test` sem falhas.
- Você consegue dizer, sem consultar nada, a complexidade de tempo de
  cada função que implementou.
- Você consegue explicar por que `hasDuplicate` com `Set` é mais rápido
  que a versão com dois laços aninhados, e em que cenário essa diferença
  realmente importa (arrays pequenos vs. grandes).

## Revisão espaçada

Marque quando revisar este conjunto de problemas (repetição espaçada —
volte e resolva de novo sem olhar sua solução anterior):

- [ ] 1 dia
- [ ] 3 dias
- [ ] 7 dias
- [ ] 14 dias

## Dicas

Peça `DICA_1`, `DICA_2` ou `DICA_3` dizendo qual exercício travou, ou veja
`hints.md`.

Não peça `MOSTRAR_SOLUCAO` antes de tentar de verdade.
