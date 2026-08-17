\set ON_ERROR_STOP on

DROP SCHEMA IF EXISTS sql_07 CASCADE;
CREATE SCHEMA sql_07;
SET search_path TO sql_07;

CREATE TABLE schema_migrations (
  version integer PRIMARY KEY,
  description text NOT NULL,
  applied_at timestamptz NOT NULL DEFAULT now()
);

-- Trate os blocos abaixo como migrations incrementais. Não edite uma migration
-- depois de considerá-la aplicada; crie a próxima.

-- TODO Migration 001:
-- crie orders(id identity PK, reference unique, status, created_at) e registre
-- version=1 em schema_migrations.

-- TODO Migration 002:
-- adicione public_id text, preencha registros existentes quando houver, aplique
-- NOT NULL + UNIQUE e registre version=2.

-- TODO Seed:
-- insira seis pedidos determinísticos com datas, incluindo empate de created_at.
-- Reexecutar o seed não pode duplicar reference nem public_id.

-- TODO Paginação:
-- crie page_after_cursor com no máximo três pedidos posteriores ao cursor
-- ('2026-01-02T10:00:00Z', public_id='PUB-002'), ordenados por
-- (created_at, public_id). A view simula uma página por cursor composto.

