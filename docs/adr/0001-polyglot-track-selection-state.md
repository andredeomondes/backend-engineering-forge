# ADR 0001 — Estado da seleção poliglota

- Status: aceita
- Data: 2026-08-16

## Contexto

O Forge Web e a CLI persistem progresso por unidade no SQLite. Eles ainda não
representam conclusão de fases, evidências de gates de fase ou matrizes de
competência. A trilha poliglota só pode ser escolhida depois do gate da Fase 9.

## Decisão

Não será criado um segundo mecanismo de progresso apenas para liberar a trilha.
Enquanto gates de fase não fizerem parte do núcleo, `PROGRESS.md` registra o
estado da escolha e `SKILLS_MATRIX.md` registra suas competências. O comando de
mentoria `SELECIONAR_TRILHA <JAVA|DOTNET|GO>` é documental e deve validar esses
arquivos.

O painel exibe as três opções como bloqueadas e não oferece seleção antecipada.

## Consequências

- nenhuma trilha pode ser ativada acidentalmente;
- Markdown continua sendo a fonte humana verificável;
- não há sincronização frágil entre SQLite e documentos;
- no futuro, um modelo único de `phase_gates` poderá ser adicionado ao núcleo;
- quando isso ocorrer, a seleção deve ser transacional, exportável e coberta por
  testes de bloqueio, exclusividade e persistência.

## Alternativas rejeitadas

- Inferir conclusão da fase analisando texto livre: frágil.
- Criar apenas uma flag `phase_9_completed`: não registra evidências do gate.
- Liberar seleção manual na interface: permite estado inválido.
