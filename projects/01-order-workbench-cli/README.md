---
id: project-01-order-workbench
title: Order Workbench CLI
unlockAfter: js-06
status: planned
estimatedHours: 8
prerequisites:
  - js-01
  - js-02
  - js-03
  - js-04
  - js-05
  - js-06
---

# Order Workbench CLI

Construa uma ferramenta de terminal para importar pedidos em JSON, validar os
dados, calcular totais e gerar um resumo por status. Este projeto conecta as
seis primeiras unidades a um fluxo parecido com um pequeno serviço de backend.

O código de leitura do arquivo e da linha de comando já está preparado porque
Node.js ainda não é o objetivo pedagógico. Seu trabalho está nas regras puras em
`src/order-workbench.js`.

## Liberação

O material está preparado, mas o projeto só começa depois do gate de `js-06`.
Não interrompa a Unidade 5 para iniciá-lo antecipadamente.

## Modelo de entrada

```json
{
  "id": "order-1001",
  "status": "paid",
  "items": [
    { "sku": "BOOK-01", "quantity": 2, "unitPriceInCents": 4590 }
  ]
}
```

Status aceitos: `pending`, `paid` e `cancelled`. Valores monetários usam
centavos inteiros.

## Entregas

- leitura de um arquivo JSON informado pelo usuário;
- validação explícita dos campos de cada pedido;
- relatório por status e valor total;
- mensagens de erro úteis para arquivos e registros inválidos;
- contador de pedidos processados implementado com closure;
- testes para os caminhos felizes e, principalmente, para falhas;
- README com decisões, limitações e instruções de execução.

## Funções a implementar

1. `validateOrder` — retorna erros sem alterar a entrada;
2. `calculateOrderTotal` — calcula o total em centavos;
3. `createProcessingCounter` — mantém contagem privada com closure;
4. `summarizeOrders` — agrupa quantidade e valor por status;
5. `processOrders` — separa registros válidos e inválidos.

## Como trabalhar

```bash
npm run test:project-01
npm run project:01 -- projects/01-order-workbench-cli/fixtures/valid-orders.json
```

Comece por um único teste. Não tente implementar todas as funções na mesma
sessão. As dicas estão em `hints.md` e a checklist em
`docs/acceptance-checklist.md`.

Materiais preparados:

- [`docs/study-guide.md`](docs/study-guide.md) — roteiro de oito aulas práticas;
- [`exercises.md`](exercises.md) — exercícios de preparação, debugging e extensão;
- [`hints.md`](hints.md) — três níveis de ajuda progressiva;
- [`docs/acceptance-checklist.md`](docs/acceptance-checklist.md) — evidências do gate.

## Gate

- suíte de testes verde;
- nenhuma mutação acidental dos dados importados;
- pelo menos três cenários de falha cobertos;
- entrada original preservada;
- nenhuma operação monetária com ponto flutuante;
- retrospectiva registrada em `notes/project-retrospectives/`;
- explicação oral do fluxo completo sem consultar o código.

## Evidências

- saída da suíte de testes;
- exemplo de execução válido e inválido;
- pelo menos três commits pequenos;
- explicação de onde closures, arrays e objetos aparecem;
- retrospectiva e lista de limitações.

## Pós-entrega: repo próprio

Quando o gate acima fechar, extrair esta pasta para um repositório GitHub
isolado (portfólio), mantendo cópia aqui também. Decidido em 2026-08-04.
