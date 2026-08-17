\set ON_ERROR_STOP on

DROP SCHEMA IF EXISTS sql_08 CASCADE;
CREATE SCHEMA sql_08;
SET search_path TO sql_08;

CREATE TABLE customers (id integer PRIMARY KEY, name text NOT NULL);
CREATE TABLE products (id integer PRIMARY KEY, sku text NOT NULL UNIQUE, name text NOT NULL);
CREATE TABLE orders (id integer PRIMARY KEY, customer_id integer REFERENCES customers(id));
CREATE TABLE order_items (
  order_id integer REFERENCES orders(id),
  product_id integer REFERENCES products(id),
  quantity integer NOT NULL,
  unit_price_cents integer NOT NULL,
  PRIMARY KEY (order_id, product_id)
);

INSERT INTO customers VALUES (1, 'Ana'), (2, 'Bruno');
INSERT INTO products VALUES (1, 'SAFE-01', 'Safe Product'), (2, 'BOOK-01', 'Book');
INSERT INTO orders VALUES (1, 1), (2, 1), (3, 2);
INSERT INTO order_items VALUES (1, 1, 1, 1000), (2, 2, 2, 500), (3, 1, 1, 1000);

-- TODO 1: crie customer_order_totals retornando todos os clientes, quantidade
-- de pedidos e valor total, substituindo um fluxo N+1.

-- TODO 2: crie find_product_by_sku(input text) como função SQL parametrizada
-- que retorna id, sku e name. Uma string de injection deve ser tratada como SKU.

-- TODO 3: crie a role forge_report_reader (se ainda não existir), conceda o
-- mínimo para conectar, usar sql_08 e ler customer_order_totals. Ela não pode
-- inserir, atualizar, excluir ou ler diretamente products.

-- TODO 4 (manual): faça pg_dump deste schema, restaure em forge_sql_restore e
-- registre comandos, duração e contagens verificadas.

