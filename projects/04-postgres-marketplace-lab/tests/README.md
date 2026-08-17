# Estratégia de verificação

Cubra pelo menos:

- constraints com entradas inválidas;
- migrations partindo de banco vazio;
- seed reexecutado;
- transação com falha intermediária;
- duas conexões disputando a última unidade;
- paginação com empates e inserção entre páginas;
- payload de SQL injection tratado como valor;
- permissões negativas da role da aplicação;
- backup restaurado e contagens comparadas.

Os testes devem provar propriedades do sistema, não somente executar SQL sem
erro.

