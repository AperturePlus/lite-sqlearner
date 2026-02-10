# DML 训练 - DELETE 风险日志清理

`DELETE` 用于删除记录。最常见的两个坑是：

- 忘写 `WHERE` 导致全表删除
- 条件写错，删多了或删少了

生产环境里通常会先 `SELECT` 预览目标数据，再执行删除。

## 题目

你有两张表：

- `user_login_log`：登录日志
- `ip_blacklist`：高风险 IP 列表

请删除所有来自黑名单 IP 的登录记录。  
删除后，统计每个用户剩余的登录次数，输出：

- `user_id`
- `login_cnt`

并按 `user_id` 升序排序。
