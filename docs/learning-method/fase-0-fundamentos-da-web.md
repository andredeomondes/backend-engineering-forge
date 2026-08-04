# Fase 0 — Ambiente profissional e fundamentos da Web

Objetivo: montar o ambiente de trabalho profissional e entender, em nível
conceitual, o que acontece por trás de uma requisição HTTP — antes de
escrever qualquer lógica de negócio.

## O que estudar

- terminal, processos, arquivos e permissões;
- Git: branches, commits, PRs, resolução de conflitos;
- GitHub na prática (issues, PR, review);
- npm, `package.json`, versionamento semântico;
- variáveis de ambiente e por que `.env` não é versionado;
- cliente e servidor;
- DNS e TCP em nível conceitual (não é preciso implementar nada aqui);
- HTTP: métodos, headers, body, status codes, cookies, JSON;
- CORS em nível conceitual.

## Práticas obrigatórias

1. Confirmar que este repositório está inicializado e versionado.
2. Rodar `npm install` e `npm test` (ver README).
3. Criar um pequeno servidor HTTP local (pode ser com `node:http`, sem
   framework) e inspecionar requisições com `curl` — este exercício vem
   como um laboratório em `labs/http/` quando você chegar nele via
   `PROXIMA_UNIDADE` ou `GERAR_PROJETO` (não gerado ainda nesta primeira
   execução).
4. Abrir uma coleção no Bruno, Insomnia ou Postman com pelo menos uma
   requisição `GET` e uma `POST`.
5. Abrir ao menos um PR real neste repositório (mesmo que para os
   próprios exercícios).

## Gate da fase

Sem consultar nada, você deve conseguir explicar:

- o que acontece de forma simplificada quando você acessa uma URL;
- diferença entre processo, porta e servidor;
- diferença entre Git e GitHub;
- diferença entre `GET`, `POST`, `PUT`, `PATCH` e `DELETE`;
- diferença entre `401` e `403`;
- por que não se deve versionar `.env`.

Use o comando `AVALIAR_FASE` quando achar que está pronto. Até lá, a
Fase 1 já começa em paralelo (ver `exercises/01-javascript-core/`), pois
fundamentos de JS não dependem deste gate.
