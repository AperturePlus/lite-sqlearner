# DML 训练 - UPDATE 绩效回写

复杂 `UPDATE` 的典型场景是“把统计结果回写到业务表”。  
除了 `CASE WHEN`，你还会经常用到：

- 相关子查询（按当前行去别表取值）
- `COALESCE`（处理空值）
- 数值保护（例如最低不能小于 0）

## 题目

请根据以下规则更新 `teacher_bonus` 的 `bonus` 字段：

`bonus = class_count * 120 + max(avg_score - 80, 0) * 25 - absent_times * 50`

说明：

- `absent_times` 需要从 `teacher_attendance` 表按 `teacher_id` 查询
- 奖金最低为 `0`
- 结果保留两位小数

更新后输出：

- `teacher_id`
- `teacher_name`
- `bonus`

并按 `teacher_id` 升序排序。
