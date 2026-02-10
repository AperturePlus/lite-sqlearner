import md from "./README.md?raw";
import sql from "./createTable.sql?raw";

export default {
  key: "normalization1nf",
  title: "范式分解训练 - 1NF 原子化",
  initSQL: sql,
  content: md,
  defaultSQL: "select * from student_course_wide",
  answer:
    "SELECT student_id, student_name, course_1 AS course_name FROM student_course_wide WHERE course_1 IS NOT NULL\n" +
    "UNION ALL\n" +
    "SELECT student_id, student_name, course_2 AS course_name FROM student_course_wide WHERE course_2 IS NOT NULL\n" +
    "UNION ALL\n" +
    "SELECT student_id, student_name, course_3 AS course_name FROM student_course_wide WHERE course_3 IS NOT NULL;",
  hint: "用 UNION ALL 把重复组拍平，并过滤空课程",
  type: "custom",
  difficulty: 2,
} as LevelType;
