---
tags: [security, repo-hygiene]
date: 2026-08-09
status: recomendação — nada ativado automaticamente
related: []
---

# Segurança do próprio repositório — recomendações

Levantamento do estado atual (2026-08-09) e recomendações. Nada aqui foi
ativado automaticamente — ativação de proteções no GitHub (branch
protection, secret scanning, Dependabot) exige acesso às configurações do
repositório e deve ser feita conscientemente pelo dono do repositório.

## Estado atual

- Não existe pasta `.github/` — sem workflows de CI, sem
  `dependabot.yml`, sem templates de PR/issue.
- `package.json`/`package-lock.json` presentes, sem scanning automatizado
  de dependências configurado no repositório.
- Sem evidência de branch protection na branch `master` (não verificável
  via arquivos locais — checar em Settings → Branches no GitHub).

## Recomendações

### CI mínimo (GitHub Actions)

Criar `.github/workflows/ci.yml` rodando em push/PR:

- `npm ci`;
- lint (`eslint`);
- typecheck quando TypeScript entrar (Fase 2);
- `npm run test:system` e `npm run test:unit` (suítes já existentes, ver
  `README.md`).

### Dependabot

Criar `.github/dependabot.yml` com update semanal para `npm` e
`github-actions`. Baixo risco, alto valor — recomendado ativar cedo.

### Secret scanning e dependency review

Ativar em Settings → Security (recursos nativos do GitHub, sem necessidade
de arquivo no repositório):

- Secret scanning + push protection;
- Dependency graph + Dependabot alerts;
- Dependency review no PR (bloqueia merge com dependência nova
  vulnerável).

### CodeQL

Vale a pena a partir do momento em que o código de produção (Express/Nest)
começar a existir (Fase 5+). Antes disso, o retorno é baixo — a maior parte
do repositório hoje é material de estudo em JavaScript sem superfície de
ataque real.

### Proteção da branch principal

Recomendado a partir do momento em que PRs passarem a ser o fluxo padrão
(já é a prática pedida no `LEARNING_CONTRACT.md`):

- exigir PR antes de merge em `master`;
- exigir status checks (CI) passando;
- desabilitar force-push e deleção da branch.

### Prevenção de secrets em commits

- `.gitignore` já deve cobrir `.env` — confirmar antes de qualquer commit
  com credenciais reais (ex.: AWS na Fase 11);
- preferir `git-secrets` ou o próprio secret scanning do GitHub a revisão
  manual.

## Prioridade sugerida

1. `.github/dependabot.yml` (baixo esforço, sem dependência de outras fases);
2. secret scanning + push protection (configuração no GitHub, um clique);
3. CI mínimo quando o primeiro projeto com testes automatizados existir;
4. branch protection quando PRs virarem o fluxo real de trabalho;
5. CodeQL quando houver código de API real exposto (Fase 5+).

Nenhum item aqui bloqueia o andamento da formação — é preparação para
quando o repositório passar a ter mais superfície real de risco.
