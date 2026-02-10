CREATE TABLE IF NOT EXISTS orders_live
(
    order_id       INTEGER      NOT NULL PRIMARY KEY,
    customer_name  VARCHAR(50)  NOT NULL,
    order_date     DATE         NOT NULL,
    status         VARCHAR(20)  NOT NULL,
    amount         NUMERIC      NOT NULL
);

CREATE TABLE IF NOT EXISTS orders_archive
(
    order_id       INTEGER      NOT NULL PRIMARY KEY,
    customer_name  VARCHAR(50)  NOT NULL,
    order_date     DATE         NOT NULL,
    status         VARCHAR(20)  NOT NULL,
    amount         NUMERIC      NOT NULL
);

INSERT INTO orders_live (order_id, customer_name, order_date, status, amount)
VALUES
    (5001, '客户甲', '2025-10-12', 'CANCELLED', 300.00),
    (5002, '客户乙', '2025-12-15', 'CANCELLED', 420.00),
    (5003, '客户丙', '2025-09-21', 'PAID', 188.00),
    (5004, '客户丁', '2025-08-03', 'CANCELLED', 520.00),
    (5005, '客户戊', '2025-11-29', 'SHIPPED', 640.00),
    (5006, '客户己', '2025-07-10', 'CANCELLED', 270.00);
