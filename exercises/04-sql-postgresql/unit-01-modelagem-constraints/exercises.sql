\set ON_ERROR_STOP on

DROP SCHEMA IF EXISTS sql_01 CASCADE;
CREATE SCHEMA sql_01;
SET search_path TO sql_01;

-- Implemente as tabelas abaixo. Não remova as verificações do banco para fazer
-- os testes passarem: o objetivo é expressar as regras com constraints.

-- TODO 1: customers
-- id bigint gerado pelo banco, name e email obrigatórios, email único.

-- TODO 2: products
-- id, sku único, name e price_cents inteiro não negativo.

-- TODO 3: orders
-- id, customer_id, status limitado a pending/paid/cancelled e created_at.

-- TODO 4: order_items
-- order_id, product_id, quantity positiva e unit_price_cents não negativo.
-- O mesmo produto não pode aparecer duas vezes no mesmo pedido.

-- Depois de criar o schema, tente manualmente três INSERTs inválidos e registre
-- as mensagens no seu diário de erros.

