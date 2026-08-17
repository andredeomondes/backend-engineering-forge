\set ON_ERROR_STOP on

DROP SCHEMA IF EXISTS sql_06 CASCADE;
CREATE SCHEMA sql_06;
SET search_path TO sql_06;

CREATE TABLE orders (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  external_id text NOT NULL,
  customer_id integer NOT NULL,
  status text NOT NULL,
  total_cents integer NOT NULL,
  created_at timestamptz NOT NULL
);

INSERT INTO orders (external_id, customer_id, status, total_cents, created_at)
SELECT
  'EXT-' || number,
  (number % 200) + 1,
  CASE WHEN number % 5 = 0 THEN 'pending' WHEN number % 3 = 0 THEN 'cancelled' ELSE 'paid' END,
  (number % 10000) + 100,
  '2025-01-01T00:00:00Z'::timestamptz + (number || ' minutes')::interval
FROM generate_series(1, 10000) AS number;

-- Antes dos índices, registre EXPLAIN (ANALYZE, BUFFERS) para:
-- 1. pedidos de um cliente, mais recentes primeiro;
-- 2. pedidos pending, mais recentes primeiro;
-- 3. busca por external_id.

-- TODO 1: idx_orders_customer_created em (customer_id, created_at DESC).
-- TODO 2: idx_orders_pending_created, parcial por status pending, em created_at DESC.
-- TODO 3: índice único idx_orders_external_id em external_id.

-- Rode novamente os planos e documente quando o PostgreSQL ainda preferir
-- sequential scan. Não desabilite seqscan para fingir uma melhoria.

