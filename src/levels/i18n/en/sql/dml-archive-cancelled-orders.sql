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
    (5001, 'Customer A', '2025-10-12', 'CANCELLED', 300.00),
    (5002, 'Customer B', '2025-12-15', 'CANCELLED', 420.00),
    (5003, 'Customer C', '2025-09-21', 'PAID', 188.00),
    (5004, 'Customer D', '2025-08-03', 'CANCELLED', 520.00),
    (5005, 'Customer E', '2025-11-29', 'SHIPPED', 640.00),
    (5006, 'Customer F', '2025-07-10', 'CANCELLED', 270.00);
