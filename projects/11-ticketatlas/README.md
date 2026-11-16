---
id: project-11-ticketatlas
title: TicketAtlas — gestão de chamados
status: planned
estimatedHours: 80
unlockAfter: null
---

# TicketAtlas

Primeiro projeto full-stack da sequência de estudo. Um time precisa abrir,
listar e acompanhar chamados e saber por que uma mudança de status foi recusada.

| Marco | Entrega | Evidência |
|---|---|---|
| 1 · TypeScript e Express | Abertura, listagem e mudança de status em memória | Teste de entrada inválida e transição recusada |
| 2 · PostgreSQL | Schema versionado, persistência e filtros | Ambiente limpo reproduz migration e teste |
| 3 · React | Lista e formulário conectados à API | Erros e carregamento visíveis na interface |
| 4 · NestJS | Evolução de um módulo e autorização por recurso | Teste de contrato e comparação com Express |
| 5 · Automação em TypeScript | Job de chamados atrasados com PostgreSQL | Reexecução sem duplicar notificações |
| 6 · RAG em TypeScript | Perguntas sobre guias internos de exemplo | Resposta cita a fonte e admite ausência de evidência |
| 7 · Qualidade React web | Detalhe, estados de tela e recuperação | Demonstração com falha simulada e teste |

Prática guiada pelo [roteiro por dias](../../docs/curriculum/study-sessions.md).
Depois do primeiro fluxo web, comece Java Core em paralelo. A aplicação
de Java/Spring fica no [LedgerFlow](../02-ledgerflow/README.md).

## Integração opcional MuleSoft e Salesforce

**Objetivo:** enviar um chamado do TicketAtlas para a equipe de atendimento,
que acompanha o caso no Salesforce. Comece depois de ter o fluxo web funcional.
Pode fazer esta extensão em paralelo com Java.

1. Defina o contrato e use dados sintéticos. No MuleSoft, transforme o payload
   com DataWeave e crie um Case no ambiente de prática do Salesforce.
2. Mostre no React o estado da sincronização e o ID externo. Simule uma falha,
   mantenha o chamado pendente e demonstre a recuperação com nova tentativa.
3. Use o ID do chamado como identidade externa e teste que o reenvio gera
   um único Case. Use um substituto local da API externa nos testes repetíveis.
4. Publique um diagrama e instruções de reprodução no README. Para o LinkedIn,
   grave uma demo curta mostrando criação, falha e recuperação. Treine em
   inglês a explicação de como evitou duplicatas.

Angular, React Native e SAP ficam para oportunidades ou projetos específicos.

## Entregas no semestre

Fluxo web nos dias 11–22, qualidade e segurança nos dias 62–90, automação e
RAG nos dias 126–133. Use 141–155 para a integração opcional ou um CRM simulado.
As referências de React, NestJS, Apex e MuleSoft estão na [matriz](../../docs/curriculum/course-matrix.md).
