# Dicas — Unidade 1 (Java)

Use `DICA_1`, `DICA_2` ou `DICA_3` dizendo qual exercício travou.

## Nível 1 — direção, sem código

- `isEven`: qual operador dá o resto da divisão? O que acontece com o
  resto de um número negativo?
- `sumUpTo`: o laço `for` de Java tem a mesma forma do de JS, mas a
  variável precisa de tipo.
- `countVowels`: uma `String` não é um array. Que método devolve o
  caractere numa posição? E como tratar maiúsculas sem duplicar código?
- `average`: se os dois lados da divisão são `int`, o resultado é `int`.
  Como forçar um dos lados a ser `double`?
- `formatCents`: separe reais e centavos com `/` e `%`. O sinal precisa
  ser tratado antes.
- `fixStringEqualityBug`: o que `==` compara entre dois objetos?

## Nível 2 — pista mais direta

- `isEven`: `n % 2 == 0` funciona para negativos (`-4 % 2` é `0`).
- `countVowels`: `Character.toLowerCase(text.charAt(i))` e
  `"aeiou".indexOf(c) >= 0`.
- `reverse`: `new StringBuilder(text).reverse().toString()`.
- `average`: some num `long`, depois `(double) sum / values.length`.
- `formatCents`: `Math.abs(cents)`, `reais = abs / 100`,
  `centavos = abs % 100`, e `String.format("%02d", centavos)`.
- `fixPercentageBug`: a multiplicação por 100 precisa acontecer em
  `double` antes da divisão.

## Nível 3 — quase o código, mas ainda não a solução

- `classifyAge`:
  ```java
  if (age < 0) throw new IllegalArgumentException("idade negativa");
  if (age < 18) return "menor";
  // ...
  ```
- `formatCents`:
  ```java
  String sign = cents < 0 ? "-" : "";
  long abs = Math.abs(cents);
  return sign + "R$ " + (abs / 100) + "," + String.format("%02d", abs % 100);
  ```
- `fixStringEqualityBug`: troque o `==` por uma comparação de conteúdo
  que não quebre quando `status` for `null`.
