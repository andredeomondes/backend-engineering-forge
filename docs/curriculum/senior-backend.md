# PARTE IV — Senior Backend Engineering Track

> Só começa depois da Definição de Pronto da seção 10 (competências técnicas
> de pleno). Não libera nenhuma fase desta parte antes disso.

A diferença central desta parte:

```text
antes (pleno):  "consigo construir este sistema"
depois (sênior): "consigo ser responsável por este sistema"
```

Senioridade não é "pleno que conhece mais frameworks". É a capacidade de:

```text
entender sistemas → projetar → implementar → medir → operar
→ proteger → escalar → diagnosticar → recuperar → evoluir
→ decidir → comunicar → liderar tecnicamente
```

Esta trilha **não** cria tecnologias novas por moda. Usa o stack já
consolidado (TypeScript, Node.js, NestJS, PostgreSQL, Redis, BullMQ/SQS,
Docker, AWS, GitHub Actions, OpenTelemetry) e o projeto já existente
(**TicketAtlas**, Fase 14) como laboratório de produção. Ferramentas novas
só entram quando resolvem um problema real da fase (ex.: k6 para load
testing) — nunca para "aumentar o currículo".

Regra obrigatória de escopo, válida para toda a Parte IV: para cada conceito
candidato a entrar aqui, perguntar *"isso desenvolve uma competência
necessária para responder por um sistema em produção?"*. Se não, não entra.
Não adicionar dezenas de bancos, frameworks, clouds ou Kubernetes avançado
sem necessidade real do projeto.

Estilo de exercício muda de direção: menos "implemente X", mais
"este sistema apresenta este sintoma — descubra a causa", "existem três
soluções possíveis — escolha uma e defenda os trade-offs", "você é
responsável por este incidente — qual sua sequência de ações". As regras
da seção 27 (contra dependência da IA) valem com força redobrada aqui: a
IA não entrega causa de incidente, arquitetura pronta ou código antes da
tentativa; pede hipóteses, plano de investigação, interpretação de métricas
e justificativa de decisões. A IA age como staff/senior mentor, não como
geradora automática de solução.

---

## Fase 15 — Performance Engineering & Node.js Profiling

### Testes de performance

- load, stress, spike, soak/endurance, breakpoint testing;
- benchmarking e baseline de performance;
- regressão de performance.

Ferramenta principal: **k6** (Artillery só com justificativa específica).

### O que medir

- RPS, throughput, concorrência;
- latência p50/p90/p95/p99 (nunca só a média);
- error rate, saturation;
- uso de CPU, memória, conexões de banco, connection pools, event loop.

Cenários realistas: PostgreSQL + Redis + filas + workers + API externa +
múltiplos usuários concorrentes — não benchmark isolado de função pura.

### Node.js profiling

- CPU profiling, heap profiling, heap snapshots;
- memory leaks, garbage collection;
- event loop lag e event loop utilization;
- flamegraphs;
- operações bloqueantes, libuv thread pool, saturation;
- worker threads, streams, backpressure;
- connection pooling, HTTP keep-alive;
- benchmark antes/depois de uma otimização.

### Método

A IA cria cenários de regressão de performance (métricas, logs, sintomas) e
**não entrega a causa**. Investigação segue: hipótese → medição → isolamento
→ correção → benchmark de confirmação.

### Gate

Devo produzir um `performance-baseline.md` para o TicketAtlas e explicar,
sem consultar solução, por que latência média isolada não basta.

---

## Fase 16 — Capacity Planning & Reliability Engineering

### Capacity planning

Responder com dados, não com achismo:

```text
Quantas req/s esse sistema suporta hoje?
Quantas instâncias precisamos?
Onde está o primeiro gargalo?
O que acontece se o tráfego aumentar 10x?
```

Cobre: concorrência máxima, limites do banco/Redis/workers, tamanho de
pool de conexões, tamanho de fila, autoscaling, estimativa de infra.

Entregável obrigatório de todo projeto avançado a partir daqui:
`capacity-plan.md`.

### Reliability patterns

- timeout, retry, exponential backoff, jitter;
- circuit breaker, bulkhead, fallback, fail-fast;
- graceful degradation, graceful shutdown, load shedding;
- rate limiting, health checks (readiness/liveness);
- idempotência e deduplicação.

Retry **não** é regra universal — exigir análise de quando retry piora uma
falha (retry storm, cascading failure). Criar cenários de ambos.

### Gate

Explicar, com um incidente simulado, por que um retry mal configurado
pode derrubar um serviço já degradado.

---

## Fase 17 — Chaos Engineering & Site Reliability Engineering (SRE)

### Failure injection (local, seguro)

Simular: PostgreSQL indisponível, Redis indisponível, worker morto, API
externa lenta/500, timeout, DNS failure, latência artificial, perda de
conexão, pool esgotado, CPU/memória sob pressão, processo morto no meio de
uma operação, mensagem duplicada/fora de ordem/poison message, fila
crescendo indefinidamente, disco cheio quando aplicável.

Objetivo: observar o comportamento real do sistema sob falha, não só ler
sobre o padrão.

### SRE

- reliability, availability, SLI, SLO, SLA, error budget, burn rate;
- MTTD, MTTR, MTBF;
- severidade de incidente, escalation, incident commander (nível conceitual);
- runbooks, postmortems sem culpa, alert fatigue.

Entregáveis obrigatórios em pelo menos um projeto avançado: `SLO.md`,
`runbook.md`, `incident-report.md`, `postmortem.md` (templates em
`docs/templates/`).

### Gate

Executo um experimento de failure injection no TicketAtlas, documento o
comportamento observado e proponho (sem implementar ainda) uma mitigação.

---

## Fase 18 — Observabilidade avançada & Debugging de produção

### Observabilidade

- structured logging, correlation ID, trace ID;
- metrics, distributed tracing, OpenTelemetry;
- CloudWatch; Prometheus/Grafana quando útil;
- RED Method, USE Method, Golden Signals;
- dashboards, alerts, metric cardinality, tracing/log sampling;
- segurança de logs: PII, secrets, tokens nunca logados.

### `assessments/production-debugging/`

Cenários simulados sem causa revelada, só sintomas: CPU alta, memory leak,
event loop bloqueado, banco saturado, pool cheio, query regressiva, Redis
lento, cache miss excessivo, worker travado, queue backlog, duplicação de
eventos, deadlocks, timeout em cascata, retry storm, dependency outage,
deploy ruim, migration problemática.

Fornecido: logs, métricas, traces, deploy recente, mudanças, sintomas,
contexto. Devo formular e testar hipóteses — a causa não é entregue.

### Gate

Diagnostico corretamente pelo menos 3 cenários de `production-debugging`
descrevendo hipótese → evidência → causa → correção → validação.

---

## Fase 19 — PostgreSQL avançado, Concorrência & Sistemas Distribuídos

### PostgreSQL avançado e database reliability

- MVCC, lock contention, deadlocks;
- optimistic vs. pessimistic locking;
- isolation anomalies: lost update, phantom reads;
- connection pool saturation e tuning;
- slow query investigation, `EXPLAIN ANALYZE`;
- index-only scans, covering indexes, partial indexes, index bloat;
- vacuum, analyze, table bloat, partitioning;
- replication, read replicas, replication lag;
- backup, restore, point-in-time recovery, failover conceitual.

### Concorrência avançada

Experimentos de concorrência real, não sequencial: dois usuários comprando
a última unidade; dois workers processando o mesmo pagamento; 1000
requisições tentando modificar o mesmo recurso.

Cobre: race conditions, atomicidade, optimistic/pessimistic concurrency,
compare-and-swap conceitual, distributed locking, fencing tokens
(conceitual), overselling, double spending, idempotency keys.

Uma solução não é considerada correta só porque funciona em execução
sequencial.

### Sistemas distribuídos

- strong vs. eventual consistency, CAP, PACELC;
- network partitions, clock skew, ordering, duplicate delivery;
- at-most-once, at-least-once, limitações de "exactly once";
- replication, quorum conceitual, leader/follower, split brain conceitual;
- distributed transactions, saga, outbox, inbox, conflict resolution.

Aplicado ao TicketAtlas: trava de assento em tempo real, transferência de
posse na revenda P2P, pagamento idempotente.

### Gate

Simulo overselling de assento no TicketAtlas, identifico a janela de race
condition e implemento a correção com teste de concorrência real (não
sequencial).

---

## Fase 20 — Mensageria avançada & Cache avançado

### Mensageria (BullMQ, SQS e laboratório Kafka)

- producer, consumer, consumer groups, retries, backoff, DLQ;
- poison message, ordering, deduplication, idempotent consumer;
- message/schema versioning, evolução de contrato, event replay;
- outbox, inbox, event contracts.

Kafka é introduzido no projeto poliglota avançado para compreender partitions,
offsets, consumer groups, retention e replay sem virar o foco da formação:

```text
NestJS API
→ PostgreSQL + transactional outbox
→ Kafka
→ consumer na linguagem escolhida
→ inbox + deduplicação
→ PostgreSQL/read model
→ OpenTelemetry
```

O laboratório exige contrato versionado, compatibilidade, idempotência,
duplicação, mensagem fora de ordem, retry, DLQ, replay, observabilidade, teste
de carga e explicação das limitações de “exactly once”. Não exige extração
prematura de microsserviços.

### Cache avançado

- cache-aside, write-through, write-behind, TTL, invalidation;
- distributed vs. local cache, cache coherence;
- cache stampede, cache penetration, cache avalanche, hot keys;
- eviction policies, stale data, cache warming.

Exercícios mostram cache causando bugs (dado stale servido após update),
não só acelerando leitura.

### Gate

Altero um evento do TicketAtlas sem quebrar consumidores antigos e demonstro o
consumer poliglota processando duplicação, retry e replay com evidências.

---

## Fase 21 — Security Engineering avançada & Supply Chain

Preserva integralmente a Fase 7 (fundamento) e aprofunda:

- threat modeling com STRIDE, abuse cases, security design review;
- tenant escape, business logic abuse;
- secret rotation, key rotation, KMS, IAM avançado, least privilege aplicado;
- session fixation, token replay, refresh token theft, credential stuffing;
- audit logs, security incident response.

### Supply chain security

- Dependabot, dependency scanning, SAST, DAST, container scanning, IaC
  scanning, SBOM, SLSA (nível conceitual);
- lockfiles, dependency pinning, GitHub Actions pinning;
- typosquatting, package takeover/hijacking, dependências comprometidas.

Análise crítica de ferramentas como `npm audit`: nem todo alerta é
vulnerabilidade explorável no contexto real da aplicação.

### Gate

Produzo um `threat-model.md` (template em `docs/templates/`) para o módulo
de revenda P2P do TicketAtlas cobrindo STRIDE e pelo menos um abuse case
de tenant escape.

---

## Fase 22 — API Engineering avançada & Zero-Downtime Engineering

### API avançada

- distributed rate limiting, idempotency keys, cursor pagination;
- API versioning e deprecation, backward compatibility;
- request cancellation, timeout, safe retry, streaming, compression;
- large payload handling;
- webhook signatures, replay protection, retries, delivery logs;
- contract testing, consumer-driven contracts.

### Zero-downtime engineering

- rolling deployments, blue/green, canary, feature flags, dark launches;
- zero-downtime deployment e database migrations;
- expand/contract migrations, mudanças backward-compatible de API/schema/evento;
- rollback, roll-forward, recuperação de migration falha.

Desafio típico: adicionar uma coluna obrigatória em tabela com milhões de
registros sem interromper produção.

### Gate

Desenho e executo (em ambiente local) uma migration expand/contract no
TicketAtlas sem downtime, documentando cada etapa.

---

## Fase 23 — Disaster Recovery, Cloud avançado & FinOps

### Disaster recovery

- backup strategy, backups automatizados, restore testing;
- RTO, RPO, point-in-time recovery;
- data corruption, service recovery, disaster runbook;
- outage regional em nível de System Design.

Regra: um backup nunca restaurado não é considerado validado — exercício
real de restore em ambiente local/staging é obrigatório.

### Cloud avançado (aprofunda a Fase 11)

IAM, KMS, VPC/subnets/NAT/security groups, ALB, autoscaling, ECS/Fargate,
RDS Multi-AZ e read replicas, ElastiCache, S3, SQS/SNS/EventBridge,
CloudWatch, Route 53, CloudFront, WAF, Secrets Manager, budgets e cost
alerts — só o necessário para projetar, publicar, proteger, operar e
otimizar. Não vira estudo para certificação.

### FinOps

Custo por requisição, custo de banco/compute/storage/logs/traces, network
egress, cache vs. banco, ECS vs. Lambda quando aplicável, RDS sizing,
autoscaling, cost anomaly, budgets, build vs. buy, performance vs. custo.

Cenário típico: "o custo mensal subiu de R$ 3.000 para R$ 10.000— descubra
por quê e proponha redução sem destruir confiabilidade."

### Gate

Produzo `disaster-recovery-plan.md` e `cost-analysis.md` para o TicketAtlas,
incluindo um teste de restore real e uma investigação de custo simulada.

---

## Fase 24 — System Design avançado, RFCs & Code Review sênior

### System Design avançado

Aumentar complexidade progressivamente: rate limiter, notification
platform, webhook delivery system, file processing pipeline, job
scheduler, marketplace, payment processing, search system, social feed,
audit platform, multi-tenant SaaS, high-volume import system.

Cada design exige: requisitos funcionais e não funcionais, escala
estimada, APIs, dados, componentes, fluxo, bottlenecks, failure modes,
trade-offs, custos, observabilidade, segurança, estratégia de evolução.

### RFCs

Além de ADRs (decisão pontual), introduzir RFCs (mudança de maior impacto).
Template: `docs/templates/rfc-template.md` — contexto, problema, objetivos,
não objetivos, requisitos, alternativas, proposta, trade-offs, impacto,
segurança, observabilidade, rollout, rollback, custos, riscos, perguntas
abertas.

Cenários de decisão: monólito modular vs. microsserviços; PostgreSQL vs.
DynamoDB; fila vs. processamento síncrono; Redis vs. banco; build vs. buy.

### Code review de nível sênior

Avaliações com problemas plantados de lógica, segurança, concorrência,
performance, banco, observabilidade, contratos, resiliência, arquitetura,
manutenibilidade, edge cases, failure modes, complexidade desnecessária.

Classificar cada problema por severidade: `blocker`, `critical`, `major`,
`minor`, `nit`.

### Gate

Escrevo um RFC completo propondo uma mudança arquitetural real no
TicketAtlas e conduzo `SIMULAR_PR` classificando ao menos 8 problemas por
severidade.

---

## Fase 25 — Liderança técnica

Competências não puramente técnicas, praticadas com exercícios concretos:

- decompor iniciativas, escrever technical proposals e RFCs;
- estimar, identificar riscos, priorizar, negociar escopo;
- comunicar dívida técnica e trade-offs para público não técnico;
- revisar código e orientar outro desenvolvedor;
- responder a incidentes e conduzir postmortems;
- decidir com informação incompleta.

Senioridade técnica exige influência, não só código.

### Gate

Conduzo `SIMULAR_TRABALHO` de ponta a ponta como responsável técnico:
decomposição, riscos, comunicação a "produto", implementação e
retrospectiva.

---

## Fase 26 — Production Engineering & Reliability Project (TicketAtlas sob pressão)

Não cria outro sistema do zero. Pega o TicketAtlas (Fase 14) e o transforma
em laboratório de produção, colocando-o sob carga progressiva:

```text
100 req/s → 500 req/s → 1.000 req/s → 5.000 req/s
```

Os números são ajustados à máquina/ambiente real — nunca uma meta
arbitrária. O objetivo é medir capacidade e achar o primeiro gargalo, não
bater um número.

Introduzir sob pressão: PostgreSQL sob concorrência, Redis, workers,
filas, API externa instável, latência, falhas, deploys, migrations,
incidentes.

### Entregáveis obrigatórios

```text
performance-baseline.md      load-test-report.md
capacity-plan.md              SLO.md
runbook.md                    incident-report.md
postmortem.md                 threat-model.md
performance-analysis.md       cost-analysis.md
architecture-rfc.md           disaster-recovery-plan.md
```

Templates de todos em `docs/templates/`.

### Gate

Apresento o TicketAtlas como se estivesse em produção real: capacidade
atual, primeiro gargalo, SLOs definidos, plano de resposta a incidente e
plano de recuperação de desastre — tudo com evidência, não opinião.

---

## Fase 27 — Cenários obrigatórios de senioridade & Gates finais

### Cenários obrigatórios

A IA deve apresentar, sem revelar a causa, situações como:

```text
Performance:   o p99 subiu de 150ms para 3s.
Banco:         PostgreSQL em 95% de CPU.
Filas:         1.000.000 de jobs atrasados.
Segurança:     um tenant observou dado de outro tenant.
Deployment:    o deploy aumentou HTTP 500 em 300%.
Dados:         migration precisa alterar tabela gigante sem downtime.
Mensageria:    preciso alterar um evento sem quebrar consumidores antigos.
Integrações:   API externa passou a responder em 20s.
Concorrência:  dois pedidos venderam a última unidade em estoque.
Custo:         a conta AWS triplicou.
Incidente:     o serviço principal caiu às 02:00 — sou o responsável.
```

Para cada um: observar → formular hipóteses → investigar → medir →
identificar causa → propor opções → escolher solução → implementar →
validar → monitorar → documentar.

### Gates de senioridade

Uma competência sênior não é considerada concluída só por ter sido
implementada. Cada gate avalia: implementação, investigação, design,
performance, segurança, operação, incident response, documentação,
decisões, trade-offs e comunicação — nunca só "os testes passaram".

Uma avaliação sênior pode apresentar um sistema já quebrado e exigir a
sequência completa acima, não só o código de correção.

### Definição de pronto — Senior Backend Engineer (competências, não cargo)

Concluir esta trilha **não garante** o cargo de sênior. Senioridade
profissional depende também de experiência real, contexto de empresa,
colaboração e responsabilidade contínua por sistemas reais. Esta definição
verifica competência técnica e comportamental, não título.

Devo conseguir:

- liderar tecnicamente uma funcionalidade ou iniciativa;
- projetar sistemas e diagnosticar produção;
- operar sistemas e analisar performance;
- definir SLOs e responder a incidentes;
- melhorar confiabilidade e identificar riscos;
- proteger sistemas (threat modeling, supply chain, tenant isolation);
- executar migrations seguras sem downtime;
- estimar capacidade e controlar custos;
- tomar decisões arquiteturais e escrever RFCs;
- revisar design e código de outra pessoa;
- orientar outro desenvolvedor;
- comunicar riscos e trade-offs para público técnico e não técnico.

---
