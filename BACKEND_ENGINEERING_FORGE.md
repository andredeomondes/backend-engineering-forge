# Backend Engineering Forge

Formação orientada a projetos com dois backends. A sequência de estudo começa
com TypeScript, Node, Express e React no TicketAtlas, evolui com NestJS e inclui
Java/Spring no LedgerFlow. O roteiro inclui inglês falado e uma extensão
opcional de integração com MuleSoft e Salesforce.
Siga o [Roteiro de 180 dias](docs/curriculum/study-sessions.md) no painel.

Este arquivo é o índice canônico da formação. O conteúdo foi dividido por
responsabilidade para que pessoas, ferramentas e agentes de IA carreguem apenas
o contexto necessário para cada tarefa.

> Concluir o Forge não concede automaticamente senioridade. Experiência real,
> responsabilidade por produção, colaboração e decisões sob ambiguidade
> continuam sendo necessárias.

## Estrutura da formação

Ordem e numeração atuais: [`ROADMAP.md`](ROADMAP.md) (ADR
[`0002`](docs/adr/0002-java-spring-main-stack.md)).

| Parte | Escopo | Documento |
|---|---|---|
| Níveis | diagnóstico, competências e ritmos | [Currículo por competências](docs/curriculum/competency-levels.md) |
| Parte I | Fases 0–3 — JS essencial, Java base, SQL | [`docs/curriculum/foundations.md`](docs/curriculum/foundations.md) + [`java-spring.md`](docs/curriculum/java-spring.md) |
| Parte II | Fases 4–6 — Spring Boot, segurança, deploy, React | [`docs/curriculum/java-spring.md`](docs/curriculum/java-spring.md) |
| Parte III | Fases 7–12 — mensageria, automação e RAG em TypeScript, NestJS, cloud, arquitetura, DSA | [`docs/curriculum/platform-and-ai.md`](docs/curriculum/platform-and-ai.md) |
| Parte IV | Fases 13–25 — engenharia sênior | [`docs/curriculum/senior-backend.md`](docs/curriculum/senior-backend.md) |
| Referência | conteúdo detalhado na numeração anterior | [`professional-backend.md`](docs/curriculum/professional-backend.md), [`production-backend.md`](docs/curriculum/production-backend.md) |
| Método | sessões, gates, anotações e mentoria | [`docs/curriculum/learning-method.md`](docs/curriculum/learning-method.md) |
| Entrevistas | DSA, System Design e behavioral | [`docs/curriculum/interview-preparation.md`](docs/curriculum/interview-preparation.md) |

## Sequência principal

```text
JS, TS, Node e SQL em rotação → TicketAtlas com Express, React e NestJS
→ Java Core e LedgerFlow com Spring em paralelo à prática em TypeScript
→ automação e RAG no TicketAtlas → qualidade do fluxo React web
```

Trilhas opcionais: C# + .NET e Go, abertas por escolha a qualquer momento
([`docs/tracks/POLYGLOT_BACKEND_TRACK.md`](docs/tracks/POLYGLOT_BACKEND_TRACK.md)).

## Fontes de estado

- [`PROGRESS.md`](PROGRESS.md): estado atual e trilha selecionada.
- [`ROADMAP.md`](ROADMAP.md): sequência, gates (conquistas) e disponibilidade.
- [`SKILLS_MATRIX.md`](SKILLS_MATRIX.md): competências demonstradas.
- [`LEARNING_CONTRACT.md`](LEARNING_CONTRACT.md): regras e comandos de mentoria.

O currículo descreve o que existe e seus critérios. Ele não deve copiar o
estado atual desses arquivos.

## Projetos

[Catálogo dos oito projetos, rubrica e portfólio](projects/README.md).
O LedgerFlow reúne os marcos de Java/Spring. A [auditoria](docs/curriculum/audit.md)
registra a origem da reestruturação. As [leituras por tema](docs/curriculum/resources.md)
vinculam documentação à prática.

## Navegação rápida

- Índice documental: [`docs/README.md`](docs/README.md)
- Mapa do repositório: [`docs/REPOSITORY_MAP.md`](docs/REPOSITORY_MAP.md)
- Painel local: [`docs/architecture/forge-web-local.md`](docs/architecture/forge-web-local.md)
- Projeto central: [`projects/02-ledgerflow/README.md`](projects/02-ledgerflow/README.md)
- ADRs: [`docs/adr/README.md`](docs/adr/README.md)
