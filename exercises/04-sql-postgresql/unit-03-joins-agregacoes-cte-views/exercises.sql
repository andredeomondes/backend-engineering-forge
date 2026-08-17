\set ON_ERROR_STOP on

DROP SCHEMA IF EXISTS sql_03 CASCADE;
CREATE SCHEMA sql_03;
SET search_path TO sql_03;

CREATE TABLE customers (id integer PRIMARY KEY, name text NOT NULL);
CREATE TABLE products (id integer PRIMARY KEY, sku text NOT NULL UNIQUE, name text NOT NULL);
CREATE TABLE orders (
  id integer PRIMARY KEY,
  customer_id integer NOT NULL REFERENCES customers(id),
  status text NOT NULL,
  created_at date NOT NULL
);
CREATE TABLE order_items (
  order_id integer REFERENCES orders(id),
  product_id integer REFERENCES products(id),
  quantity integer NOT NULL,
  unit_price_cents integer NOT NULL,
  PRIMARY KEY (order_id, product_id)
);

INSERT INTO customers VALUES (1, 'Ana'), (2, 'Bruno'), (3, 'Carla');
INSERT INTO products VALUES (1, 'BOOK', 'Book'), (2, 'MUG', 'Mug'), (3, 'PEN', 'Pen'), (4, 'BAG', 'Bag');
INSERT INTO orders VALUES
  (1, 1, 'paid', '2026-01-01'),
  (2, 1, 'paid', '2026-01-03'),
  (3, 2, 'cancelled', '2026-01-04'),
  (4, 2, 'paid', '2026-01-05');
INSERT INTO order_items VALUES
  (1, 1, 1, 1000), (1, 2, 2, 500),
  (2, 3, 3, 100),
  (3, 1, 1, 1000),
  (4, 2, 1, 500), (4, 3, 5, 100);

-- TODO 1: customer_revenue(customer_id, customer_name, paid_orders,
-- revenue_cents), incluindo Carla com zeros e ignorando pedidos cancelados.

-- TODO 2: products_without_sales(product_id, sku, name), considerando somente
-- vendas pagas.

-- TODO 3: product_ranking(sku, quantity_sold, sales_rank), usando DENSE_RANK e
-- somente pedidos pagos.

-- TODO 4: daily_running_revenue(day, revenue_cents, running_revenue_cents),
-- agregando por dia antes de aplicar a window function.

