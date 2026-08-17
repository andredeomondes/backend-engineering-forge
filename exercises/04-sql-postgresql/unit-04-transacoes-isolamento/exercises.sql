\set ON_ERROR_STOP on

DROP SCHEMA IF EXISTS sql_04 CASCADE;
CREATE SCHEMA sql_04;
SET search_path TO sql_04;

CREATE TABLE accounts (
  id integer PRIMARY KEY,
  balance_cents integer NOT NULL CHECK (balance_cents >= 0)
);
CREATE TABLE products (
  id integer PRIMARY KEY,
  stock integer NOT NULL CHECK (stock >= 0)
);
CREATE TABLE orders (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  reference text NOT NULL UNIQUE,
  total_cents integer NOT NULL CHECK (total_cents >= 0)
);
CREATE TABLE order_items (
  order_id bigint REFERENCES orders(id),
  product_id integer REFERENCES products(id),
  quantity integer NOT NULL CHECK (quantity > 0),
  PRIMARY KEY (order_id, product_id)
);

INSERT INTO accounts VALUES (1, 1000), (2, 500);
INSERT INTO products VALUES (1, 5);

-- TODO 1: em uma transação, transfira 200 centavos da conta 1 para a conta 2.
-- A soma dos saldos precisa continuar 1500.

-- TODO 2: em outra transação, crie ORD-TX-01 com total 2000, adicione duas
-- unidades do produto 1 e reduza o estoque de 5 para 3.

-- TODO 3 (manual): repita a criação com quantidade maior que o estoque, force
-- uma violação antes do COMMIT e prove que pedido e baixa foram desfeitos.

