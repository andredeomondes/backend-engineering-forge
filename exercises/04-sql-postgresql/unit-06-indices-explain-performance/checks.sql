\set ON_ERROR_STOP on
SET search_path TO sql_06;

DO $$
DECLARE
  definition text;
BEGIN
  SELECT indexdef INTO definition FROM pg_indexes
  WHERE schemaname = 'sql_06' AND indexname = 'idx_orders_customer_created';
  IF definition IS NULL OR definition NOT ILIKE '%customer_id%created_at%DESC%' THEN
    RAISE EXCEPTION 'Índice composto de cliente/data ausente ou com ordem incorreta.';
  END IF;

  SELECT indexdef INTO definition FROM pg_indexes
  WHERE schemaname = 'sql_06' AND indexname = 'idx_orders_pending_created';
  IF definition IS NULL OR definition NOT ILIKE '%WHERE%status%pending%' THEN
    RAISE EXCEPTION 'Índice parcial de pedidos pending não encontrado.';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE schemaname = 'sql_06' AND indexname = 'idx_orders_external_id'
      AND indexdef ILIKE 'CREATE UNIQUE INDEX%'
  ) THEN RAISE EXCEPTION 'Índice único de external_id não encontrado.'; END IF;
END $$;

SELECT 'sql-06: definições de índices verdes; compare também os planos' AS result;

