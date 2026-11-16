# Plataforma, IA e arquitetura — Fases 7 a 12

A sequência por evidência está nos [níveis de competência](competency-levels.md).
LedgerFlow mantém a integração das práticas que servem ao domínio financeiro.
O [catálogo](../../projects/README.md) indica as demais entregas.

## Fase 7 — Redis, RabbitMQ e Kafka

- **Objetivo:** tirar trabalho da requisição e reduzir carga no banco com critério.
- **Conteúdo:** cache-aside e TTL; rate limit; filas no RabbitMQ (produtor,
  consumidor, ack, retry, DLQ); Kafka (tópicos, partições, consumer groups,
  ordenação); eventos de domínio; outbox pattern; consumidor idempotente.
- **Nível-alvo:** escolhe entre cache, fila e log de eventos para um cenário e
  justifica.
- **Entrega:** LedgerFlow M3 e Plataforma de Pedidos Orientada a Eventos.
- **Gate:** evento reprocessado não duplica efeito; consumidor que cai não perde mensagem.

## Fase 8 — Automação e RAG em TypeScript e Java

- **Automação:** praticar um job Node que seleciona chamados atrasados com
  PostgreSQL, gera um resumo e evita notificações repetidas ao ser reexecutado.
- **RAG:** preparar alguns guias internos de exemplo, recuperar trechos relevantes
  e devolver respostas com fontes. Comparar a busca textual com embeddings se
  houver casos em que a busca textual falha.
- **Evidência:** o job pode ser executado duas vezes sem duplicar o aviso.
  O RAG cita a fonte correta, informa quando os guias não contêm a resposta e
  trata indisponibilidade do provedor. Use guias sintéticos nos testes.
- **Comparação em Java:** no laboratório Spring AI, reutilize os guias e as
  perguntas do TicketAtlas para comparar fontes e abstenção. No LedgerFlow,
  calcule a reconciliação em Java e valide o resumo gerado e o fallback.
- **Entregas planejadas:** TicketAtlas e laboratório Spring AI nos dias 126–140.

Python fica como extensão futura para processamento de documentos, dados ou
treinamento de modelos quando houver uma necessidade concreta.

## Fase 9 — Node.js e NestJS

- **Objetivo:** provar que o desenho do Spring se transfere para outro ecossistema.
- **Conteúdo:** Node (unidades `node-01`–`node-07` já prontas: event loop,
  módulos, fs, streams, http nativo); Express em nível de leitura; NestJS
  (módulos, providers, DI, DTOs, `ValidationPipe`, guards, interceptors);
  consumidor de fila; testes.
- **Nível-alvo:** mapeia cada conceito do NestJS para o equivalente Spring.
- **Entrega:** Integrações Comerciais com NestJS, com Fastify. LedgerFlow M5 é uma aplicação complementar.
- **Gate:** o mesmo webhook entregue duas vezes gera um único efeito de negócio.

## Fase 10 — GCP, CI/CD e observabilidade

- **Objetivo:** publicar com segurança e enxergar o sistema em produção.
- **Conteúdo:** GitHub Actions (build, testes, imagem); IAM e rede básica; Cloud Run, Cloud SQL e Artifact Registry; gestão de segredos; logs estruturados com correlation id;
  métricas e traces (Spring Actuator, OpenTelemetry); health checks e alertas.
- **Nível-alvo:** faz deploy por merge e rastreia um erro do log ao trace.
- **Entrega:** LedgerFlow M6. Nos dias 111–120, use Jenkins para build, testes,
  imagem por commit, homologação e rollback local.
- **Gate:** deploy automático funcionando e um incidente simulado investigado.

## Fase 11 — Arquitetura, portfólio e entrevistas

- **Objetivo:** defender o LedgerFlow numa entrevista técnica.
- **Conteúdo:** SOLID, coesão e acoplamento; arquitetura hexagonal; monólito
  modular vs. microsserviços; ADRs; diagramas C4; README de portfólio com demo;
  system design de nível júnior/pleno; simulação de entrevista técnica Java.
- **Entrega:** LedgerFlow M7.
- **Gate:** explicar a arquitetura e defender três decisões sem anotações.

## Fase 12 — DSA em paralelo

Duas sessões por semana durante toda a formação. JavaScript até a Fase 2, Java
depois. Detalhes em [`interview-preparation.md`](interview-preparation.md).
