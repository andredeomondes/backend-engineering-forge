\set ON_ERROR_STOP on

DROP SCHEMA IF EXISTS sql_05 CASCADE;
CREATE SCHEMA sql_05;
SET search_path TO sql_05;

CREATE TABLE products (
  id integer PRIMARY KEY,
  stock integer NOT NULL CHECK (stock >= 0),
  version integer NOT NULL DEFAULT 0
);
CREATE TABLE reservations (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  reference text NOT NULL UNIQUE,
  product_id integer NOT NULL REFERENCES products(id),
  quantity integer NOT NULL CHECK (quantity > 0),
  created_at timestamptz NOT NULL DEFAULT now()
);
INSERT INTO products (id, stock) VALUES (1, 1);

-- TODO: implemente a função abaixo.
-- reserve_stock(product_id integer, quantity integer, reference text)
-- retorna true e cria a reserva quando existe estoque; retorna false sem criar
-- reserva quando não existe. A decisão e a baixa precisam ser atômicas.

-- Escolha FOR UPDATE ou UPDATE condicional e documente o trade-off no README
-- da unidade. Não remova a constraint de estoque para facilitar a implementação.

