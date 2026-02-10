CREATE TABLE IF NOT EXISTS sales_order
(
    order_id       INTEGER      NOT NULL PRIMARY KEY,
    customer_name  VARCHAR(50)  NOT NULL,
    amount         NUMERIC      NOT NULL,
    pay_status     VARCHAR(20)  NOT NULL,
    is_member      INTEGER      NOT NULL,
    discount_rate  NUMERIC      NOT NULL DEFAULT 0,
    final_amount   NUMERIC      NOT NULL
);

INSERT INTO sales_order (order_id, customer_name, amount, pay_status, is_member, discount_rate, final_amount)
VALUES
    (1, '企业A', 1200.00, 'PAID', 1, 0, 1200.00),
    (2, '企业B', 800.00, 'PAID', 0, 0, 800.00),
    (3, '企业C', 500.00, 'UNPAID', 1, 0, 500.00),
    (4, '企业D', 300.00, 'PAID', 1, 0, 300.00),
    (5, '企业E', 960.00, 'UNPAID', 0, 0, 960.00);
