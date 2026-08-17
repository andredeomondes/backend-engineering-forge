# Exercícios — Order Workbench CLI

Estes exercícios complementam a suíte inicial. Não precisam ser resolvidos de
uma vez e não contêm soluções.

## Preparação

1. Classifique cada campo do pedido como string, número, array ou objeto.
2. Escreva cinco invariantes do domínio sem usar código.
3. Calcule manualmente o total de `order-1001`.
4. Preveja a saída para uma lista vazia.
5. Explique por que o fixture inválido deve produzir dois resultados inválidos,
   mas não encerrar o processo inteiro.

## Implementação fundamental

6. Faça `validateOrder` acumular todos os erros encontrados.
7. Faça `calculateOrderTotal` retornar um inteiro em centavos.
8. Crie dois contadores e prove que possuem estados independentes.
9. Agrupe pedidos por status sem criar antecipadamente grupos vazios.
10. Preserve o índice original de cada registro inválido.

## Casos extremos para você transformar em testes

11. A entrada do lote não é um array.
12. Um item não possui SKU.
13. A quantidade é decimal, zero, negativa ou texto.
14. O preço contém ponto flutuante.
15. Dois pedidos diferentes possuem o mesmo ID.
16. O mesmo objeto de pedido aparece duas vezes no array.
17. Um pedido cancelado possui valor, mas a regra do relatório precisa decidir
    se ele entra ou não no total financeiro.

Para os exercícios 15–17, escreva primeiro a decisão de negócio. Não invente
comportamento silenciosamente dentro do código.

## Debugging

18. Um resumo apresenta `NaN`. Liste três hipóteses e teste uma de cada vez.
19. O segundo contador começa em 4 em vez de 1. Identifique onde o estado pode
    ter sido compartilhado.
20. Um teste de imutabilidade falha somente depois de executar o resumo. Reduza
    o caso até encontrar a operação que altera a entrada.
21. O relatório perde o índice original quando há dois inválidos seguidos.
    Reproduza com um teste mínimo antes de corrigir.

## Refatoração

22. Identifique validações repetidas e extraia somente uma função pequena que
    realmente melhore a leitura.
23. Compare loop tradicional e `reduce` no resumo. Escolha pela clareza que você
    consegue defender, não pela menor quantidade de linhas.
24. Revise nomes genéricos como `data`, `item` ou `result` e melhore apenas os
    que ocultam intenção.

## Desafio integrador

Adicione um relatório geral com:

- total processado;
- quantidade válida e inválida;
- valor por status;
- percentual de registros válidos;
- lista de erros por índice.

Antes de implementar, escreva o formato exato da saída e pelo menos quatro
testes. Não altere o contrato das cinco funções existentes sem justificar.

## Explicação final

Apresente o projeto em até cinco minutos:

1. problema;
2. modelo de dados;
3. validação;
4. cálculo e agregação;
5. closure;
6. testes importantes;
7. limitações e próxima evolução.
