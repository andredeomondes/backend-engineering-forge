# Projetos do Forge

Na sequência de estudo atual, comece pelo [TicketAtlas](11-ticketatlas/README.md)
e depois pratique Java/Spring no [LedgerFlow](02-ledgerflow/README.md).
O [roteiro por dias](../docs/curriculum/study-sessions.md) guia essa ordem.
O primeiro semestre concentra as entregas em TicketAtlas e LedgerFlow.
Os demais projetos ficam no catálogo para ciclos posteriores.

| Ordem sugerida | Projeto | Nível | Evidência principal |
|---|---|---|---|
| 1 | [Gestão de estoque em Java](03-java-management-cli/README.md) | 0 | Regra de estoque testada sem framework |
| 2 | [API Comercial](05-commercial-api/README.md) | 1 | REST e persistência reproduzível |
| 3 | [SaaS de Agendamentos](06-booking-saas/README.md) ★ | 1–2 | Reserva concorrente e fluxo React/Next.js |
| 4 | [Integrações Comerciais com NestJS](07-nest-integration/README.md) ★ | 2 | Integração resiliente, Redis e contrato |
| 5 | [Plataforma de Pedidos Orientada a Eventos](08-event-driven-orders/README.md) | 3 | Outbox, replay e efeito único |
| 6 | [Logística em Tempo Real](09-realtime-logistics/README.md) | 3 | Reconexão, geolocalização e carga |
| 7 | [LedgerFlow](02-ledgerflow/README.md) ★ | 1–3 | Ledger financeiro e fluxo React |
| 8 | [Production Engineering Capstone](10-production-capstone/README.md) | 4 | Operação, recuperação e análise de incidente |

As fundações do LedgerFlow podem começar junto à API Comercial. O marco
financeiro avançado vem depois de praticar processamento assíncrono. No
Capstone, evolua um dos três projetos de portfólio. Os horários dos briefs
são estimativas dos projetos e estão incluídos no [plano de estudo](../docs/curriculum/competency-levels.md).

O [Order Workbench CLI](01-order-workbench-cli/README.md) permanece como
evidência concluída. O [Marketplace Database Lab](04-postgres-marketplace-lab/README.md)
continua como laboratório compartilhado para modelagem, transações e análise de consultas.

## Rubrica por projeto

Pontue cada eixo de 0 a 2 e registre um link para a evidência. A entrega
recomendada soma pelo menos 8/10, com 2 em comportamento e confiabilidade.

| Eixo | 0 | 1 | 2 |
|---|---|---|---|
| Comportamento | Sem fluxo demonstrável | Fluxo principal demonstrado | Todos os critérios do brief demonstrados, inclusive erros |
| Confiabilidade | Sem teste executável | Testes do caminho feliz | Testes reproduzem os casos críticos e passam com ambiente limpo |
| Segurança | Sem evidência | Controles descritos | Controle relevante validado por teste ou demonstração |
| Operação | Execução depende de ajustes manuais não descritos | Instruções parciais | Outra pessoa consegue executar e inspecionar a entrega |
| Decisões e comunicação | Sem justificativa | Decisão descrita | Estudante defende alternativa, consequência e limite com evidência |

## Portfólio, entrevistas e freelancing

Prepare três repositórios demonstráveis no GitHub. O SaaS evidencia entrega
fullstack comercial, o NestJS evidencia integração profissional e o LedgerFlow
evidencia engenharia Java e consistência. Em cada README em inglês, descreva
problema, escopo, diagrama, comandos para Compose e testes, contrato OpenAPI,
ADRs, limitações e demo quando viável. Em projetos com carga medida, publique
perfil, ambiente, p95, taxa de erro e limitações. Use dados sintéticos. No
currículo e no LinkedIn, descreva o que implementou e o resultado medido com
o contexto do ensaio.

Alterne entrevistas de Java/Spring (JPA, locks e transações), Node/NestJS
(event loop, contratos e backpressure) e Software Engineer (SQL, debugging,
DSA, revisão de PR e system design). Em inglês, apresente um projeto em cinco
minutos e defenda um trade-off, uma falha e o que mediria a seguir. Use a
[preparação existente](../docs/curriculum/interview-preparation.md) para as sessões.

Para freelancing, comece com uma agenda ou catálogo de escopo pequeno.
Faça descoberta e registre escopo, exclusões, critérios de aceite, dependências
e estimativa por marco. Entregue primeiro um fluxo em homologação e combine
quem controla contas, domínio, deploy, backups e suporte. Encerre com aceite,
manual curto e estimativa de manutenção. Use o SaaS de Agendamentos como
demonstração e pratique uma solicitação de mudança com impacto em prazo e custo.
