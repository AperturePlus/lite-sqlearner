# DML 训练 - UPDATE 条件更新

`UPDATE` 用于修改已有数据，常常会配合 `CASE WHEN` 按条件批量更新。

语法示例：

```sql
UPDATE table_name
SET column_a = ...,
    column_b = ...
WHERE ...;
```

## 题目

当前订单表 `sales_order` 中，`discount_rate` 和 `final_amount` 还没按规则计算。

请按以下规则更新全表：

- 已支付且会员（`pay_status='PAID' and is_member=1`）：折扣 `0.15`
- 已支付但非会员（`pay_status='PAID' and is_member=0`）：折扣 `0.05`
- 其他情况：折扣 `0`

同时更新 `final_amount = amount * (1 - discount_rate)`（保留两位小数）。

最后输出：

- `order_id`
- `customer_name`
- `discount_rate`
- `final_amount`

并按 `order_id` 升序排序。
