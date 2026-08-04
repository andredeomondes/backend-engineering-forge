# Dicas — Unidade 4 (TypeScript)

Use `DICA_1`, `DICA_2` ou `DICA_3` dizendo qual exercício travou. Abaixo
está o roteiro geral que a mentoria segue nesta unidade, para os
exercícios mais traiçoeiros.

## Nível 1 — direção, sem código

- Para `pluck`: `keyof T` é o conjunto de nomes de propriedade de `T`.
  Se `K extends keyof T`, o que o compilador sabe sobre `T[K]` que ele não
  saberia se `key` fosse tipado como `string`?
- Para `findByKey`: é quase o mesmo raciocínio de `pluck`, mas agora você
  também recebe um `value: T[K]` para comparar — isso garante, em tempo de
  compilação, que você não pode comparar `id` com uma string por engano.
- Para `createStack`: você não precisa de uma `class`. Uma função que
  fecha sobre um array interno (closure) e retorna um objeto com os
  métodos já resolve — pense em como cada método acessa a mesma variável
  `items` sem expô-la diretamente.
- Para `doubleValue`: a assinatura de implementação usa
  `x: number | string`. Como você decide, dentro do corpo, qual dos dois
  caminhos seguir? O que `typeof x` te dá nesse momento?
- Para `combineValues` (debugging): rode mentalmente
  `combineValues(2, 3)`. O código atual entra no branch de string? Não.
  Então qual operação ele está fazendo com os dois números, e qual
  deveria fazer?
- Para `mergeUnique` (debugging): a constraint `T extends { id: number }`
  existe para permitir comparar itens pelo `id`. O código atual usa essa
  informação em algum momento, ou só concatena os dois arrays?
- Para `groupBy`: você precisa de um acumulador que comece vazio e, para
  cada item, calcule a chave com `keyFn(item)` e empurre o item para o
  array daquela chave (criando o array se ainda não existir).

## Nível 2 — pista mais direta

- `pluck`: `return obj[key];` — o tipo de retorno `T[K]` já é inferido
  pela assinatura, você não precisa fazer type assertion nenhuma.
- `findByKey`: percorra `items` com `for...of` e retorne o primeiro
  `item` onde `item[key] === value`; se o laço terminar sem achar,
  retorne `undefined`.
- `createStack`: declare `const items: T[] = []` dentro da função e
  retorne um objeto literal com `push`, `pop` (`items.pop()`), `peek`
  (`items[items.length - 1]`) e `size` (`() => items.length`).
- `doubleValue`: `if (typeof x === "string") { return x + x; } return x * 2;`
- `combineValues`: a linha `return (a as number) - (b as number);`
  deveria somar, não subtrair.
- `mergeUnique`: crie um `Set<number>` (ou `Map`) com os ids já vistos ao
  percorrer `[...a, ...b]`, e só inclua um item no resultado se o `id`
  dele ainda não tiver sido visto.
- `groupBy`: comece com `const result = {} as Record<K, T[]>;` (a única
  forma prática de tipar um acumulador que começa vazio e cresce com
  chaves dinâmicas), depois, para cada item, `const key = keyFn(item);`
  e `(result[key] ??= []).push(item);`.

## Nível 3 — quase o código, mas ainda não a solução

- `mergeUnique`:
  ```ts
  const seen = new Set<number>();
  const result: T[] = [];
  for (const item of [...a, ...b]) {
    if (!seen.has(item.id)) {
      seen.add(item.id);
      result.push(item);
    }
  }
  return result;
  ```
- `groupBy`:
  ```ts
  const result = {} as Record<K, T[]>;
  for (const item of items) {
    const key = keyFn(item);
    if (!result[key]) {
      result[key] = [];
    }
    result[key].push(item);
  }
  return result;
  ```
- `maxNumber` / `maxString` (refatoração): extraia uma função interna
  não exportada, por exemplo `function maxOf<T extends number | string>(values: T[]): T { ... }`
  com a mesma lógica de laço que já existe hoje, e faça `maxNumber` e
  `maxString` chamarem `maxOf` internamente, mantendo as duas assinaturas
  exportadas intactas.

Peça `MOSTRAR_SOLUCAO` apenas depois de registrar sua tentativa.
