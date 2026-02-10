import md from "./README.md?raw";
import sql from "./createTable.sql?raw";

export default {
  key: "dmlUpdateTeacherBonus",
  title: "DML 训练 - UPDATE 绩效回写",
  initSQL: sql,
  content: md,
  defaultSQL: "select * from teacher_bonus",
  answer:
    "UPDATE teacher_bonus\n" +
    "SET bonus = MAX(\n" +
    "    0,\n" +
    "    ROUND(\n" +
    "        class_count * 120\n" +
    "        + CASE WHEN avg_score > 80 THEN (avg_score - 80) * 25 ELSE 0 END\n" +
    "        - COALESCE(\n" +
    "            (\n" +
    "                SELECT absent_times\n" +
    "                FROM teacher_attendance ta\n" +
    "                WHERE ta.teacher_id = teacher_bonus.teacher_id\n" +
    "            ),\n" +
    "            0\n" +
    "        ) * 50,\n" +
    "        2\n" +
    "    )\n" +
    ");\n" +
    "\n" +
    "SELECT\n" +
    "    teacher_id,\n" +
    "    teacher_name,\n" +
    "    bonus\n" +
    "FROM teacher_bonus\n" +
    "ORDER BY teacher_id;",
  hint: "可用相关子查询取缺勤次数，注意奖金下限是 0",
  type: "custom",
  difficulty: 3,
} as LevelType;
