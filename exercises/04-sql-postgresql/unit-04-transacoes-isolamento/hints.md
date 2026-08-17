# Dicas — `sql-04`

## Nível 1

Escreva os invariantes antes das instruções: a soma dos saldos e o estoque não
negativo precisam permanecer verdadeiros.

## Nível 2

Faça a leitura necessária e a alteração relacionada dentro da mesma transação.

## Nível 3

Use uma constraint como última linha de defesa e provoque uma violação antes do
`COMMIT` para observar o rollback.

