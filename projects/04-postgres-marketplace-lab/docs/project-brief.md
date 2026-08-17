# Brief — Marketplace Database Lab

## Requisitos funcionais

- cadastrar clientes e produtos;
- manter estoque não negativo;
- criar pedido com itens e preço histórico;
- impedir referência duplicada;
- cancelar pedido sem apagar histórico;
- listar pedidos por cliente e status;
- calcular receita paga;
- paginar pedidos por cursor.

## Requisitos não funcionais

- integridade garantida também pelo banco;
- nenhuma SQL injection;
- criação de pedido atômica;
- nenhuma venda acima do estoque;
- migrations reproduzíveis;
- consultas críticas analisadas;
- acesso da aplicação por least privilege;
- restore comprovado.

## Perguntas que você deve decidir

1. O preço do item copia o preço do produto ou consulta o valor atual?
2. Cancelar pedido devolve estoque? Em qual transação?
3. Quais estados de pedido são válidos e quais transições são permitidas?
4. O produto pode ser removido depois de vendido?
5. Qual é o cursor estável para pedidos?

## Riscos

- overselling;
- soma duplicada por joins;
- migration irreversível;
- índice excessivo;
- paginação instável;
- privilégio amplo;
- backup nunca restaurado.

