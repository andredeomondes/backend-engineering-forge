# Backend Engineering Forge

Formação backend-first, orientada a projetos, para desenvolver competências
profissionais com TypeScript, Node.js, NestJS, PostgreSQL, segurança, cloud e
engenharia de produção.

Este arquivo é o índice canônico da formação. O conteúdo foi dividido por
responsabilidade para que pessoas, ferramentas e agentes de IA carreguem apenas
o contexto necessário para cada tarefa.

> Concluir o Forge não concede automaticamente senioridade. Experiência real,
> responsabilidade por produção, colaboração e decisões sob ambiguidade
> continuam sendo necessárias.

## Estrutura da formação

| Parte | Escopo | Documento |
|---|---|---|
| Visão geral | identidade, princípios, estrutura e stack | [`docs/curriculum/overview.md`](docs/curriculum/overview.md) |
| Parte I | Fases 0–3 — fundamentos | [`docs/curriculum/foundations.md`](docs/curriculum/foundations.md) |
| Parte II | Fases 4–8 — backend profissional | [`docs/curriculum/professional-backend.md`](docs/curriculum/professional-backend.md) |
| Parte III | Fases 9–14 — arquitetura, produção e full-stack | [`docs/curriculum/production-backend.md`](docs/curriculum/production-backend.md) |
| Parte IV | Fases 15–27 — engenharia sênior | [`docs/curriculum/senior-backend.md`](docs/curriculum/senior-backend.md) |
| Método | sessões, gates, anotações e mentoria | [`docs/curriculum/learning-method.md`](docs/curriculum/learning-method.md) |
| Entrevistas | DSA, System Design e behavioral | [`docs/curriculum/interview-preparation.md`](docs/curriculum/interview-preparation.md) |

## Sequência principal

```text
Fases 0–8
→ Fase 9 e seu gate
→ TRILHA PARALELA OPCIONAL — Polyglot Backend Engineering
→ Fases 10–27 continuam como formação principal
```

A trilha poliglota não substitui nem renumera nenhuma fase. Depois do gate da
Fase 9, o estudante pode escolher exatamente uma opção inicial:

- Java com Spring;
- C# com .NET;
- Go para backend.

Distribuição após a escolha: aproximadamente 70% do tempo no Forge principal e
30% na especialização escolhida. As três opções começam como
`BLOQUEADA — escolha permitida somente após o gate da Fase 9`.

Regras, seleção e integração: [`docs/tracks/POLYGLOT_BACKEND_TRACK.md`](docs/tracks/POLYGLOT_BACKEND_TRACK.md).

## Fontes de estado

- [`PROGRESS.md`](PROGRESS.md): estado atual e trilha selecionada.
- [`ROADMAP.md`](ROADMAP.md): sequência, gates e bloqueios.
- [`SKILLS_MATRIX.md`](SKILLS_MATRIX.md): competências demonstradas.
- [`LEARNING_CONTRACT.md`](LEARNING_CONTRACT.md): regras e comandos de mentoria.

O currículo descreve o que existe e seus critérios. Ele não deve copiar o
estado atual desses arquivos.

## Projetos

Os projetos 1–8 desenvolvem capacidades progressivas. A partir do Projeto 9,
o TicketAtlas torna-se o sistema contínuo da formação:

```text
Projeto 9  → backend modular do TicketAtlas
Projeto 10 → deploy, CI/CD e observabilidade
Projeto 11 → painel administrativo full-stack
Fase 14    → experiência completa, assentos, checkout e revenda
Fases 15–27 → laboratório de produção e confiabilidade
Fase 20    → consumer Kafka na linguagem poliglota escolhida
```

Projetos são catalogados antecipadamente, mas seus arquivos completos são
materializados somente perto da liberação. O Projeto 1 é a exceção atual por
estar próximo do foco de estudo.

## Navegação rápida

- Índice documental: [`docs/README.md`](docs/README.md)
- Mapa do repositório: [`docs/REPOSITORY_MAP.md`](docs/REPOSITORY_MAP.md)
- Painel local: [`docs/architecture/forge-web-local.md`](docs/architecture/forge-web-local.md)
- Projeto atual: [`projects/01-order-workbench-cli/README.md`](projects/01-order-workbench-cli/README.md)
- ADRs: [`docs/adr/README.md`](docs/adr/README.md)
