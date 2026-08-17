# Dicas — `sql-07`

## Nível 1

Toda ordenação de paginação precisa ser total; use ID como desempate.

## Nível 2

O cursor composto compara primeiro a data e depois o ID quando as datas empatam.

## Nível 3

Evite seed que sempre insere duplicatas. Use chaves estáveis e conflito tratado
explicitamente.

