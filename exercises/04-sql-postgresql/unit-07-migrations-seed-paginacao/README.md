---
id: sql-07
title: Migrations, seed e paginação
phase: 4
status: locked
estimatedHours: 8
prerequisites: [sql-06]
---

# Unidade 7 — Migrations, seed e paginação

## Objetivo

Evoluir schema e dados de forma reproduzível e paginar sem perder ou repetir
registros.

## Conteúdo

Migrations incrementais, seed determinístico, mudanças compatíveis, offset e
cursor pagination, ordenação estável e cursor composto.

## Laboratório

Registre duas migrations, gere seed repetível e implemente uma view que retorna
a página posterior a um cursor `(created_at, id)`.

## Evidência e gate

- banco recriado do zero;
- seed idempotente;
- verificações verdes;
- comparação offset/cursor sob inserção concorrente;
- plano de rollback ou roll-forward.

Avance quando outra pessoa conseguir recriar seu banco apenas com os arquivos.

