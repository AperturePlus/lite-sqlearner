# DML 训练 - INSERT 批量新增

`INSERT` 用于新增数据。常见写法有两种：

- 单行插入：`INSERT INTO ... VALUES (...);`
- 批量插入：`INSERT INTO ... VALUES (...), (...), (...);`

批量写法在导入初始数据时更常用，也更高效。

## 题目

有一张库存表 `warehouse_stock`。请你新增两条商品记录：

1. `(104, '蓝牙耳机', '数码', 35, 299.00, '2026-01-10')`
2. `(105, '人体工学椅', '家居', 12, 899.00, '2026-01-10')`

并在插入后查询整张表，按 `product_id` 升序输出以下字段：

- `product_id`
- `product_name`
- `category`
- `qty`
- `price`
- `last_update`
