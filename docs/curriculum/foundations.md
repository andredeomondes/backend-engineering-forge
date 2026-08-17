# 7. Plano completo por fases

As durações são referências, não promessas. Avance por competência.

---

## Fase 0 — Ambiente profissional e fundamentos da Web

### Objetivos

Aprender:

- terminal;
- processos;
- arquivos e permissões;
- Git;
- GitHub;
- branches;
- commits;
- pull requests;
- resolução de conflitos;
- npm;
- `package.json`;
- versionamento semântico;
- variáveis de ambiente;
- cliente e servidor;
- DNS em nível introdutório;
- TCP em nível conceitual;
- HTTP;
- métodos HTTP;
- headers;
- body;
- status codes;
- cookies;
- JSON;
- CORS em nível conceitual.

### Práticas

- criar o repositório;
- configurar lint e formatter;
- abrir PR para cada unidade;
- criar um pequeno servidor local e inspecionar requisições com `curl`;
- analisar requests pelo DevTools;
- criar uma coleção no Bruno, Insomnia ou Postman.

### Gate da fase

Eu devo explicar:

- o que acontece de forma simplificada quando acesso uma URL;
- diferença entre processo, porta e servidor;
- diferença entre Git e GitHub;
- diferença entre `GET`, `POST`, `PUT`, `PATCH` e `DELETE`;
- diferença entre `401` e `403`;
- por que não se deve versionar `.env`.

---

## Fase 1 — JavaScript profundo para backend

Use como inspiração temática a Parte 1 do Eloquent JavaScript, mas gere material original.

### Unidades

1. valores, tipos, operadores, coerção e igualdade;
2. controle de fluxo;
3. funções;
4. escopo léxico;
5. closures;
6. arrays e objetos;
7. referências, mutabilidade e cópias;
8. funções de alta ordem;
9. `map`, `filter`, `find`, `some`, `every` e `reduce`;
10. destructuring;
11. spread e rest;
12. tratamento de erros;
13. classes e protótipos;
14. `this`;
15. iterables e generators em nível introdutório;
16. regular expressions em nível prático;
17. módulos ES;
18. callbacks;
19. promises;
20. `async/await`;
21. `Promise.all`, `allSettled`, `race` e `any`;
22. erros assíncronos;
23. event loop em nível de linguagem;
24. JSON;
25. imutabilidade;
26. legibilidade, coesão e funções pequenas;
27. Big O básico.

### Quantidade mínima de prática

Para cada unidade:

- 8 exercícios fundamentais;
- 4 exercícios intermediários;
- 2 exercícios de debugging;
- 1 exercício de refatoração;
- 1 desafio integrador.

Não transforme isso em repetição mecânica. Combine assuntos conforme a progressão.

### Projeto 1 — CLI de estoque e pedidos

Construir sem framework e inicialmente sem TypeScript.

Funcionalidades:

- cadastrar produtos;
- atualizar estoque;
- listar produtos;
- filtrar;
- ordenar;
- registrar pedido;
- validar quantidade;
- calcular total;
- aplicar regras de desconto;
- gerar relatório JSON;
- persistir em arquivo;
- recuperar após reiniciar;
- tratar arquivo corrompido;
- importar dados.

Exigências:

- módulos;
- tratamento de erros;
- funções de alta ordem;
- testes;
- README;
- commits por funcionalidade;
- pelo menos uma refatoração documentada.

### Gate da fase

Sem consultar solução, devo conseguir:

- explicar closure;
- explicar diferença entre valor e referência;
- usar arrays e objetos confortavelmente;
- corrigir uma Promise mal encadeada;
- explicar o efeito de `async/await`;
- organizar um programa em módulos;
- escrever testes de funções puras;
- analisar complexidade básica.

---

## Fase 2 — TypeScript profissional

### Conteúdo

- inferência;
- anotações;
- tipos primitivos;
- arrays e tuplas;
- aliases;
- interfaces;
- propriedades opcionais;
- `readonly`;
- unions;
- intersections;
- literal types;
- enums apenas para reconhecer e discutir trade-offs;
- narrowing;
- type guards;
- discriminated unions;
- funções;
- overloads em nível prático;
- generics;
- constraints;
- `keyof`;
- `typeof` no sistema de tipos;
- indexed access types;
- utility types;
- mapped types;
- conditional types introdutórios;
- classes;
- `abstract`;
- interfaces e composição;
- módulos;
- declaração de tipos;
- `unknown`, `never` e `any`;
- configuração do `tsconfig`;
- strict mode;
- tipagem de erros;
- tipagem de dados externos;
- diferença entre validação em compilação e validação em runtime.

### Projeto 2 — Domínio tipado de marketplace

Reescrever o núcleo do projeto anterior em TypeScript.

Modelar:

- produto;
- cliente;
- pedido;
- item do pedido;
- pagamento;
- status;
- cupom;
- resultado de operações;
- erros de domínio.

Usar:

- discriminated unions;
- generics úteis;
- `Result` simples quando fizer sentido;
- invariantes;
- testes.

Não criar patterns desnecessários apenas porque existem no Java.

### Gate da fase

Devo:

- manter `strict` ativado;
- evitar `any`;
- distinguir tipo estático de validação runtime;
- criar type guards;
- explicar quando usar composição;
- criar tipos que impeçam estados inválidos;
- tipar respostas e erros.

---

## Fase 3 — Node.js por baixo dos frameworks

### Conteúdo

- runtime Node;
- V8, libuv e event loop em nível prático;
- operações bloqueantes e não bloqueantes;
- ESM e CommonJS;
- `process`;
- sinais;
- variáveis de ambiente;
- `fs`;
- `path`;
- buffers;
- streams;
- backpressure;
- `EventEmitter`;
- timers;
- HTTP nativo;
- URL;
- criptografia com `node:crypto`;
- child processes em nível introdutório;
- worker threads em nível conceitual;
- graceful shutdown;
- logs;
- testes com `node:test` para compreender a base.

### Projeto 3A — Processador de arquivos

Criar uma ferramenta que:

- leia CSV grande via stream;
- valide linhas;
- normalize produtos;
- produza JSON;
- gere relatório de erros;
- não carregue o arquivo inteiro em memória;
- permita cancelar o processamento;
- mostre progresso;
- tenha testes.

### Projeto 3B — API HTTP sem framework

Criar:

- roteamento;
- parsing de JSON;
- validação;
- tratamento de erros;
- middleware simples;
- logs;
- health check;
- CRUD em memória;
- encerramento gracioso.

O objetivo não é construir um framework completo. É entender o que os frameworks abstraem.

### Gate da fase

Devo explicar:

- por que bloquear o event loop prejudica todos os clientes;
- quando usar streams;
- o que é backpressure;
- diferença entre concorrência e paralelismo;
- fluxo de uma requisição HTTP no Node;
- como encerrar conexões com segurança.

---
