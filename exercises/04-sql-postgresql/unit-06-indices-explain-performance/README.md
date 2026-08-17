---
id: sql-06
title: Índices, EXPLAIN e performance
phase: 4
status: locked
estimatedHours: 8
prerequisites: [sql-05]
---

# Unidade 6 — Índices, `EXPLAIN` e performance

## Objetivo

Criar índices por evidência de workload, não por reflexo.

## Conteúdo

B-tree, índices simples, compostos e parciais; seletividade; ordem das colunas;
custo de escrita; `EXPLAIN (ANALYZE, BUFFERS)` e estatísticas.

## Laboratório

Analise consultas de pedidos antes e depois dos índices. Registre plano, tempo,
buffers e impacto de escrita.

## Evidência e gate

- baseline antes do índice;
- verificações de definição verdes;
- comparação dos planos;
- um índice rejeitado com justificativa;
- explicação de por que tabela pequena pode usar sequential scan.

Avance quando conseguir defender e também remover um índice.

