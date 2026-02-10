import md from "./README.md?raw";
import sql from "./createTable.sql?raw";

export default {
  key: "dmlInsertSelectCandidate",
  title: "DML 训练 - INSERT INTO ... SELECT",
  initSQL: sql,
  content: md,
  defaultSQL: "select * from applicant_raw",
  answer:
    "INSERT OR IGNORE INTO candidate_pool (candidate_id, candidate_name, exam_score, interview_score, batch_no)\n" +
    "SELECT\n" +
    "    applicant_id,\n" +
    "    applicant_name,\n" +
    "    exam_score,\n" +
    "    interview_score,\n" +
    "    '2026S1' AS batch_no\n" +
    "FROM applicant_raw\n" +
    "WHERE exam_score >= 85\n" +
    "  AND interview_score >= 80\n" +
    "  AND status = 'NEW';\n" +
    "\n" +
    "SELECT\n" +
    "    candidate_id,\n" +
    "    candidate_name,\n" +
    "    exam_score,\n" +
    "    interview_score,\n" +
    "    batch_no\n" +
    "FROM candidate_pool\n" +
    "ORDER BY candidate_id;",
  hint: "把筛选条件写在 SELECT 的 WHERE 中，再插入目标表",
  type: "custom",
  difficulty: 2,
} as LevelType;
