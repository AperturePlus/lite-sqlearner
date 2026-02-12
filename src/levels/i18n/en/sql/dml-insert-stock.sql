CREATE TABLE IF NOT EXISTS warehouse_stock
(
    product_id   INTEGER      NOT NULL PRIMARY KEY,
    product_name VARCHAR(100) NOT NULL,
    category     VARCHAR(50)  NOT NULL,
    qty          INTEGER      NOT NULL,
    price        NUMERIC      NOT NULL,
    last_update  DATE         NOT NULL
);

INSERT INTO warehouse_stock (product_id, product_name, category, qty, price, last_update)
VALUES
    (101, 'Mechanical Keyboard', 'Digital', 18, 399.00, '2026-01-08'),
    (102, 'Monitor Stand', 'Office', 26, 219.00, '2026-01-08'),
    (103, 'Coffee Machine', 'Home Appliances', 9, 1299.00, '2026-01-08');
