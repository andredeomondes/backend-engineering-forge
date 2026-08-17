\set ON_ERROR_STOP on
SET search_path TO sql_05;

DO $$
DECLARE
  first_result boolean;
  second_result boolean;
BEGIN
  IF to_regprocedure('sql_05.reserve_stock(integer,integer,text)') IS NULL THEN
    RAISE EXCEPTION 'Função reserve_stock(integer, integer, text) não encontrada.';
  END IF;

  first_result := reserve_stock(1, 1, 'RES-001');
  second_result := reserve_stock(1, 1, 'RES-002');

  IF first_result IS NOT TRUE OR second_result IS NOT FALSE THEN
    RAISE EXCEPTION 'A primeira reserva deve vencer e a segunda deve falhar.';
  END IF;
  IF (SELECT stock FROM products WHERE id = 1) <> 0 THEN
    RAISE EXCEPTION 'Estoque final deveria ser zero.';
  END IF;
  IF (SELECT count(*) FROM reservations) <> 1 THEN
    RAISE EXCEPTION 'Deveria existir exatamente uma reserva.';
  END IF;
END $$;

SELECT 'sql-05: verificações sequenciais verdes; execute também o laboratório concorrente' AS result;

