# Forge Web — Trilha RPG, missões e fim dos bloqueios

Data: 2026-11-08
Status: rascunho para aprovação

## Intenção

Hoje o painel do Forge passa sensação de desorganização: não mostra de forma
visual onde o estudante está, o que falta, quem ele está se tornando
(júnior → pleno → sênior) nem dá sensação de progresso. Os enunciados aparecem
como um bloco único de texto em fonte pixelada, difícil de ler e de entender o
que cada exercício pede.

O objetivo é fazer um **upgrade do painel 8-bit existente** (não um painel novo)
com três mudanças:

1. Uma nova tela **Trilha**: mapa em árvore, clicável, da formação inteira, com
   níveis no estilo RPG e um painel "quem você é aqui" para cada fase.
2. A tela **Unidade** reorganizada: cada exercício vira um cartão de **missão**
   com seções curtas e separadas.
3. **Fim dos bloqueios**: tudo fica aberto e o estudante marca o progresso
   livremente. Os gates deixam de ser trava e viram conquista.

Mockups aprovados como direção (em `.superpowers/brainstorm/*/content/`):
`arvore-8bit-v2.html` (Trilha) e `unidade-missoes-v1.html` (Unidade).

## Objetivos

- Ver em uma tela toda a trilha (Fases 0–27 + side quest Java) como árvore,
  com a posição atual destacada.
- Saber o nível atual no estilo RPG (ficha de personagem: classe, nível, XP,
  próximo nível).
- Clicar em qualquer fase e ver: progresso, "quem você é aqui", o que já
  consegue, o que falta nesta seção (com checkboxes) e "o que você vira".
- Marcar progresso sem nenhuma trava.
- Entender cada exercício sem ler um texto corrido: objetivo, exemplo,
  regras, armadilhas, validação e dicas, separados.

## Não objetivos

- Não gerar agora o conteúdo completo de exercícios das fases futuras. A
  regra do `AGENTS.md` de preparar exercícios só para a unidade atual + 2
  continua valendo para **conteúdo**. O que muda é só a **progressão**.
- Não mexer no Dashboard, no Pomodoro, nas revisões espaçadas nem no
  export/backup, a não ser onde dependerem de "locked".
- Não incluir as trilhas .NET e Go no mapa. A side quest mostrada é Java,
  conforme a decisão do estudante. As outras continuam existindo nos
  documentos, mas ficam fora da árvore.
- Não entregar soluções. A regra "nenhuma solução antes da tentativa"
  continua.

## Antiobjetivos (falharia mesmo funcionando)

- Perder o visual monocromático RPG. **Sem cores.** Estados são diferenciados
  por preenchimento, contorno, tracejado, padrão e animação em degraus.
- Parecer um painel genérico ou novo, desconectado do Forge atual.
- Continuar com textos longos em fonte pixelada difíceis de ler.
- Alguma tela ainda dizer "bloqueada" ou impedir uma ação por falta de gate.

## Restrições

- Stack existente: `tools/forge-web` (React + Vite + Tailwind 4, componentes
  em `src/components`, tokens em `src/globals.css` e `src/styles.css`),
  servidor Express em `tools/forge-web/server.js`, lógica em
  `tools/forge-core` (`curriculum.js`, `services.js`, `database.js` com
  SQLite em `.forge/forge.db`).
- Seguir o `ui-registry.md` (tokens, bordas de 1–2px, sem sombra, sem painel
  dentro de painel) e manter os temas claro e escuro já existentes
  (`ThemeToggle`). O monocromático vale nos dois: preto sobre branco e
  branco sobre preto.
- Roda só local (`127.0.0.1`). A árvore deve renderizar sem depender de CDN
  em tempo de execução: biblioteca instalada via npm ou SVG próprio.
- O banco já tem dados reais do estudante: qualquer mudança de schema é
  aditiva (novas tabelas/colunas com `IF NOT EXISTS`/defaults), sem perder
  progresso.
- Validação obrigatória ao final: `npm run test:system`, `npm run lint`,
  `npm run typecheck`, `npm run build:web`.

## Decisões tomadas

### Visual (decidido pelo estudante)

- Upgrade do painel atual, no estilo monocromático RPG.
- Árvore no estilo do diagrama Mermaid mostrado: caixas ligadas de cima para
  baixo, agrupadas por nível, com a side quest Java saindo da Fase 9 e
  reaparecendo na Fase 20.
- Enunciados "mais separadinhos": um cartão por exercício.

### Tipografia (decisão do Claude)

`Press Start 2P` continua em títulos, rótulos, badges, navegação e números.
Textos longos (enunciado, regras, código, exemplo, markdown do briefing)
usam uma fonte mono legível (ex.: JetBrains Mono), com tamanho de leitura
de cerca de 14px. Motivo: o enunciado todo em fonte pixelada cansa. O
estudante pode reverter.

### Progressão (decidido pelo estudante: "tudo aberto")

- Toda unidade, fase, projeto e a side quest Java ficam acessíveis.
  `setCurrentUnit` deixa de recusar unidades; `getDashboard` deixa de
  produzir `status: "locked"` para unidades, projetos, fases e trilhas.
- O gate vira **conquista**: suíte da unidade verde (+ reflexão e
  confiança, como já definido no método) concede o selo "gate fechado ★".
  Nada depende do selo para ser aberto.
- **Marcação manual conta como concluído** (decisão do Claude, após o
  estudante dizer "roda"). Uma missão marcada à mão sem teste verde aparece
  como concluída, mas com um selo distinto ("marcada · sem teste verde",
  com contorno tracejado em vez de preenchido). Quando o teste passa, vira
  o selo normal. O XP conta as duas.
- Atualizar as regras escritas para não contradizer o painel:
  `AGENTS.md` (regras de progressão), `LEARNING_CONTRACT.md` ("nenhuma fase
  avança sem gate", `PROXIMA_UNIDADE`, `SELECIONAR_TRILHA` após Fase 9),
  `ROADMAP.md` (textos "bloqueada"), `docs/tracks/POLYGLOT_BACKEND_TRACK.md`
  e o README (bloco de estado). Gates continuam descritos como
  recomendação e conquista.

### Níveis RPG (decisão do Claude, alinhada ao diagrama mostrado)

| Nível | Nome | Fases |
|---|---|---|
| LV1 | Júnior em construção | 0–3 |
| LV2 | Júnior | 4–9 |
| LV3 | Pleno | 10–14 |
| LV4 | Sênior | 15–27 |
| Side quest | Java + Spring | JAVA-01…09 (+ participação na Fase 20) |

- **Nível atual** = nível da fase da unidade em foco (`current_unit`).
- **XP (decisão do Claude)**: cada fase 0–27, exceto a 12, vale o mesmo peso,
  ou seja, 1/27 da barra. Dentro da fase, conta o % de itens concluídos
  (unidades nas fases com unidades, tópicos nas demais). Assim, terminar a
  Fase 1 não enche metade da barra. A ficha mostra "XP 7%" e o texto
  "N/M fases · K/L unidades". Java e DSA (Fase 12) têm barras próprias e
  não entram no XP principal.
- **Próximo nível** = primeira fase do nível seguinte.
- Fase 12 (DSA) aparece como nó lateral, ligado por tracejado à trilha
  principal, sem pertencer a um nível.

### Estados de conclusão (decisão do Claude)

- **Missão concluída**: teste da missão verde **ou** marcada à mão.
- **Unidade concluída**: suíte completa verde **ou** todas as missões
  concluídas (inclusive à mão, ou via "Marcar tudo"). Ao concluir, continua
  chamando `markUnitCompleted`, que agenda as revisões de 2/7/30 dias e
  alimenta `completedUnits` no Dashboard, como hoje.
- **Selo "gate fechado ★"** (só visual): suíte verde + reflexão (≥30
  caracteres) + confiança ≥3, o critério já documentado. Uma suíte verde sem
  reflexão conclui a unidade, mas não dá o selo.
- **Fase concluída**: todos os itens da fase concluídos. Fase "atual" é a
  fase da unidade em foco.

### Progresso existente e fonte da verdade (decisão do Claude)

- **Migração**: unidades com `status=completed` em `unit_progress` (JS-01 a
  JS-08) recebem todas as missões marcadas como "teste verde" na tabela
  nova, para nada que já foi feito aparecer como pendente.
- **Fase 0**: os tópicos são semeados uma vez a partir das checkboxes `[x]`
  do `PROGRESS.md`.
- Depois disso, **o banco é a fonte da verdade das marcações** do painel. O
  painel não escreve no `PROGRESS.md`. O `AGENTS.md` passa a dizer que o
  `PROGRESS.md` prevalece para o estado narrativo e de mentoria, e o
  `.forge/forge.db` para as marcações de progresso.
- A ficha mantém o aviso do README: concluir não equivale a cargo.

## Tela Trilha (nova)

Nova entrada no menu lateral, entre Unidade e Progresso: **Trilha**.

Topo: **ficha do personagem**, com classe "Backend Dev", nível atual, barra
de XP em blocos, próximo nível, fase/unidade atual e quanto falta na fase.

Corpo: **árvore** à esquerda e **painel da fase** à direita (fixo ao rolar).

- **Granularidade (decisão do Claude)**: um nó por fase, de 0 a 27, todos
  clicáveis e com conteúdo próprio, inclusive 15–27, que o mockup agrupava
  só para caber. Java fica em três nós (01–03, 04–06, 07–09) e a Fase 12
  como nó lateral. Os nós do nível Sênior podem ser mais compactos.
- Nós agrupados por nível (subgrafos LV1–LV4 + side quest Java), com o rótulo
  de cada fase: número, nome curto e mini barra de progresso em texto ou blocos.
- Estados, sem cor: concluída = preenchida; atual = invertida e piscando em
  degraus (respeitar `prefers-reduced-motion`); a fazer = só contorno;
  Java = contorno tracejado; marcado sem teste = preenchimento em padrão.
- Clique em qualquer nó abre o painel com:
  - título, nível e % concluído;
  - **Quem você é aqui** (1–2 frases);
  - **Já consegue** (itens concluídos);
  - **Falta nesta seção** (itens pendentes, com checkbox que grava na hora);
  - **O que você vira** ao terminar a fase;
  - botões "Abrir fase/unidade" e "Marcar tudo".
- Fases com várias unidades (1, 2, 3, 4, 12): itens = unidades, e cada uma
  leva à tela Unidade.
- A página Progresso atual pode continuar existindo como lista; a Trilha
  passa a ser a visão principal de jornada.

### Conteúdo "quem você é aqui"

Novo arquivo de conteúdo versionado (ex.: `docs/curriculum/trilha.yaml` ou
`.json`), lido por `forge-core`, com uma entrada por fase 0–27 e por bloco
Java (01–03, 04–06, 07–09): `nivel`, `quemVoceE`, `oQueVoceVira`. O builder
redige esse conteúdo a partir de `docs/curriculum/*.md` (seções "Gate da
fase" / "Devo:") e de `docs/tracks/JAVA_SPRING_TRACK.md`, em português, no
tom do Forge.

### Fases sem unidades (5–11, 13–27 e Java)

**Decisão do Claude:** como os documentos do currículo não seguem um formato
único, os itens **não são extraídos do Markdown por código**. O builder
escreve uma lista curada no mesmo arquivo `trilha.yaml`, com 5 a 10 itens
por fase. Esses itens são condensados de "Gate da fase / Devo:" quando a
seção existir; quando não existir, vêm de "Conteúdo" ou das subseções. Cada
item tem um `id` estável escrito no arquivo (ex.: `f05-idempotencia`). Para
Java, um item por módulo em `JAVA_SPRING_TRACK.md`. As marcações são salvas
no banco (tabela nova, ex.: `topic_checks(item_id, checked_at)`). Quando
uma fase ganhar unidades reais, ela passa a contar unidades.

## Tela Unidade (reorganizada)

Abas no topo da unidade:

1. **Briefing**: título, "por que importa para backend", duração estimada.
2. **Antes de começar**: as perguntas de hipótese, cada uma num bloco.
3. **Missões N/M**: quest log + cartão da missão (padrão ao abrir).
4. **Fechar unidade**: suíte completa, reflexão, confiança e selo do gate.

**Quest log** (coluna esquerda): exercícios agrupados pelos títulos do README
(Fundamentais, Intermediários, Debugging, Refatoração, e "Desafio
integrador", exibido como "Chefão ★"), com status por missão (não feita,
teste verde, marcada sem teste) e barra de XP da unidade.

**Cartão da missão** (direita), em seções separadas:

- cabeçalho: "Missão X de N", assinatura da função, badges (grupo, método
  exigido, status do teste);
- **Objetivo**: uma frase;
- **Exemplo**: entrada → saída lado a lado em blocos de código;
- **Regras** e **Armadilhas** em duas colunas, como listas curtas;
- **Validar**: botão "rodar teste desta missão" (já existe na API) e o
  comando equivalente copiável; checkbox "marcar como feita";
- **Dicas**: as dicas da unidade (`hints.md`, níveis 1–3), mostrando
  primeiro os trechos que citam o nome desta missão. As dicas continuam
  progressivas: revelar a 2 só depois da 1. Isso é ritmo de ajuda, não
  bloqueio de progresso.

### Fonte do conteúdo das missões

Hoje cada exercício é um item de lista no README (`N. **\`nome\`** — texto`),
e o exemplo só existe nos testes. Formato novo, opcional e aditivo: um
arquivo `missions.md` (ou `.yaml`) por unidade com, para cada exercício,
`objetivo`, `exemplo.entrada`, `exemplo.saida`, `regras[]`, `armadilhas[]` e
`usa` (método exigido). O parser em `curriculum.js` usa esse arquivo quando
ele existir. Quando não existir, cai no texto do README, dividido em frases,
dentro de um bloco legível.

**Escopo (decisão do Claude)**: o builder cria `missions.*` só para JS-09,
JS-10 e JS-11 (unidade atual + 2, a mesma regra de conteúdo do
`AGENTS.md`). As outras unidades usam o fallback do README até chegar a vez
delas. Os exemplos vêm dos casos de teste, que o estudante já pode ler no
repositório: mostram entrada e saída, nunca a implementação, então não
contam como solução.

### Correção necessária: teste por missão

Hoje o botão "rodar teste desta missão" não funciona direito. O nome
extraído do README inclui a assinatura (`doubleAll(numbers)`), enquanto os
testes se chamam `doubleAll: …`. Por isso o padrão não casa com nenhum
teste, e a execução pode terminar "verde" sem ter rodado nada. O builder
deve:
- usar só o identificador da função (antes do `(`) para montar o
  `--test-name-pattern`, ancorado no início do nome do teste;
- tratar "0 testes executados" como falha, nunca como verde;
- em unidades SQL, que não têm teste por missão, esconder o botão por missão
  e deixar só a marcação manual e a suíte completa.

## Dados e API (aditivo)

- Status por exercício: nova tabela (ex.: `exercise_progress(unit_id,
  exercise, last_result, last_run_at, manual_done, manual_at)`). Hoje
  `testUnit` com `exerciseName` grava `success:false` no nível da unidade;
  passa também a registrar o resultado real da missão nessa tabela.
- Endpoints novos (nomes sugeridos): `GET /api/trail` (ficha + árvore + itens
  por fase), `POST /api/checks` (marcar ou desmarcar um tópico ou missão).
  `GET /api/units/:id` passa a incluir `missions[]` e o status por missão.
- Remover os caminhos de "locked": `trackRequirements`, o erro em
  `setCurrentUnit`, `projects[].status` baseado em `unlockAfter` (vira
  "sugerido após X") e `listPolyglotTracks().status`. `listPhases` deixa de
  deduzir "locked" do emoji do `ROADMAP.md`. O status passa a vir do
  progresso real.
- Ajustar os testes de sistema em `tools/forge-core/*.test.js` que hoje
  afirmam bloqueio.

## Deixado para o builder

- Mermaid via npm vs. SVG/HTML próprio para a árvore, desde que fique igual
  ao mockup, funcione offline e seja clicável e acessível por teclado.
- Nomes exatos de tabelas, endpoints, arquivos e componentes.
- Layout responsivo: em telas estreitas, o painel da fase vira gaveta
  abaixo da árvore.
- Texto exato de "quem você é" e "o que você vira", dentro do tom descrito.

## Critérios de pronto

- Nenhuma tela mostra "bloqueada", e qualquer unidade pode virar foco.
- A Trilha mostra a árvore completa, a ficha com nível e XP, e o painel ao
  clicar em qualquer fase, com checkboxes que persistem depois de recarregar.
- A tela Unidade de JS-09 mostra as 16 missões em cartões com objetivo,
  exemplo, regras, armadilhas, validação e dicas.
- Monocromático nos temas claro e escuro, alinhado ao `ui-registry.md`
  (atualizado com os novos padrões: nó de árvore, ficha, cartão de missão).
- Docs de regras atualizados para "tudo aberto".
- `test:system`, `lint`, `typecheck` e `build:web` passando.
