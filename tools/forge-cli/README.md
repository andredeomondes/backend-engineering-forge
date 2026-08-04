# forge-cli

Interface de terminal do Backend Engineering Forge. A CLI e o painel web usam
o mesmo banco SQLite, então uma sessão registrada em qualquer uma das interfaces
aparece nas duas.

## Uso

```bash
npm run forge -- status
npm run forge -- log
npm run forge -- focus js-02
npm run forge -- test
npm run forge -- hint 1
npm run forge -- progress
npm run forge -- review
npm run forge -- next
npm run forge -- export json
npm run forge -- import .forge/exports/forge-backup.json --replace
```

## Dados

- `.forge/forge.db`: fonte oficial para progresso, sessões, dicas e revisões.
- Markdown em `exercises/`: fonte oficial do conteúdo didático.
- `.forge/exports/`: backups JSON e relatórios CSV criados pela CLI.
- `tools/forge-cli/state.json`: estado antigo, importado apenas uma vez para
  preservar compatibilidade.

O diretório `.forge/` não é versionado. Use a exportação JSON para backup e o
CSV para análise do histórico de sessões.
