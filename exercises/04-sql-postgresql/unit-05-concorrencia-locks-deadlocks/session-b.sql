\set ON_ERROR_STOP on
SET search_path TO sql_05;

-- Terminal B: execute em paralelo com session-a.sql.
-- BEGIN;
-- SELECT stock FROM products WHERE id = 1;
-- Compare a leitura sem lock e depois com sua estratégia escolhida.
-- ROLLBACK;

