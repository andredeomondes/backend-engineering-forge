# ADR 0002 — Java + Spring como backend principal

- Status: aceita, complementada pelo [ADR 0003](0003-competency-levels-and-gcp.md)
- Data: 2026-11-13
- Substitui: [ADR 0001](0001-polyglot-track-selection-state.md)

## Contexto

O Forge nasceu TypeScript-first: 27 unidades de JavaScript, depois TypeScript,
Node, Express e NestJS, com Java como trilha opcional liberada só após a Fase 9.
Depois de 8 unidades concluídas, o estudante avaliou que:

- a formação estava longa demais antes de chegar a um backend real;
- as vagas que ele mira (consultorias como Stefanini e Capgemini, que atendem
  bancos, seguradoras e varejo) pedem principalmente Java + Spring, React no
  front, mensageria (Kafka/RabbitMQ), Redis, cloud e, cada vez mais, Python
  para automação e IA;
- exercícios isolados rendem menos que um projeto que cresce.

## Decisão

1. **Java + Spring vira o backend principal** (Fases 2, 4 e 5). Node/NestJS
   continua no currículo como segundo backend (Fase 9), estudado depois de
   Spring porque o modelo de módulos, DI e decorators é o mesmo.
2. **JavaScript fica reduzido ao essencial**: unidades 1–9, 12, 13 e 18–23.
   As demais permanecem no repositório como opcionais e não contam para o
   percentual da Fase 1.
3. **Projeto central LedgerFlow** (carteira digital) concentra as Fases 4–11 e
   substitui o TicketAtlas. Domínio escolhido por cobrar o que entrevistas Java
   cobram: transações ACID, concorrência, idempotência, auditoria e segurança.
4. **Python** entra na Fase 8 para automação e integração com LLM, não para
   treinar modelos. Fastify fica fora.
5. **IDs nunca mudam.** `js-*`, `ts-*`, `node-*`, `sql-*` e `dsa-*` mantêm os
   IDs e o progresso no SQLite; só a fase de cada trilha muda. Itens de tópico
   `f02`–`f27` foram reaproveitados porque não tinham marcações.
6. **.NET e Go** continuam trilhas opcionais, abertas por escolha a qualquer
   momento. A seleção continua documental (`PROGRESS.md`).

## Consequências

- Nova numeração: 0–12 na formação principal e 13–25 na trilha sênior
  (antigas 15–27). Equivalência em `ROADMAP.md`.
- `trilha.json` declara quais fases têm unidades (`units: true`) e quais
  unidades são opcionais (`optionalUnits`). O núcleo não tem mais números de
  fase fixos.
- O painel roda testes Java via Maven/Surefire (`exercises/13-java-core`).
  Requer JDK 21+ e Maven na máquina.
- Os documentos longos de currículo (`foundations.md`, `professional-backend.md`,
  `production-backend.md`, `senior-backend.md`) seguem como referência de
  conteúdo com numeração antiga; cada um tem a tabela de equivalência no topo.
- Risco: largura demais. Mitigação: cada tecnologia entra no LedgerFlow com
  um motivo e um nível-alvo definidos em `docs/curriculum/java-spring.md` e
  `docs/curriculum/platform-and-ai.md`.

## Alternativas rejeitadas

- **Repositório separado para Java:** duplicaria painel, diário e revisões.
- **TS ponta a ponta com Java depois:** mais rápido para o primeiro portfólio,
  mas desalinhado com as vagas-alvo.
- **NestJS e Spring em paralelo:** dobra o esforço sem dobrar a
  empregabilidade; os conceitos se transferem quando estudados em sequência.
