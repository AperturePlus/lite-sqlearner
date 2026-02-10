# 范式分解训练 - 2NF 消除部分依赖

## 教程

第二范式（2NF）要求：在满足 1NF 的前提下，**每个非主属性都必须完全依赖于整个候选键**，不能只依赖组合键的一部分。

这张 `enrollment_raw` 表把学生信息、课程信息和成绩信息放在了一起。  
如果候选键是 `(student_id, course_id)`，就会出现典型的“部分依赖”：

- `student_name, major_name` 只依赖 `student_id`
- `course_name, credit` 只依赖 `course_id`
- `score` 才依赖整个 `(student_id, course_id)`

所以需要分解为“学生维度 + 课程维度 + 选课事实”。

## 本关函数依赖

- `student_id -> student_name, major_name`
- `course_id -> course_name, credit`
- `(student_id, course_id) -> score`

## 题目

请把 `enrollment_raw` 分解为 2NF，并按下面顺序输出 **3 个结果集**：

1. 学生维表：`student_id, student_name, major_name`
2. 课程维表：`course_id, course_name, credit`
3. 选课事实表：`student_id, course_id, score`

提示：

- 维表需要去重
- 结果集顺序要与题目一致
