# Progress

Cronologia Java-first desde 2026-11-13 (ADR 0002). Nada foi apagado: IDs de
unidades e progresso no painel continuam os mesmos; mudou a ordem e a fase
de cada trilha. Tabela de equivalência em `ROADMAP.md`.

Ritmos de referência de 6, 10 e 15 h/semana e critérios por evidência em
[níveis de competência](docs/curriculum/competency-levels.md). O LedgerFlow
continua como projeto central Java a partir da Fase 4.

## Próxima sessão

Dia 1 do [roteiro de 180 dias](docs/curriculum/study-sessions.md). Retomar uma
missão de `js-09` e desenhar os dados de um chamado. TicketAtlas é o primeiro
projeto web. Java entra em paralelo depois desse primeiro fluxo e segue no
LedgerFlow. A Fase 8 prevê automação e RAG no TicketAtlas e um laboratório em Java.
Cada dia do roteiro inclui 20 minutos de inglês por voz. A integração
MuleSoft/Salesforce é uma extensão opcional planejada.

## Fase 0 — Ambiente profissional e fundamentos da Web

Status: em andamento. Itens de base estudados em paralelo, conforme o projeto
pedir (Git e HTTP antes da Fase 4).

- [ ] Terminal, processos, arquivos e permissões
- [ ] Git e GitHub (branches, commits, PRs, conflitos)
- [ ] npm e `package.json`, versionamento semântico
- [ ] Variáveis de ambiente e `.env`
- [ ] Cliente/servidor, DNS e TCP em nível conceitual
- [ ] HTTP: métodos, headers, body, status codes, cookies, JSON, CORS
- [x] Repositório criado com estrutura canônica
- [x] Lint, formatter e test runner configurados
- [x] Painel web local com SQLite, diário, testes, dicas e revisões
- [x] Testes de sistema separados dos exercícios incompletos

## Fase 1 — JavaScript essencial para backend

Status: Unidade 9 ativa. Alternar a prática de JS com TS, Node e SQL para
preparar o TicketAtlas. As opcionais continuam no repositório e podem ser feitas a qualquer
momento; não contam para o percentual da fase.

- [x] Unidade 1 — valores, tipos, operadores, coerção, igualdade (16/16, suite verde)
- [x] Unidade 2 — controle de fluxo (24/24 testes)
- [x] Unidade 3 — funções (29/29 testes)
- [x] Unidade 4 — escopo léxico (21/21 testes)
- [x] Unidade 5 — closures (24/24 testes)
- [x] Unidade 6 — arrays e objetos (24/24 testes)
- [x] Unidade 7 — referências, mutabilidade e cópias (gate concluído)
- [x] Unidade 8 — funções de alta ordem (gate concluído)
- [ ] Unidade 9 — map/filter/find/some/every/reduce (ativa)
- [ ] Unidade 12 — tratamento de erros (essencial)
- [ ] Unidade 13 — classes e protótipos (essencial)
- [ ] Unidade 18 — callbacks (essencial)
- [ ] Unidade 19 — promises (essencial)
- [ ] Unidade 20 — async/await (essencial)
- [ ] Unidade 21 — Promise.all/allSettled/race/any (essencial)
- [ ] Unidade 22 — erros assíncronos (essencial)
- [ ] Unidade 23 — event loop (essencial)

Opcionais: 10 destructuring, 11 spread/rest, 14 this, 15 iterables/generators,
16 regex, 17 módulos ES, 24 JSON, 25 imutabilidade, 26 legibilidade, 27 Big O.
Destructuring e spread aparecem de novo no React (Fase 6); vale fazer antes dela.

## Fase 2 — Java base

Status: disponível. Unidades em `exercises/13-java-core` (Maven + JUnit 5).
JDK 25 e Maven 3.9 confirmados na máquina em 2026-11-13.

- [ ] java-01 — tipos, controle de fluxo e métodos (entregue)
- [ ] java-02 — classes, records, enums e interfaces (entregue)
- [ ] java-03 — coleções e streams (entregue)

## Fase 3 — SQL e PostgreSQL de verdade

Status: disponível. Oito unidades e ambiente Docker preparados.

- [ ] `sql-01` — modelo relacional e constraints
- [ ] `sql-02` — CRUD, filtros e ordenação
- [ ] `sql-03` — joins, agregações, CTEs e views
- [ ] `sql-04` — transações, ACID e isolamento
- [ ] `sql-05` — concorrência, locks e deadlocks
- [ ] `sql-06` — índices, `EXPLAIN` e performance
- [ ] `sql-07` — migrations, seed e paginação
- [ ] `sql-08` — segurança, N+1 e operação básica

## Fases 4–11 — LedgerFlow

Status: catálogo e marcos em `projects/02-ledgerflow/README.md`. Código e
material detalhado são criados quando a fase anterior estiver perto do fim.

## Fase 6 — TypeScript (base do React)

Status: 8 unidades TS prontas em `exercises/02-typescript-core`, nenhuma iniciada.

## Fase 9 — Node.js (base do NestJS)

Status: 7 unidades Node prontas em `exercises/03-node-core`, nenhuma iniciada.

## Fase 12 — DSA em paralelo

Status: sessão 01 entregue, aguardando tentativa. Combinado: 2x/semana, em
JavaScript até a Fase 2 e depois em Java.

- [ ] Sessão 01 — Big O básico + arrays (`exercises/12-dsa-algorithms/session-01-big-o-arrays`)

## Trilhas opcionais

- C# + .NET: disponível, não selecionada
- Go: disponível, não selecionada

## Projetos progressivos

- [x] Project 01 — Order Workbench CLI (gate fechado: 12/12 testes, retro registrada, explicação oral validada em 2026-08-25)
- [ ] TicketAtlas (planejado, primeiro projeto web no roteiro)
- [ ] Project 02 — LedgerFlow (projeto Java/Spring, sugerido após `java-03`)
- [ ] Project 04 — Marketplace Database Lab (material preparado; sugerido após `sql-08`)
- Os demais projetos do [catálogo](projects/README.md) estão planejados.

---

Atualizar este arquivo a cada `PROXIMA_UNIDADE`, `AVALIAR_FASE` e
`ENCERRAR_SESSAO`.
