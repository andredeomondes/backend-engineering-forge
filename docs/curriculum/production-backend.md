## Fase 9 — Testes, qualidade e manutenção

Testes devem existir desde o início, mas esta fase aprofunda a estratégia.

### Conteúdo

- pirâmide de testes;
- testes unitários;
- integração;
- E2E;
- testes de contrato;
- doubles;
- mocks;
- stubs;
- spies;
- fixtures;
- factories;
- testes determinísticos;
- relógio e aleatoriedade;
- banco isolado;
- Testcontainers;
- cobertura;
- mutation testing conceitual;
- testes de segurança;
- testes de concorrência;
- testes de carga introdutórios;
- código legado;
- caracterização;
- refatoração segura.

### Tarefa profissional simulada

Entregar um módulo deliberadamente mal construído contendo:

- acoplamento;
- duplicação;
- queries lentas;
- falta de transação;
- teste frágil;
- vulnerabilidade de autorização;
- logs ruins.

Eu devo:

- diagnosticar;
- escrever testes de caracterização;
- abrir issues;
- priorizar;
- refatorar em PRs pequenos;
- produzir relatório antes/depois.

---

## TRILHA PARALELA OPCIONAL — Polyglot Backend Engineering

Depois de cumprir o gate da Fase 9, o estudante pode selecionar exatamente uma
especialização inicial em Java/Spring, C#/.NET ou Go. Ela é executada em paralelo
às Fases 10–27, com aproximadamente 70% do tempo dedicado ao Forge principal e
30% à opção escolhida.

As três opções permanecem bloqueadas até esse momento e nenhuma é selecionada
automaticamente. Regras, módulos, gates e comando `SELECIONAR_TRILHA` estão em
[`../tracks/POLYGLOT_BACKEND_TRACK.md`](../tracks/POLYGLOT_BACKEND_TRACK.md).

---

## Fase 10 — Arquitetura e design de software

### Conteúdo

- coesão;
- acoplamento;
- SOLID com senso crítico;
- composição;
- dependency inversion;
- use cases;
- ports and adapters;
- clean architecture;
- repository pattern;
- service layer;
- domain services;
- entities e value objects;
- DDD tático básico;
- bounded contexts em nível introdutório;
- modular monolith;
- arquitetura hexagonal;
- patterns úteis:
  - strategy;
  - factory;
  - adapter;
  - decorator;
  - observer;
  - command;
- patterns distribuídos:
  - idempotency key;
  - outbox;
  - saga conceitual;
  - retry;
  - circuit breaker;
- event-driven architecture:
  - eventos de domínio vs. eventos de integração;
  - pub/sub (SNS → SQS);
  - choreography vs. orchestration;
  - event sourcing em nível introdutório;
- consistência forte;
- consistência eventual;
- CAP em nível prático;
- escalabilidade vertical e horizontal;
- stateless services;
- load balancing;
- replicação;
- particionamento conceitual;
- monólito versus microsserviços;
- custo operacional;
- ADRs;
- diagramas C4 em nível básico.

### Projeto 9 — TicketAtlas como monólito modular

Construir a fundação backend do TicketAtlas sem antecipar microsserviços.

Módulos:

- identity;
- organizations;
- users;
- venues;
- events;
- sessions;
- seating;
- tickets;
- orders;
- resale;
- files;
- notifications;
- audit.

Requisitos:

- fronteiras claras;
- sem acesso indevido entre tenants;
- autorização por recurso;
- transações;
- filas;
- cache;
- logs;
- testes;
- OpenAPI;
- ADRs;
- diagrama de contexto e containers;
- explicação de por que continua monólito modular.

---

## Fase 11 — Docker, CI/CD, AWS e observabilidade

### 11.1 Docker

- imagens;
- containers;
- Dockerfile;
- multi-stage build;
- usuário não-root;
- `.dockerignore`;
- layers;
- volumes;
- networks;
- health checks;
- Docker Compose;
- API + PostgreSQL + Redis + worker;
- logs;
- debug;
- limites de recursos em nível introdutório.

### 11.2 CI/CD

Criar GitHub Actions para:

- lint;
- typecheck;
- unit tests;
- integration tests;
- build;
- scan básico de dependências;
- imagem Docker;
- deploy em staging;
- aprovação para produção;
- migrations;
- rollback documentado.

Praticar:

- branches;
- PR template;
- status checks;
- code review;
- secrets;
- environments;
- versionamento.

### 11.3 AWS

Aprender de maneira orientada ao projeto:

- IAM e least privilege;
- budgets e alertas de custo;
- S3 para arquivos;
- RDS PostgreSQL;
- ECR;
- ECS/Fargate;
- application load balancer;
- SQS;
- SNS;
- DynamoDB (noções, quando faz sentido vs. PostgreSQL);
- CloudWatch;
- Secrets Manager/Parameter Store;
- noções de VPC;
- subnets públicas e privadas;
- security groups;
- backups;
- alta disponibilidade em nível conceitual.

Não começar por Kubernetes.

Kubernetes deve ser apenas uma introdução posterior:

- pod;
- deployment;
- service;
- config;
- secret;
- readiness;
- liveness;
- scaling.

### 11.4 Observabilidade

Implementar:

- logs estruturados;
- níveis de log;
- correlation ID;
- métricas RED:
  - rate;
  - errors;
  - duration;
- health;
- readiness;
- traces;
- OpenTelemetry introdutório;
- dashboard;
- alertas;
- Sentry ou equivalente;
- runbook;
- postmortem sem culpa.

### Projeto 10 — Publicação de produção

Publicar o backend do TicketAtlas:

```text
cliente
→ load balancer
→ API NestJS no ECS/Fargate
→ RDS PostgreSQL
→ Redis
→ S3
→ SQS/worker
→ CloudWatch
```

Entregáveis:

- pipeline;
- staging;
- produção;
- migrations;
- backup;
- health check;
- logs;
- métricas;
- alarme;
- runbook;
- simulação de incidente;
- postmortem;
- estimativa de custos.

### Terraform

Somente depois do deploy manual:

- providers;
- state;
- resources;
- variables;
- outputs;
- modules;
- ambientes;
- plano;
- apply;
- drift;
- cuidados com secrets.

Converter parte da infraestrutura do projeto para Terraform.

---

## Fase 12 — Estruturas de dados e algoritmos em paralelo

Não interromper projetos por meses para estudar apenas LeetCode.

Praticar duas vezes por semana:

- Big O;
- arrays;
- strings;
- hash maps;
- sets;
- stacks;
- queues;
- linked lists;
- recursion;
- binary search;
- sorting;
- trees;
- heaps;
- graphs;
- BFS;
- DFS;
- sliding window;
- two pointers;
- programação dinâmica introdutória.

Sempre usar TypeScript.

Distribuição:

- 60% problemas fáceis;
- 35% médios;
- 5% difíceis, apenas quando houver base.

Criar exercícios ligados ao backend:

- LRU cache;
- fila de prioridade;
- deduplicação;
- rate limiter;
- detecção de dependência circular;
- ordenação de jobs;
- busca em árvore de categorias;
- caminho em grafo;
- indexação simplificada.

Exigir explicação de complexidade temporal e espacial.

---

## Fase 13 — Full-stack capability (Frontend + integração real com o backend)

Somente liberar esta fase depois que eu conseguir construir, testar e
publicar uma API NestJS completa. Esta fase é o marco **"full-stack
capability"** entre Pleno (competência backend) e a Parte IV (senioridade):
o objetivo não é virar frontend engineer, é conseguir **construir o
produto completo** e entender o contrato real entre as duas pontas.
Proporção geral do Forge continua ~80% backend / ~20% frontend (seção 3) —
esta fase não vira um curso de React genérico.

### 13.1 HTML e CSS

- HTML semântico;
- formulários;
- labels;
- acessibilidade;
- box model;
- flexbox;
- grid;
- responsividade;
- mobile-first;
- estados de foco;
- CSS suficiente para entender o que o Tailwind gera.

### 13.2 JavaScript no browser

- DOM;
- eventos;
- formulários;
- fetch;
- armazenamento;
- cookies;
- CORS;
- módulos;
- estados de loading, erro e vazio.

### 13.3 React com TypeScript e Vite

Setup:

- Vite (build tool padrão — não CRA, não Next.js nesta fase);
- estrutura de projeto por feature;
- variáveis de ambiente por ambiente (dev/staging/prod).

Core:

- componentes, JSX, props, state, renderização, eventos;
- hooks, efeitos, composição;
- React Router (rotas, rotas protegidas, params, navegação programática);
- error boundaries;
- lazy loading e code splitting por rota;
- React Profiler e frontend performance (re-render desnecessário,
  memoização quando justificada, não como reflexo).

Formulários e validação:

- React Hook Form;
- Zod como schema de validação (mesma lib usada no backend com Zod —
  reforça a ideia de contrato compartilhado, mesmo sem compartilhar código);
- mensagens de erro por campo, estados de submit/disabled.

Server state (TanStack Query):

- cache de servidor, invalidation, stale time;
- paginação (cursor, alinhada ao que a API expõe);
- optimistic update quando fizer sentido;
- polling.

Autenticação e autorização visual:

- fluxo de login/logout, renovação de sessão, expiração;
- 401 vs. 403 tratados de formas diferentes na UI;
- autorização de interface (esconder/desabilitar ação) sem nunca confundir
  isso com segurança real — a autorização de verdade é sempre no backend.

Upload/download, streaming de status:

- upload de arquivo com progresso;
- download de arquivo gerado pelo backend;
- estados de "importação iniciada / X% / concluído" via polling, evoluindo
  depois para Server-Sent Events e, só com justificativa real, WebSockets.

Segurança frontend:

- XSS na renderização de dado não confiável;
- não guardar token sensível em `localStorage` sem entender o risco;
- CORS do ponto de vista do cliente;
- não vazar segredo em variável de ambiente exposta ao bundle.

Testes:

- React Testing Library (unidade/componente, comportamento não implementação);
- Playwright (E2E dos fluxos críticos: login, CRUD principal, importação).

### 13.4 Tailwind CSS e design system básico

- utility-first, spacing, typography, colors, flex, grid;
- responsive variants, mobile-first, state variants, dark mode;
- design tokens;
- componentes reutilizáveis (design system básico: button, input, table,
  modal, empty/loading/error state) — quando extrair componente vs. quando
  usar CSS comum;
- acessibilidade (foco, contraste, aria quando necessário);
- evitar classes gigantes sem organização.

### 13.5 Integração real frontend ↔ backend (núcleo desta fase)

Esta fase não ensina frontend isolado — ensina o fluxo completo:

```text
React (Vite)
↓ HTTP / REST
NestJS
↓
PostgreSQL / Redis / filas / workers / AWS
```

Praticar, contra a API NestJS já construída (não contra mock):

**Autenticação ponta a ponta**

```text
React → POST /auth/login → NestJS → PostgreSQL/sessão
→ cookie ou token → React autenticado
```

login, logout, 401, 403, refresh token, renovação de sessão, expiração,
cookies `HttpOnly`, permissões refletidas na UI.

**CRUD e server state**

```text
React (TanStack Query) → NestJS REST API → PostgreSQL
```

listagem, filtros, ordenação, cursor pagination, criação, atualização,
exclusão, cache, invalidation, optimistic update quando fizer sentido.

**Processamento assíncrono**

```text
React → upload → NestJS → fila → worker → PostgreSQL
→ status/progresso → React
```

A UI mostra estados reais ("Importação iniciada" → "Importando: 35%" →
"Concluído"), começando com polling e evoluindo para SSE; WebSockets só
quando houver necessidade concreta (ex.: trava de assento em tempo real
no TicketAtlas, Fase 14).

### 13.6 Next.js Fundamentals — Optional Employability Module

**Opcional.** Só depois de 13.1-13.5 dominados. Objetivo único: aumentar
compatibilidade com vagas que pedem React + Next.js, sem desviar a
especialização de backend nem virar meses extras de estudo.

Ensinar somente:

- conceitos do Next.js e quando ele resolve um problema que Vite não resolve;
- App Router, layouts, pages/routes;
- Server Components vs. Client Components;
- SSR, SSG, rendering, data fetching, cache, revalidation;
- environment variables;
- integração com um backend externo (o mesmo NestJS já construído).

Arquitetura continua:

```text
Next.js / React
↓
NestJS API
↓
PostgreSQL / Redis / filas
```

Next.js **não substitui** o NestJS. Não usar API Routes/Server Actions do
Next.js como arquitetura de backend principal do Forge — isso quebraria a
identidade backend-first do projeto. Pode existir um mini projeto opcional
(reimplementar 1-2 telas do painel em Next.js), sem reescrever o produto
inteiro.

### Projeto 11 — Painel administrativo

Criar o painel administrativo do TicketAtlas:

- login;
- renovação de sessão;
- dashboard;
- casas e salas;
- eventos e sessões;
- mapas e disponibilidade de assentos;
- importação de eventos;
- progresso de jobs;
- pedidos, ingressos e revendas;
- usuários;
- roles;
- auditoria;
- responsividade;
- acessibilidade;
- testes.

Usar React + TypeScript + Vite + Tailwind, integrado de ponta a ponta com
a API NestJS (não contra mock) pelos três fluxos da seção 13.5.

### Gate da fase

Devo conseguir, sem consultar solução:

- explicar por que autorização de interface não substitui autorização no
  backend;
- implementar um fluxo de autenticação completo (login → token/cookie →
  rota protegida → 401/403 tratados);
- consumir um endpoint paginado com TanStack Query com cache e invalidation
  corretos;
- acompanhar um processamento assíncrono real via polling ou SSE;
- justificar quando usaria Next.js numa vaga real, sem depender dele para
  o Forge.

---

## Fase 14 — Projeto final full-stack

### Tema sugerido

**SaaS multi-tenant de bilheteria com mapa de assentos em tempo real e
revenda P2P.** (trocado em 2026-08-04; tema anterior era "SaaS white-label
de estoque e cotações para revendedores" — ver nota em "Nome do projeto
final")

Cada casa/organizador (cinema, teatro, show) é um tenant isolado. Cliente
abre o app e vê no mapa as casas/eventos mais próximos geograficamente
(busca por raio/distância); escolhe uma, entra na sessão e escolhe assento
num mapa interativo; ao clicar, o assento trava em tempo real (ninguém mais
pode selecioná-lo) até o pagamento confirmar ou o timeout expirar. Ingresso
comprado pode ser revendido dentro da própria plataforma (P2P), com
transferência de posse atômica e prevenção de venda duplicada/fraude.

### Backend

- organizações/tenants (casas/organizadores);
- usuários (admin da casa, cliente final);
- roles e permissions;
- autenticação segura;
- geolocalização: busca de casas/eventos por proximidade (raio/distância,
  PostGIS ou equivalente);
- catálogo de eventos/sessões e mapa de assentos por sala;
- trava de assento em tempo real (lock com timeout);
- checkout e emissão de ingresso;
- geração de PDF/QR do ingresso;
- revenda P2P (listagem, transferência de posse, anti-fraude);
- importação assíncrona (ex.: carga de eventos em lote);
- filas (processamento de pagamento, expiração de trava);
- cache;
- notificações (confirmação, timeout, venda de revenda);
- auditoria;
- integrações (provedor de pagamento);
- webhooks;
- Swagger;
- testes;
- observabilidade;
- AWS;
- CI/CD.

### Frontend

- React;
- TypeScript;
- Vite;
- React Router;
- TanStack Query;
- React Hook Form + Zod;
- Tailwind;
- painel admin (por tenant/organizador);
- mapa geográfico de casas/eventos próximos;
- mapa de assentos interativo em tempo real;
- fluxo de checkout;
- marketplace de revenda;
- formulários;
- tabelas;
- filtros;
- paginação;
- permissões de interface;
- upload;
- acompanhamento de processamento;
- responsividade;
- PWA (instalável, ícone/home screen, offline parcial, push) — sem React
  Native; mobile nativo fica fora de escopo do capstone;
- testes.

### Desafios obrigatórios

- isolamento entre tenants;
- usuário não pode acessar dados de outra organização;
- concorrência: dois usuários tentando o mesmo assento ao mesmo tempo;
- operação idempotente (pagamento não pode duplicar cobrança);
- transferência de posse atômica na revenda (ingresso não pode ser
  revendido duas vezes);
- importação grande sem bloquear API;
- job duplicado;
- retry;
- arquivo inválido;
- integração externa lenta (provedor de pagamento);
- token revogado;
- rotação de refresh token;
- query lenta;
- falha parcial;
- migração de banco;
- deploy;
- incidente;
- rollback.

### Entregáveis profissionais

- README;
- arquitetura;
- decisões ADR;
- modelo de dados;
- OpenAPI;
- threat model;
- testes;
- pipeline;
- Docker;
- ambiente de staging;
- deploy;
- logs e métricas;
- runbook;
- postmortem;
- vídeo curto demonstrando o sistema;
- currículo do projeto em inglês;
- explicação de trade-offs.

---

# 8. Competências comportamentais de pleno

Inclua tarefas para desenvolver:

- ownership;
- autonomia com responsabilidade;
- comunicação;
- escrita técnica;
- estimativa;
- decomposição de tarefas;
- negociação de escopo;
- identificação de riscos;
- code review;
- feedback;
- mentoria simulada;
- trabalho com produto;
- priorização;
- investigação de incidentes;
- decisões com informação incompleta.

Para cada projeto grande, exigir:

1. descrição do problema;
2. perguntas de requisitos;
3. proposta;
4. alternativas;
5. riscos;
6. estimativa;
7. tarefas;
8. implementação;
9. testes;
10. deploy;
11. monitoramento;
12. retrospectiva.

---

# 9. Rubrica de avaliação

Avalie cada projeto de 0 a 4 em:

| Dimensão | 0 | 2 | 4 |
|---|---:|---:|---:|
| Correção | não funciona | funciona parcialmente | funciona e cobre casos extremos |
| Clareza | confuso | aceitável | simples, coeso e legível |
| TypeScript | `any` e tipos frágeis | tipagem razoável | tipos seguros e úteis |
| Testes | inexistentes | happy path | unitários, integração e falhas |
| Banco | modelagem ruim | funcional | constraints, transações e índices justificados |
| Segurança | vulnerável | controles básicos | threat model e controles testados |
| Arquitetura | acoplada | organizada | limites claros e trade-offs documentados |
| Operação | não publica | deploy manual | CI/CD, logs, métricas e runbook |
| Git | histórico ruim | commits aceitáveis | PRs pequenos e mensagens claras |
| Comunicação | não explica | explica o básico | defende decisões e reconhece limites |

Não me aprove para a fase seguinte com falhas críticas em correção, banco ou segurança.

---

# 10. Definição de pronto para competências técnicas de pleno

Ao final, aplique uma avaliação integrada.

Eu devo conseguir:

## JavaScript/TypeScript

- compreender profundamente assincronismo;
- escrever TypeScript estrito;
- modelar estados;
- evitar abstrações desnecessárias;
- depurar memória, concorrência e fluxo assíncrono básico.

## Node.js

- explicar event loop;
- evitar bloqueios;
- usar streams;
- criar shutdown;
- diagnosticar lentidão;
- lidar com erros e sinais.

## APIs

- projetar REST;
- validar entrada;
- documentar;
- versionar;
- paginar;
- criar idempotência;
- consumir serviços externos com timeout e retry seguros.

## Banco

- modelar;
- escrever SQL;
- usar transações;
- tratar concorrência;
- criar índices;
- analisar query;
- evitar N+1.

## NestJS

- dominar DI;
- modules;
- controllers;
- providers;
- pipes;
- guards;
- interceptors;
- filters;
- lifecycle;
- testes.

## Segurança

- implementar senha com algoritmo adequado;
- autenticação;
- JWT;
- refresh rotation;
- sessões;
- RBAC;
- ownership;
- tenant isolation;
- password reset;
- rate limiting;
- OWASP API Top 10;
- testes de autorização.

## Sistemas assíncronos

- cache;
- filas;
- retries;
- idempotência;
- jobs duplicados;
- dead-letter;
- monitoramento.

## Arquitetura

- modular monolith;
- SOLID com senso crítico;
- clean/hexagonal quando útil;
- DDD básico;
- ADR;
- system design;
- trade-offs.

## Operação

- Docker;
- Compose;
- CI/CD;
- AWS;
- logs;
- métricas;
- traces;
- alertas;
- runbook;
- incidente e postmortem.

## Full-stack

- criar painel React;
- usar TypeScript;
- estilizar com Tailwind;
- consumir API;
- tratar autenticação;
- testar fluxos principais.

## Colaboração

- abrir PR;
- revisar código;
- explicar decisão;
- dividir tarefa;
- estimar;
- comunicar risco;
- orientar alguém em um problema simples.

---
