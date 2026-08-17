\set ON_ERROR_STOP on
SET search_path TO sql_03;

DO $$
BEGIN
  IF to_regclass('customer_revenue') IS NULL OR to_regclass('products_without_sales') IS NULL
     OR to_regclass('product_ranking') IS NULL OR to_regclass('daily_running_revenue') IS NULL THEN
    RAISE EXCEPTION 'As quatro views de relatório são obrigatórias.';
  END IF;

  IF (SELECT revenue_cents FROM customer_revenue WHERE customer_name = 'Ana') <> 2300 THEN
    RAISE EXCEPTION 'Receita de Ana incorreta.';
  END IF;
  IF (SELECT revenue_cents FROM customer_revenue WHERE customer_name = 'Bruno') <> 1000 THEN
    RAISE EXCEPTION 'Receita de Bruno incorreta.';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM customer_revenue WHERE customer_name = 'Carla' AND revenue_cents = 0) THEN
    RAISE EXCEPTION 'Carla precisa aparecer com receita zero.';
  END IF;
  IF (SELECT array_agg(sku ORDER BY sku) FROM products_without_sales) <> ARRAY['BAG'] THEN
    RAISE EXCEPTION 'Produtos sem venda incorretos.';
  END IF;
  IF (SELECT quantity_sold FROM product_ranking WHERE sku = 'PEN') <> 8 THEN
    RAISE EXCEPTION 'Quantidade vendida de PEN incorreta.';
  END IF;
  IF (SELECT max(running_revenue_cents) FROM daily_running_revenue) <> 3300 THEN
    RAISE EXCEPTION 'Receita acumulada final deveria ser 3300.';
  END IF;
END $$;

SELECT 'sql-03: verificações verdes' AS result;

