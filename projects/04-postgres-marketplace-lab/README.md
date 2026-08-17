---
id: project-04-postgres-marketplace-lab
title: Marketplace Database Lab
unlockAfter: sql-08
status: planned
estimatedHours: 24
---

# Projeto 4 — Marketplace Database Lab

Estado: `BLOQUEADO — libera após o gate de sql-08`.

Projete o banco de um marketplace de pedidos sem ORM. O projeto consolida
modelagem, consultas, transações, concorrência, índices, migrations, segurança
e operação básica.

## Cenário

O sistema administra clientes, catálogo, estoque e pedidos. Dois compradores
podem tentar adquirir a última unidade; relatórios precisam paginar e responder
com desempenho justificável; entradas vêm de uma futura API e nunca podem ser
concatenadas ao SQL.

## Entregáveis

- modelo entidade-relacionamento;
- migrations incrementais e seed determinístico;
- constraints e relacionamentos;
- consultas de catálogo, pedidos e receita;
- transação de criação de pedido;
- teste de concorrência contra overselling;
- paginação por cursor;
- relatório de índices com `EXPLAIN (ANALYZE, BUFFERS)`;
- role de aplicação com least privilege;
- backup e restore local;
- README de decisões e limitações.

## Estrutura preparada

- [`docs/project-brief.md`](docs/project-brief.md) — requisitos e riscos;
- [`docs/acceptance-checklist.md`](docs/acceptance-checklist.md) — gate;
- [`migrations/README.md`](migrations/README.md) — convenção das migrations;
- [`queries/README.md`](queries/README.md) — catálogo de consultas;
- [`tests/README.md`](tests/README.md) — estratégia de verificação.

Nenhuma migration ou consulta de solução foi criada. Você produzirá os
artefatos depois da liberação.

## Gate

O projeto só fecha com verificações verdes, concorrência real em duas conexões,
restore demonstrado e defesa oral das decisões. Um schema que funciona apenas
em execução sequencial não passa.

