# Mapa do repositório

## Fontes oficiais

| Informação | Fonte |
|---|---|
| Estado atual | `PROGRESS.md` |
| Ordem, status e bloqueios | `ROADMAP.md` |
| Competência demonstrada | `SKILLS_MATRIX.md` |
| Regras de estudo | `LEARNING_CONTRACT.md` |
| Currículo | `docs/curriculum/` |
| Decisão arquitetural | `docs/adr/` |

O README apresenta o projeto, mas não deve repetir detalhes voláteis do
progresso.

## Responsabilidade por diretório

| Diretório | Conteúdo |
|---|---|
| `docs/` | documentação oficial e durável |
| `notes/` | anotações pessoais, erros e revisões |
| `labs/` | experimentos pequenos e descartáveis |
| `exercises/` | prática isolada, testes e dicas por unidade |
| `projects/` | aplicações progressivas e seus artefatos |
| `assessments/` | gates, entrevistas e cenários de avaliação |
| `tools/forge-core/` | descoberta de currículo, estado e regras |
| `tools/forge-cli/` | comandos locais |
| `tools/forge-web/` | interface local |

Pastas vazias não devem ser criadas apenas para completar uma árvore ideal.

## Convenções de descoberta

- IDs são estáveis: `js-05`, `ts-01`, `JAVA-01`, `project-01-order-workbench`.
- Pastas usam inglês e `kebab-case`.
- Documentos podem ser escritos em português.
- Cada unidade e projeto começa com frontmatter contendo `id`, `title`, estado,
  estimativa e condição de liberação.
- Termos pesquisáveis como `Fase 9`, `JAVA-01` e `TicketAtlas` devem aparecer
  literalmente; não invente aliases.

## Materialização progressiva

Todo o currículo pode ser catalogado. Material completo — exercícios, testes,
dicas e avaliações — é criado apenas para a unidade atual e, no máximo, as duas
seguintes. Projetos ganham estrutura completa quando se aproximam da liberação.

## Fluxo de leitura eficiente

```text
AGENTS.md
→ PROGRESS.md
→ este mapa
→ documento da fase ou projeto em escopo
→ arquivos de implementação diretamente envolvidos
```

