# DML 训练 - 归档并删除历史取消单

这是数据治理中非常常见的一类任务：

1. 把符合条件的数据归档到历史表
2. 再从在线表删除

通常用 `INSERT INTO ... SELECT ...` + `DELETE` 组合完成。

## 题目

请把 `orders_live` 中满足以下条件的订单归档到 `orders_archive`：

- `status = 'CANCELLED'`
- `order_date < '2025-12-01'`

归档后，从 `orders_live` 删除这批订单。

最后按顺序输出 **两个结果集**：

1. `orders_archive` 的 `order_id, status`（按 `order_id` 升序）
2. `orders_live` 的 `order_id, status`（按 `order_id` 升序）
