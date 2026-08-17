# Dicas — `sql-08`

## Nível 1

Nunca concatene entrada do usuário ao texto SQL. Separe instrução e valores.

## Nível 2

Uma role de leitura precisa de `CONNECT`, `USAGE` no schema e `SELECT` nas
tabelas ou views certas — não de acesso total.

## Nível 3

O relatório N+1 costuma ser substituído por um join/agregação que retorna todos
os pais e seus totais em uma viagem ao banco.
