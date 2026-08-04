# Forge Web Local — arquitetura

## Objetivo

Oferecer uma experiência de estudo pelo navegador sem substituir o código, os
testes ou o material versionado do repositório. O sistema roda apenas em
`127.0.0.1` e não depende de conta, serviço externo ou container.

## Fontes da verdade

| Informação | Fonte |
| --- | --- |
| Aulas, enunciados e dicas | Markdown em `exercises/` |
| Implementação do aluno | `exercises.js` |
| Validação | `exercises.test.js` |
| Sessões, progresso e revisões | `.forge/forge.db` |
| Backup e portabilidade | JSON |
| Relatórios tabulares | CSV |

## Componentes

```text
React local
    │
    ▼
API Node/Express ─────── Markdown e arquivos de teste
    │
    ├─────────────── execução permitida de node --test
    │
    ▼
SQLite local
```

O executor nunca aceita um caminho arbitrário enviado pelo navegador. A unidade
é descoberta no currículo e o caminho do teste precisa permanecer dentro do
workspace e terminar em `exercises.test.js`.

## Gates e revisão

Uma unidade é concluída quando sua última suíte está verde, existe uma reflexão
de ao menos 30 caracteres e a confiança informada é 3 ou maior. A conclusão
agenda revisões em 2, 7 e 30 dias.

O nível mais alto de dica revelada é registrado para produzir uma métrica de
autonomia. Essa métrica não é nota; serve para perceber quando a ajuda está
diminuindo com a prática.

## Execução

```bash
npm run forge:web
npm run build:web
npm run typecheck
npm run test:system
```
