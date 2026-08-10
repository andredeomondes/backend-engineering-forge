---
tags: [performance, capacity]
date:
status: rascunho
related: []
---

# Capacity plan — nome do sistema

## Capacidade atual medida

RPS suportado, latência sob essa carga, ponto onde a degradação começa.
Baseado em `load-test-report.md`, não estimativa.

## Primeiro gargalo identificado

Componente que satura primeiro (CPU da API, pool de conexões do banco,
Redis, worker, thread pool) e a evidência que aponta para ele.

## Limites por componente

| Componente | Limite observado | Como foi medido |
|---|---|---|
| API (CPU/event loop) | | |
| PostgreSQL (conexões/CPU) | | |
| Redis | | |
| Workers/filas | | |

## Cenário de crescimento

O que acontece se o tráfego aumentar 2x, 5x, 10x — qual componente quebra
primeiro em cada cenário.

## Plano de scaling

Horizontal, vertical, autoscaling, mudança de arquitetura — com trade-off
de custo.

## Estimativa de infraestrutura

Instâncias/recursos necessários para o próximo patamar de tráfego.

## Revisão
