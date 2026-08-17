\set ON_ERROR_STOP on
SET search_path TO sql_08;

DO $$
DECLARE
  injected_count integer;
BEGIN
  IF to_regclass('sql_08.customer_order_totals') IS NULL THEN
    RAISE EXCEPTION 'View customer_order_totals não encontrada.';
  END IF;
  IF (SELECT total_cents FROM customer_order_totals WHERE customer_id = 1) <> 2000 THEN
    RAISE EXCEPTION 'Total de Ana deveria ser 2000.';
  END IF;
  IF to_regprocedure('sql_08.find_product_by_sku(text)') IS NULL THEN
    RAISE EXCEPTION 'Função find_product_by_sku(text) não encontrada.';
  END IF;
  SELECT count(*) INTO injected_count FROM find_product_by_sku('SAFE-01'' OR 1=1 --');
  IF injected_count <> 0 THEN RAISE EXCEPTION 'Entrada de injection alterou a consulta.'; END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'forge_report_reader') THEN
    RAISE EXCEPTION 'Role forge_report_reader não encontrada.';
  END IF;
  IF NOT has_table_privilege('forge_report_reader', 'sql_08.customer_order_totals', 'SELECT') THEN
    RAISE EXCEPTION 'Role precisa ler a view de relatório.';
  END IF;
  IF has_table_privilege('forge_report_reader', 'sql_08.products', 'SELECT')
     OR has_table_privilege('forge_report_reader', 'sql_08.products', 'DELETE') THEN
    RAISE EXCEPTION 'Role recebeu privilégio direto excessivo em products.';
  END IF;
END $$;

SELECT 'sql-08: segurança e relatório verdes; valide também o restore manual' AS result;
