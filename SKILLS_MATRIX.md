# Skills Matrix

Estados possíveis: `NÃO INICIADO`, `EM ESTUDO`, `COM AJUDA`, `AUTÔNOMO`,
`AUTÔNOMO EM PROJETO`, `CAPAZ DE REVISAR`.

Nenhuma habilidade é permanente — revisitar periodicamente.

## Fase 0 — Fundamentos da Web

| Habilidade | Estado | Última revisão |
|---|---|---|
| Terminal e processos | NÃO INICIADO | — |
| Git/GitHub | NÃO INICIADO | — |
| npm e package.json | NÃO INICIADO | — |
| HTTP (métodos, status, headers) | NÃO INICIADO | — |

## Fase 1 — JavaScript essencial

| Habilidade | Estado | Última revisão |
|---|---|---|
| Valores, tipos, operadores | EM ESTUDO | — |
| Coerção e igualdade estrita | EM ESTUDO | — |
| Closures | NÃO INICIADO | — |
| Promises / async-await | NÃO INICIADO | — |

## Fase 2 — Java base

| Habilidade | Estado | Última revisão |
|---|---|---|
| Tipos, controle de fluxo e métodos | NÃO INICIADO | — |
| Classes, records, enums e interfaces | NÃO INICIADO | — |
| Coleções e Streams | NÃO INICIADO | — |
| Maven e JUnit 5 | NÃO INICIADO | — |

## Fases 3–11 — LedgerFlow

Linhas detalhadas entram quando cada fase começar. Eixos: SQL/PostgreSQL (3),
Spring Boot + JPA (4), Spring Security + Docker (5), TypeScript + React (6),
Redis/RabbitMQ/Kafka (7), automação e RAG em TypeScript (8), NestJS (9), GCP + CI/CD +
observabilidade (10), arquitetura e entrevistas (11).

## Fase 12 — DSA

| Habilidade | Estado | Última revisão |
|---|---|---|
| Big O | NÃO INICIADO | — |

---

## Trilhas opcionais — .NET e Go

Abertas a qualquer momento, por escolha. Nenhuma selecionada. Java deixou de ser
opcional (ADR 0002) e está na Fase 2.

| Opção | Módulos | Estado | Última revisão |
|---|---|---|---|
| C# + .NET | `DOTNET-01`–`DOTNET-09` | NÃO SELECIONADA | — |
| Go | `GO-01`–`GO-09` | NÃO SELECIONADA | — |

---

## PARTE IV — Senior Backend Engineering Track (Fases 13-25)

Recomendada após a Definição de Pronto de Pleno em
`docs/curriculum/production-backend.md`. Linhas detalhadas por habilidade só são
adicionadas quando cada fase for de fato liberada — listar aqui apenas os
grandes eixos para não gerar uma matriz vazia e desatualizada.

| Eixo | Fases | Estado |
|---|---|---|
| Performance & profiling | 13 | NÃO INICIADO |
| Capacity planning & reliability patterns | 14 | NÃO INICIADO |
| Chaos engineering & SRE | 15 | NÃO INICIADO |
| Observabilidade avançada & debugging de produção | 16 | NÃO INICIADO |
| PostgreSQL avançado, concorrência & sistemas distribuídos | 17 | NÃO INICIADO |
| Mensageria avançada & cache avançado | 18 | NÃO INICIADO |
| Security engineering avançada & supply chain | 19 | NÃO INICIADO |
| API engineering avançada & zero-downtime engineering | 20 | NÃO INICIADO |
| Disaster recovery, cloud avançado & FinOps | 21 | NÃO INICIADO |
| System design avançado, RFCs & code review sênior | 22 | NÃO INICIADO |
| Liderança técnica | 23 | NÃO INICIADO |
| Production engineering project (LedgerFlow) | 24 | NÃO INICIADO |
| Gates finais de senioridade | 25 | NÃO INICIADO |

---

Atualizar via `REVIEW_SEMANA`, `PROXIMA_UNIDADE` e `AVALIAR_FASE`.

## Evidência por nível

A tabela descreve o que observar. Registre estado e data nas linhas em estudo
e vincule a evidência na revisão semanal.

| Nível | Runtime e API | Dados e integração | Qualidade e operação |
|---|---|---|---|
| 0 | Explica event loop e resolve regra Java com coleções | Modela PK/FK e escreve join | Depura stack trace e justifica custo Big O |
| 1 | Implementa e documenta REST e autorização por recurso | Aplica migration em banco limpo e explica JPA | Executa integração real e ambiente Compose |
| 2 | Compara DI e contratos Java/NestJS e refatora módulo | Mede índice, testa locking e reproduz webhook duplicado | Testa contrato, timeout e cache; publica pipeline |
| 3 | Justifica limite do monólito e canal síncrono/assíncrono | Demonstra outbox, replay, ordenação e reconciliação | Mede carga e segue trace após falha parcial |
| 4 | Defende HLD/LLD e revisa uma mudança de arquitetura | Explica capacidade, consistência e limites de escala | Opera deploy, rollback e restore; registra SLO, postmortem e plano de ação |

## Evidências ao fim do primeiro semestre

| Competência | Evidência esperada |
|---|---|
| Full-stack TypeScript | Mudar uma regra, atualizar React e testar o fluxo HTTP e SQL |
| Java/Spring | Explicar a transação e provar atomicidade sob falha e concorrência |
| CI/CD | Mostrar que Jenkins bloqueia uma entrega com teste quebrado e reproduzir rollback |
| Automação e RAG | Comparar fontes, abstenção e falhas nas duas stacks com os mesmos dados sintéticos |
| Integração opcional | Demonstrar falha, reenvio e efeito único no CRM |
| Inglês | Demonstrar os projetos e responder perguntas sobre decisões e bugs |

Depois do semestre, use entregas reais, revisão e operação repetida para
aprofundar as competências rumo a pleno.
