---
id: sql-01
title: Modelo relacional, tabelas e constraints
phase: 4
status: locked
estimatedHours: 7
prerequisites: [node-07]
---

# Unidade 1 — Modelo relacional, tabelas e constraints

## Objetivo

Transformar regras de negócio em tabelas que impeçam estados inválidos, mesmo
quando a aplicação falhar.

## Conteúdo

Modelo relacional, tipos, chaves primárias e estrangeiras, identidade, `UNIQUE`,
`NOT NULL`, `CHECK`, relacionamentos 1:N e N:N, normalização até 3FN em nível
prático e nomes consistentes.

## Exercícios

Modele clientes, produtos, pedidos e itens em `exercises.sql`. As verificações
exigem tabelas, relacionamentos e constraints, mas não determinam todos os nomes
internos da sua solução.

Perguntas antes do código:

1. Qual entidade possui cada dado?
2. O que nunca pode ser nulo?
3. Que duplicação deve ser impossível?
4. Qual regra pertence ao banco e qual depende do domínio?

## Evidência e gate

- diagrama ER feito por você;
- `npm run sql:test -- sql-01` verde;
- três inserções inválidas rejeitadas pelo banco;
- explicação de cardinalidade e normalização;
- justificativa de cada constraint.

Avance quando conseguir alterar uma regra do domínio sem desmontar o schema.

