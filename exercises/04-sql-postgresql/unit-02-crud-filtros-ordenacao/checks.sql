\set ON_ERROR_STOP on
SET search_path TO sql_02;

DO $$
DECLARE
  active_skus text[];
  paid_refs text[];
BEGIN
  IF to_regclass('sql_02.active_products') IS NULL THEN
    RAISE EXCEPTION 'View active_products não encontrada.';
  END IF;
  IF to_regclass('sql_02.paid_orders_over_1000') IS NULL THEN
    RAISE EXCEPTION 'View paid_orders_over_1000 não encontrada.';
  END IF;

  SELECT array_agg(sku ORDER BY price_cents, sku) INTO active_skus FROM active_products;
  IF active_skus <> ARRAY['MUG-01', 'PEN-01', 'NOTE-01', 'BOOK-01'] THEN
    RAISE EXCEPTION 'Produtos ativos incorretos: %.', active_skus;
  END IF;

  SELECT array_agg(reference ORDER BY created_at DESC) INTO paid_refs FROM paid_orders_over_1000;
  IF paid_refs <> ARRAY['ORD-003', 'ORD-001'] THEN
    RAISE EXCEPTION 'Pedidos pagos incorretos: %.', paid_refs;
  END IF;

  IF (SELECT status FROM orders WHERE reference = 'ORD-005') <> 'cancelled' THEN
    RAISE EXCEPTION 'ORD-005 deveria estar cancelado.';
  END IF;
  IF EXISTS (SELECT 1 FROM products WHERE sku = 'OLD-01') THEN
    RAISE EXCEPTION 'Produto inativo OLD-01 ainda existe.';
  END IF;
  IF (SELECT count(*) FROM products WHERE sku = 'NOTE-01') <> 1 THEN
    RAISE EXCEPTION 'NOTE-01 deve existir exatamente uma vez.';
  END IF;
END $$;

SELECT 'sql-02: verificações verdes' AS result;

