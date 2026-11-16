# Currículo por competências

A sequência abaixo recomenda dependências pedagógicas. O painel agrupa cada
fase uma vez. Quando um módulo aparece em mais de um nível na tabela, pratique
o recorte necessário para a entrega atual. Fases e IDs do painel
continuam como endereços para exercícios e histórico. O nível curricular mede
evidência de engenharia e pode avançar em ritmos diferentes por competência.

| Nível | Preparação e sequência de módulos | Entrega e evidência de progressão | Lacuna a trabalhar em seguida | Horas |
|---|---|---|---|---:|
| 0 · Fundamentos de computação e programação | Fases 0–3 e DSA (12). Git/Linux → processos, threads, DNS/TCP/TLS/HTTP → Java 21+, OO, records, generics, exceptions, Collections, Streams e Optional → SQL relacional. TS avançado, assincronismo e event loop por diagnóstico (material 1, 6, 9). | CLI Java; explicar Big O, corrigir erro via stack trace, reproduzir consulta com join e explicar o trajeto de uma requisição. | Contrato HTTP, persistência, identidade. | 80–110 |
| 1 · Fundamentos de desenvolvimento backend | Nível 0 → Fases 4–6. REST/OpenAPI, DI/IoC, DTO, validação, erros, paginação, JPA/Hibernate e Flyway, segurança JWT/OAuth2/OIDC, Docker, testes unitários e integração. Introdução a equivalentes em NestJS por comparação. | API Comercial e primeiros cortes do SaaS e LedgerFlow. Subir ambiente limpo, provar autorização por recurso e testar migration e consulta paginada. | Concorrência, integração externa e operação. | 150–190 |
| 2 · Engenharia backend profissional | API com testes → SQL avançado e Fase 9; partes das Fases 7, 11, 13 e 17. EXPLAIN ANALYZE, isolamento e locks, monólito modular, SOLID, padrões, DDD e portas/adaptadores sob demanda. Refatoração, contrato, webhook, jobs, cache/invalidação, rate limit, CI e profiling inicial. | SaaS com corrida de agendamento e serviço NestJS com ORM, Redis e testes de contrato. Defender o limite transacional e mostrar medição antes/depois de uma melhoria. | Falhas parciais e coordenação entre processos. | 200–255 |
| 3 · Sistemas distribuídos | Invariantes locais → Fases 7, 10, 17–18. Kafka (partições, offsets, grupos, ordenação), RabbitMQ (ack e redelivery), outbox, duplicatas, retries/backoff/DLQ, consistência eventual, Saga, CQRS e gateway quando justificados. Redis Streams/Pub/Sub, GEO, WebSocket, concorrência Java/Node, timeouts, circuit breaker, k6 e telemetria. | Plataforma de Pedidos, Logística e LedgerFlow avançado. Recuperar de falha induzida, reconciliar estado e defender um limite de serviço com números. | Capacidade, segurança operacional e recuperação. | 295–370 |
| 4 · Competências de engenharia sênior | Sistema instrumentado → Fases 13–25 e arquitetura da 11. HLD/LLD, domínio complexo, JVM/GC e event loop lag, capacidade, balanceamento, replicação/particionamento/sharding, consistência/disponibilidade, Kubernetes/GKE, GCP, IaC e segredos. SLI/SLO, incidentes, DR, ADRs, dívida técnica, revisão, estimativas e mentoria. | Capstone com deploy e rollback, relatório de carga, restore cronometrado, postmortem e defesa de arquitetura em inglês. | Experiência real com usuários, times e operação continuada. | 250–325 |

Fase 8 aplica automação e RAG no TicketAtlas e em um laboratório Java/Spring AI. Fase 12 é
transversal. Consulte o [índice](README.md) para o material de cada fase e o
[catálogo de projetos](../../projects/README.md) para as dependências entre entregas.

## Diagnóstico e mentoria

Use uma sessão por eixo conhecido. Para TS/Node, modele estados com união
discriminada e explique a ordem de execução de promises e timers. Para HTTP,
revise um contrato com paginação e autorização por recurso. Para SQL, explique
um join e demonstre como verificar a integridade após uma transação. Para Java,
modele uma regra com tipos, coleções e um teste. Em cada sessão, tente sozinho,
execute o teste ou mostre o resultado, explique a decisão em voz alta e altere
um requisito. Evidência autônoma permite seguir direto ao próximo ponto de
dificuldade. Se faltar evidência, retome a unidade correspondente do catálogo.
Comece pela tentativa já aberta de js-09 e use o Order Workbench como evidência
prévia de JavaScript.

| Passo | Atividade | Evidência |
|---|---|---|
| Learn | Ler a seção necessária da fonte oficial e prever um comportamento | Previsão explicada |
| Build | Implementar uma história e validar o caso de erro | Diff e teste |
| Review | Revisar como PR, reproduzir achados e corrigir por impacto | Achado, reprodução e correção |
| Challenge | Alterar uma regra ou induzir uma falha controlada | Resultado observado e diagnóstico |
| Ship | Rodar os checks, registrar o contrato e demonstrar a entrega | CI, comando reproduzível ou deploy |
| Reflect | Defender a decisão e seus custos de memória, latência, manutenção ou operação, sem consultar a IA | Reflexão, confiança e próximo experimento |

O gate do painel continua sendo conquista: suíte verde, reflexão com pelo
menos 30 caracteres e confiança ≥3. Para progressão recomendada, acrescente
a evidência do nível e uma defesa oral sem IA. Use o diário do painel para
tempo, reflexão e dicas. Registre o link do teste, PR, ADR ou relatório na
revisão semanal e atualize a [matriz](../../SKILLS_MATRIX.md) só após observar
a competência. O [estado narrativo](../../PROGRESS.md) registra foco e próximos
passos. Um resultado manual no painel pode coexistir com uma avaliação ainda pendente.

## Ritmos de estudo

Estimativa inicial: 975–1250 h, antes do ajuste pelo diagnóstico, incluindo
projetos, revisão e avaliações. GCP pode exigir sessões extras de operação.
A cada quatro semanas, compare horas planejadas e reais e recalcule a faixa
pelos marcos restantes.

| Ritmo | Learn e diagnóstico | Build e testes | Review, Challenge e Ship | Reflect, DSA e entrevista | Semanas de estudo |
|---|---:|---:|---:|---:|---:|
| 6 h | 1 h | 3 h | 1 h | 1 h | 163–209 |
| 10 h | 1,5 h | 5 h | 2 h | 1,5 h | 98–125 |
| 15 h | 2 h | 8 h | 3 h | 2 h | 65–84 |

Em um bloco de quatro semanas, pratique diagnóstico e inicie uma história na
primeira, implemente e teste na segunda, revise e altere um requisito na
terceira, e demonstre e replaneje na quarta. Marcos maiores atravessam vários
blocos. Use cerca de 80% do esforço de projeto em backend e operação. Dentro
das horas específicas de linguagem/framework, planeje 65% em Java/Spring e 35%
em TS/NestJS. SQL, HTTP, segurança, mensageria e observabilidade entram uma vez
como engenharia compartilhada, com comparações de implementação no projeto NestJS.
