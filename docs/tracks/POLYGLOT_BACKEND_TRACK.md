# TRILHA PARALELA OPCIONAL — Polyglot Backend Engineering

## Propósito

Adicionar profundidade em uma segunda stack sem substituir a formação principal
em TypeScript, Node.js e NestJS. A especialização pode começar a qualquer momento;
concluir a Fase 9 antes é recomendado, não obrigatório.

## Estado inicial

| Opção | Módulos | Estado |
|---|---:|---|
| Java + Spring | `JAVA-01`–`JAVA-09` | disponível |
| C# + .NET | `DOTNET-01`–`DOTNET-09` | disponível |
| Go | `GO-01`–`GO-09` | disponível |

Nenhuma opção está selecionada.

## Comando de mentoria

```text
SELECIONAR_TRILHA JAVA
SELECIONAR_TRILHA DOTNET
SELECIONAR_TRILHA GO
```

Ao receber o comando, a mentoria deve:

1. verificar em `PROGRESS.md` o estado da Fase 9 e, se o gate estiver pendente, apenas avisar (recomendado, nunca obrigatório);
2. aceitar a seleção mesmo assim, por escolha do estudante;
3. verificar se já existe uma trilha ativa;
4. marcar a escolhida como `ATIVA` e as outras como `NÃO SELECIONADA`;
5. registrar a escolha em `PROGRESS.md` e `SKILLS_MATRIX.md`;
6. sugerir o módulo 01 da opção escolhida (os demais seguem abertos).

Recomenda-se concluir a primeira trilha antes de iniciar outra, registrando a
justificativa profissional em ADR.

## Distribuição de estudo

Depois da escolha:

```text
70% → Forge principal: Fases 10–27, projetos, produção e engenharia
30% → especialização poliglota escolhida
```

DSA, revisões e entrevistas continuam dentro do planejamento principal. Não se
estudam as três opções simultaneamente.

## Progressão

Cada módulo contém objetivo, pré-requisitos, conteúdo, laboratório, evidência,
gate e critério de avanço. O gate anterior é recomendado antes do próximo módulo, nunca obrigatório.

Gate final obrigatório:

- API funcional com PostgreSQL;
- autenticação e autorização;
- testes automatizados;
- Docker e CI;
- logs e métricas;
- uma decisão arquitetural em ADR;
- relatório comparativo com NestJS;
- explicação de quando escolher e quando evitar a stack.

Concluir a trilha não concede automaticamente senioridade.

## Integração com a Fase 20

A trilha escolhida participa do laboratório avançado:

```text
NestJS API
→ PostgreSQL + transactional outbox
→ Kafka
→ consumer na linguagem escolhida
→ inbox + deduplicação
→ PostgreSQL/read model
→ OpenTelemetry
```

Evidências obrigatórias:

- contrato de evento versionado e compatível;
- consumer idempotente;
- mensagem duplicada e fora de ordem;
- retry, DLQ e replay;
- traces, métricas e logs correlacionados;
- teste de carga;
- trade-offs e limitações de “exactly once”.

Kafka entra nesse momento como laboratório de engenharia distribuída. Ele não
justifica microsserviços antecipados.

## Currículos

- [`JAVA_SPRING_TRACK.md`](JAVA_SPRING_TRACK.md)
- [`CSHARP_DOTNET_TRACK.md`](CSHARP_DOTNET_TRACK.md)
- [`GO_BACKEND_TRACK.md`](GO_BACKEND_TRACK.md)
