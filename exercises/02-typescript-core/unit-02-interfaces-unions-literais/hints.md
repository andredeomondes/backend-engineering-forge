# Dicas — Unidade 2 (TypeScript)

Use `DICA_1`, `DICA_2` ou `DICA_3` dizendo qual exercício travou. Abaixo
está o roteiro geral que a mentoria segue nesta unidade.

## Nível 1 — direção, sem código

- Para `describeUser`: `age?: number` significa que, dentro da função,
  `user.age` pode ser `number` ou `undefined`. Como você testa "essa
  propriedade opcional foi passada?" antes de usá-la na string?
- Para `describeShape`: as três variantes de `Shape` compartilham um
  campo `kind` com um valor literal diferente cada (`"circle"`,
  `"square"`, `"rectangle"`). O que acontece com o tipo de `shape` dentro
  de cada `case` de um `switch (shape.kind)`?
- Para `describePaymentMethod`: `CreditCard` e `BankTransfer` não têm um
  campo em comum para discriminar. Qual operador do JavaScript testa "essa
  chave existe neste objeto?" e também é entendido pelo TypeScript como
  guarda de tipo?
- Para `renameCityImmutable`: `Address` é `readonly` em todas as
  propriedades — você não pode fazer `address.city = newCity`. Qual
  sintaxe cria um objeto novo copiando as propriedades de outro,
  sobrescrevendo só uma?
- Para `mergeConfigs`/`combineProfile`: um tipo interseção (`A & B`)
  descreve um valor que satisfaz **os dois** tipos ao mesmo tempo. Que
  operador de objeto do JavaScript combina duas fontes de propriedades em
  um único objeto novo?
- Para `fixDiscountCalculation`: um desconto de `10` (por cento) deveria
  virar uma fração antes de multiplicar pelo preço. O código atual
  multiplica pelo `10` direto — o que isso faz com o valor do desconto?
  E o que vale `undefined!` em tempo de execução, quando a propriedade
  não existe?

## Nível 2 — pista mais direta

- `describeUser`: `if (user.age !== undefined) { ... }` — dentro do
  bloco, o TypeScript já sabe que `user.age` é `number`.
- `describeShape`: dentro de `case "circle":`, `shape` é tratado como
  `Circle`, então `shape.radius` existe e `shape.side`/`shape.width` não
  compilariam ali — isso é a união discriminada em ação.
- `describePaymentMethod`: `if ("cardNumber" in method) { ... } else { ... }`
  — no primeiro bloco `method` é `CreditCard`, no `else` é `BankTransfer`.
- `renameCityImmutable`: `return { ...address, city: newCity };`.
- `mergeConfigs`: `return { ...base, ...overrides };` — chaves depois no
  spread sobrescrevem as de antes, e chaves `undefined` em `overrides`
  (propriedade opcional não passada) simplesmente não aparecem no objeto.
- `fixDiscountCalculation`: quando `discountPercent` existe, o desconto é
  `price * (discountPercent / 100)`; quando não existe, o preço final é o
  preço cheio, sem cálculo nenhum.

## Nível 3 — quase o código, mas ainda não a solução

- `describeShape`:
  ```ts
  switch (shape.kind) {
    case "circle":
      return `círculo com área ${(Math.PI * shape.radius ** 2).toFixed(2)}`;
    case "square":
      return `quadrado com área ${(shape.side ** 2).toFixed(2)}`;
    case "rectangle":
      return `retângulo com área ${(shape.width * shape.height).toFixed(2)}`;
  }
  ```
- `fixDiscountCalculation`:
  ```ts
  if (product.discountPercent === undefined) return product.price;
  const discount = product.price * (product.discountPercent / 100);
  return product.price - discount;
  ```
- `fixShapeAreaBug`: o `case "rectangle"` usa `shape.width * shape.width`
  — troque o segundo `shape.width` por `shape.height`.
- `summarizeOrder`: valide `order.items.length === 0` primeiro (lance
  `RangeError`), depois use `.reduce` (ou um `for...of`) para somar
  `price * quantity`, e reaproveite a mesma lógica de
  `describePaymentMethod` e `describeUser` para montar os outros campos.

Peça `MOSTRAR_SOLUCAO` apenas depois de registrar sua tentativa.
