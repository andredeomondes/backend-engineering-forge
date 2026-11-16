# Matriz de cursos e prática

Análise das grades públicas dos instrutores. Os tópicos abaixo são uma
síntese. Use até 10 minutos de vídeo ou leitura para a tarefa do dia. Com
aulas mais longas, selecione um trecho ou leia a documentação. A assinatura
de cursos é opcional.

| Competência | Grade consultada | Conteúdos em ordem de prática | Aplicação no roteiro |
|---|---|---|---|
| JS, TS e Express | [JavaScript e TypeScript — Miranda e Calogi](https://www.udemy.com/course/curso-de-javascript-moderno-do-basico-ao-avancado/) | lógica e funções → arrays/objetos e assincronismo → tipagem e API REST | Dias 1–16. Aproveite Express e validação. Use PostgreSQL no projeto. |
| Node/Express (EN) | [NodeJS — Academind](https://www.udemy.com/course/nodejs-the-complete-guide/) | runtime e servidor HTTP → Express e middleware → dados, REST e autenticação | Dias 7–16 e 52–61. Compare servidor nativo e rota Express. |
| NestJS | [NestJS para REST API](https://www.udemy.com/course/nestjs-curso-completo-rest-api-typeorm-jwt-e-mais/) | módulos, controllers, providers → TypeORM e DTOs → JWT e testes | Dias 22–28, 62–71 e 105. Evolua um módulo do TicketAtlas. |
| SQL (EN) | [The Complete SQL Bootcamp — Jose Portilla](https://www.udemy.com/course/the-complete-sql-bootcamp/) | consultas e filtros → agregações → joins → tabelas e constraints | Dias 2–15, 26, 33 e 39–49. O Forge acrescenta locks e EXPLAIN com os projetos. |
| React web | [React JS 19 e Next.js 15](https://www.udemy.com/course/curso-de-reactjs-nextjs-completo-do-basico-ao-avancado/) | projeto React/Vite/TS com componentes, hooks e rotas; Next.js em etapa própria | Dias 17–21 e 84–89. Aplique a parte de React/Vite à interface existente. |
| React (EN) | [The Ultimate React Course — Jonas Schmedtmann](https://www.udemy.com/course/the-ultimate-react-course/) | componentes e estado → efeitos e consumo de dados → roteamento → Next.js | Use estado e efeitos na lista, formulário e detalhe do TicketAtlas. |
| Java Core | [Java COMPLETO — Cod3r](https://www.udemy.com/course/fundamentos-de-programacao-com-java/) | tipos e controle → classes → arrays/coleções → OO, exceções e generics | Dias 23–29, 57 e 60. Modele contas e escreva testes em JUnit. |
| Spring e deploy | [Spring Boot REST APIs do zero à nuvem](https://www.udemy.com/course/restful-apis-do-0-a-nuvem-com-springboot-e-docker/) | REST → Spring, persistência, segurança e testes → Docker e cloud | Dias 30–34, 64–68 e 111–120. Compare o pipeline do Forge em Jenkins. |
| Spring (EN) | [Spring Boot & Hibernate for Beginners — Chad Darby](https://www.udemy.com/course/spring-hibernate-tutorial/) | Spring Core e DI → JPA/Hibernate → REST e segurança | Use os recortes de DI, persistência e autorização no LedgerFlow. |
| RAG TypeScript (EN) | [LangChain with TypeScript](https://www.udemy.com/course/langchain-with-typescript/) | chamada ao modelo, recuperação e RAG, ferramentas e agentes | Dias 126–133. Teste busca, fontes e fallback. Agentes ficam para outro ciclo. |
| RAG Java (EN) | [Build AI-Driven Apps with Java](https://www.udemy.com/course/build-ai-driven-apps-with-java-spring-ai-rag-agents/) | Spring AI → embeddings/pgvector → RAG e tool calling | Dias 134–140. Compare com o mesmo conjunto de guias sintéticos e teste o job Java. |
| Jenkins (EN) | [Learn DevOps: CI/CD with Jenkins](https://www.udemy.com/course/learn-devops-ci-cd-with-jenkins-using-pipelines-and-docker/) | Jenkinsfile, pipeline Java/Maven, Docker e entrega | Dias 111–120. Prove que falha de teste bloqueia a entrega. |
| Salesforce/Apex | [Apex do Zero ao Profissional](https://www.udemy.com/course/apex-do-zero-ao-profissional/) | ambiente Salesforce → Apex → SOQL, DML e triggers | Dias 142–144 e 154. Use um Case de teste e deixe trigger como exploração isolada. |
| Salesforce (EN) | [Salesforce Administrator Fundamentals](https://www.udemy.com/course/salesforce-administrator-fundamentals-a-complete-guide/) | objetos, permissões, Case Management e Flow | Dia 142. Configure o mínimo necessário para o laboratório. |
| MuleSoft | [Mulesoft — Do zero à Certificação](https://www.udemy.com/course/mulesoft-do-zero-a-certificacao/) | API-led → Anypoint → desenho de APIs → Studio e transformação | Dias 145–147. Desenhe contratos e mapeie o chamado. |
| MuleSoft (EN) | [MuleSoft 4.X Complete Guide](https://www.udemy.com/course/mule-4x-indepth-beginner-to-expert-with-real-time-use-cases/) | setup → primeiro app e debugging → transformação e tratamento de erros | Dias 145–153. Implemente uma integração pequena e demonstre falha e reenvio. |
| MuleSoft e CRM | [Mulesoft: Integrando com a Salesforce](https://www.udemy.com/course/mulesoft-integrando-com-a-salesforce/) | DataWeave e chamadas à API Salesforce | Dias 147–152. Sincronize o Case e teste efeito único. |

## Como as grades mudam a ordem

Nos cursos internacionais consultados, Node passa do runtime e HTTP para
rotas e persistência, React passa de componentes e estado para efeitos e
rotas, e Spring trabalha injeção, persistência, REST e segurança. O Forge
aplica essas dependências em dois projetos e alterna SQL, testes e interface
desde os primeiros ciclos. Next.js pode entrar depois de React conforme
uma necessidade do projeto.

Para integração corporativa, configure um Case, valide o contrato, transforme
o payload e trate a falha antes de demonstrar a sincronização. SOQL, DML e
triggers são prática opcional separada. O laboratório também funciona com um
CRM simulado. Jenkins entra depois de os testes rodarem localmente.

Para IA, pratique saída estruturada e falhas do provedor. Depois compare
recuperação textual e vetorial, respostas com fontes e abstenção nas duas
linguagens. Calcule prazos e valores no código e use o modelo para resumir
resultados. Documente a evidência nas [competências](../../SKILLS_MATRIX.md).

