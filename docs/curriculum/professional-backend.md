## Fase 4 — SQL e PostgreSQL de verdade

Não permitir que o ORM esconda esta fase.

### Unidades

1. `sql-01` — modelo relacional, tabelas e constraints;
2. `sql-02` — CRUD, filtros e ordenação;
3. `sql-03` — joins, agregações, CTEs e views;
4. `sql-04` — transações, ACID e isolamento;
5. `sql-05` — concorrência, locks e deadlocks;
6. `sql-06` — índices, `EXPLAIN` e performance;
7. `sql-07` — migrations, seed e paginação;
8. `sql-08` — segurança, N+1 e operação básica.

Material: [`../../exercises/04-sql-postgresql/`](../../exercises/04-sql-postgresql/).

### Conteúdo

- modelo relacional;
- tabelas;
- tipos;
- primary key;
- foreign key;
- `UNIQUE`;
- `CHECK`;
- `NOT NULL`;
- normalização;
- relacionamentos;
- CRUD;
- joins;
- agregações;
- subqueries;
- CTE;
- views;
- window functions em nível útil;
- transações;
- propriedades ACID;
- níveis de isolamento;
- concorrência;
- locks;
- deadlocks;
- índices B-tree;
- índices compostos;
- índices parciais;
- `EXPLAIN` e `EXPLAIN ANALYZE`;
- custo de escrita dos índices;
- offset pagination;
- cursor pagination;
- migrations;
- seed;
- backup e restore em nível introdutório;
- SQL injection e queries parametrizadas;
- N+1;
- quando SQL não é a resposta certa: MongoDB (documentos, schema flexível) vs. DynamoDB (chave-valor gerenciado) — critérios de escolha, não implementação profunda.

### Projeto 4 — Marketplace Database Lab

Entregáveis:

- modelo entidade-relacionamento;
- migrations SQL;
- seed;
- consultas reais;
- relatório de índices;
- transação de criação de pedido;
- simulação de concorrência de estoque;
- solução para impedir venda acima do estoque;
- paginação por cursor;
- análise de queries lentas.

Projeto preparado em
[`../../projects/04-postgres-marketplace-lab/`](../../projects/04-postgres-marketplace-lab/).

### Gate da fase

Devo conseguir:

- modelar banco sem depender do ORM;
- justificar índices;
- usar transações;
- explicar risco de concorrência;
- ler um plano de execução básico;
- detectar N+1;
- impedir SQL injection.

---

## Fase 5 — Engenharia de APIs com Express

### Conteúdo

- REST;
- recursos;
- rotas;
- status codes;
- headers;
- content negotiation em nível básico;
- middleware;
- controllers;
- services;
- repositories;
- validação com Zod;
- erro centralizado;
- logs estruturados;
- correlation ID;
- paginação;
- filtros;
- ordenação;
- versionamento;
- OpenAPI;
- upload;
- streaming;
- consumo de API externa;
- timeout;
- cancelamento;
- retry apenas quando seguro;
- idempotência;
- webhooks;
- testes unitários;
- testes de integração;
- testes E2E com Supertest.

### Projeto 5 — API de pedidos

Funcionalidades:

- usuários;
- produtos;
- estoque;
- pedidos;
- filtros;
- paginação;
- transações;
- validação;
- logs;
- documentação;
- testes;
- Docker Compose com PostgreSQL.

Ainda não implementar autenticação completa. Primeiro desenvolver uma API consistente.

### Gate da fase

Devo:

- projetar endpoints coerentes;
- distinguir erros de cliente e servidor;
- criar resposta de erro consistente;
- documentar API;
- escrever teste de integração;
- usar transação;
- implementar idempotência em uma operação sensível.

---

## Fase 6 — NestJS profissional

### Conteúdo

- bootstrap;
- modules;
- controllers;
- providers;
- dependency injection;
- custom providers;
- configuration;
- DTOs;
- pipes;
- validation;
- guards;
- interceptors;
- exception filters;
- middleware;
- custom decorators;
- serialization;
- lifecycle;
- graceful shutdown;
- Swagger;
- testing module;
- unit tests;
- integration tests;
- E2E tests;
- Prisma;
- organização por feature;
- módulos compartilhados;
- limites de domínio;
- evitar dependências circulares;
- dynamic modules em nível intermediário.

### Projeto 6 — Migração da API para NestJS

Migrar o projeto Express sem copiar cegamente.

Antes de cada migração, registrar:

- o que o Nest abstrai;
- qual problema resolve;
- trade-offs;
- como o fluxo da requisição funciona.

Criar um ADR comparando:

- Express;
- NestJS;
- manutenção;
- velocidade de desenvolvimento;
- testabilidade;
- acoplamento.

---

## Fase 7 — Autenticação, autorização e segurança de APIs

Esta é uma fase central, não um módulo superficial.

### 7.1 Fundamentos

Distinguir:

- identificação;
- autenticação;
- autorização;
- sessão;
- token;
- hash;
- criptografia;
- assinatura;
- encoding;
- secret;
- key;
- salt;
- pepper.

### 7.2 Senhas

Aprender e implementar:

- nunca armazenar senha em texto puro;
- nunca usar criptografia reversível para senha;
- bcrypt;
- salt;
- work factor;
- comparação segura;
- Argon2id e por que é recomendado em novos sistemas;
- limite de tamanho;
- política de senha sensata;
- prevenção contra senhas vazadas em nível conceitual;
- alteração de senha;
- encerramento de sessões após troca;
- recuperação de senha;
- token aleatório, expirável, de uso único e armazenado em hash.

### 7.3 JWT

Aprender:

- estrutura do JWT;
- header;
- payload;
- signature;
- claims;
- `sub`;
- `iss`;
- `aud`;
- `iat`;
- `exp`;
- algoritmo;
- segredo simétrico versus chaves assimétricas;
- access token curto;
- refresh token;
- rotação de refresh token;
- detecção de reutilização;
- revogação;
- logout;
- armazenamento;
- riscos de `localStorage`;
- cookies `HttpOnly`, `Secure`, `SameSite`;
- CSRF quando cookies são usados;
- XSS;
- por que JWT não é criptografia;
- por que não colocar dado sensível no payload;
- invalidação e sessões no banco/Redis.

### 7.3.1 OAuth 2.0 e OpenID Connect

Aprender e implementar login social (ex.: Google) como client:

- authorization code flow com PKCE;
- diferença entre autenticação (OIDC) e autorização (OAuth puro);
- scopes;
- access token vs. id token;
- state e nonce contra CSRF/replay;
- troca de código por token no backend, nunca no client;
- vincular conta OAuth a usuário existente;
- quando expor a própria API como provedor OAuth (client credentials para máquina-a-máquina) — nível introdutório.

### 7.4 Autorização

Implementar progressivamente:

1. usuário autenticado;
2. RBAC;
3. permissions;
4. ownership do recurso;
5. deny by default;
6. least privilege;
7. validação em toda requisição;
8. políticas por atributo;
9. escopo de tenant;
10. testes de autorização.

Não considerar suficiente verificar somente `role = admin`.

### 7.5 Proteções de API

Implementar e testar:

- input validation;
- output filtering;
- mass assignment;
- BOLA/IDOR;
- broken function-level authorization;
- rate limiting;
- brute force;
- credential stuffing em nível defensivo;
- CORS;
- Helmet;
- CSRF;
- SQL injection;
- XSS refletido em respostas;
- SSRF;
- upload inseguro;
- path traversal;
- secrets;
- logs sem senha/token;
- mensagens de erro que não vazam detalhes;
- dependências vulneráveis;
- limitação de tamanho de payload;
- timeout;
- resource exhaustion;
- auditoria;
- TLS em produção.

### Projeto 7 — API de identidade e acesso

Implementar:

- cadastro;
- login;
- logout;
- access token;
- refresh token rotativo;
- sessões/dispositivos;
- revogação;
- e-mail verificado simulado;
- esqueci minha senha;
- redefinição de senha;
- troca de senha;
- roles;
- permissions;
- ownership;
- tenant;
- rate limiting;
- audit log;
- testes de ataques de autorização;
- testes de reutilização de refresh token;
- threat model;
- checklist OWASP.

### Avaliação de segurança

A IA deve criar ataques automatizados seguros contra o ambiente local:

- acessar recurso de outro usuário;
- alterar role no payload;
- reutilizar token revogado;
- brute force controlado;
- payload excessivo;
- IDOR;
- mass assignment;
- refresh token repetido;
- tentativa de reset de senha reutilizado.

Nunca usar técnicas contra sistemas externos.

---

## Fase 8 — Redis, cache, filas e integrações

### Conteúdo

- por que usar Redis;
- strings;
- hashes;
- sets;
- sorted sets;
- TTL;
- cache-aside;
- invalidação;
- cache stampede;
- rate limiting;
- distributed lock em nível conceitual;
- filas;
- producer;
- consumer;
- workers;
- retries;
- backoff;
- prioridade;
- concorrência;
- delayed jobs;
- dead-letter strategy;
- idempotência;
- at-least-once delivery;
- job duplicado;
- poison message;
- observação de filas;
- BullMQ;
- SQS posteriormente;
- eventos internos;
- integração externa;
- webhooks assinados;
- timeout;
- circuit breaker em nível conceitual;
- fallback;
- outbox pattern em nível intermediário.

### Projeto 8 — Pipeline assíncrono de importação

Criar uma funcionalidade que:

1. recebe CSV/Excel/PDF simulado;
2. armazena arquivo;
3. cria job;
4. worker processa;
5. normaliza produtos;
6. registra erros por linha;
7. atualiza progresso;
8. tenta novamente falhas transitórias;
9. não duplica importação;
10. gera relatório;
11. envia notificação;
12. registra métricas.

Evoluir:

- Redis/BullMQ local;
- depois criar uma versão equivalente com SQS;
- comparar os modelos.

---
