# Java + Spring e front — Fases 2, 4, 5 e 6

Parte da cronologia Java-first (ADR 0002). Fase 3 (SQL) segue em
[`professional-backend.md`](professional-backend.md), seção da antiga Fase 4.
Marcos do projeto em [`../../projects/02-ledgerflow/README.md`](../../projects/02-ledgerflow/README.md).

Cada fase tem: **objetivo**, **conteúdo**, **nível-alvo** (o que significa
"saber" aqui), **entrega** e **gate**. Material completo é criado só para a
unidade atual e as duas seguintes.

## Fase 2 — Java base

- **Objetivo:** escrever Java idiomático, guiado por testes, a partir do que já sabe de JS.
- **Conteúdo:** tipos primitivos e `String`; controle de fluxo; métodos; classes,
  `record`, `enum`, `interface`; encapsulamento; exceções checked e unchecked;
  `Optional`; `List`/`Set`/`Map`; Streams; generics básicos; Maven e JUnit 5.
- **Unidades:** `java-01` tipos e métodos · `java-02` classes, records e
  interfaces · `java-03` coleções e streams (prontas). Próximas: exceções e I/O,
  generics, testes com JUnit e Mockito.
- **Nível-alvo:** resolve um problema novo de coleções sem consultar exemplo; lê
  um stack trace e acha a linha do erro.
- **Entrega:** Gestão de estoque em Java.
- **Gate:** três unidades com suíte verde e reflexão.

## Fase 4 — Spring Boot: REST, JPA, validação e testes

- **Objetivo:** construir a API do LedgerFlow entendendo o que o Spring faz por baixo.
- **Conteúdo:** camadas controller/service/repository; injeção de dependência e
  beans; configuração e profiles; DTOs; Bean Validation; `ProblemDetail`; JPA
  (entidades, relacionamentos, lazy/eager, N+1); Flyway; `@Transactional` e
  isolamento; paginação; OpenAPI; JUnit + Mockito + Testcontainers.
- **Nível-alvo:** sobe uma API nova do zero sozinho; explica o ciclo de vida de
  uma requisição e de uma transação.
- **Entrega:** API Comercial e LedgerFlow M1.
- **Gate:** testes de integração verdes; transferências concorrentes não deixam
  saldo negativo.

## Fase 5 — Spring Security, Docker e deploy

- **Objetivo:** proteger a API e tirá-la da sua máquina.
- **Conteúdo:** autenticação vs. autorização; BCrypt; JWT com filtro do Spring
  Security; OAuth2/OIDC; papéis; CORS; OWASP Top 10 aplicado; Dockerfile multi-stage; Docker
  Compose com PostgreSQL; primeiro deploy.
- **Nível-alvo:** explica por que cada endpoint está ou não protegido; sobe o
  sistema do zero com um comando.
- **Entrega:** LedgerFlow M2.
- **Gate:** token inválido é recusado; `docker compose up` funciona em máquina limpa.

## Fase 6 — TypeScript e React

- **Objetivo:** construir o front do LedgerFlow consumindo a API Spring.
- **Conteúdo:** TypeScript (unidades `ts-01`–`ts-08` já prontas); componentes,
  props e estado; hooks; formulários com validação; consumo de API com estados de
  carregamento e erro; rotas protegidas; testes de componente. Vite como build.
- **Antes:** vale fazer as unidades JS opcionais 10 (destructuring) e 11
  (spread/rest), muito usadas em React.
- **Nível-alvo:** monta uma tela nova com formulário, chamada à API e tratamento
  de erro sem copiar de outra tela.
- **Entrega:** login, saldo, extrato com filtros e transferência no LedgerFlow;
  fluxo de reserva no SaaS de Agendamentos.
- **Gate:** fluxo completo de transferência pelo navegador, com erro de saldo
  insuficiente exibido corretamente.
