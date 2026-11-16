# Backend Engineering Forge — orientação para agentes

## Contexto mínimo

O Forge ensina TypeScript e Java por projetos. A sequência de prática está no
[roteiro de 180 dias](docs/curriculum/study-sessions.md): TicketAtlas com
TypeScript/Express/React e evolução em NestJS; Java em paralelo após o primeiro
fluxo web, com LedgerFlow em Spring. Inclua 20 minutos de inglês por voz
por dia e trate MuleSoft/Salesforce como extensão opcional do TicketAtlas. Automação e RAG entram no
TicketAtlas com TypeScript e em um laboratório Spring AI. Python fica para uma necessidade futura.
Prepare exercícios apenas quando a sessão se aproximar e preserve os IDs das
unidades. .NET e Go seguem opcionais por escolha do estudante.

Antes de qualquer alteração:

1. execute `git status -sb` e preserve mudanças do usuário;
2. leia `PROGRESS.md` para descobrir o estado real;
3. consulte `docs/REPOSITORY_MAP.md`;
4. abra somente os documentos indicados para a tarefa;
5. não trate arquivos planejados como conteúdo já concluído.

## Roteamento de contexto

| Necessidade | Fonte |
|---|---|
| Estado atual | `PROGRESS.md` |
| Sequência recomendada | `ROADMAP.md` |
| Competências | `SKILLS_MATRIX.md` |
| Regras de mentoria | `LEARNING_CONTRACT.md` |
| Currículo da fase | `docs/curriculum/` |
| Trilha poliglota | `docs/tracks/` |
| Projeto ativo | `projects/<projeto>/README.md` |
| Painel local | `docs/architecture/forge-web-local.md` |
| Decisões | `docs/adr/` |

Não leia toda a documentação por padrão. `BACKEND_ENGINEERING_FORGE.md` é um
índice; siga apenas os links necessários.

## Regras de progressão

- Toda unidade, fase e projeto ficam abertos. O progresso é marcado livremente no painel.
- Gate = conquista (selo ★): suíte verde + reflexão (≥30 caracteres) + confiança ≥3. Recomendado, nunca obrigatório.
- `PROGRESS.md` prevalece para o estado narrativo e de mentoria; `.forge/forge.db` para as marcações de progresso do painel.
- .NET ou Go pode ser ativada a qualquer momento, por escolha do estudante.
- Exercícios completos são preparados para a unidade atual e, no máximo, as
  duas seguintes. Para o restante, mantenha apenas catálogo, objetivo e gate.
- Não altere exercícios concluídos nem forneça soluções antes da tentativa.

## Validação

Execute conforme o escopo:

```bash
npm run test:system
npm run lint
npm run typecheck
npm run build:web
mvn -q -f exercises/13-java-core/pom.xml test   # unidades Java
git diff --check
```

Testes de exercícios futuros podem começar falhando. Não confunda isso com a
suíte de sistema, que deve permanecer verde.

