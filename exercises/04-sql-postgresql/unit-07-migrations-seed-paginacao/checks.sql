\set ON_ERROR_STOP on
SET search_path TO sql_07;

DO $$
DECLARE
  page_count integer;
BEGIN
  IF to_regclass('sql_07.orders') IS NULL THEN RAISE EXCEPTION 'Tabela orders não encontrada.'; END IF;
  IF (SELECT count(*) FROM schema_migrations WHERE version IN (1, 2)) <> 2 THEN
    RAISE EXCEPTION 'Migrations 001 e 002 devem estar registradas.';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'sql_07' AND table_name = 'orders'
      AND column_name = 'public_id' AND is_nullable = 'NO'
  ) THEN RAISE EXCEPTION 'public_id deve existir e ser NOT NULL.'; END IF;
  IF (SELECT count(*) FROM orders) <> 6 THEN
    RAISE EXCEPTION 'Seed deve produzir exatamente seis pedidos.';
  END IF;
  IF to_regclass('sql_07.page_after_cursor') IS NULL THEN
    RAISE EXCEPTION 'View page_after_cursor não encontrada.';
  END IF;
  SELECT count(*) INTO page_count FROM page_after_cursor;
  IF page_count < 1 OR page_count > 3 THEN
    RAISE EXCEPTION 'Página deve conter entre um e três registros; recebeu %.', page_count;
  END IF;
  IF EXISTS (
    SELECT 1 FROM page_after_cursor
    WHERE (created_at, public_id) <= ('2026-01-02T10:00:00Z'::timestamptz, 'PUB-002')
  ) THEN RAISE EXCEPTION 'A página contém registro anterior ou igual ao cursor.'; END IF;
END $$;

SELECT 'sql-07: migrations, seed e cursor verdes' AS result;

