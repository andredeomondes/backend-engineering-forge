# Backend Engineering Forge

Formação backend-first, orientada a projetos, para dominar JavaScript,
TypeScript, Node.js, NestJS, PostgreSQL, segurança, cloud e engenharia
full-stack aplicada.

> Concluir esta trilha não transforma alguém automaticamente em
> desenvolvedor pleno. Senioridade também exige experiência real,
> responsabilidade em produção, colaboração e capacidade de lidar com
> problemas ambíguos. O objetivo aqui é desenvolver **competências
> técnicas e comportamentais compatíveis com um backend pleno**.

## Estratégia

```text
80% backend e engenharia de software
20% frontend para capacidade full-stack
```

Ordem macro:

```text
JavaScript → TypeScript → Node.js → HTTP → PostgreSQL/SQL
→ API com framework leve → NestJS → autenticação/autorização/segurança
→ Redis, filas e integrações → arquitetura e qualidade
→ Docker, CI/CD, AWS e observabilidade → React/Vite + integração real → Tailwind CSS
→ projeto full-stack
```

Não começamos por microsserviços, nem por Kubernetes, nem pelo frontend.

## Estrutura em partes

```text
PARTE I   — Backend Foundations              (Fases 0-3)
PARTE II  — Professional Backend Engineering (Fases 4-8)
PARTE III — Production Backend Engineering   (Fases 9-14, até Pleno + full-stack capability)
PARTE IV  — Senior Backend Engineering        (Fases 15-27, após Pleno)
```

Progressão completa: Fundamentos → Backend Engineering → Backend Pleno →
Full-stack capability (React + Vite + TanStack Query + React Hook Form +
Zod, integrado de ponta a ponta com a API NestJS; Next.js só como módulo
opcional de empregabilidade, Fase 13.6) → Production Engineering →
Reliability Engineering → Distributed Systems → Senior Backend
Engineering.

A Parte IV trata senioridade como responsabilidade por sistemas em
produção (performance, confiabilidade, segurança, sistemas distribuídos,
operação, incidentes, arquitetura, liderança técnica) — não como "mais
frameworks". Índice completo em `BACKEND_ENGINEERING_FORGE.md`. Concluir
a trilha não garante o cargo de pleno ou sênior; desenvolve as
competências técnicas e comportamentais associadas a eles — experiência
real, responsabilidade por produção e contexto de empresa continuam
necessários.

## Estado atual

O estado muda durante cada sessão e possui uma única fonte oficial:
[`PROGRESS.md`](PROGRESS.md). O README não replica a unidade ativa para evitar
informações desatualizadas.

## Trilha poliglota opcional

Depois do gate da Fase 9, será possível selecionar uma única especialização em
Java/Spring, C#/.NET ou Go. TypeScript, Node.js e NestJS continuam sendo a
formação principal, com divisão aproximada de 70%/30% depois da escolha.

As três opções estão bloqueadas e nenhuma foi selecionada. Veja
[`docs/tracks/POLYGLOT_BACKEND_TRACK.md`](docs/tracks/POLYGLOT_BACKEND_TRACK.md).

## Como rodar os testes

```bash
npm install
npm test
```

`npm test` executa somente a unidade ativa. A infraestrutura tem uma suíte
separada, que deve permanecer sempre verde:

```bash
npm run test:system
npm run test:unit -- js-02
npm run test:dsa
npm run test:all
```

## Painel web local

O Forge também pode ser usado pelo navegador, sem hospedagem ou conta:

```bash
npm run forge:web
```

Abra `http://127.0.0.1:4310`. O painel reúne a unidade atual, execução dos
testes, dicas progressivas, gates, diário, revisões e métricas. Os materiais
continuam em Markdown; progresso e sessões ficam no banco local
`.forge/forge.db`.

Para criar backups pelo terminal:

```bash
npm run forge -- export json
npm run forge -- export csv
```

## Documentos de acompanhamento

- `docs/README.md` — índice da documentação por assunto.
- `docs/REPOSITORY_MAP.md` — mapa curto para pessoas e agentes de IA.
- `ROADMAP.md` — fases completas da formação.
- `PROGRESS.md` — o que já foi liberado e concluído.
- `STUDY_LOG.md` — diário de sessões de estudo.
- `SKILLS_MATRIX.md` — estado de cada competência.
- `LEARNING_CONTRACT.md` — regras do método de estudo e da mentoria.
- `docs/architecture/forge-web-local.md` — arquitetura do painel local.

## Comandos de mentoria

Ver `LEARNING_CONTRACT.md` para a lista completa
(`INICIAR`, `PROXIMA_UNIDADE`, `SELECIONAR_TRILHA`, `REVISAR`, `DICA_1/2/3`, `MOSTRAR_SOLUCAO`,
`SIMULAR_BUG`, `SIMULAR_PR`, `AVALIAR_FASE`, `GERAR_PROJETO`, entre outros).

A especificação completa da formação está em `BACKEND_ENGINEERING_FORGE.md`.
