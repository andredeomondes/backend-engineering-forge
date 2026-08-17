# 34. Trilha de Estruturas de Dados e Algoritmos para Entrevistas Internacionais

Esta trilha deve ser executada **em paralelo**, sem substituir projetos backend,
banco de dados, testes, segurança ou System Design.

## 34.1 Linguagem padrão

A linguagem principal e padrão para entrevistas será:

```text
TypeScript
```

Motivos pedagógicos:

- é minha stack profissional principal;
- reduz troca de contexto;
- fortalece domínio de arrays, maps, sets, generics e tipagem;
- permite praticar raciocínio e comunicação na linguagem em que pretendo trabalhar;
- facilita entrevistas específicas de Node.js, frontend e full-stack;
- torna meus exercícios úteis também para código profissional.

A IA não deve recomendar mudança automática para Python apenas porque a sintaxe
é menor.

Python será opcional, não obrigatório.

## 34.2 Quando considerar Python

Somente sugerir uma trilha complementar em Python se ocorrer uma destas situações:

- a vaga exige Python;
- a plataforma ou empresa limita as linguagens;
- já resolvo problemas médios com segurança em TypeScript;
- a sintaxe de TypeScript está prejudicando significativamente meu raciocínio;
- quero comparar expressividade depois de dominar o conceito;
- pretendo disputar vagas Python de forma séria.

Mesmo nesses casos:

1. resolver primeiro o conceito em TypeScript;
2. opcionalmente reimplementar em Python;
3. não dividir o estudo principal entre duas linguagens no começo;
4. manter TypeScript como linguagem de explicação e entrevista por padrão.

## 34.3 Biblioteca mínima que devo dominar em TypeScript

A IA deve me treinar para usar naturalmente:

```ts
Array
Map
Set
WeakMap
WeakSet
string
number
bigint
```

Métodos essenciais:

```text
push
pop
shift
unshift
slice
splice
sort
reverse
map
filter
find
findIndex
some
every
reduce
includes
```

Também devo saber implementar manualmente, para fins pedagógicos:

- stack;
- queue;
- deque;
- linked list;
- hash table simplificada;
- binary tree;
- binary search tree;
- heap;
- priority queue;
- trie;
- graph;
- union-find/disjoint set;
- LRU cache.

Não devo reinventar essas estruturas em código de produção sem justificativa.

## 34.4 Progressão de tópicos

### Bloco 1 — Fundamentos

- análise de complexidade;
- Big O;
- tempo e espaço;
- casos melhor, médio e pior;
- arrays;
- strings;
- objects;
- `Map`;
- `Set`;
- loops;
- recursão básica.

### Bloco 2 — Padrões de problemas

- frequency counter;
- two pointers;
- sliding window;
- prefix sum;
- binary search;
- sorting;
- interval merging;
- matrix traversal;
- recursion;
- backtracking.

### Bloco 3 — Estruturas

- stack;
- queue;
- linked list;
- tree;
- binary search tree;
- heap;
- priority queue;
- trie;
- graph;
- union-find.

### Bloco 4 — Algoritmos

- BFS;
- DFS;
- topological sort;
- shortest paths em nível introdutório;
- greedy;
- divide and conquer;
- dynamic programming introdutória;
- memoization;
- tabulation.

### Bloco 5 — Problemas ligados ao backend

- LRU cache;
- rate limiter;
- deduplicação;
- fila de prioridade de jobs;
- dependências entre tarefas;
- detecção de ciclos;
- paginação e busca;
- agregação de eventos;
- janela deslizante para métricas;
- ranking com heap;
- árvore de categorias;
- roteamento em grafo;
- processamento concorrente conceitual.

## 34.5 Método de resolução obrigatório

Para cada problema, eu devo seguir:

```text
1. repetir o problema com minhas palavras;
2. esclarecer entradas, saídas e restrições;
3. criar exemplos;
4. identificar casos extremos;
5. propor força bruta;
6. analisar complexidade;
7. procurar padrão;
8. escrever pseudocódigo;
9. implementar;
10. testar manualmente;
11. explicar complexidade;
12. comparar alternativa;
13. revisar após alguns dias.
```

A IA não deve permitir que eu pule diretamente para código.

## 34.6 Template de exercício de entrevista

```md
# Problema

## Enunciado

## Restrições

## Exemplos

## Perguntas que devo fazer ao entrevistador

## Minha solução de força bruta

## Complexidade da força bruta

## Padrão reconhecido

## Pseudocódigo

## Implementação TypeScript

## Testes manuais

## Complexidade final

## Trade-offs

## Erros que cometi

## Explicação em inglês

## Revisões

- [ ] 1 dia
- [ ] 3 dias
- [ ] 7 dias
- [ ] 14 dias
- [ ] 30 dias
```

## 34.7 Treino de comunicação em inglês

Depois de resolver um problema, exigir uma explicação curta em inglês:

```text
- clarification questions;
- brute-force idea;
- optimized approach;
- time complexity;
- space complexity;
- edge cases;
- test walkthrough.
```

A IA deve corrigir clareza e vocabulário, mas não transformar a sessão em aula
de gramática.

Exemplo de estrutura:

```text
First, I would clarify...
A straightforward solution would be...
We can improve this by using...
The time complexity is...
The main edge cases are...
Let me walk through an example...
```

## 34.8 Rotina semanal

Enquanto estiver construindo base:

```text
2 sessões de 45 a 60 minutos por semana
```

Quando estiver aplicando para vagas:

```text
3 a 5 sessões por semana
1 entrevista simulada por semana
```

Distribuição inicial:

```text
60% problemas fáceis
35% problemas médios
5% difíceis
```

Não focar em problemas difíceis antes de resolver médios com consistência.

## 34.9 Critérios para marcar um padrão como autônomo

Devo conseguir:

- reconhecer o padrão sem dica;
- explicar por que se aplica;
- escrever solução do zero;
- testar casos extremos;
- declarar complexidade;
- resolver problema semelhante depois de sete dias;
- explicar em inglês.

## 34.10 Entrevistas simuladas

Adicionar o comando:

```text
MOCK_INTERVIEW_DSA <duracao> <nivel>
```

A IA deve atuar como entrevistador:

- apresentar apenas o problema;
- responder perguntas de esclarecimento;
- não oferecer dicas cedo;
- observar comunicação;
- pedir complexidade;
- pedir testes;
- fornecer feedback apenas no final;
- avaliar solução, comunicação, debugging e colaboração.

Rubrica:

| Dimensão | Peso |
|---|---:|
| Entendimento e perguntas | 15% |
| Estratégia | 20% |
| Correção | 25% |
| Complexidade | 15% |
| Testes e casos extremos | 10% |
| Comunicação | 15% |

## 34.11 Caderno de padrões

Criar:

```text
notes/interview-patterns/
├── frequency-counter.md
├── two-pointers.md
├── sliding-window.md
├── binary-search.md
├── stack-queue.md
├── trees.md
├── graphs.md
├── heaps.md
├── backtracking.md
└── dynamic-programming.md
```

Cada arquivo deve conter:

- sinal de que o padrão pode ser útil;
- perguntas que devo fazer;
- esqueleto mental, não código para decorar;
- complexidades comuns;
- erros frequentes;
- dois problemas resolvidos;
- um problema pendente;
- data da última revisão.

## 34.12 Não decorar soluções

A IA deve detectar sinais de memorização:

- escrevo código rapidamente, mas não explico;
- não consigo adaptar requisitos;
- erro em caso semelhante;
- não sei justificar complexidade;
- não consigo reconstruir após uma semana.

Quando isso acontecer:

1. alterar nomes e contexto;
2. mudar uma restrição;
3. pedir força bruta;
4. pedir outra estrutura;
5. solicitar explicação sem código;
6. revisar depois.

---

# 35. Preparação completa para vagas internacionais

Estruturas de dados são apenas uma parte.

A preparação deve incluir quatro eixos:

```text
1. coding e DSA
2. backend e projetos
3. system design
4. comunicação e comportamento
```

## 35.1 Coding e DSA

Usar a trilha anterior.

## 35.2 Backend prático

Simular tarefas como:

- corrigir bug em repositório;
- implementar endpoint;
- escrever migration;
- investigar query lenta;
- adicionar autorização;
- escrever teste;
- revisar PR;
- consumir API externa;
- tratar retry e timeout.

## 35.3 System Design

Adicionar o comando:

```text
MOCK_SYSTEM_DESIGN <sistema> <nivel>
```

Avaliar:

- clarificação;
- requisitos funcionais;
- requisitos não funcionais;
- estimativa aproximada;
- API;
- dados;
- componentes;
- gargalos;
- segurança;
- confiabilidade;
- observabilidade;
- custos;
- trade-offs.

Começar por sistemas compatíveis com backend júnior/pleno:

- encurtador de URL;
- processamento de arquivos;
- notificações;
- estoque;
- pedidos;
- autenticação;
- importação assíncrona;
- catálogo;
- cotação;
- webhooks.

## 35.4 Behavioral em inglês

Criar:

```text
notes/interview-stories/
```

Preparar histórias no formato STAR sobre:

- bug difícil;
- conflito técnico;
- prazo apertado;
- erro próprio;
- decisão com trade-off;
- aprendizado rápido;
- projeto do zero;
- melhoria de performance;
- segurança;
- trabalho em equipe;
- feedback;
- situação ambígua.

Adicionar o comando:

```text
MOCK_BEHAVIORAL_INTERVIEW
```

A IA deve:

- entrevistar em inglês;
- fazer perguntas de aprofundamento;
- detectar respostas vagas;
- pedir resultados concretos;
- ajudar a reduzir respostas longas;
- não inventar experiências.

## 35.5 Estratégia de linguagem por tipo de entrevista

Usar:

```text
DSA geral: TypeScript
Node.js/backend específico: TypeScript
React/full-stack: TypeScript
Live coding em repositório Node: TypeScript
System Design: linguagem independente
SQL: PostgreSQL
Vaga Python: Python após preparação específica
Vaga Go: Go após preparação específica
```

Não mudar para Python por ansiedade ou tendência de mercado.

A linguagem da entrevista deve maximizar:

- clareza;
- velocidade;
- correção;
- comunicação;
- familiaridade com bibliotecas;
- alinhamento com a vaga.

---

# 36. Atualização dos comandos

Adicionar:

```text
MOCK_INTERVIEW_DSA <duracao> <nivel>
MOCK_SYSTEM_DESIGN <sistema> <nivel>
MOCK_BEHAVIORAL_INTERVIEW
REVISAR_PADRAO_DSA <padrao>
GERAR_PLANO_ENTREVISTAS <semanas>
```

## `GERAR_PLANO_ENTREVISTAS <semanas>`

Deve criar um plano equilibrado contendo:

- DSA em TypeScript;
- revisão de JavaScript/TypeScript;
- Node/NestJS;
- SQL;
- projeto;
- System Design;
- behavioral em inglês;
- entrevistas simuladas;
- descanso e revisão.

Não permitir que LeetCode ocupe todo o tempo de preparação.
