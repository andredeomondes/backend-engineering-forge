<div align="center">

# ⚔️ Backend Engineering Forge

**Formação backend-first, orientada a projetos — com um painel local em estilo RPG
que transforma cada unidade, teste e revisão em progresso visível.**

![Node.js](https://img.shields.io/badge/Node.js-24-3c873a?logo=nodedotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-8-646cff?logo=vite&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-local-003b57?logo=sqlite&logoColor=white)
![Testes](https://img.shields.io/badge/suíte_de_sistema-74%2F74-5fe0a8)

JavaScript · TypeScript · Node.js · NestJS · PostgreSQL · segurança · cloud · full-stack aplicado

![Dashboard do Forge Web](docs/screenshots/dashboard.png)

</div>

> Concluir esta trilha não transforma alguém automaticamente em
> desenvolvedor pleno. Senioridade também exige experiência real,
> responsabilidade em produção, colaboração e capacidade de lidar com
> problemas ambíguos. O objetivo aqui é desenvolver **competências
> técnicas e comportamentais compatíveis com um backend pleno**.

## Sumário

- [O que é](#o-que-é)
- [O painel em imagens](#o-painel-em-imagens)
- [Estado atual](#estado-atual)
- [Como funciona uma unidade](#como-funciona-uma-unidade)
- [Como rodar](#como-rodar)
- [CLI](#cli)
- [Roadmap](#roadmap)
- [Arquitetura do painel](#arquitetura-do-painel)
- [Estrutura do repositório](#estrutura-do-repositório)
- [Stack](#stack)
- [Documentos de acompanhamento](#documentos-de-acompanhamento)
- [Créditos de arte](#créditos-de-arte)

## O que é

O Forge reúne três coisas num repositório só:

| | |
| --- | --- |
| 📚 **Currículo** | 28 fases (0–27), do JavaScript básico até confiabilidade e sistemas distribuídos. |
| 🧪 **Exercícios com testes** | Cada unidade tem aula em Markdown, um `exercises.js` para implementar e um `exercises.test.js` que valida. |
| 🗺️ **Ferramentas locais** | CLI + painel web que registram sessões, rodam testes, liberam dicas progressivas, marcam progresso e agendam revisões espaçadas. |

Estratégia de tempo e ordem macro:

```text
80% backend e engenharia de software · 20% frontend para capacidade full-stack

JavaScript → TypeScript → Node.js → HTTP → PostgreSQL/SQL
→ API com framework leve → NestJS → autenticação/autorização/segurança
→ Redis, filas e integrações → arquitetura e qualidade
→ Docker, CI/CD, AWS e observabilidade → React/Vite + integração real → Tailwind CSS
→ projeto full-stack
```

Não começamos por microsserviços, nem por Kubernetes, nem pelo frontend.

## O painel em imagens

Painel local em estilo **MMORPG clássico**: moldura de cliente de jogo,
herói em pixel art, equipamento por tecnologia e um diário de aventura.
Tudo roda em `127.0.0.1`, sem conta, sem hospedagem e sem container.

### 🗺️ Trilha — ficha do personagem e mapa da formação

Nível (LV1 Júnior em construção → LV4 Sênior), XP real da formação,
**equipamento que acende** conforme você avança em cada tecnologia, skills
com porcentagem e a árvore das 28 fases. O herói fica no nó onde você está.
Clicar numa fase abre "quem você é aqui", o que já consegue, o que falta
(com checkbox) e o que você vira.

![Trilha com ficha do personagem e árvore de fases](docs/screenshots/trail.png)

### ⚔️ Unidade — missões em cartões

Cada exercício vira uma **missão** com objetivo, exemplo de entrada → saída,
regras, armadilhas, teste só daquela missão e dicas progressivas. O quest
log mostra o status de cada uma, e o último grupo é o **chefão**, que vira
caveira quando você vence. Concluir todas as missões libera um baú.

![Unidade com quest log, chefão e cartão de missão](docs/screenshots/unit.png)

### 📊 Progresso e 🏠 Dashboard

O Dashboard mostra o foco atual, tempo registrado, autonomia, diário de
sessões, **Diário de aventura** (unidades concluídas e sessões) e exportação
JSON/CSV. O Progresso lista todas as fases por parte da formação.

![Progresso da formação](docs/screenshots/progress.png)

### 🌗 Tema claro, Pomodoro e celular

Dois temas: **Masmorra noturna** (escuro, ardósia e dourado) e
**Pergaminho** (claro). O Pomodoro flutuante registra a sessão sozinho ao
terminar e tem ruído/lo-fi embutidos. No celular, a navegação vai para a
barra inferior.

| Tema claro · Pergaminho | Pomodoro aberto |
| --- | --- |
| ![Trilha no tema claro](docs/screenshots/trail-light.png) | ![Pomodoro flutuante](docs/screenshots/pomodoro.png) |

<p align="center">
  <img src="docs/screenshots/mobile-dashboard.png" alt="Dashboard no celular" width="260">
  &nbsp;&nbsp;
  <img src="docs/screenshots/mobile-trail.png" alt="Ficha do personagem no celular" width="260">
</p>

**Detalhes que fazem diferença:**

- 🔓 **Sem travas:** toda unidade, fase, projeto e a trilha Java ficam
  abertos. O progresso é marcado livremente.
- ★ **Gate = conquista:** suíte verde + reflexão (≥ 30 caracteres) +
  confiança ≥ 3 rende um selo. Recomendado, nunca obrigatório.
- ✅ **Missão marcada à mão** conta como feita, mas aparece como
  "marcada · sem teste verde", para você saber o que não foi validado.
- 🧙 **Escolha a classe** do herói (Cavaleiro, Mago, Elfa ou Lagarto) direto
  na ficha.

## Estado atual

> Retrato de **2026-11-09**. A fonte oficial do estado narrativo é
> [`PROGRESS.md`](PROGRESS.md); as marcações do painel ficam em
> `.forge/forge.db`. Se este bloco divergir, valem essas fontes.

| Frente | Situação |
| --- | --- |
| Fase 0 — Ambiente e fundamentos da Web | 🟡 em andamento (repositório, lint, testes e painel prontos; tópicos conceituais pendentes) |
| Fase 1 — JavaScript profundo | 🟡 unidades 1–8 concluídas, **Unidade 9 (map/filter/reduce) ativa**, 10–27 já geradas |
| Fase 2 — TypeScript | ⚪ 8/8 unidades geradas, disponível |
| Fase 3 — Node.js | ⚪ disponível (7 unidades preparadas) |
| Fase 4 — SQL e PostgreSQL | ⚪ disponível (8/8 unidades + ambiente Docker + Projeto 4 preparados) |
| Fase 12 — DSA em paralelo | 🟡 Sessão 01 (Big O + arrays) entregue, aguardando tentativa |
| Project 01 — Order Workbench CLI | 🟢 concluído: 12/12 testes, retrospectiva e explicação oral |
| Project 04 — Marketplace Database Lab | ⚪ material preparado, disponível |
| Trilha poliglota (Java / .NET / Go) | ⚪ disponível (nenhuma selecionada) |

Números do momento:

- **51 unidades** catalogadas (27 JS · 8 TS · 7 Node · 8 SQL · 1 DSA).
- **8/51 unidades concluídas** · personagem em **LV1, Fase 1, XP 3%**.
- **Suíte de sistema: 74/74 testes verdes** (`npm run test:system`).
- **Autonomia: 83%** (métrica baseada no nível de dica revelado).

## Como funciona uma unidade

```text
ler a aula → responder as perguntas iniciais → resolver as missões
→ rodar o teste de cada missão (ou a suíte) → (dica 1/2/3 só se travar)
→ fechar a unidade com reflexão → revisar
```

- **Conclusão:** a unidade fecha com a suíte verde ou com todas as missões
  feitas. Fechar agenda revisões espaçadas em **2, 7 e 30 dias**.
- **Selo ★:** suíte verde + reflexão escrita + confiança ≥ 3.
- **Autonomia:** registra o nível mais alto de dica revelada. Não é nota;
  serve para perceber a ajuda diminuindo com a prática.

As regras completas do método e da mentoria estão em
[`LEARNING_CONTRACT.md`](LEARNING_CONTRACT.md).

## Como rodar

Requer **Node.js 24** ou superior.

```bash
npm install
npm run forge:web
```

Abra `http://127.0.0.1:4310`. O banco SQLite é criado em `.forge/forge.db`
na primeira execução.

| Comando | Para quê |
| --- | --- |
| `npm run forge:web` | painel web local |
| `npm test` | testes da unidade ativa |
| `npm run test:unit -- js-02` | testes de uma unidade específica |
| `npm run test:system` | suíte das ferramentas do Forge (sempre verde) |
| `npm run test:dsa` | sessão de DSA |
| `npm run test:project-01` | Project 01 — Order Workbench CLI |
| `npm run test:all` | tudo |
| `npm run forge -- <comando>` | CLI |
| `npm run lint` / `typecheck` / `format` | qualidade do código |
| `npm run build:web` | gera o build do painel |
| `npm run sql:up` / `sql:down` / `sql:test` | PostgreSQL em Docker (Fase 4) |

## CLI

Tudo que o painel faz também existe no terminal:

```bash
npm run forge -- status
```

```text
Backend Engineering Forge — status

Foco atual: Unidade 9 — map, filter, find, some, every, reduce (js-09)
Tempo total: 1.3h (75 min)
Unidades concluídas: 8/51
```

| Comando | O que faz |
| --- | --- |
| `status` | mostra o estado atual |
| `log` | registra uma sessão de estudo |
| `focus <js-02>` | define a unidade ativa |
| `test [js-02]` | executa os testes de uma unidade |
| `hint <1\|2\|3>` | revela uma dica progressiva |
| `progress` | lista todas as unidades |
| `review` | lista revisões agendadas |
| `next` | abre a próxima unidade |
| `export [json\|csv]` | exporta seus dados |
| `import <json> --replace` | restaura um backup |

## Roadmap

```text
PARTE I   — Backend Foundations              (Fases 0-3)
PARTE II  — Professional Backend Engineering (Fases 4-8)
PARTE III — Production Backend Engineering   (Fases 9-14, até Pleno + full-stack capability)
PARTE IV  — Senior Backend Engineering       (Fases 15-27, após Pleno)
```

Progressão: Fundamentos → Backend Engineering → Backend Pleno →
Full-stack capability (React + Vite + TanStack Query + React Hook Form +
Zod, integrado de ponta a ponta com a API NestJS; Next.js só como módulo
opcional de empregabilidade, Fase 13.6) → Production Engineering →
Reliability Engineering → Distributed Systems → Senior Backend Engineering.

A Parte IV trata senioridade como responsabilidade por sistemas em
produção (performance, confiabilidade, segurança, sistemas distribuídos,
operação, incidentes, arquitetura, liderança técnica), não como "mais
frameworks". Tabela fase a fase em [`ROADMAP.md`](ROADMAP.md); índice
completo em [`BACKEND_ENGINEERING_FORGE.md`](BACKEND_ENGINEERING_FORGE.md).

**Trilha poliglota opcional:** a qualquer momento é possível ativar uma
especialização em Java/Spring, C#/.NET ou Go. TypeScript, Node.js e NestJS
continuam sendo a formação principal, com divisão aproximada de 70%/30%
depois da escolha. Veja
[`docs/tracks/POLYGLOT_BACKEND_TRACK.md`](docs/tracks/POLYGLOT_BACKEND_TRACK.md).

## Arquitetura do painel

```text
React local (Vite)
    │
    ▼
API Node/Express ─────── Markdown, missions.json e arquivos de teste
    │
    ├─────────────── execução permitida de node --test
    │
    ▼
SQLite local (.forge/forge.db)
```

O executor nunca aceita caminho arbitrário vindo do navegador: a unidade é
descoberta no currículo e o teste precisa estar dentro do workspace. O
teste de uma missão roda com padrão ancorado no nome do exercício. Detalhes
em [`docs/architecture/forge-web-local.md`](docs/architecture/forge-web-local.md).

## Estrutura do repositório

```text
exercises/      unidades por fase (01-javascript-core, 02-typescript-core,
                03-node-core, 04-sql-postgresql, 12-dsa-algorithms)
projects/       projetos progressivos (01-order-workbench-cli, 04-postgres-marketplace-lab)
labs/           laboratórios (http, database, node-runtime, queues, security, observability)
assessments/    gates de fase, code review, debugging, system design, mock interviews
solutions/      soluções de referência
notes/          anotações pessoais de estudo
docs/           currículo, trilha (trilha.json), arquitetura, ADRs, screenshots
tools/          forge-cli, forge-core, forge-sql, forge-web
.forge/         banco SQLite local com sessões e progresso (não versionado)
```

Mapa detalhado em [`docs/REPOSITORY_MAP.md`](docs/REPOSITORY_MAP.md).

## Stack

| Camada | Tecnologia |
| --- | --- |
| Runtime | Node.js 24, ES Modules |
| Testes | `node --test` (runner nativo) |
| API do painel | Express 5 |
| Interface | React 19, Vite 8, Tailwind CSS 4, Radix UI, lucide-react |
| Visual | tema MMO próprio + RPGUI + sprites 0x72, fontes Jersey 10 e VT323 |
| Persistência | SQLite local (`node:sqlite`) |
| Conteúdo | Markdown com front matter (`gray-matter`, `react-markdown`) |
| Qualidade | ESLint, Prettier, TypeScript (typecheck do painel) |

## Documentos de acompanhamento

- [`PROGRESS.md`](PROGRESS.md) — estado narrativo e de mentoria; as marcações do painel ficam em `.forge/forge.db`.
- [`ROADMAP.md`](ROADMAP.md) — fases completas da formação.
- [`STUDY_LOG.md`](STUDY_LOG.md) — diário de sessões de estudo.
- [`SKILLS_MATRIX.md`](SKILLS_MATRIX.md) — estado de cada competência.
- [`LEARNING_CONTRACT.md`](LEARNING_CONTRACT.md) — regras do método de estudo e da mentoria.
- [`BACKEND_ENGINEERING_FORGE.md`](BACKEND_ENGINEERING_FORGE.md) — especificação completa da formação.
- [`docs/README.md`](docs/README.md) — índice da documentação por assunto.
- [`docs/REPOSITORY_MAP.md`](docs/REPOSITORY_MAP.md) — mapa curto para pessoas e agentes de IA.
- [`docs/architecture/forge-web-local.md`](docs/architecture/forge-web-local.md) — arquitetura do painel local.

**Comandos de mentoria:** ver [`LEARNING_CONTRACT.md`](LEARNING_CONTRACT.md)
(`INICIAR`, `PROXIMA_UNIDADE`, `SELECIONAR_TRILHA`, `REVISAR`, `DICA_1/2/3`,
`MOSTRAR_SOLUCAO`, `SIMULAR_BUG`, `SIMULAR_PR`, `AVALIAR_FASE`,
`GERAR_PROJETO`, entre outros).

## Créditos de arte

- Sprites: [16x16 DungeonTileset II](https://0x72.itch.io/dungeontileset-ii), por 0x72 — CC0.
- Molduras, barras e ícones de slot: [RPGUI](https://github.com/RonenNess/RPGUI), por Ronen Ness — Zlib.
- Fontes: Jersey 10 e VT323 — SIL Open Font License.

Detalhes em [`tools/forge-web/src/public/CREDITS.md`](tools/forge-web/src/public/CREDITS.md).
