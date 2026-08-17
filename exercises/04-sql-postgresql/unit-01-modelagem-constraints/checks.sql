\set ON_ERROR_STOP on
SET search_path TO sql_01;

DO $$
DECLARE
  table_count integer;
  fk_count integer;
  check_count integer;
  unique_count integer;
BEGIN
  SELECT count(*) INTO table_count
  FROM information_schema.tables
  WHERE table_schema = 'sql_01'
    AND table_name IN ('customers', 'products', 'orders', 'order_items');
  IF table_count <> 4 THEN
    RAISE EXCEPTION 'Esperadas 4 tabelas; encontradas %.', table_count;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'sql_01' AND table_name = 'customers'
      AND column_name = 'email' AND is_nullable = 'NO'
  ) THEN RAISE EXCEPTION 'customers.email deve ser NOT NULL.'; END IF;

  SELECT count(*) INTO fk_count
  FROM information_schema.table_constraints
  WHERE constraint_schema = 'sql_01' AND constraint_type = 'FOREIGN KEY';
  IF fk_count < 3 THEN RAISE EXCEPTION 'Esperadas ao menos 3 foreign keys.'; END IF;

  SELECT count(*) INTO check_count
  FROM information_schema.table_constraints
  WHERE constraint_schema = 'sql_01' AND constraint_type = 'CHECK';
  IF check_count < 3 THEN RAISE EXCEPTION 'Esperadas constraints CHECK para status, quantidade e preço.'; END IF;

  SELECT count(*) INTO unique_count
  FROM information_schema.table_constraints
  WHERE constraint_schema = 'sql_01' AND constraint_type = 'UNIQUE';
  IF unique_count < 3 THEN RAISE EXCEPTION 'Esperadas unicidades para email, sku e item do pedido.'; END IF;
END $$;

BEGIN;
DO $$
BEGIN
  BEGIN
    INSERT INTO products (sku, name, price_cents) VALUES ('INVALID', 'Inválido', -1);
    RAISE EXCEPTION 'Preço negativo foi aceito.';
  EXCEPTION WHEN check_violation THEN NULL;
  END;
END $$;
ROLLBACK;

SELECT 'sql-01: verificações verdes' AS result;

