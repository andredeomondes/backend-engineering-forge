# Dicas — `sql-05`

## Nível 1

Abra dois terminais e pare ambos depois da leitura do mesmo estoque.

## Nível 2

O lock precisa ser obtido antes de decidir se há quantidade disponível.

## Nível 3

Uma única atualização condicional com `stock >= requested` também pode impedir
valor negativo. Compare o resultado de `RETURNING` com o uso de `FOR UPDATE`.

