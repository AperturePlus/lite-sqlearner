# DML 训练 - INSERT INTO ... SELECT

当你要把一批“查询出来的数据”写入另一张表时，最常用的就是：

```sql
INSERT INTO target_table (col1, col2, ...)
SELECT ...
FROM source_table
WHERE ...;
```

这个写法在数据分层、归档、名单生成里非常常见。

## 题目

将 `applicant_raw` 中满足以下条件的候选人，插入到 `candidate_pool`：

- `exam_score >= 85`
- `interview_score >= 80`
- `status = 'NEW'`

并把 `batch_no` 固定写为 `'2026S1'`。

插入后查询 `candidate_pool`，按 `candidate_id` 升序输出：

- `candidate_id`
- `candidate_name`
- `exam_score`
- `interview_score`
- `batch_no`
