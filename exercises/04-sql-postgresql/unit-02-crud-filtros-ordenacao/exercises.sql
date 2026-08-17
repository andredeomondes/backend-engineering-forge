\set ON_ERROR_STOP on

DROP SCHEMA IF EXISTS sql_02 CASCADE;
CREATE SCHEMA sql_02;
SET search_path TO sql_02;

CREATE TABLE products (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  sku text NOT NULL UNIQUE,
  name text NOT NULL,
  price_cents integer NOT NULL CHECK (price_cents >= 0),
  active boolean NOT NULL DEFAULT true
);

CREATE TABLE orders (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  reference text NOT NULL UNIQUE,
  status text NOT NULL,
  total_cents integer NOT NULL,
  created_at timestamptz NOT NULL
);

INSERT INTO products (sku, name, price_cents, active) VALUES
  ('BOOK-01', 'Backend Book', 1200, true),
  ('MUG-01', 'Forge Mug', 500, true),
  ('OLD-01', 'Archived Item', 3000, false),
  ('PEN-01', 'Green Pen', 500, true);

INSERT INTO orders (reference, status, total_cents, created_at) VALUES
  ('ORD-001', 'paid', 1200, '2026-01-01T10:00:00Z'),
  ('ORD-002', 'pending', 500, '2026-01-02T10:00:00Z'),
  ('ORD-003', 'paid', 3200, '2026-01-03T10:00:00Z'),
  ('ORD-004', 'cancelled', 900, '2026-01-04T10:00:00Z'),
  ('ORD-005', 'pending', 700, '2026-01-05T10:00:00Z');

-- TODO 1: crie a view active_products com produtos ativos ordenados por
-- price_cents crescente e sku crescente como desempate.

-- TODO 2: crie a view paid_orders_over_1000 com pedidos pagos cujo total seja
-- maior que 1000, do mais recente para o mais antigo.

-- TODO 3: altere ORD-005 de pending para cancelled e use um filtro seguro.

-- TODO 4: exclua apenas o produto inativo OLD-01.

-- TODO 5: insira NOTE-01, Notebook, 850 centavos, ativo. Faça o comando poder
-- ser executado novamente sem duplicar o SKU.

