import md from "./README.md?raw";
import sql from "./createTable.sql?raw";

export default {
  key: "dmlInsertStock",
  title: "DML 训练 - INSERT 批量新增",
  initSQL: sql,
  content: md,
  defaultSQL: "select * from warehouse_stock",
  answer:
    "INSERT OR IGNORE INTO warehouse_stock (product_id, product_name, category, qty, price, last_update)\n" +
    "VALUES\n" +
    "    (104, '蓝牙耳机', '数码', 35, 299.00, '2026-01-10'),\n" +
    "    (105, '人体工学椅', '家居', 12, 899.00, '2026-01-10');\n" +
    "\n" +
    "SELECT\n" +
    "    product_id,\n" +
    "    product_name,\n" +
    "    category,\n" +
    "    qty,\n" +
    "    price,\n" +
    "    last_update\n" +
    "FROM warehouse_stock\n" +
    "ORDER BY product_id;",
  hint: "可以一次 INSERT 多行，别忘了最后用 SELECT 验证结果",
  type: "custom",
  difficulty: 1,
} as LevelType;
