# Dicas progressivas — Order Workbench CLI

Use uma seção por vez e só depois de registrar sua tentativa.

## Nível 1 — decomposição

Comece por `validateOrder`. Liste cada regra em linguagem natural e faça cada
validação acrescentar uma mensagem ao mesmo array. Só depois implemente total e
processamento.

## Nível 2 — estruturas

`summarizeOrders` pode acumular um objeto indexado pelo status. Antes de somar,
garanta que o grupo atual exista. Para o contador, pense em qual variável deve
continuar acessível depois que a função externa terminar.

## Nível 3 — fluxo

Em `processOrders`, percorra a entrada uma única vez. Para cada posição, use
`validateOrder`; envie o pedido para uma lista quando válido e um objeto com
`index`, `order` e `errors` para a outra quando inválido. O contador deve ser
incrementado exatamente uma vez por registro.

