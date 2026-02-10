import md from "./README.md?raw";
import sql from "./createTable.sql?raw";

export default {
  key: "normalization3nf",
  title: "范式分解训练 - 3NF / BCNF 去传递依赖",
  initSQL: sql,
  content: md,
  defaultSQL: "select * from teaching_record_raw",
  answer:
    "SELECT DISTINCT student_id, student_name, advisor_id FROM teaching_record_raw;\n" +
    "SELECT DISTINCT advisor_id, advisor_name, advisor_office, dept_id FROM teaching_record_raw;\n" +
    "SELECT DISTINCT dept_id, dept_name, dept_phone FROM teaching_record_raw;\n" +
    "SELECT DISTINCT course_id, course_name FROM teaching_record_raw;\n" +
    "SELECT student_id, course_id, score FROM teaching_record_raw;",
  hint: "先拆掉 advisor 与 department 的传递依赖，再保留 enrollment 事实",
  type: "custom",
  difficulty: 3,
} as LevelType;
