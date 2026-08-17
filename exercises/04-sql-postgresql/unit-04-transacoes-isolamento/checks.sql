\set ON_ERROR_STOP on
SET search_path TO sql_04;

DO $$
BEGIN
  IF (SELECT sum(balance_cents) FROM accounts) <> 1500 THEN
    RAISE EXCEPTION 'A soma dos saldos foi alterada.';
  END IF;
  IF (SELECT balance_cents FROM accounts WHERE id = 1) <> 800
     OR (SELECT balance_cents FROM accounts WHERE id = 2) <> 700 THEN
    RAISE EXCEPTION 'Transferência esperada: conta 1 = 800, conta 2 = 700.';
  END IF;
  IF (SELECT stock FROM products WHERE id = 1) <> 3 THEN
    RAISE EXCEPTION 'Estoque esperado após pedido: 3.';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM orders o JOIN order_items i ON i.order_id = o.id
    WHERE o.reference = 'ORD-TX-01' AND i.product_id = 1 AND i.quantity = 2
  ) THEN RAISE EXCEPTION 'Pedido transacional não encontrado.'; END IF;
END $$;

SELECT 'sql-04: verificações verdes' AS result;
