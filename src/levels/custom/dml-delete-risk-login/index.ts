import md from "./README.md?raw";
import sql from "./createTable.sql?raw";

export default {
  key: "dmlDeleteRiskLogin",
  title: "DML 训练 - DELETE 风险日志清理",
  initSQL: sql,
  content: md,
  defaultSQL: "select * from user_login_log",
  answer:
    "DELETE FROM user_login_log\n" +
    "WHERE ip_addr IN (\n" +
    "    SELECT ip_addr\n" +
    "    FROM ip_blacklist\n" +
    ");\n" +
    "\n" +
    "SELECT\n" +
    "    user_id,\n" +
    "    COUNT(*) AS login_cnt\n" +
    "FROM user_login_log\n" +
    "GROUP BY user_id\n" +
    "ORDER BY user_id;",
  hint: "DELETE + 子查询是常见组合，删完后记得聚合验证",
  type: "custom",
  difficulty: 2,
} as LevelType;
