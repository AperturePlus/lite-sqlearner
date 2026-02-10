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
    (101, '机械键盘', '数码', 18, 399.00, '2026-01-08'),
    (102, '显示器支架', '办公', 26, 219.00, '2026-01-08'),
    (103, '咖啡机', '家电', 9, 1299.00, '2026-01-08');
