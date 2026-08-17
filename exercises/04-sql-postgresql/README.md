---
id: phase-04-sql-postgresql
title: Fase 4 — SQL e PostgreSQL de verdade
phase: 4
status: locked
unlockAfter: node-07
estimatedHours: 64
---

# Fase 4 — SQL e PostgreSQL de verdade

Estado: `BLOQUEADA — libera após o gate da Fase 3`.

Esta fase ensina banco relacional antes de ORM. O material está preparado, mas
não deve competir com a Unidade 5 atual.

## Unidades

| ID | Tema | Gate resumido |
|---|---|---|
| `sql-01` | Modelo relacional e constraints | schema impede estados inválidos |
| `sql-02` | CRUD, filtros e ordenação | consultas corretas e parametrizáveis |
| `sql-03` | Joins, agregações, CTEs e views | relatório sem duplicação indevida |
| `sql-04` | Transações, ACID e isolamento | operação atômica sob falha |
| `sql-05` | Concorrência, locks e deadlocks | overselling reproduzido e impedido |
| `sql-06` | Índices, `EXPLAIN` e performance | índice justificado por evidência |
| `sql-07` | Migrations, seed e paginação | evolução reproduzível e cursor estável |
| `sql-08` | Segurança, N+1 e operação | injection impedida e restore demonstrado |

## Ambiente local

Requer Docker com Compose:

```bash
npm run sql:up
npm run sql:test -- sql-01
npm run sql:down
```

`sql:down` remove também o volume local desta fase. Use-o apenas quando quiser
reiniciar completamente o laboratório.

Cada execução aplica `exercises.sql` e depois `checks.sql`. Os exercícios
começam incompletos e as verificações falham até sua implementação.

## Regras

- escreva SQL manualmente;
- não use ORM;
- preveja a saída antes de executar;
- leia a mensagem da verificação antes de pedir dica;
- use `EXPLAIN (ANALYZE, BUFFERS)` apenas em ambiente local;
- nunca copie uma solução sem reconstruí-la e explicá-la.

## Projeto

Depois de `sql-08`, execute o
[`Projeto 4 — Marketplace Database Lab`](../../projects/04-postgres-marketplace-lab/README.md).
