# Progress

## Fase 0 — Ambiente profissional e fundamentos da Web

Status: em andamento.

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

## Fase 1 — JavaScript profundo para backend

Status: todas as 27 unidades geradas (2026-07-25, a pedido do usuário, fora
do fluxo normal `PROXIMA_UNIDADE`). Unidades 1–6 concluídas; Unidade 7 ativa;
8–27 entregues e aguardando tentativa progressiva. Ritmo recomendado atual:
aproximadamente uma unidade por semana, ajustado pelo gate.

- [x] Unidade 1 — valores, tipos, operadores, coerção, igualdade (16/16 exercícios, suite verde)
- [x] Unidade 2 — controle de fluxo (16/16 exercícios, suite verde — 24/24 testes)
- [x] Unidade 3 — funções (16/16 exercícios, suite verde — 29/29 testes)
- [x] Unidade 4 — escopo léxico (16/16 exercícios, suite verde — 21/21 testes)
- [x] Unidade 5 — closures (16/16 exercícios, suite verde — 24/24 testes)
- [x] Unidade 6 — arrays e objetos (16/16 exercícios, suite verde — 24/24 testes)
- [ ] Unidade 7 — referências, mutabilidade e cópias (entregue)
- [ ] Unidade 8 — funções de alta ordem (entregue)
- [ ] Unidade 9 — map/filter/find/some/every/reduce (entregue)
- [ ] Unidade 10 — destructuring (entregue)
- [ ] Unidade 11 — spread e rest (entregue)
- [ ] Unidade 12 — tratamento de erros (entregue)
- [ ] Unidade 13 — classes e protótipos (entregue)
- [ ] Unidade 14 — this (entregue)
- [ ] Unidade 15 — iterables e generators (entregue)
- [ ] Unidade 16 — regular expressions (entregue)
- [ ] Unidade 17 — módulos ES (entregue)
- [ ] Unidade 18 — callbacks (entregue)
- [ ] Unidade 19 — promises (entregue)
- [ ] Unidade 20 — async/await (entregue)
- [ ] Unidade 21 — Promise.all/allSettled/race/any (entregue)
- [ ] Unidade 22 — erros assíncronos (entregue)
- [ ] Unidade 23 — event loop (entregue)
- [ ] Unidade 24 — JSON (entregue)
- [ ] Unidade 25 — imutabilidade (entregue)
- [ ] Unidade 26 — legibilidade, coesão e funções pequenas (entregue, split de exercícios adaptado: 6/4/2/2/2 em vez de 8/4/2/1/1, unidade é refactor-heavy)
- [ ] Unidade 27 — Big O básico (entregue, nível conceitual, não duplica a trilha DSA em `exercises/12-dsa-algorithms`)

## Fase 12 — DSA em paralelo

Status: a iniciar agora (2026-07-23), 2x/semana, sem competir com unidade/projeto atual.

Nota: doc original pede DSA sempre em TypeScript, mas Fase 2 (TS) ainda não
começou. Decisão (2026-07-23): iniciar DSA em JavaScript puro e migrar os
exercícios para TypeScript quando a Fase 2 for liberada.

- [ ] Sessão 01 — Big O básico + arrays (entregue em `exercises/12-dsa-algorithms/session-01-big-o-arrays`, aguardando tentativa)

## Fase 4 — SQL e PostgreSQL de verdade

Status: `BLOQUEADA — libera após o gate da Fase 3`. As oito unidades, o
ambiente PostgreSQL e o Projeto 4 estão preparados, mas não liberados para
estudo.

- [ ] `sql-01` — modelo relacional e constraints (preparada)
- [ ] `sql-02` — CRUD, filtros e ordenação (preparada)
- [ ] `sql-03` — joins, agregações, CTEs e views (preparada)
- [ ] `sql-04` — transações, ACID e isolamento (preparada)
- [ ] `sql-05` — concorrência, locks e deadlocks (preparada)
- [ ] `sql-06` — índices, `EXPLAIN` e performance (preparada)
- [ ] `sql-07` — migrations, seed e paginação (preparada)
- [ ] `sql-08` — segurança, N+1 e operação básica (preparada)

## Trilha paralela opcional — Polyglot Backend Engineering

Gate de liberação: Fase 9 concluída.

- Java + Spring: `BLOQUEADA — escolha permitida somente após o gate da Fase 9`
- C# + .NET: `BLOQUEADA — escolha permitida somente após o gate da Fase 9`
- Go: `BLOQUEADA — escolha permitida somente após o gate da Fase 9`
- Trilha selecionada: `NENHUMA`
- Alocação futura: 70% Forge principal / 30% trilha escolhida

O comando `SELECIONAR_TRILHA <JAVA|DOTNET|GO>` deve atualizar esta seção e a
matriz de habilidades somente depois do gate.

## Projetos progressivos

- [x] Project 01 — Order Workbench CLI (gate fechado: 12/12 testes, retro registrada, explicação oral validada em 2026-08-25)
- [ ] Project 04 — Marketplace Database Lab (material preparado; libera após `sql-08`)

---

Atualizar este arquivo a cada `PROXIMA_UNIDADE`, `AVALIAR_FASE` e
`ENCERRAR_SESSAO`.
