# Unidade 1 — Tipos, controle de fluxo e métodos em Java

Fase 2, Unidade 1. Cobre: tipos primitivos (`int`, `long`, `double`,
`boolean`, `char`), `String`, `if`/`switch`, laços, métodos `static`,
divisão inteira e comparação de objetos.

Por que isso importa para backend: Java é estaticamente tipado. O
compilador recusa o programa antes de rodar se os tipos não batem —
coisa que em JavaScript só aparecia em produção. E dois erros clássicos
de júnior Java (divisão inteira e `==` em `String`) já derrubaram muito
cálculo de juros e comparação de status por aí.

Ponte com o que você já sabe: tudo aqui tem equivalente em JS
(Unidades 1–3). A diferença é que agora **cada variável tem tipo fixo**
e números inteiros e decimais são tipos diferentes.

## Antes de começar

Responda por escrito:

1. Em JS, `7 / 2` dá `3.5`. Em Java, `7 / 2` dá quanto? Por quê?
2. Em JS você comparava strings com `===`. O que `==` compara em Java
   quando os dois lados são objetos?
3. Por que sistemas financeiros guardam dinheiro em centavos (`long`)
   em vez de `double`?

Não pesquise ainda. Escreva sua hipótese antes de implementar.

## Como trabalhar

1. Abra `exercises/13-java-core/src/main/java/forge/java/Unit01Exercises.java`.
   Cada método tem `throw new UnsupportedOperationException("TODO: <nome>")`.
2. Implemente um método por vez.
3. Rode os testes da unidade:

   ```bash
   mvn -q -f exercises/13-java-core/pom.xml test -Dtest=Unit01ExercisesTest
   ```

   Ou só os de um exercício: `-Dtest=Unit01ExercisesTest#isEven_*`.
   No painel, o botão de testes faz o mesmo.

4. Todos os testes começam falhando. Os dois de debugging já vêm com
   código e um bug proposital.

## Exercícios fundamentais (6)

1. **`isEven(int n)`** — retorna `true` se `n` for par (inclusive
   negativos e zero).
2. **`maxOfThree(int a, int b, int c)`** — retorna o maior dos três,
   usando `if`/`else` (sem `Math.max`).
3. **`sumUpTo(int n)`** — soma de 1 até `n` com um laço `for`. Para
   `n <= 0`, retorna `0`.
4. **`countVowels(String text)`** — conta as vogais (`aeiou`, maiúsculas
   ou minúsculas). `null` conta como zero vogais.
5. **`reverse(String text)`** — devolve o texto invertido usando
   `StringBuilder`.
6. **`classifyAge(int age)`** — retorna `"menor"` (0–17), `"adulto"`
   (18–59) ou `"idoso"` (60+). Idade negativa lança
   `IllegalArgumentException`.

## Exercícios intermediários (2)

7. **`average(int[] values)`** — média como `double`. Array vazio
   retorna `0.0`. Cuidado: `int / int` em Java descarta a parte decimal.
8. **`formatCents(long cents)`** — formata centavos em reais:
   `1234` → `"R$ 12,34"`, `5` → `"R$ 0,05"`, `-250` → `"-R$ 2,50"`.
   Não use `double` em nenhum passo.

## Debugging (2)

9. **`fixPercentageBug(int part, int whole)`** — deveria devolver a
   porcentagem (`25` de `200` → `12.5`), mas sempre devolve `0.0` ou
   número inteiro. Encontre e corrija o bug sem mudar a assinatura.
10. **`fixStringEqualityBug(String status, String expected)`** — deveria
    dizer se dois status de pagamento são iguais, mas falha quando as
    strings vêm de fontes diferentes. Corrija.

## Gate

Suíte verde + reflexão: explique com suas palavras a diferença entre
`==` e `.equals()` e por que `int / int` perde casas decimais.
