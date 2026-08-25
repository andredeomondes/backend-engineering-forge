---
tags: [retrospectiva]
date: 2026-08-25
projeto: 01-order-workbench-cli
---

# Retrospectiva — [[01-order-workbench-cli]]

## O que construí

Um CLI de processamento de pedidos: valida pedidos (`validateOrder`), calcula
totais em centavos (`calculateOrderTotal`), mantém um contador com estado
privado via closure (`createProcessingCounter`), agrupa pedidos por status
(`summarizeOrders`) e separa pedidos válidos de inválidos preservando a
posição original (`processOrders`).

## O que consigo explicar sem consultar

- `validateOrder`, `calculateOrderTotal`, `createProcessingCounter`: sim.
- `summarizeOrders`: sim — acumula num objeto indexado por status.
- `processOrders`: sim — percorre com índice, valida cada um, separa em duas listas.

## Maiores dificuldades

- Confundir métodos de `Map` (`.has()`) com objeto plain — objeto comum não
  tem `.has()`, precisa `in` ou checar `=== undefined`.
- Esquecer que `validateOrder` retorna um objeto `{ valid, errors }`, não um
  booleano — `if (validateOrder(order))` é sempre truthy.
- Montar o shape certo de `invalidOrders` (`{ index, order, errors }`) em vez
  de empurrar só o pedido cru.
- Colocar lógica fora do `if/else` por engano (ex: `push` rodando sempre,
  incremento de total fora do campo certo do objeto).

## Erros recorrentes

- Acessar propriedade errada em array (`_orders.order` em vez de `_orders[i]`).
- Somar/incrementar no nível errado do objeto aninhado (`result[status] += x`
  em vez de `result[status].totalInCents += x`).

## Decisões boas

- Reusar `calculateOrderTotal` dentro de `summarizeOrders` em vez de
  recalcular a lógica de soma.
- Usar `for` clássico com índice em `processOrders` pra ter `i` disponível
  sem `.entries()`.

## Decisões que mudaria

- (preencher se houver algo)

## Dívidas técnicas

- (preencher se houver algo)

## Conhecimentos que ainda faltam

- (preencher se houver algo)

## Conceitos usados

- [[closures]]
- [[arrays]]
- [[objetos]]
- [[acumuladores]]

## Próximo projeto ou melhoria

Repo próprio do Order Workbench CLI (fora do monorepo de estudo).

## Demonstração

Explique o projeto como em uma entrevista.
