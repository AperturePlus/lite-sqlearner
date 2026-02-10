import md from "./README.md?raw";
import sql from "./createTable.sql?raw";

export default {
  key: "dmlArchiveCancelledOrders",
  title: "DML 训练 - 归档并删除历史取消单",
  initSQL: sql,
  content: md,
  defaultSQL: "select * from orders_live",
  answer:
    "INSERT OR IGNORE INTO orders_archive (order_id, customer_name, order_date, status, amount)\n" +
    "SELECT\n" +
    "    order_id,\n" +
    "    customer_name,\n" +
    "    order_date,\n" +
    "    status,\n" +
    "    amount\n" +
    "FROM orders_live\n" +
    "WHERE status = 'CANCELLED'\n" +
    "  AND order_date < '2025-12-01';\n" +
    "\n" +
    "DELETE FROM orders_live\n" +
    "WHERE status = 'CANCELLED'\n" +
    "  AND order_date < '2025-12-01';\n" +
    "\n" +
    "SELECT order_id, status FROM orders_archive ORDER BY order_id;\n" +
    "SELECT order_id, status FROM orders_live ORDER BY order_id;",
  hint: "先 INSERT...SELECT 归档，再 DELETE 清理在线表",
  type: "custom",
  difficulty: 3,
} as LevelType;
