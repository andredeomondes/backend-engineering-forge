# Migrations

Crie migrations numeradas e imutáveis depois de aplicadas:

```text
001_initial_schema.sql
002_add_order_public_id.sql
003_add_query_indexes.sql
```

Cada migration deve informar objetivo, risco, validação e estratégia de
rollback ou roll-forward. Não coloque todo o projeto em um único arquivo final.

