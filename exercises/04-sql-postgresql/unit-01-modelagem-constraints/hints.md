# Dicas — `sql-01`

## Nível 1

Comece pelas entidades independentes. Só crie pedidos depois de clientes e
produtos existirem.

## Nível 2

Um item de pedido pertence a um pedido e referencia um produto. A combinação
pedido/produto não deveria se repetir silenciosamente.

## Nível 3

Liste as regras que usam `NOT NULL`, `UNIQUE`, `CHECK` e `FOREIGN KEY`. Se uma
regra não cabe em nenhuma, explique por que ela ficará na aplicação.

