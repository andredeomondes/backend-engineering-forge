# Roteiro de aulas — Order Workbench CLI

Use este roteiro somente depois do gate de `js-06`. Cada aula dura de 60 a 90
minutos e termina com uma entrega pequena. Não avance apenas porque leu o
material: execute testes, explique a decisão e registre o próximo passo.

## Aula 1 — Entender o problema e os contratos

### Recuperação ativa

1. Qual é a diferença entre parâmetro, argumento e valor retornado?
2. O que acontece quando dois nomes apontam para o mesmo objeto?
3. Por que valores monetários em centavos evitam alguns erros de precisão?

### Material

Um pedido válido possui identificador não vazio, status conhecido e ao menos um
item. Cada item possui SKU, quantidade inteira positiva e preço inteiro em
centavos. Validação é diferente de processamento: primeiro identificamos se o
dado pode entrar no domínio; depois calculamos e agregamos.

### Prática

- leia o README e os dois fixtures;
- escreva as regras com suas palavras;
- preveja quais testes falharão primeiro;
- execute `npm run test:project-01`;
- escolha somente o primeiro teste como próximo alvo.

### Entrega

Uma lista de invariantes e três casos extremos adicionais.

## Aula 2 — Validação acumulativa

### Recuperação ativa

1. Quando usar retorno antecipado?
2. Qual a diferença entre falhar no primeiro erro e acumular erros?
3. Como verificar um array sem alterá-lo?

### Material

Em importações em lote, acumular erros permite corrigir vários campos de uma
vez. A função deve sempre retornar o mesmo formato: `{ valid, errors }`. Uma
entrada inválida não deve lançar erro apenas por violar uma regra de negócio;
ela deve produzir evidência utilizável no relatório.

### Prática

- implemente `validateOrder` em etapas;
- faça primeiro o caso válido passar;
- libere uma regra de validação por vez;
- adicione um teste para pedido nulo ou valor que não seja objeto.

### Entrega

Testes de validação verdes e mensagens que identificam o campo problemático.

## Aula 3 — Dinheiro, arrays e imutabilidade

### Recuperação ativa

1. Qual operação percorre todos os itens para produzir um único valor?
2. Como provar que uma função não alterou seu argumento?
3. Por que `0.1 + 0.2` exige cuidado em dinheiro?

### Material

Neste projeto, dinheiro é representado por inteiros em centavos. O total de um
item é `quantidade × preço unitário`; o total do pedido é a soma desses totais.
O cálculo deve ser uma função pura: mesma entrada, mesma saída, sem mutação.

### Prática

- implemente `calculateOrderTotal`;
- preveja o total manualmente antes de executar;
- cubra pedido com um item e com vários itens;
- confirme que a entrada permanece igual após o cálculo.

### Entrega

Testes de total e imutabilidade verdes.

## Aula 4 — Estado privado com closure

### Recuperação ativa

1. O que uma closure mantém acessível?
2. Por que uma variável global seria ruim para dois processamentos simultâneos?
3. O que deve acontecer quando criamos dois contadores?

### Material

O contador precisa possuir estado privado por execução. Cada chamada da função
externa cria um ambiente léxico independente; a função retornada consulta e
atualiza esse ambiente.

### Prática

- desenhe os ambientes dos contadores `first` e `second`;
- implemente `createProcessingCounter`;
- faça os dois testes de contador passarem;
- explique por que os estados não se misturam.

### Entrega

Closure funcionando e explicação escrita em até cinco linhas.

## Aula 5 — Agregação por status

### Recuperação ativa

1. Quando um objeto pode funcionar como índice?
2. Qual valor inicial cada grupo precisa possuir?
3. Como evitar código repetido para cada status?

### Material

O resumo transforma uma lista de pedidos em um objeto por status. Cada grupo
acumula quantidade de pedidos e valor total. A saída não precisa conter status
que não apareceram na entrada.

### Prática

- implemente `summarizeOrders`;
- trate lista vazia;
- adicione um teste para pedido cancelado;
- compare uma solução com loop e uma com `reduce`, sem trocar apenas por estilo.

### Entrega

Resumo verde e justificativa da estrutura escolhida.

## Aula 6 — Pipeline de processamento

### Recuperação ativa

1. Qual informação de posição ajuda a corrigir um arquivo grande?
2. Por que pedidos inválidos não devem interromper todo o lote?
3. Quando o contador deve ser incrementado?

### Material

O pipeline recebe o lote, valida cada registro e cria duas saídas: pedidos
válidos e registros inválidos com índice e erros. Um dado inválido é um resultado
esperado; uma falha ao abrir ou interpretar o arquivo é um erro operacional.

### Prática

- implemente `processOrders`;
- preserve a posição original;
- incremente o contador uma vez por registro;
- rode a suíte completa.

### Entrega

As cinco funções implementadas e os 12 testes iniciais verdes.

## Aula 7 — Debugging, novos testes e refatoração

### Recuperação ativa

1. Quais comportamentos ainda não estão cobertos?
2. Qual função possui mais de uma responsabilidade?
3. Que evidência prova ausência de mutação?

### Prática

- execute os cenários de debugging em `../exercises.md`;
- crie no mínimo três testes próprios;
- refatore apenas com a suíte verde;
- execute lint e a CLI com os dois fixtures.

### Entrega

Quinze ou mais testes verdes e uma refatoração explicada.

## Aula 8 — Documentação e gate

### Recuperação ativa

Explique sem consultar:

1. o fluxo completo do arquivo até o relatório;
2. onde closure, arrays e objetos aparecem;
3. como o projeto distingue dado inválido de erro operacional;
4. por que dinheiro usa centavos;
5. quais limitações ainda existem.

### Prática

- complete a checklist de aceite;
- documente decisões e limitações no README;
- registre a retrospectiva;
- organize ao menos três commits pequenos;
- faça a demonstração final.

### Entrega

Gate apresentado com evidências, não apenas com a frase “funciona”.

