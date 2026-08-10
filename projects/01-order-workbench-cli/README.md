---
id: project-01-order-workbench
title: Order Workbench CLI
unlockAfter: js-06
status: planned
estimatedHours: 8
---

# Order Workbench CLI

Construa uma ferramenta de terminal para importar pedidos em JSON, validar os
dados, calcular totais e gerar um resumo por status. Este projeto conecta os
fundamentos das seis primeiras unidades a um fluxo parecido com um pequeno
serviço de backend.

## Entregas

- leitura de um arquivo JSON informado pelo usuário;
- validação explícita dos campos de cada pedido;
- relatório por status e valor total;
- mensagens de erro úteis para arquivos e registros inválidos;
- testes para os caminhos felizes e, principalmente, para falhas;
- README com decisões, limitações e instruções de execução.

## Gate

- suíte de testes verde;
- nenhuma mutação acidental dos dados importados;
- pelo menos três cenários de falha cobertos;
- retrospectiva registrada em `notes/project-retrospectives/`;
- explicação oral do fluxo completo sem consultar o código.

## Pós-entrega: repo próprio

Quando o gate acima fechar, extrair esta pasta para um repositório GitHub
isolado (portfólio), mantendo cópia aqui também. Decidido em 2026-08-04.
