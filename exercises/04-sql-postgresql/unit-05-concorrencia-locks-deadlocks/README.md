---
id: sql-05
title: Concorrência, locks e deadlocks
phase: 4
status: locked
estimatedHours: 9
prerequisites: [sql-04]
---

# Unidade 5 — Concorrência, locks e deadlocks

## Objetivo

Reproduzir uma race condition real e impedir overselling com evidência.

## Conteúdo

MVCC introdutório, row locks, `SELECT ... FOR UPDATE`, lock otimista, bloqueio,
deadlocks, ordem consistente e retry consciente.

## Laboratório

Use duas sessões `psql` para tentar vender a última unidade. Primeiro reproduza
o erro; depois implemente uma função segura e compare alternativas.

## Evidência e gate

- timeline das duas sessões;
- overselling reproduzido antes da correção;
- verificações verdes após a correção;
- deadlock provocado e explicado;
- decisão entre lock pessimista e otimista.

Avance somente com teste concorrente, não apenas sequencial.

