# Java com Spring

Estado: `BLOQUEADA — escolha permitida somente após o gate da Fase 9`.

Padrão da trilha: JDK LTS suportado no momento da liberação, Maven como build
tool inicial, Spring Boot, PostgreSQL e Testcontainers. Versões são confirmadas
na documentação oficial quando cada módulo for materializado.

## `JAVA-01` — Java moderno para quem vem de TypeScript

- **Objetivo:** escrever Java idiomático sem reproduzir TypeScript ou abusar de orientação a objetos.
- **Pré-requisitos:** Fase 9 concluída e trilha Java selecionada.
- **Conteúdo:** tipagem nominal versus estrutural; classes, interfaces, records, enums; generics; collections; exceptions; imutabilidade; streams; `Optional`; datas; concorrência; virtual threads quando aplicável; JVM, heap, stack e garbage collection.
- **Laboratório:** modelar e processar pedidos imutáveis, comparar a solução com tipos TypeScript e observar memória/threads.
- **Evidência:** código, testes e nota comparativa “Java idiomático versus TypeScript escrito em Java”.
- **Gate:** explicar as diferenças de tipos, memória e concorrência e resolver uma alteração de domínio sem casts frágeis.
- **Avanço:** laboratório verde e explicação autônoma.

## `JAVA-02` — Ferramentas e projeto profissional

- **Objetivo:** criar e operar um projeto Java reproduzível.
- **Pré-requisitos:** `JAVA-01`.
- **Conteúdo:** JDK LTS suportado; Maven como padrão e Gradle como comparação; estrutura; dependências; profiles; configuração; logs; debug; qualidade estática.
- **Laboratório:** montar aplicação multiambiente com build, análise estática e logging estruturado.
- **Evidência:** repositório reproduzível, comandos documentados e relatório de uma sessão de debug.
- **Gate:** build limpo em máquina nova e nenhuma configuração sensível versionada.
- **Avanço:** CI local reproduz build, testes e análise.

## `JAVA-03` — Spring Boot e APIs

- **Objetivo:** implementar uma API HTTP profissional entendendo o que o Spring abstrai.
- **Pré-requisitos:** `JAVA-02` e fundamentos REST do Forge.
- **Conteúdo:** Spring Boot; controllers; DTOs; validação; DI; configuration; tratamento global de erros; REST; OpenAPI; paginação; versionamento.
- **Laboratório:** API paginada de catálogo com validação e contrato OpenAPI.
- **Evidência:** endpoints, testes HTTP, documentação e diagrama do fluxo da requisição.
- **Gate:** erros consistentes, validação de entrada e nenhum acoplamento de DTO ao domínio.
- **Avanço:** contrato testado e decisões comparadas ao NestJS.

## `JAVA-04` — Persistência

- **Objetivo:** persistir com segurança sem esconder SQL e transações atrás do ORM.
- **Pré-requisitos:** `JAVA-03` e Fase 4 do Forge.
- **Conteúdo:** PostgreSQL; JDBC conceitual; Spring Data JPA; Hibernate; migrations; transações; N+1; lazy/eager loading; locking; concorrência otimista; SQL direto.
- **Laboratório:** reserva concorrente de recurso com migration, índices e teste que reproduz conflito.
- **Evidência:** modelo, SQL analisado, teste de concorrência e relatório de queries.
- **Gate:** impedir lost update e demonstrar correção de N+1.
- **Avanço:** transação e estratégia de acesso a dados justificadas.

## `JAVA-05` — Segurança

- **Objetivo:** proteger uma API com controles verificáveis.
- **Pré-requisitos:** `JAVA-04` e Fase 7 do Forge.
- **Conteúdo:** Spring Security; authentication e authorization; security filter chain; password hashing; JWT; refresh token; OAuth 2.0; OIDC; RBAC; permissões; CSRF; CORS; proteção de APIs.
- **Laboratório:** login, rotação de refresh token e autorização por recurso.
- **Evidência:** threat model e testes de 401, 403, ownership, token reutilizado e CORS.
- **Gate:** nenhuma falha crítica de autenticação/autorização e explicação da filter chain.
- **Avanço:** revisão de segurança aprovada.

## `JAVA-06` — Testes

- **Objetivo:** criar uma estratégia equilibrada e confiável.
- **Pré-requisitos:** `JAVA-05`.
- **Conteúdo:** JUnit; Mockito; testes unitários e de integração; Testcontainers; PostgreSQL real; testes de segurança e contratos.
- **Laboratório:** testar verticalmente um fluxo protegido com banco real.
- **Evidência:** suíte determinística, matriz de cenários e justificativa dos mocks.
- **Gate:** contrato, autorização e rollback transacional cobertos sem mockar o banco de integração.
- **Avanço:** suíte verde e executável no CI.

## `JAVA-07` — Processamento assíncrono

- **Objetivo:** processar mensagens com falhas, duplicação e reexecução controladas.
- **Pré-requisitos:** `JAVA-06` e fundamentos de mensageria do Forge.
- **Conteúdo:** executors; threads e virtual threads; jobs; retries; idempotência; Spring Kafka; producer/consumer; offsets; consumer groups; DLQ; outbox e inbox.
- **Laboratório:** consumer Kafka idempotente alimentado por outbox transacional.
- **Evidência:** testes de duplicação, retry, poison message, DLQ e replay.
- **Gate:** nenhuma duplicação de efeito e offset só confirmado conforme a estratégia documentada.
- **Avanço:** falhas simuladas explicadas com evidência.

## `JAVA-08` — Produção

- **Objetivo:** empacotar, observar e operar a aplicação.
- **Pré-requisitos:** `JAVA-07`.
- **Conteúdo:** Docker; health checks; configuração externa; métricas; logs estruturados; OpenTelemetry; profiling da JVM; CI/CD; deploy e rollback.
- **Laboratório:** publicar ambiente reproduzível e investigar uma regressão simulada.
- **Evidência:** imagem não-root, pipeline, dashboard, trace e runbook de rollback.
- **Gate:** health/readiness corretos, telemetria correlacionada e rollback demonstrado.
- **Avanço:** operação validada sob falha controlada.

## `JAVA-09` — Projeto comparativo

- **Objetivo:** demonstrar autonomia e comparar escolhas arquiteturais com NestJS.
- **Pré-requisitos:** `JAVA-01`–`JAVA-08`.
- **Conteúdo:** reimplementar em Spring Boot um módulo profissional do TicketAtlas já existente em NestJS.
- **Projeto:** API com PostgreSQL, segurança, testes, Docker, CI, logs, métricas e um ADR.
- **Evidência:** aplicação e relatório sobre arquitetura, DI, ORM, segurança, testes, concorrência, observabilidade, performance, produtividade e trade-offs.
- **Gate:** gate final definido na trilha geral e defesa oral de quando escolher ou evitar Spring.
- **Avanço:** trilha concluída; outra opção continua bloqueada até justificativa profissional.
