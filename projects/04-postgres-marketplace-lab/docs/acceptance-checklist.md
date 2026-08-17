# Checklist de aceite — Projeto 4

## Dados

- [ ] Diagrama ER e decisões documentados.
- [ ] PKs, FKs, unicidades, checks e nulabilidade justificadas.
- [ ] Preço histórico preservado nos itens.
- [ ] Seed determinístico e reexecutável.

## Correção

- [ ] Pedido e baixa de estoque são atômicos.
- [ ] Overselling é reproduzido antes da correção.
- [ ] Correção possui teste concorrente real.
- [ ] Relatórios incluem casos sem correspondência quando necessário.

## Performance e operação

- [ ] Consultas críticas possuem baseline e plano posterior.
- [ ] Cada índice resolve workload identificado.
- [ ] Paginação por cursor é estável.
- [ ] Role da aplicação usa least privilege.
- [ ] Backup foi restaurado em banco separado.

## Gate

- [ ] Verificações automatizadas verdes.
- [ ] Nenhuma solução consultada antes da tentativa.
- [ ] README permite reproduzir ambiente do zero.
- [ ] Trade-offs apresentados oralmente.

