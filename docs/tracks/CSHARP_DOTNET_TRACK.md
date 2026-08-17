# C# com .NET

Estado: `BLOQUEADA — escolha permitida somente após o gate da Fase 9`.

Padrão da trilha: versão LTS suportada do .NET no momento da liberação,
ASP.NET Core, PostgreSQL e Testcontainers. Versões e clientes externos são
confirmados na documentação oficial quando o módulo for materializado.

## `DOTNET-01` — C# moderno para quem vem de TypeScript

- **Objetivo:** escrever C# idiomático sem reproduzir TypeScript.
- **Pré-requisitos:** Fase 9 concluída e trilha .NET selecionada.
- **Conteúdo:** tipagem nominal/estrutural; classes, interfaces, records, enums; generics; collections; LINQ; nullable reference types; exceptions; imutabilidade; delegates; events; `async`/`await`.
- **Laboratório:** domínio imutável de pedidos com pipeline assíncrono e nulabilidade estrita.
- **Evidência:** código, testes e comparação com TypeScript.
- **Gate:** modelar estados válidos, explicar LINQ e evitar bloqueio indevido de tarefas.
- **Avanço:** laboratório verde e explicação autônoma.

## `DOTNET-02` — Ferramentas e projeto profissional

- **Objetivo:** estruturar solution e projetos reproduzíveis.
- **Pré-requisitos:** `DOTNET-01`.
- **Conteúdo:** .NET LTS; SDK e CLI; solution/projects; NuGet; Configuration; Options pattern; logs; debug; análise estática.
- **Laboratório:** solution com API, domínio e testes, configuração validada por ambiente.
- **Evidência:** build reproduzível e relatório de debug.
- **Gate:** warnings relevantes tratados, secrets externos e pipeline local verde.
- **Avanço:** comandos e arquitetura documentados.

## `DOTNET-03` — ASP.NET Core e APIs

- **Objetivo:** construir APIs coerentes escolhendo conscientemente Controllers ou Minimal APIs.
- **Pré-requisitos:** `DOTNET-02`.
- **Conteúdo:** Controllers e Minimal APIs; DTOs; validação; DI; middleware; filters; erros globais; REST; OpenAPI; paginação; versionamento.
- **Laboratório:** dois endpoints equivalentes para comparar estilos e manter um como padrão.
- **Evidência:** contrato OpenAPI, testes HTTP e ADR curto da escolha.
- **Gate:** pipeline de requisição explicado, validação e erros consistentes.
- **Avanço:** API testada sem regra de negócio no endpoint.

## `DOTNET-04` — Persistência

- **Objetivo:** usar EF Core sem perder compreensão de SQL e concorrência.
- **Pré-requisitos:** `DOTNET-03` e Fase 4.
- **Conteúdo:** PostgreSQL; ADO.NET conceitual; EF Core; migrations; transações; tracking/no-tracking; N+1; eager/lazy loading; concorrência otimista; Dapper/SQL direto.
- **Laboratório:** atualização concorrente com token de versão e análise de queries.
- **Evidência:** migrations, testes com banco e relatório de performance.
- **Gate:** conflito concorrente tratado e N+1 demonstrado/corrigido.
- **Avanço:** estratégia de tracking e SQL justificada.

## `DOTNET-05` — Segurança

- **Objetivo:** implementar autenticação e autorização testáveis.
- **Pré-requisitos:** `DOTNET-04` e Fase 7.
- **Conteúdo:** ASP.NET Core Authentication/Authorization; Identity quando justificado; JWT; refresh token; OAuth 2.0; OIDC; policies; claims; roles; permissions; password hashing; CSRF; CORS; comparação com Spring Security e Passport/Guards.
- **Laboratório:** autenticação com policies, ownership e rotação de token.
- **Evidência:** threat model e testes de ataques de autorização.
- **Gate:** negar por padrão, diferenciar 401/403 e defender a escolha de Identity.
- **Avanço:** revisão de segurança aprovada.

## `DOTNET-06` — Testes

- **Objetivo:** validar comportamento do domínio até a borda HTTP.
- **Pré-requisitos:** `DOTNET-05`.
- **Conteúdo:** xUnit; mocking; testes unitários e de integração; `WebApplicationFactory`; Testcontainers; PostgreSQL real; segurança; contratos.
- **Laboratório:** fluxo protegido completo com host em memória e banco real.
- **Evidência:** suíte determinística, matriz de cenários e relatório de isolamento.
- **Gate:** autenticação, autorização, contrato e transação cobertos.
- **Avanço:** suíte verde no CI.

## `DOTNET-07` — Processamento assíncrono

- **Objetivo:** operar workers e mensagens com cancelamento e idempotência.
- **Pré-requisitos:** `DOTNET-06`.
- **Conteúdo:** Tasks; thread pool; cancellation tokens; Channels; `BackgroundService`; workers; retries; idempotência; cliente Kafka estável e amplamente adotado; producer/consumer; offsets; consumer groups; DLQ; outbox/inbox.
- **Laboratório:** worker Kafka cancelável e idempotente alimentando read model.
- **Evidência:** testes de duplicação, ordem, cancelamento, retry, DLQ e replay.
- **Gate:** shutdown sem perda indevida e efeito único sob redelivery.
- **Avanço:** estratégia de entrega defendida.

## `DOTNET-08` — Produção

- **Objetivo:** publicar e observar a aplicação de forma segura.
- **Pré-requisitos:** `DOTNET-07`.
- **Conteúdo:** Docker; health checks; Configuration; secret management; logs estruturados; métricas; OpenTelemetry; profiling; CI/CD; deploy e rollback.
- **Laboratório:** ambiente containerizado com telemetria e incidente simulado.
- **Evidência:** imagem, pipeline, métricas, trace e runbook.
- **Gate:** readiness, configuração e rollback demonstrados.
- **Avanço:** operação validada.

## `DOTNET-09` — Projeto comparativo

- **Objetivo:** demonstrar autonomia e comparar .NET com NestJS.
- **Pré-requisitos:** `DOTNET-01`–`DOTNET-08`.
- **Conteúdo:** reimplementar em ASP.NET Core um módulo profissional do TicketAtlas.
- **Projeto:** API com PostgreSQL, segurança, testes, Docker, CI, logs, métricas e ADR.
- **Evidência:** relatório comparando arquitetura, DI, ORM, segurança, testes, concorrência, observabilidade, performance, produtividade e trade-offs.
- **Gate:** gate final da trilha geral e defesa de quando escolher ou evitar .NET.
- **Avanço:** trilha concluída; nova opção exige justificativa profissional.
