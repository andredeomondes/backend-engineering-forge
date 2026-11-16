# Recursos por nível

Obrigatório significa leitura para a prática proposta. Comece pela seção
indicada e leve uma pergunta ao exercício.

| Tema | Obrigatório | Aplicação |
|---|---|---|
| Java, OO, coleções, generics, exceções, JVM | [Dev.java Learn](https://dev.java/learn/) | Resolver as unidades Java e justificar as estruturas da CLI |
| TypeScript e assincronismo | [Handbook](https://www.typescriptlang.org/docs/handbook/intro.html), [event loop do Node](https://nodejs.org/learn/asynchronous-work/event-loop-timers-and-nexttick) | Diagnóstico de narrowing e ordenação de callbacks |
| Linux, rede, Git e Big O | [Currículo de fundamentos](foundations.md), [prática DSA](interview-preparation.md) | Explicar uma requisição e comparar o custo de busca em lista e mapa |
| REST, DI, JPA, testes e segurança | [Spring Guides](https://spring.io/guides/), [Testcontainers para Java](https://docs.docker.com/guides/testcontainers-java-getting-started/), [OWASP ASVS](https://asvs.owasp.org/) | Ler guias REST, persistência e segurança; demonstrar autorização e rollback |
| SQL, isolamento e índices | [PostgreSQL EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html), [laboratório SQL](../../projects/04-postgres-marketplace-lab/README.md) | Comparar planos e registrar efeito da concorrência |
| Frontend aplicado e ambiente local | [React Learn](https://react.dev/learn), [Docker Compose](https://docs.docker.com/compose/) | Implementar fluxo com erro de API e instalar em ambiente limpo |
| NestJS, Fastify, cache e jobs | [NestJS](https://docs.nestjs.com/fundamentals.md), [adaptadores HTTP](https://github.com/nestjs/docs.nestjs.com/blob/master/content/http/performance.md), [Redis](https://redis.io/docs/latest/) | Comparar fronteiras de DI e medir política de cache |
| Kafka e RabbitMQ | [Kafka Design](https://kafka.apache.org/documentation/), [RabbitMQ](https://www.rabbitmq.com/docs) | Induzir redelivery e explicar diferenças de offset, ack, ordenação e replay |
| Telemetria, carga e pipeline | [OpenTelemetry](https://opentelemetry.io/docs/), [k6](https://grafana.com/docs/k6/latest/), [GitHub Actions](https://docs.github.com/en/actions) | Correlacionar uma falha e definir thresholds de carga |
| Cloud e sistemas distribuídos | [Cloud Run](https://docs.cloud.google.com/run/docs), [Cloud SQL](https://docs.cloud.google.com/sql/docs/postgres), [Pub/Sub](https://docs.cloud.google.com/pubsub/docs), [Kubernetes](https://kubernetes.io/docs/concepts/), [GKE](https://docs.cloud.google.com/kubernetes-engine/docs) | Comparar serviços, implantar uma revisão e praticar recuperação |
| Confiabilidade e arquitetura | [The Site Reliability Workbook](https://sre.google/workbook/table-of-contents/), [currículo sênior](senior-backend.md) | Escrever SLO, simular incidente e defender ADR e plano de capacidade |

- **Opcional, vídeo:** sugestão de pesquisa no canal Devtiro por um trecho de
  Spring Boot sobre REST, JPA ou testes. Selecionar um trecho que corresponda
  à tarefa e conferir a versão usada antes de assistir.
- **Opcional, código aberto:** [OpenTelemetry Demo](https://opentelemetry.io/docs/demo/).
  Escolha um cenário e siga apenas o trace entre dois serviços.
- **Aprofundamento, livro:** *The Site Reliability Workbook*, capítulos de SLO,
  resposta a incidentes e postmortem, no link oficial da tabela.
- **Aprofundamento, artigo técnico:** seção Design da documentação Apache Kafka
  para justificar durabilidade, consumo e ordenação no ADR do projeto de pedidos.
