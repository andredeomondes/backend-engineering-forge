# Roadmap

Índice completo: `BACKEND_ENGINEERING_FORGE.md`. Currículo modular em
`docs/curriculum/`. Este arquivo resume fases e a ordem recomendada; o estado detalhado
fica em `PROGRESS.md`.

O catálogo usa a numeração de fases definida no ADR 0002. A ordem
prática adotada para TypeScript e Java está no roteiro abaixo.

A sequência recomendada, os diagnósticos e os ritmos de 6, 10 e 15 horas estão nos
[níveis de competência](docs/curriculum/competency-levels.md). Veja os
[oito projetos](projects/README.md) para acompanhar as entregas.

## Ordem de estudo recomendada

Siga o [roteiro de 180 dias](docs/curriculum/study-sessions.md), começando em
`js-09` e alternando JS, TS, Node e SQL. O roteiro distribui todas as unidades de JS, TS e SQL. O primeiro fluxo é TicketAtlas
(TypeScript, Express, PostgreSQL e React). Em seguida, Java Core entra em
paralelo à evolução em NestJS e leva ao LedgerFlow com Spring Boot.
O ciclo tem 180 sessões de uma hora, incluindo inglês. A [matriz de cursos](docs/curriculum/course-matrix.md) associa as grades aos dias.
Pratique 20 minutos de inglês por voz em cada dia do roteiro. A integração
MuleSoft/Salesforce é opcional após o primeiro fluxo web. React Native, Angular
e SAP ficam para quando houver um projeto ou oportunidade que os peça.

As fases abaixo são os endereços do catálogo e do painel. O roteiro indica
quando visitar cada uma. A árvore agrupa as fases na ordem de prática, com
TicketAtlas (26) antes de Java e qualidade do fluxo web (27) depois.

## Fases 0–3 · Fundamentos

| Fase | Tema                                        | Status                              |
| ---- | ------------------------------------------- | ------------------------------------ |
| 0    | Ambiente profissional e fundamentos da Web  | 🟡 em andamento                     |
| 1    | JavaScript essencial para backend           | 🟡 unidade 9 ativa · 17 essenciais, 10 opcionais |
| 2    | Java base: tipos, OO, coleções e streams    | ⚪ disponível · 3 unidades prontas    |
| 3    | SQL e PostgreSQL de verdade                 | ⚪ disponível · 8/8 unidades prontas  |

## Fases 4–6 · Backend Java e frontend aplicado

| Fase | Tema                                        | Status                              |
| ---- | ------------------------------------------- | ------------------------------------ |
| 4    | LedgerFlow: Spring Boot, REST e PostgreSQL  | ⚪ disponível · LedgerFlow M1         |
| 5    | Spring Security, Docker e deploy            | ⚪ disponível · LedgerFlow M2         |
| 6    | TypeScript e React                          | ⚪ disponível · 8 unidades TS prontas |

## Fases 7–12 · Plataforma, Node.js, arquitetura e DSA

| Fase | Tema                                        | Status                              |
| ---- | ------------------------------------------- | ------------------------------------ |
| 7    | Redis, RabbitMQ e Kafka                     | ⚪ disponível · LedgerFlow M3         |
| 8    | Engenharia de IA aplicada (TypeScript e Java) | Planejado · TicketAtlas e laboratório Spring AI · ementa completa em `docs/curriculum/ai-engineering.md` |
| 9    | Node.js e fundamentos HTTP | ⚪ disponível · 7 unidades Node prontas |
| 10   | GCP, CI/CD e observabilidade                | ⚪ disponível · LedgerFlow M6         |
| 11   | Arquitetura, portfólio e entrevistas        | ⚪ disponível · LedgerFlow M7         |
| 12   | Estruturas de dados e algoritmos (paralelo) | 🟡 sessão 01 entregue, aguardando tentativa |

## Fases 13–25 · Engenharia avançada

Detalhe completo em `docs/curriculum/senior-backend.md` (numeração antiga 15–27;
a tabela de equivalência está no topo do documento).

| Fase | Tema                                                       | Status       |
| ---- | ------------------------------------------------------------ | ------------ |
| 13   | Performance Engineering & Profiling de JVM e Node.js          | ⚪ disponível  |
| 14   | Capacity Planning & Reliability Engineering                    | ⚪ disponível  |
| 15   | Chaos Engineering & SRE                                        | ⚪ disponível  |
| 16   | Observabilidade avançada & Debugging de produção               | ⚪ disponível  |
| 17   | PostgreSQL avançado, Concorrência & Sistemas Distribuídos      | ⚪ disponível  |
| 18   | Mensageria avançada & Cache avançado                            | ⚪ disponível  |
| 19   | Security Engineering avançada & Supply Chain                    | ⚪ disponível  |
| 20   | API Engineering avançada & Zero-Downtime Engineering             | ⚪ disponível  |
| 21   | Disaster Recovery, Cloud avançado & FinOps                      | ⚪ disponível  |
| 22   | System Design avançado, RFCs & Code Review sênior                | ⚪ disponível  |
| 23   | Liderança técnica                                               | ⚪ disponível  |
| 24   | Production Engineering & Reliability Project (LedgerFlow)        | ⚪ disponível  |
| 25   | Cenários obrigatórios de senioridade & Gates finais              | ⚪ disponível  |

## Projetos na árvore

| Fase | Tema | Status |
| ---- | ---- | ---- |
| 26 | TicketAtlas: Express, React e evolução em NestJS | Planejado · primeiro fluxo web |
| 27 | Qualidade web e integração opcional do TicketAtlas | Planejado · após o fluxo web |

## Trilhas opcionais

C# + .NET (`DOTNET-01`–`09`) e Go (`GO-01`–`09`) continuam abertas, por escolha do
estudante. Java deixou de ser opcional: virou a trilha principal (Fases 2, 4 e 5).
Detalhes em `docs/tracks/POLYGLOT_BACKEND_TRACK.md`.

## Equivalência com a numeração anterior

| Antes | Agora |
|---|---|
| 1 JavaScript profundo | 1 JavaScript essencial (U10, 11, 14–17, 24–27 opcionais) |
| 2 TypeScript | 6 TypeScript e React |
| 3 Node.js | 9 Node.js e NestJS |
| 4 SQL | 3 SQL |
| 5 Express | absorvida: conceitos REST na 4, Express como leitura na 9 |
| 6 NestJS | 9 |
| 7 Auth e segurança | 5 |
| 8 Redis e filas | 7 |
| 9 Testes | distribuída: 2 (JUnit), 4 (integração), 11 |
| 10 Arquitetura | 11 |
| 11 Docker, CI/CD, AWS | 5 (Docker) e 10 |
| 13 Full-stack / 14 TicketAtlas | TicketAtlas no roteiro de estudo, com React e evolução em NestJS |
| 15–27 Sênior | 13–25 |

Legenda: 🟢 concluída · 🟡 em andamento · ⚪ disponível/não iniciada.

Toda unidade, fase e projeto ficam abertos. O progresso é marcado livremente no painel.
Gate = conquista (selo ★): suíte verde + reflexão (≥30 caracteres) + confiança ≥3. Recomendado, nunca obrigatório.
Critérios do gate em `docs/curriculum/overview.md`, seção 4.6.
Concluir a trilha avançada desenvolve competências associadas a sênior — não
garante o cargo (ver Definição de Pronto — Senior Backend Engineer).
