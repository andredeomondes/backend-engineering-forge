---
id: sql-04
title: Transações, ACID e isolamento
phase: 4
status: locked
estimatedHours: 8
prerequisites: [sql-03]
---

# Unidade 4 — Transações, ACID e isolamento

## Objetivo

Garantir que operações compostas ocorram por inteiro ou não ocorram.

## Conteúdo

`BEGIN`, `COMMIT`, `ROLLBACK`, savepoints, ACID, autocommit, níveis de
isolamento e anomalias de leitura.

## Laboratório

Simule transferência entre contas e criação de pedido com baixa de estoque.
Introduza uma falha entre as etapas e prove que o estado permanece consistente.

## Evidência e gate

- verificações verdes;
- demonstração de rollback;
- tabela relacionando anomalias e níveis de isolamento;
- explicação dos limites de uma transação.

Avance quando conseguir identificar a fronteira transacional de um caso real.

