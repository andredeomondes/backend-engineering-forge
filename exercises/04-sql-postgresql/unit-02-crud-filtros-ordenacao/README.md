---
id: sql-02
title: CRUD, filtros e ordenação
phase: 4
status: locked
estimatedHours: 6
prerequisites: [sql-01]
---

# Unidade 2 — CRUD, filtros e ordenação

## Objetivo

Consultar e modificar dados explicitamente, prevendo resultado e quantidade de
linhas afetadas.

## Conteúdo

`INSERT`, `SELECT`, `UPDATE`, `DELETE`, `RETURNING`, aliases, `WHERE`, `IN`,
`BETWEEN`, `LIKE`/`ILIKE`, `NULL`, `ORDER BY`, `LIMIT` e determinismo.

## Laboratório

O seed é fornecido. Você cria views para consultas verificáveis e executa
alterações pedidas em `exercises.sql`.

## Evidência e gate

- verificações verdes;
- previsão escrita de três consultas;
- atualização e exclusão com filtro seguro;
- explicação de `NULL` e ordenação determinística.

Avance quando nenhuma alteração puder afetar toda a tabela por acidente.

