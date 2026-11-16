# Roteiro de 180 dias · seis meses

Uma sessão por dia, sem datas fixas. Reserve **60 minutos totais**: 5 min de
revisão, 10 de teoria ou vídeo, 25 de prática e 20 de inglês. Ao acabar o
tempo, registre onde parou. Retome a tarefa na próxima sessão e use os dias
de revisão para recuperar pendências.

| Mês | Dias | Entrega de referência |
|---|---|---|
| 1 | 1–30 | Fluxo web inicial do TicketAtlas e primeiras sessões Java |
| 2 | 31–60 | Persistência, testes e cobertura das unidades de fundamentos |
| 3 | 61–90 | Segurança, automação, RAG inicial em TS e qualidade web |
| 4 | 91–120 | Autonomia nos projetos, Jenkins e entrega em homologação |
| 5 | 121–150 | Redis, RAG e automação nas duas stacks, início da extensão opcional |
| 6 | 151–180 | Integração, recuperação, portfólio e entrevistas |

São 180 horas, sendo 60 de inglês e 120 de estudo técnico. Os marcos são
recortes pequenos. Use as evidências da [matriz](../../SKILLS_MATRIX.md) para
decidir o que aprofundar depois do semestre.

## Inglês falado · 20 minutos por dia

Use 2 min para a estrutura do dia, 15 min de conversa por voz e 3 min de
feedback. Peça uma pergunta por vez, duas correções e repita uma resposta.
O painel oferece um prompt para copiar.

## Cobertura e fontes

O plano cobre as 27 unidades JS (1–8 já concluídas), oito de TS, oito de SQL,
sete de Node e Java Core. A [matriz de cursos](course-matrix.md) liga tópicos
das grades às tarefas. Tente antes de pedir código à IA e registre o teste,
a evidência e a ajuda usada.

## Dias 1–10 · Fundamentos em rotação

| Dia | Foco principal | Rotação e entrega | Inglês falado (20 min) |
|---|---|---|---|
| 1 | Em `js-09`, tente uma missão de seleção com `filter` ou `find`. | Desenhe os dados de um chamado. Rode o teste da missão e explique quando usaria cada método. | Present simple: Introduce yourself and explain what filter does. |
| 2 | Em `sql-01`, pratique tabela, chave e constraint. | Volte à `js-09` e tente transformar uma lista de chamados. Explique qual regra fica no banco. | There is / there are: Describe the fields in a support ticket. |
| 3 | Em `ts-01`, pratique inferência e parâmetros tipados. | Rode uma missão da `js-09`. Explique uma diferença entre erro de tipo e erro em execução. | I use … to …: Explain why you add a type annotation. |
| 4 | Em `sql-02`, consulte registros com filtro e ordenação. | Em `js-09`, pratique agregação e compare o resultado de uma consulta com o de uma lista em memória. | Comparatives: Compare a SQL query with filtering an array. |
| 5 | Em `ts-02`, modele chamados e status possíveis. | Rode a suíte da `js-09` e retome uma missão que precisou de dica. | Past simple: Tell me how you solved a JavaScript exercise. |
| 6 | Em `js-12`, leia e trate erros. | Esboce o contrato de criação de chamado, incluindo resposta para entrada inválida. | If …, then …: Explain what happens when the request is invalid. |
| 7 | Em `js-18` e `js-19`, acompanhe callback e Promise. | Em `node-01`, preveja a ordem de mensagens e confira executando. | First / then / finally: Predict the order of callbacks and promises. |
| 8 | Em `js-20` e `js-22`, trate sucesso e rejeição com async/await. | Em `sql-03`, faça uma consulta ligando chamado e responsável. | When / while: Describe what the app does while a request is pending. |
| 9 | Em `node-02`, pratique módulos e configuração de ambiente. | Em `ts-03`, represente dois resultados possíveis e explique como o código distingue os casos. | Can / cannot: Explain which states a ticket can have. |
| 10 | Em `node-06`, observe método, rota e status no HTTP nativo. | Descreva uma requisição válida e uma inválida para o TicketAtlas. | Question forms: Ask me about an HTTP request and its response. |

Se o dia 7 ou 8 ficar longo, trate cada unidade como uma sessão. Use
`js-21` e `js-23` em retornos curtos quando praticar concorrência e event loop.

## Dias 11–22 · Primeiro fluxo do TicketAtlas

| Dia | Foco principal | Rotação e entrega | Inglês falado (20 min) |
|---|---|---|---|
| 11 | Crie em Express uma rota para listar chamados em memória. | Inspecione método, status e corpo da resposta pelo terminal. | Present simple: Describe what the list endpoint returns. |
| 12 | Crie a rota de abertura de chamado. | Escreva um teste para título ausente e veja a falha antes de corrigir. | Must / should: Explain what a user must provide to open a ticket. |
| 13 | Implemente uma transição de status. | Revise `ts-03` e teste uma transição recusada. | Allowed to: Describe a valid and an invalid status change. |
| 14 | Modele e versione o schema de chamados em PostgreSQL. | Em `sql-07`, pratique a parte de migrations. Reserve paginação para o dia 47. | Because / so: Explain why you added a database constraint. |
| 15 | Persista abertura e listagem de chamados. | Reaplique filtro e ordenação de `sql-02` e rode o teste da rota. | How many / how much: Discuss filters, ordering and the number of results. |
| 16 | Refaça uma rota simples sem copiar a anterior. | Mude uma regra, ajuste o teste e explique a falha que encontrou. | Past simple: Walk me through a bug you fixed. |
| 17 | Em React/TypeScript, mostre a lista vinda da API. | Revise destructuring em `js-10`. Confira no navegador os estados de carregamento e erro. | Present continuous: Describe what the UI shows while data is loading. |
| 18 | Conecte o formulário de abertura. | Revise spread/rest em `js-11`. Siga a resposta de entrada inválida até a tela. | Imperatives: Guide me through opening a ticket in your app. |
| 19 | Conecte a mudança de status. | Escreva um roteiro curto para outra pessoa demonstrar o fluxo. | Sequencing: Demo how to change a ticket status. |
| 20 | Depure um erro atravessando tela, API e banco. | Registre hipótese, observação e correção. | Cause and effect: Explain how you traced a bug across three layers. |
| 21 | Refaça uma mudança pequena de ponta a ponta com documentação. | Rode os testes e explique a decisão sem consultar a IA. | Clarification: Ask me two questions before changing a requirement. |
| 22 | Escolha um módulo para evoluir em NestJS. | Compare controller, validação e serviço com a versão Express. | Comparatives: Compare an Express route and a NestJS controller. |

## Dias 23–36 · Java em paralelo com TypeScript

| Dia | Foco principal | Rotação e entrega | Inglês falado (20 min) |
|---|---|---|---|
| 23 | `java-01`: métodos, tipos e controle de fluxo. | Compare com a tipagem TypeScript e rode um teste JUnit. | Present simple: Explain a Java method and what it returns. |
| 24 | TicketAtlas: implemente o módulo escolhido em NestJS. | Preserve um caso de aceitação que já existia em Express. | Used to / now: Describe how the module changed after moving to NestJS. |
| 25 | `java-02`: classes, records, enums e interfaces. | Desenhe conta e movimentação do LedgerFlow. | Can / could: Explain how you could model an account in Java. |
| 26 | `sql-04`: pratique commit e rollback. | Explique o que deve acontecer se uma transferência falhar no meio. | If … fails: Describe what should happen when a transfer fails. |
| 27 | `java-03`: coleções e streams. | Compare uma operação com a mesma ideia estudada na `js-09`. | Similar to: Compare a Java stream operation with a JavaScript array method. |
| 28 | TicketAtlas: melhore um teste de integração. | Registre o que NestJS facilitou e onde ainda existe complexidade. | Should have: Explain what an integration test should cover. |
| 29 | LedgerFlow: implemente uma regra de conta em Java puro. | Escreva um teste de rejeição com JUnit. | Given / when / then: Describe a JUnit test aloud. |
| 30 | Spring Boot: exponha uma operação pequena do LedgerFlow. | Compare a rota com o que você escreveu em Express e NestJS. | Where / how: Walk me through a Spring endpoint. |
| 31 | Conecte uma consulta do LedgerFlow ao PostgreSQL. | Confira migration e ordenação do extrato. | From … to …: Trace a query from Spring to PostgreSQL. |
| 32 | Acrescente a primeira transferência. | Demonstre rollback em caso de falha. | Either … or: Explain the two valid outcomes of a transfer. |
| 33 | Em `sql-05`, observe duas operações concorrentes. | Use o cenário para planejar um teste de saldo no LedgerFlow. | At the same time: Explain what concurrent requests might do. |
| 34 | Rode o teste concorrente e investigue o resultado. | Registre a decisão e o limite da estratégia usada. | Evidence language: Tell me what your test proves and what remains unclear. |
| 35 | TicketAtlas: revise um fluxo React e uma resposta de erro da API. | Escolha um fluxo que faria sentido ter no celular. | Polite requests: Role-play a user reporting a confusing error. |
| 36 | Demonstre os dois projetos e escolha a próxima lacuna. | Faça uma mudança curta em cada linguagem e registre a ajuda necessária. | Present perfect: Summarize what you have built in each project. |

## Dias 37–51 · Complete JS, TS e SQL aplicando nos projetos

| Dia | Foco principal | Rotação e entrega | Inglês falado (20 min) |
|---|---|---|---|
| 37 | `js-13`: classes e protótipos. | Compare uma regra simples com uma classe Java já estudada. | Definitions: Explain what a prototype is with a simple example. |
| 38 | `ts-04`: funções e generics. | Tipe o retorno de uma função de listagem e confira a inferência. | Any / each: Explain what a generic function can reuse. |
| 39 | `sql-06`: índices e EXPLAIN. | Compare dois planos para a consulta de chamados e registre o que mudou. | Before / after: Compare two database query plans. |
| 40 | `js-14`: comportamento de `this`. | Investigue o que acontece ao passar um método como callback. | Depends on: Explain why the value of this can change. |
| 41 | `ts-05`: tipos utilitários. | Modele os dados de atualização de um chamado e teste um campo indevido. | Pick / omit: Explain which fields belong in an update request. |
| 42 | `js-15`: iteráveis e generators. | Consuma uma sequência de itens e observe quando cada valor é calculado. | One at a time: Describe how a generator yields values. |
| 43 | `js-16`: expressões regulares. | Teste valores válidos e inválidos para um identificador de chamado. | Examples and exceptions: Describe valid and invalid ticket identifiers. |
| 44 | `ts-06`: classes abstratas e composição. | Compare duas formas de organizar uma dependência do TicketAtlas. | Instead of: Explain a trade-off between composition and inheritance. |
| 45 | `js-17` e `ts-07`: módulos, unknown, never e any. | Exporte uma função pequena e refine um dado de entrada antes de usá-lo. | Might / may: Explain what an unknown input might contain. |
| 46 | `js-24` e `ts-08`: JSON, strict e validação em execução. | Teste JSON malformado e JSON válido com campos incorretos. | Even if: Explain why valid JSON can still contain invalid data. |
| 47 | `sql-07`: complete seed e paginação. | Teste duas páginas da listagem com ordenação estável. | Order and position: Explain why stable ordering matters for pagination. |
| 48 | `js-25` e `js-26`: imutabilidade, legibilidade e coesão. | Refatore uma função e confirme que os testes existentes continuam verdes. | Refactoring verbs: Summarize a change that preserved behavior. |
| 49 | `sql-08`: segurança, N+1 e operação. | Verifique quantas consultas uma listagem do LedgerFlow dispara. | How often: Explain how you noticed too many database queries. |
| 50 | `js-27`: Big O. | Compare a busca em array com a busca em mapa e explique o custo de preparar o mapa. | Scales with: Compare the cost of looking up items in two structures. |
| 51 | Revise as unidades pendentes dos três blocos. | Faça uma mudança no TicketAtlas que passe por TypeScript, JavaScript em execução e SQL. Registre o teste e o que fez com autonomia. | Past vs. present: Compare what you could do at the start and now. |

Se algum dia tiver duas unidades, use uma segunda sessão para terminar.
Ao revisar a cobertura, conte a prática e a evidência registrada de cada
unidade. Se ficou apenas na leitura ou em uma tentativa parcial, volte a ela
antes de considerar aquele assunto coberto.

## Dias 52–61 · Prática de Node e revisão do TicketAtlas

| Dia | Foco principal | Rotação e entrega | Inglês falado (20 min) |
|---|---|---|---|
| 52 | `node-03`: arquivos e caminhos | Leia um conjunto pequeno de chamados a partir de um arquivo e trate a ausência do arquivo. Um caso feliz e um erro reproduzível. | Error vocabulary: Explain how you handle a missing file. |
| 53 | `node-04`: buffers, streams e backpressure | Compare ler tudo em memória com processar registros aos poucos. Explique o que acontece se o leitor for mais rápido que o destino. | Too fast / too slow: Describe what happens when a stream consumer falls behind. |
| 54 | `node-05`: eventos e timers | Observe a ordem de dois eventos e limpe um listener após o uso. Previsão escrita e execução comparadas. | Before / after: Explain when a listener runs and when it is removed. |
| 55 | `node-07`: processos, logs e encerramento | Revise como a API fecha conexões ao encerrar. Demonstre uma saída limpa com log legível. | Must finish: Describe graceful shutdown for your API. |
| 56 | TicketAtlas: filtro e paginação | Aplique a consulta de paginação ao endpoint e depois à tela React. Compare duas páginas com ordenação estável. | User instructions: Show me how to filter and page through tickets. |
| 57 | Java: exceções e validação de domínio | Escolha uma operação inválida do LedgerFlow e escreva o teste antes da correção. A falha preserva o estado da conta. | Should reject: Explain how a domain rule protects an account. |
| 58 | TicketAtlas: formulário e acessibilidade | Percorra criação de chamado só com teclado e confira mensagens de erro. Um erro corrigido e reprodução anotada. | Polite feedback: Describe an accessibility issue and suggest a fix. |
| 59 | Revisão de JavaScript assíncrono | Revisite `js-21` e `js-23` com promises e timers. Explique um resultado inesperado. Uma previsão conferida e uma rejeição tratada. | Prediction: Explain which async result you expected first. |
| 60 | Java: generics e coleções | Escolha uma estrutura para agrupar movimentações por conta e compare com um Map em TS. Explique a escolha e cubra coleção vazia. | Grouping: Explain how you group transactions by account. |
| 61 | Revisão de autonomia | Reescreva uma função do TicketAtlas sem olhar a implementação anterior. Rode um teste e registre a ajuda usada. | Reflection: Describe what you rewrote and where you needed help. |

## Dias 62–71 · Segurança e qualidade nas duas APIs

| Dia | Foco principal | Rotação e entrega | Inglês falado (20 min) |
|---|---|---|---|
| 62 | TicketAtlas: identidade e acesso | Desenhe os casos de autor, responsável e usuário sem acesso. Uma tabela de permissões por ação. | Permission language: Explain who can open, assign and update a ticket. |
| 63 | TicketAtlas: autenticação em NestJS | Proteja uma rota e use o cliente HTTP para verificar a resposta sem credencial. Teste de autenticação com sucesso e falha. | Without / with: Compare authenticated and unauthenticated requests. |
| 64 | LedgerFlow: Spring Security | Proteja a consulta de extrato e compare o fluxo com um guard do NestJS. Teste para titular e outra conta. | Only if: Explain when a customer can see an account statement. |
| 65 | SQL: autorização e dados de teste | Verifique quais dados cada operação precisa acessar e monte registros sintéticos. Demonstre que um usuário só consulta recursos permitidos. | Minimal access: Describe which data each role needs. |
| 66 | TicketAtlas: respostas de erro | Padronize uma resposta de validação e conecte a mensagem ao formulário. Teste de API e demonstração na tela. | Plain-language errors: Rewrite an API error as a message to a user. |
| 67 | LedgerFlow: persistência com JPA | Revise entidades, relacionamentos e o limite de uma transação. Explique uma consulta gerada e verifique seu resultado. | Process explanation: Describe when a database transaction starts and ends. |
| 68 | LedgerFlow: integração com PostgreSQL | Valide o schema e rode um caso de transferência em banco de teste. Resultado que pode ser reproduzido em ambiente limpo. | Reproduction steps: Tell another developer how to run a database test. |
| 69 | TicketAtlas: contrato da API | Documente uma rota, incluindo entrada, resposta e erro. Um teste que falha quando o contrato muda. | Contract language: Explain which API change would break a client. |
| 70 | React: sessão e navegação | Trate a expiração da sessão na tela de chamados. Demonstre o retorno ao login sem perder a explicação do erro. | When a session expires: Role-play helping a user sign in again. |
| 71 | Revisão cruzada | Compare validação, DI e autorização em Express, NestJS e Spring. Explique as diferenças usando código seu. | Compare and justify: Explain how validation differs across your two stacks. |

## Dias 72–81 · Consistência, automação e RAG

| Dia | Foco principal | Rotação e entrega | Inglês falado (20 min) |
|---|---|---|---|
| 72 | LedgerFlow: idempotência | Defina o comportamento para requisição repetida e mesma chave com dados diferentes. Casos de teste para repetição e conflito. | Repeated requests: Explain idempotency to a teammate using an example. |
| 73 | TicketAtlas: automação de chamados atrasados | Use SQL para selecionar chamados abertos além do prazo e gere um resumo em TypeScript. Teste o limite de 48 horas. | Time expressions: Explain when a ticket becomes overdue. |
| 74 | TicketAtlas: reexecução do job | Simule falha e nova tentativa. Verifique que o mesmo chamado não gera dois avisos na mesma execução lógica. | Retry language: Explain what the job should do after a failure. |
| 75 | LedgerFlow: reconciliação | Compare o efeito de uma transferência nos dois lados e no extrato. Demonstre que débito e crédito conciliam. | Both / neither: Describe how you reconcile both sides of a transfer. |
| 76 | SQL: planos e índices em contexto | Meça uma consulta de extrato antes e depois de uma mudança. Plano, volume de dados e observação registrados. | Measurement language: Describe a performance observation with numbers. |
| 77 | TicketAtlas: Docker Compose | Suba aplicação e PostgreSQL com dados de demonstração. Outra pessoa consegue iniciar pelo README. | Setup instructions: Guide me through starting TicketAtlas locally. |
| 78 | LedgerFlow: Docker Compose | Suba API, banco e migrations em ambiente limpo. Smoke test da consulta de extrato. | Verification language: Explain how to check that LedgerFlow is running. |
| 79 | TicketAtlas: recuperação de guias para RAG | Use alguns guias sintéticos e compare quais trechos aparecem para perguntas conhecidas. Comece pela busca textual no PostgreSQL. | Source vocabulary: Explain how your search selects relevant guides. |
| 80 | TicketAtlas: resposta com fontes em TypeScript | Passe os trechos ao modelo, valide a saída e confira se as fontes citadas vieram da busca. Use um provedor simulado nos testes. | Attribution: Answer a question and say which guide supports the answer. |
| 81 | TicketAtlas: avalie respostas e falhas do RAG | Teste uma pergunta respondida pelos guias, outra sem cobertura e um timeout. Registre as fontes e avalie se embeddings ajudariam. | Uncertainty: Say that a guide lacks the answer and explain what you checked. |

## Dias 82–91 · Operação e qualidade do fluxo web

| Dia | Foco principal | Rotação e entrega | Inglês falado (20 min) |
|---|---|---|---|
| 82 | TicketAtlas: logs estruturados | Acompanhe uma requisição entre tela e backend por um identificador. Encontre o log de um erro de validação. | Timeline: Walk me through one request using its logs. |
| 83 | LedgerFlow: health e métricas | Observe latência e taxa de erros antes de induzir uma falha local. Evidência de como você percebeu a degradação. | Symptoms and causes: Give a short update about service degradation. |
| 84 | React web: detalhe do chamado | Conecte a lista à página de detalhe. Demonstre o fluxo com um chamado válido. | User story: Explain what someone needs from the ticket detail page. |
| 85 | React web: estados de tela | Verifique carregamento, lista vazia e resposta de erro usando a API. | Contrast states: Describe loading, empty and error states in the browser. |
| 86 | Java: transferência concorrente | Repita a corrida com entradas diferentes e revise o resultado do banco. Explique qual invariante o teste protege. | Invariant language: Explain what must remain true under concurrent transfers. |
| 87 | React web: acesso e rota inválida | Teste a navegação para um chamado inexistente e para um chamado sem permissão. | Permission scenario: Role-play a user who cannot access a ticket. |
| 88 | TypeScript: contrato web e móvel | Confira quais tipos e casos de teste podem ser usados pelas duas interfaces. Uma mudança de contrato identificada por teste. | Concise status update: Report a release check and one remaining risk. |
| 89 | React web: recuperação de falha | Simule indisponibilidade da API e ofereça nova tentativa sem duplicar a ação. | Integration vocabulary: Explain how a ticket could become a Salesforce Case. |
| 90 | Entrega em ambiente de teste | Rode build e testes em CI, faça um smoke test do fluxo React e registre a URL ou os comandos de reprodução. | Demo language: Narrate a successful run and a simulated failure. |
| 91 | Revisão de operação | Investigue um cenário de erro com logs e testes. Linha do tempo curta, hipótese e próximo passo. | Incident recap: Give a short timeline and name the next action. |

## Dias 92–100 · Autonomia e portfólio

| Dia | Foco principal | Rotação e entrega | Inglês falado (20 min) |
|---|---|---|---|
| 92 | Auditoria de cobertura | Confira as 27 unidades JS, 8 TS, 8 SQL e 7 Node e retome o primeiro assunto sem evidência. Lista do que ainda precisa de prática. | Self-assessment: Tell me which skill you need to practice and why. |
| 93 | TicketAtlas: requisito novo | Implemente um filtro ou uma regra de acesso sem consultar uma solução anterior. Mudança, teste e explicação do erro encontrado. | Clarify scope: Ask me questions about a new TicketAtlas feature. |
| 94 | LedgerFlow: requisito novo | Implemente uma regra de transferência e verifique rejeição e persistência. Teste reproduzível e decisão registrada. | Defend a decision: Explain a transfer rule and a rejected alternative. |
| 95 | SQL: desafio de debugging | Investigue consulta lenta, resultado duplicado ou página inconsistente. Mostre a reprodução e compare a correção. | Debugging narrative: Describe a SQL issue, your hypothesis and the fix. |
| 96 | TicketAtlas: revisão do fluxo web | Demonstre abertura de chamado, falha e recuperação no React. Registre evidência para o portfólio. | User support: Explain how to recover from a network error on the web. |
| 97 | Revisão de código | Revise um diff de cada projeto pensando em legibilidade, dados e falhas. Dois achados com reprodução ou evidência. | Code review: Give specific, polite feedback on a small change. |
| 98 | Documentação do TicketAtlas | Escreva instruções de execução e registre o contrato de um fluxo completo. Uma pessoa consegue reproduzir o fluxo pelo README. | Portfolio pitch: Present TicketAtlas to a recruiter in one minute. |
| 99 | Documentação do LedgerFlow | Descreva invariantes, modelo e teste de concorrência. README com diagrama e evidência de consistência. | Technical pitch: Present LedgerFlow and its concurrency test in one minute. |
| 100 | Entrevista prática | Explique uma decisão em TypeScript e outra em Java e depure um caso curto. Registre o que conseguiu explicar sem ajuda. | Interview practice: Answer follow-ups on both projects and summarize your progress. |

## Dias 101–110 · Revisão dos dois projetos

| Dia | Foco principal | Rotação e entrega | Inglês falado (20 min) |
|---|---|---|---|
| 101 | TS e unions | Modele transições e teste um estado inválido. | Explain valid ticket states. |
| 102 | Java e coleções | Agrupe movimentações por conta. | Explain your choice of collection. |
| 103 | PostgreSQL e joins | Liste chamados com e sem responsável. | Compare inner and left joins. |
| 104 | React e formulários | Reproduza um erro no campo de título. | Explain controlled inputs. |
| 105 | NestJS e DI | Troque o repositório por um substituto no teste. | Explain dependency injection. |
| 106 | Spring e DI | Trace controller, serviço e repositório. | Compare dependency injection across stacks. |
| 107 | REST e erros | Teste os status de sucesso e entrada inválida. | Justify one HTTP status. |
| 108 | Migrations | Adicione uma coluna preservando os dados. | Explain how you preserved existing data. |
| 109 | Autonomia em TS | Mude uma regra do TicketAtlas e rode um teste. | Describe a change you made independently. |
| 110 | Autonomia em Java | Mude uma regra de conta e teste a rejeição. | Explain which rule the test protects. |

## Dias 111–125 · Jenkins, Docker e operação

| Dia | Foco principal | Rotação e entrega | Inglês falado (20 min) |
|---|---|---|---|
| 111 | CI e CD | Desenhe commit, testes, imagem e entrega. | Distinguish integration from delivery. |
| 112 | Jenkins local | Inicie o ambiente e rode um job simples. | Describe your local setup. |
| 113 | Jenkinsfile declarativo | Escreva checkout e uma etapa de checagem. | Explain pipeline stages. |
| 114 | Jenkins e Maven | Execute os testes do LedgerFlow no pipeline. | Walk through the Maven stage. |
| 115 | Falha no pipeline | Quebre um teste local e confirme o bloqueio. | Explain why the next stage stopped. |
| 116 | Relatórios JUnit | Localize um teste que falhou pelo relatório. | Describe how you found a failure. |
| 117 | Imagem Docker | Identifique a imagem pelo commit validado. | Explain how to identify an image. |
| 118 | Credenciais | Identifique quais etapas precisam de credenciais e revise os logs. | Describe how credentials are handled. |
| 119 | Homologação local | Suba a imagem validada e rode um smoke test. | Describe your smoke test. |
| 120 | Rollback | Volte à imagem anterior e confira a saúde. | Walk through your rollback. |
| 121 | Redis: caso de uso | Escolha uma consulta e meça a linha de base. | Explain when a cache helps. |
| 122 | Redis: TTL | Confira a leitura antes e depois da expiração. | Describe cache expiration. |
| 123 | Redis: invalidação | Atualize o dado na origem e teste o cache. | Explain how stale data appears. |
| 124 | Telemetria | Correlacione uma requisição com o log e a latência. | Summarize a latency observation. |
| 125 | Revisão de entrega | Demonstre pipeline, falha e recuperação. | Give a release update. |

## Dias 126–140 · Automação e RAG em TypeScript e Java

| Dia | Foco principal | Rotação e entrega | Inglês falado (20 min) |
|---|---|---|---|
| 126 | IA em TS: contrato | Defina o formato do resumo e exemplos inválidos. | Explain structured output. |
| 127 | Job Node | Selecione chamados atrasados e teste o limite. | Explain the overdue rule. |
| 128 | Job Node com IA | Valide o resumo gerado com dados sintéticos. | Describe how you validate a summary. |
| 129 | Job Node: falhas | Simule timeout e reexecução sem aviso duplicado. | Explain what happens after a timeout. |
| 130 | RAG em TS: avaliação | Separe perguntas com fonte conhecida e sem cobertura. | Describe your evaluation set. |
| 131 | RAG em TS: busca textual | Compare os trechos encontrados com a fonte esperada. | Explain why a source is relevant. |
| 132 | RAG em TS: embeddings | Compare busca vetorial e textual numa mesma pergunta. | Compare keyword and vector search. |
| 133 | RAG em TS: citações | Teste fonte correta, citação inválida e ausência de evidência. | Explain when to abstain. |
| 134 | Spring AI: cliente | Valide a saída estruturada de uma chamada pequena. | Describe how you validate model output. |
| 135 | Spring AI: teste | Simule resposta inválida e timeout. | Explain why you use a fake provider. |
| 136 | Spring AI: ingestão | Carregue os mesmos guias e preserve os metadados. | Explain how you track sources. |
| 137 | Spring AI: pgvector | Recupere trechos com embeddings para uma pergunta. | Walk through retrieval in Java. |
| 138 | Comparação de RAG | Compare fontes, abstenção e latência nas duas stacks. | Compare one result from each stack. |
| 139 | Job Spring: reconciliação | Calcule totais sintéticos e teste um desvio. | Explain how you reconcile totals. |
| 140 | Job Spring com IA | Redija um resumo a partir dos totais e teste fallback. | Describe what happens when the model fails. |

## Dias 141–155 · Integração corporativa opcional

| Dia | Foco principal | Rotação e entrega | Inglês falado (20 min) |
|---|---|---|---|
| 141 | Escopo da integração | Escolha MuleSoft/Salesforce ou um CRM simulado com os mesmos critérios. | Explain which integration you chose. |
| 142 | Salesforce: Case e campos | Configure ou modele os campos e o acesso de um Case. | Describe what a Case represents. |
| 143 | Apex opcional: SOQL | Consulte Cases de teste. No caminho simulado, teste um filtro equivalente. | Compare SOQL with a familiar query. |
| 144 | Apex opcional: DML | Pratique uma gravação e um teste isolado ou valide a gravação no simulador. | Explain how you test record updates. |
| 145 | Anypoint Studio | Abra um fluxo HTTP mínimo ou execute o adaptador local. | Describe what the integration accepts. |
| 146 | API-led: fronteiras | Desenhe TicketAtlas, integração e CRM e indique quem controla cada contrato. | Explain who owns each contract. |
| 147 | DataWeave | Mapeie os dados de um chamado para o Case ou teste o mapeamento local. | Describe one transformation. |
| 148 | Conector Salesforce | Envie um payload de teste e registre o ID externo. | Walk through a successful sync. |
| 149 | Tratamento de erros | Separe entrada inválida de indisponibilidade e teste a recuperação. | Explain which failure should be retried. |
| 150 | React: estado da sincronização | Mostre pendente, sincronizado e erro. | Describe the sync states. |
| 151 | Identidade externa | Reenvie o mesmo chamado e confirme um único Case. | Explain how you prevent duplicates. |
| 152 | Reconciliação | Recupere um chamado pendente depois de uma falha simulada. | Narrate a failed sync and recovery. |
| 153 | Teste de contrato | Verifique o contrato com um substituto local. | Explain what the contract test proves. |
| 154 | Apex opcional: triggers | Explore um trigger isolado ou teste uma regra de atualização no simulador. | Explain when a trigger would be useful. |
| 155 | Demo da integração | Grave a criação, a falha e a recuperação usando dados sintéticos. | Present the integration in one minute. |

## Dias 156–165 · Arquitetura, qualidade e recuperação

| Dia | Foco principal | Rotação e entrega | Inglês falado (20 min) |
|---|---|---|---|
| 156 | Fronteiras | Desenhe os sistemas e dependências externas. | Explain the boundaries in your diagram. |
| 157 | ADR | Registre uma decisão com alternativa e custo. | Defend one trade-off. |
| 158 | Autorização | Adicione um teste de acesso negado. | Explain how you verify authorization. |
| 159 | Concorrência | Repita uma corrida e inspecione o estado persistido. | Explain what can go wrong under concurrency. |
| 160 | Acessibilidade web | Use teclado no formulário e corrija um problema. | Describe the accessibility fix. |
| 161 | Revisão de CI | Compare o pipeline com um teste quebrado e corrigido. | Compare the two build results. |
| 162 | Avaliação de IA | Compare respostas com e sem recuperação e anote uma falha. | Explain one evaluation limitation. |
| 163 | Reexecução de jobs | Rode um job duas vezes e confira efeitos e logs. | Explain why retries are safe. |
| 164 | Carga local | Meça latência com um volume pequeno e registre o cenário. | Report a measurement with context. |
| 165 | Recuperação | Restaure dados sintéticos e valide a consulta. | Walk through a recovery check. |

## Dias 166–180 · Portfólio e autonomia

| Dia | Foco principal | Rotação e entrega | Inglês falado (20 min) |
|---|---|---|---|
| 166 | README TicketAtlas | Revise contrato, diagrama e comandos em inglês. | Pitch TicketAtlas to a recruiter. |
| 167 | README LedgerFlow | Documente invariantes, concorrência e Jenkins. | Pitch LedgerFlow to a backend engineer. |
| 168 | README integração | Descreva o que foi testado no simulador e no ambiente de prática. | Describe what the integration demo proves. |
| 169 | LinkedIn | Esboce um post sobre falha e recuperação. | Deliver a short project update. |
| 170 | Entrevista JS/TS | Resolva uma mudança de tipos e explique a execução. | Explain your TypeScript solution. |
| 171 | Entrevista Java | Depure uma operação de persistência. | Answer a follow-up about transactions. |
| 172 | Entrevista SQL | Escreva um join e explique o plano. | Justify your join choice. |
| 173 | System design | Desenhe uma evolução e defenda um limite de serviço. | Describe how you would handle higher load. |
| 174 | Autonomia TicketAtlas | Implemente uma mudança do requisito ao teste. | Summarize what you did independently. |
| 175 | Autonomia LedgerFlow | Mude uma regra e demonstre consistência. | Explain how you proved the rule works. |
| 176 | Revisão de PR | Encontre um problema reproduzível em cada projeto. | Give specific code review feedback. |
| 177 | Demonstração técnica | Mostre um fluxo web e uma transferência em cinco minutos. | Give a five-minute technical demo. |
| 178 | Retrospectiva | Liste três evidências e duas lacunas da matriz. | Explain which skills you need to deepen. |
| 179 | Repetição sem ajuda | Refaça uma mudança curta que antes exigiu dica. | Compare your first and second attempts. |
| 180 | Próximo ciclo | Escolha duas competências e um marco para comprovar cada uma. | Summarize your next priorities. |

Os marcos futuros são planejados. Material de exercício entra conforme o avanço.
