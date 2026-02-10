# 范式分解训练 - 3NF / BCNF 去传递依赖

## 教程

第三范式（3NF）强调：在满足 2NF 的基础上，**非主属性不能依赖其他非主属性**。  
也就是要消除“传递依赖”。

在 `teaching_record_raw` 中，存在这条依赖链：

- `student_id -> advisor_id`
- `advisor_id -> dept_id`
- `dept_id -> dept_name, dept_phone`

如果把这些字段都塞在一张表里，会导致大量冗余，并放大更新异常风险。  
因此需要拆分出顾问表和院系表。

当你继续要求“每个决定因素都必须是候选键”时，就进入 BCNF 思路。  
本关数据依赖经过拆分后，也符合这个方向。

## 本关函数依赖

- `student_id -> student_name, advisor_id`
- `advisor_id -> advisor_name, advisor_office, dept_id`
- `dept_id -> dept_name, dept_phone`
- `course_id -> course_name`
- `(student_id, course_id) -> score`

## 题目

请把 `teaching_record_raw` 分解为更规范的结构，并按下面顺序输出 **5 个结果集**：

1. `student(student_id, student_name, advisor_id)`
2. `advisor(advisor_id, advisor_name, advisor_office, dept_id)`
3. `department(dept_id, dept_name, dept_phone)`
4. `course(course_id, course_name)`
5. `enrollment(student_id, course_id, score)`

要求：

- 维度类结果集请去重
- 结果集顺序要与题目一致
