-- Removes all data from every table and resets sequences.
-- Safe to run before seeding; does not drop tables or migrations.
TRUNCATE TABLE store_products, products, stores, categories RESTART IDENTITY CASCADE;
