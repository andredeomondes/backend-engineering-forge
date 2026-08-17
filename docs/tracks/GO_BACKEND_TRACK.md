# Go para backend

Estado: `BLOQUEADA — escolha permitida somente após o gate da Fase 9`.

Padrão da trilha: versão estável suportada no momento da liberação, biblioteca
padrão primeiro, PostgreSQL com `pgx` e dependências adicionais somente quando
resolvem um problema explícito.

## `GO-01` — Go para quem vem de TypeScript

- **Objetivo:** escrever Go idiomático sem simular classes ou decorators.
- **Pré-requisitos:** Fase 9 concluída e trilha Go selecionada.
- **Conteúdo:** tipos; structs; interfaces implícitas; ponteiros; slices/maps; métodos; erros como valores; `defer`; imutabilidade por convenção; generics; packages.
- **Laboratório:** domínio de pedidos com erros explícitos, composição e ownership claro de dados.
- **Evidência:** código, testes e comparação com TypeScript.
- **Gate:** explicar interfaces implícitas, ponteiros e tratamento de erros sem abstrações artificiais.
- **Avanço:** laboratório verde e revisão idiomática.

## `GO-02` — Ferramentas e projeto profissional

- **Objetivo:** manter projeto simples, reproduzível e observável.
- **Pré-requisitos:** `GO-01`.
- **Conteúdo:** versão estável; Go modules; estrutura; `gofmt`; `go vet`; linter; build; debug; configuração; logs.
- **Laboratório:** serviço configurável com build reproduzível e análise estática.
- **Evidência:** comandos documentados e relatório de debug.
- **Gate:** formatação, vet, testes e build verdes sem secrets no código.
- **Avanço:** pipeline local reproduzível.

## `GO-03` — HTTP e APIs

- **Objetivo:** compreender HTTP usando `net/http` antes de escolher router/framework.
- **Pré-requisitos:** `GO-02`.
- **Conteúdo:** `net/http`; handlers; middleware; DTOs; validação; erros; REST; OpenAPI; paginação; versionamento; context propagation; router somente com justificativa.
- **Laboratório:** API paginada com request ID, timeout e erros consistentes.
- **Evidência:** contrato, testes HTTP e diagrama do fluxo de contexto.
- **Gate:** cancelamento propagado e nenhuma regra de domínio acoplada ao handler.
- **Avanço:** API e decisão de roteamento justificadas.

## `GO-04` — Persistência

- **Objetivo:** trabalhar com SQL explícito, pools e transações seguras.
- **Pré-requisitos:** `GO-03` e Fase 4.
- **Conteúdo:** PostgreSQL; `database/sql`; `pgx`; migrations; transações; connection pool; SQL explícito; `sqlc` quando justificado; locking; concorrência otimista; evitar ORM pesado como padrão.
- **Laboratório:** reserva concorrente com pool limitado e teste de conflito.
- **Evidência:** SQL, plano de execução, métricas do pool e testes com banco real.
- **Gate:** impedir lost update e explicar limites/pool.
- **Avanço:** estratégia de consultas defendida.

## `GO-05` — Segurança

- **Objetivo:** proteger API sem depender de framework mágico.
- **Pré-requisitos:** `GO-04` e Fase 7.
- **Conteúdo:** password hashing; JWT; refresh token; OAuth 2.0; OIDC; RBAC; permissions; middleware de autenticação; CSRF; CORS; proteção de APIs; secret management.
- **Laboratório:** autenticação, rotação de token e ownership.
- **Evidência:** threat model e testes negativos de autorização.
- **Gate:** negar por padrão, diferenciar 401/403 e não vazar secrets.
- **Avanço:** revisão de segurança aprovada.

## `GO-06` — Testes

- **Objetivo:** testar comportamento com baixo acoplamento.
- **Pré-requisitos:** `GO-05`.
- **Conteúdo:** pacote `testing`; table-driven tests; fakes/mocks quando necessários; testes HTTP e de integração; Testcontainers; PostgreSQL real; fuzz testing; contratos.
- **Laboratório:** fluxo protegido com tabelas de casos, fuzz de entrada e banco real.
- **Evidência:** suíte determinística e justificativa de cada test double.
- **Gate:** contrato, autorização, transação e entradas adversariais cobertos.
- **Avanço:** suíte verde no CI.

## `GO-07` — Concorrência e mensageria

- **Objetivo:** controlar concorrência e backpressure em consumidores idempotentes.
- **Pré-requisitos:** `GO-06`.
- **Conteúdo:** goroutines; channels; context; cancellation; worker pools; race detector; backpressure; retries; idempotência; Kafka; producer/consumer; offsets; consumer groups; DLQ; outbox/inbox.
- **Laboratório:** consumer Kafka com worker pool limitado e read model idempotente.
- **Evidência:** race detector, testes de duplicação, ordem, retry, DLQ e replay.
- **Gate:** nenhuma data race e comportamento previsível sob cancelamento/redelivery.
- **Avanço:** limites de concorrência explicados.

## `GO-08` — Produção

- **Objetivo:** entregar binário pequeno, observável e encerrado corretamente.
- **Pré-requisitos:** `GO-07`.
- **Conteúdo:** Docker; binários; cross-compilation; health checks; graceful shutdown; logs estruturados; métricas; OpenTelemetry; `pprof`; CI/CD; deploy e rollback.
- **Laboratório:** container não-root com telemetria, profiling e falha simulada.
- **Evidência:** pipeline, profiles, trace e runbook.
- **Gate:** shutdown preserva trabalho conforme contrato e regressão é diagnosticada.
- **Avanço:** operação validada.

## `GO-09` — Projeto comparativo

- **Objetivo:** demonstrar autonomia e comparar composição em Go com NestJS.
- **Pré-requisitos:** `GO-01`–`GO-08`.
- **Conteúdo:** reimplementar em Go um módulo profissional do TicketAtlas.
- **Projeto:** API com PostgreSQL, segurança, testes, Docker, CI, logs, métricas e ADR.
- **Evidência:** relatório comparando arquitetura, composição, dados, segurança, testes, concorrência, observabilidade, performance, produtividade e trade-offs.
- **Gate:** gate final da trilha geral e defesa de quando escolher ou evitar Go.
- **Avanço:** trilha concluída; nova opção exige justificativa profissional.
