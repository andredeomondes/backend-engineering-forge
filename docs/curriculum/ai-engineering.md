# Engenharia de IA — do básico ao avançado

Ementa para virar engenheiro de IA **dentro do Forge**, sem abrir uma trilha
separada. Cada nível entra em um projeto que já existe (TicketAtlas ou
LedgerFlow), então a prática de IA reforça a de backend em vez de competir
com ela.

## Decisões

| Tema | Decisão | Por quê |
|---|---|---|
| Linguagem | TypeScript no TicketAtlas, Java (Spring AI) no LedgerFlow. Python só em um laboratório no nível A8 | Mantém as duas stacks atuais. O trabalho de engenharia de IA (integração, RAG, agentes, evals, segurança) é igual em qualquer linguagem; Python pesa mais em treino e fine-tuning |
| Profundidade | IA **aplicada**: LLMs, RAG, agentes, MCP, evals, segurança, LLMOps. ML clássico e deep learning só em nível conceitual | Engenheiro de IA constrói sistemas em cima de modelos prontos. Treinar modelos é outra carreira (cientista/ML engineer) |
| Ordem | API crua primeiro, framework depois | Quem só conhece LangChain não sabe depurar quando ele falha. Bibliotecas finas e o SDK do provedor vêm antes de LangGraph e Spring AI |
| Medir sempre | **Evals** a partir do nível A1, não no fim | Sem teste de qualidade, "funcionou no meu exemplo" não prova nada |
| Dados | Sintéticos. Nenhum dado real de cliente ou financeiro em prompts de provedor externo | Regra de segurança do projeto (ver A6) |

Fora do núcleo: n8n e vibe coding são ferramentas de apoio, não conteúdo.
Fine-tuning é raro na prática e fica no último nível.

## Como encaixar no roteiro de 60 min/dia

Comece depois do **dia 60**, quando existirem o primeiro fluxo web do
TicketAtlas e o primeiro fluxo Java. Use **2 das 7 sessões da semana**, sempre
dentro do projeto da semana, sem criar projeto novo. Horas estimadas: ~150 h no
total.

| Quando (roteiro de 180 dias) | Nível | Projeto de encaixe |
|---|---|---|
| Dias 62–71 | A0 e A1 | TicketAtlas: resumo de chamado |
| Dias 72–81 | A2 | TicketAtlas: RAG sobre guias (já previsto nos dias 79–81) |
| Dias 92–110 | A3 | TicketAtlas e LedgerFlow: evals e observabilidade |
| Dias 121–150 | A4 e A5 | TicketAtlas: MCP e agente de triagem |
| Dias 151–180 | A6 e A7 | LedgerFlow: agente com aprovação e guardrails |
| Depois dos 180 | A8 | Laboratório Python e arquitetura enterprise |

Os dias exatos podem deslizar. Vale a evidência registrada, não a data.

## Níveis

No painel, a Fase 8 (`f08`) lista um tópico por nível A0–A7. O A8 fica
fora do painel porque vem depois dos 180 dias.

Cada nível tem: conteúdo, entrega no projeto, evidência e gate. Gate segue a regra
do Forge: recomendado, nunca obrigatório.

### A0 — Fundamentos de LLMs (≈6 h)

- **Conteúdo:** o que é um LLM em termos práticos; tokens, janela de contexto,
  temperatura, custo por token, latência; ML e deep learning em uma página (o
  bastante para conversar); modelos proprietários vs. abertos; rodar um modelo
  local com Ollama; limites reais (alucinação, dado desatualizado, não
  determinismo).
- **Entrega:** nota comparando 2 modelos (um local, um via API) na mesma tarefa
  de resumo de chamado, com custo e latência medidos.
- **Gate:** explicar sem consulta por que o mesmo prompt dá respostas diferentes
  e o que custa mais: entrada ou saída.

### A1 — Integração de API e prompts (≈12 h)

- **Conteúdo:** chamar a API do provedor em TypeScript e em Java; mensagens e
  papéis; **saída estruturada** com JSON Schema e Zod; streaming; timeout, retry
  com backoff e tratamento de erro do provedor; prompt como código versionado;
  técnicas básicas de prompt (instrução, exemplos, formato de saída).
- **Entrega:** TicketAtlas gera resumo e prioridade sugerida de um chamado, com
  resposta validada contra o schema. Resposta inválida é rejeitada e tratada.
- **Evidência:** teste com provedor simulado (nenhum teste depende de rede) cobrindo
  resposta válida, JSON quebrado e timeout.
- **Gate:** a falha do provedor nunca derruba a abertura do chamado.

### A2 — Embeddings e RAG (≈20 h)

- **Conteúdo:** embeddings e similaridade; chunking; pgvector no PostgreSQL;
  busca híbrida (textual + vetorial); citar fontes; responder "não tenho
  evidência" quando faltar; reranking em nível conceitual; RAG avançado
  (reescrita de consulta, filtros por metadado, permissão por documento).
- **Entrega:** TicketAtlas responde perguntas sobre guias internos com fontes.
  LedgerFlow, no lado Java: Spring AI respondendo sobre extrato sintético, com as
  mesmas perguntas, para comparar as duas stacks.
- **Evidência:** pergunta com resposta nos guias, pergunta sem cobertura e uma
  com guia que o usuário não pode ver.
- **Gate:** trecho citado realmente contém o que a resposta afirma.

### A3 — Evals e observabilidade (≈12 h)

- **Conteúdo:** conjunto de casos de teste (dataset dourado); métricas
  (exatidão, fidelidade às fontes, recusa correta); LLM como juiz, com suas
  limitações; avaliação de regressão no CI; tracing de chamadas (prompt, modelo,
  tokens, latência, custo); logs sem dado sensível.
- **Entrega:** suíte de avaliação do RAG rodando no CI com limite mínimo de
  qualidade; painel simples de custo e latência por funcionalidade.
- **Gate:** mudar um prompt e mostrar, com números, se melhorou ou piorou.

### A4 — Tools, function calling e MCP (≈12 h)

- **Conteúdo:** function calling; desenho de tools (nome, schema, efeito
  colateral, idempotência); validar argumentos que o modelo gera; **MCP**
  (servidor e cliente); tool só de leitura vs. tool que altera estado.
- **Entrega:** servidor MCP do TicketAtlas expondo consulta de chamados (somente
  leitura) e uma tool de mudança de status com confirmação.
- **Gate:** argumentos inválidos gerados pelo modelo são recusados e a tool que
  escreve exige confirmação.

### A5 — Agentes (≈24 h)

- **Conteúdo:** loop do agente (ReAct, plan-and-execute); LangGraph.js e
  equivalente em Spring AI; memória de curto e longo prazo; **engenharia de
  contexto** (o que entra na janela, resumir, descartar); limite de passos e de
  orçamento; **human-in-the-loop**; quando multi-agente vale a complexidade (quase
  nunca no começo).
- **Entrega:** agente de triagem do TicketAtlas que classifica, busca guias e
  propõe resposta. No LedgerFlow, agente que **propõe** uma transferência e só
  executa com aprovação humana explícita.
- **Evidência:** trace completo de uma execução, mais teste de parada por limite
  de passos.
- **Gate:** o agente nunca executa ação que altera dinheiro sem aprovação, mesmo
  quando o texto do usuário pedir.

### A6 — Segurança e governança (≈12 h)

- **Conteúdo:** prompt injection (direta e indireta, via documento recuperado);
  vazamento de dados e PII; menor privilégio por tool; guardrails de entrada e
  saída; isolamento entre usuários no RAG; auditoria de cada ação do agente; LGPD
  em nível prático; custo como vetor de abuso.
- **Entrega:** exercício de red team contra o agente: 10 ataques documentados, os
  que passaram e a correção de cada um.
- **Gate:** um documento malicioso no RAG não consegue acionar uma tool.

### A7 — Produção e LLMOps (≈20 h)

- **Conteúdo:** model routing (modelo barato para tarefa simples, forte para a
  difícil); cache de resposta e cache semântico; jobs assíncronos e filas para
  chamadas lentas; rate limit e cota por usuário; fallback entre provedores;
  versionamento de prompt e de modelo; deploy e custo (FinOps).
- **Entrega:** chamadas de IA do LedgerFlow saem por fila com idempotência (mesmo
  princípio da Plataforma de Pedidos), com fallback e teto de custo.
- **Gate:** queda do provedor degrada a funcionalidade, não o sistema; relatório
  de custo por 1.000 requisições.

### A8 — Avançado e especialização (≈30 h, depois dos 180 dias)

- **Conteúdo:** preparação de dados e dataset; fine-tuning via API e LoRA/PEFT
  (laboratório em **Python**); avaliar se fine-tuning compensa frente a RAG e
  prompt; destilação e modelos locais; arquitetura enterprise de IA (várias
  equipes, governança, plataforma interna); multi-agente quando justificado.
- **Entrega:** laboratório que compara RAG, prompt e fine-tuning na mesma tarefa
  com custo e qualidade medidos.
- **Gate:** defender, com números, quando **não** fazer fine-tuning.

## Mapa para a lista de "Engenheiro de IA de verdade"

| Tema | Onde entra |
|---|---|
| Arquitetura de IA | A7, A8 |
| Agentic workflows | A5 |
| Harness engineering | A3 (suíte de avaliação) e A5 (loop e limites) |
| Engenharia de contexto | A5 |
| Human-in-the-loop | A5 |
| RAG avançado | A2 |
| Fine-tuning | A8 |
| Model routing | A7 |
| Evals e LLMOps | A3, A7 |
| MCP | A4 |
| Agent memory e skills | A5 |
| Segurança | A6 |
| Escalabilidade | A7 e fases de backend do Forge |

## Referência externa

O curso UNIPDS "Engenharia de Software com IA Aplicada" cobre tema parecido
(fundamentos, integração de APIs, MCP, agentes, arquitetura com IA, fine-tuning,
segurança e carreira, em JS/TS com partes em Python). Use como material de apoio
por nível. Esta ementa mantém o foco em produto e projeto do Forge. O mapeamento
foi feito por um resumo parcial do repositório, então confira os módulos antes de
adotar um deles.
