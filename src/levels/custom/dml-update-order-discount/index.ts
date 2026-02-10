import md from "./README.md?raw";
import sql from "./createTable.sql?raw";

export default {
  key: "dmlUpdateOrderDiscount",
  title: "DML 训练 - UPDATE 条件更新",
  initSQL: sql,
  content: md,
  defaultSQL: "select * from sales_order",
  answer:
    "UPDATE sales_order\n" +
    "SET\n" +
    "    discount_rate = CASE\n" +
    "        WHEN pay_status = 'PAID' AND is_member = 1 THEN 0.15\n" +
    "        WHEN pay_status = 'PAID' AND is_member = 0 THEN 0.05\n" +
    "        ELSE 0\n" +
    "    END,\n" +
    "    final_amount = ROUND(\n" +
    "        amount * (\n" +
    "            1 - CASE\n" +
    "                    WHEN pay_status = 'PAID' AND is_member = 1 THEN 0.15\n" +
    "                    WHEN pay_status = 'PAID' AND is_member = 0 THEN 0.05\n" +
    "                    ELSE 0\n" +
    "                END\n" +
    "        ),\n" +
    "        2\n" +
    "    );\n" +
    "\n" +
    "SELECT\n" +
    "    order_id,\n" +
    "    customer_name,\n" +
    "    discount_rate,\n" +
    "    final_amount\n" +
    "FROM sales_order\n" +
    "ORDER BY order_id;",
  hint: "用 CASE WHEN 统一更新折扣和实付金额，金额可用 ROUND 保留两位",
  type: "custom",
  difficulty: 2,
} as LevelType;
