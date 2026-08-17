---
id: sql-08
title: Segurança, N+1 e operação básica
phase: 4
status: locked
estimatedHours: 10
prerequisites: [sql-07]
---

# Unidade 8 — Segurança, N+1 e operação básica

## Objetivo

Usar o banco com segurança, reconhecer N+1 e provar que dados podem ser
restaurados.

## Conteúdo

SQL injection, queries parametrizadas, least privilege, roles, views de acesso,
N+1, backup/restore, saúde do banco e critérios PostgreSQL versus documento ou
chave-valor.

## Laboratório

Crie uma role restrita, substitua um relatório N+1 por uma consulta, documente
parâmetros seguros e realize backup/restore local.

## Evidência e gate

- verificações verdes;
- payload de injection tratado como dado;
- role sem permissão destrutiva;
- N+1 identificado e corrigido;
- restore realizado em banco separado;
- decisão escrita sobre quando não usar PostgreSQL.

O gate final da fase exige explicar modelagem, transações, concorrência,
índices, planos, N+1 e injection sem depender de ORM.

