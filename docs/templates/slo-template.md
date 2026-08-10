---
tags: [sre, slo]
date:
status: rascunho
related: []
---

# SLO — nome do serviço

## SLIs

Indicadores medidos (latência p95/p99, taxa de erro, disponibilidade,
throughput) e como cada um é calculado.

## SLOs

| SLI | Objetivo | Janela |
|---|---|---|
| Disponibilidade | | 30 dias |
| Latência p95 | | 30 dias |
| Taxa de erro | | 30 dias |

## Error budget

Quanto o serviço pode falhar antes de violar o SLO, e o que acontece
quando o budget se esgota (freeze de deploy, priorização de confiabilidade).

## Burn rate

Como o consumo do error budget é monitorado e em que taxa dispara alerta.

## SLA (se houver)

Compromisso externo, se diferente do SLO interno.

## Consumidores deste SLO

Quem depende deste serviço e o que espera dele.

## Revisão
