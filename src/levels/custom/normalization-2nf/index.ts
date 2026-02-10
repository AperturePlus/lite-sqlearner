import md from "./README.md?raw";
import sql from "./createTable.sql?raw";

export default {
  key: "normalization2nf",
  title: "范式分解训练 - 2NF 消除部分依赖",
  initSQL: sql,
  content: md,
  defaultSQL: "select * from enrollment_raw",
  answer:
    "SELECT DISTINCT student_id, student_name, major_name FROM enrollment_raw;\n" +
    "SELECT DISTINCT course_id, course_name, credit FROM enrollment_raw;\n" +
    "SELECT student_id, course_id, score FROM enrollment_raw;",
  hint: "先抽学生维度和课程维度，再保留选课成绩事实表",
  type: "custom",
  difficulty: 2,
} as LevelType;
