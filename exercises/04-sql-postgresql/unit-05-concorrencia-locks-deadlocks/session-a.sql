\set ON_ERROR_STOP on
SET search_path TO sql_05;

-- Terminal A: remova os comentários uma etapa por vez e sincronize com B.
-- BEGIN;
-- SELECT stock FROM products WHERE id = 1;
-- Aguarde B ler o mesmo valor antes de continuar.
-- Depois teste sua estratégia de lock e registre tempo de espera/resultado.
-- ROLLBACK;

