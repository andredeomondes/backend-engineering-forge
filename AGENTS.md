# Backend Engineering Forge — orientação para agentes

## Contexto mínimo

O Forge é uma formação backend-first. TypeScript, Node.js e NestJS são a stack
principal. Não antecipe frameworks, microsserviços, Kubernetes nem soluções de
exercícios, e não empurre trilhas poliglotas: elas estão abertas por escolha do
estudante.

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

- Toda unidade, fase, projeto e a trilha Java ficam abertos. O progresso é marcado livremente no painel.
- Gate = conquista (selo ★): suíte verde + reflexão (≥30 caracteres) + confiança ≥3. Recomendado, nunca obrigatório.
- `PROGRESS.md` prevalece para o estado narrativo e de mentoria; `.forge/forge.db` para as marcações de progresso do painel.
- Java, .NET ou Go pode ser ativada a qualquer momento, por escolha do estudante.
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
git diff --check
```

Testes de exercícios futuros podem começar falhando. Não confunda isso com a
suíte de sistema, que deve permanecer verde.

