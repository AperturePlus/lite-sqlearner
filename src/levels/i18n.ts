import type { AppLocale } from "../core/i18n";
import mainStudentSqlEn from "./i18n/en/sql/main-student.sql?raw";
import mainStudentClassSqlEn from "./i18n/en/sql/main-student-class.sql?raw";
import mainStudentNewSqlEn from "./i18n/en/sql/main-student-student-new.sql?raw";
import normalization1nfSqlEn from "./i18n/en/sql/normalization-1nf.sql?raw";
import normalization2nfSqlEn from "./i18n/en/sql/normalization-2nf.sql?raw";
import normalization3nfSqlEn from "./i18n/en/sql/normalization-3nf.sql?raw";
import dmlInsertStockSqlEn from "./i18n/en/sql/dml-insert-stock.sql?raw";
import dmlUpdateOrderDiscountSqlEn from "./i18n/en/sql/dml-update-order-discount.sql?raw";
import dmlInsertSelectCandidateSqlEn from "./i18n/en/sql/dml-insert-select-candidate.sql?raw";
import dmlUpdateTeacherBonusSqlEn from "./i18n/en/sql/dml-update-teacher-bonus.sql?raw";
import dmlArchiveCancelledOrdersSqlEn from "./i18n/en/sql/dml-archive-cancelled-orders.sql?raw";

interface LevelMeta {
  title: string;
  task: string;
  hint: string;
}

interface LocalizedLevelOverrides {
  title?: string;
  hint?: string;
  content?: string;
  initSQL?: string;
  answer?: string;
  defaultSQL?: string;
}

const DEFAULT_ENGLISH_HINT =
  "Use schema SQL and execution result comparison to iterate your solution.";

const buildEnglishChallengeContent = (
  title: string,
  task: string,
  hint: string
): string => {
  return [
    `# ${title}`,
    "",
    "## Goal",
    task,
    "",
    "## Hint",
    hint,
    "",
    "## Notes",
    "Use `View Schema SQL`, `View Execution Result`, and `View Answer` to verify your query.",
  ].join("\n");
};

const parseMainLevelNumber = (key: string): number | null => {
  const match = /^level(\d+)$/.exec(key);
  if (!match || !match[1]) {
    return null;
  }
  return Number(match[1]);
};

const getMainInitSqlByKey = (key: string): string | undefined => {
  const levelNumber = parseMainLevelNumber(key);
  if (!levelNumber) {
    return undefined;
  }
  if (levelNumber === 25) {
    return mainStudentNewSqlEn;
  }
  if (levelNumber >= 20) {
    return mainStudentClassSqlEn;
  }
  return mainStudentSqlEn;
};

const MAIN_LEVEL_META: Record<string, LevelMeta> = {
  level1: {
    title: "SQL Basics - SELECT - Full Table Query",
    task: "Query all columns and all rows from the `student` table.",
    hint: "Use `select * from student`.",
  },
  level2: {
    title: "SQL Basics - SELECT - Projection",
    task: "Query only the `name` and `age` columns from `student`.",
    hint: "Specify required columns in `SELECT`.",
  },
  level3: {
    title: "SQL Basics - Aliases",
    task: "Query student name and age, and alias them as `student_name` and `student_age`.",
    hint: "Use `AS` or direct alias syntax after each selected column.",
  },
  level4: {
    title: "SQL Basics - Constants and Expressions",
    task: "Return `name`, `score`, and a computed column `double_score` = `score * 2`.",
    hint: "Use arithmetic expressions in the select list.",
  },
  level5: {
    title: "SQL Basics - WHERE Filter",
    task: "Return `name` and `score` for the student named `Yupi`.",
    hint: "Filter with an equality condition in `WHERE`.",
  },
  level6: {
    title: "SQL Basics - Comparison Operators",
    task: "Return `name` and `age` for students whose name is not `HotDog`.",
    hint: "Use `!=` in the `WHERE` clause.",
  },
  level7: {
    title: "SQL Basics - NULL Handling",
    task: "Return `name`, `age`, and `score` where `age` is not null.",
    hint: "Use `IS NOT NULL`.",
  },
  level8: {
    title: "SQL Basics - Pattern Matching",
    task: "Return `name` and `score` for students whose names do not contain `Li`.",
    hint: "Use `NOT LIKE` with `%` wildcard.",
  },
  level9: {
    title: "SQL Basics - Logical Conditions",
    task: "Return `name` and `score` where name contains `Li` OR score is greater than 500.",
    hint: "Combine conditions with `OR`.",
  },
  level10: {
    title: "SQL Basics - DISTINCT",
    task: "Return distinct combinations of `class_id` and `exam_num`.",
    hint: "Use `DISTINCT` on multiple columns.",
  },
  level11: {
    title: "SQL Basics - ORDER BY",
    task: "Return `name`, `age`, `score` ordered by `score` descending and `age` ascending.",
    hint: "Sort by multiple fields with different directions.",
  },
  level12: {
    title: "SQL Basics - LIMIT and OFFSET",
    task: "Sort by age ascending, then return 3 rows starting from the second row.",
    hint: "The first argument of SQLite `LIMIT` can be the offset.",
  },
  level13: {
    title: "SQL Basics - CASE WHEN",
    task:
      "For each student, return `name` and an `age_level` label: `Senior` if age > 60, `Adult` if age > 20, otherwise `Junior`. Order by name ascending.",
    hint: "Use a multi-branch `CASE WHEN` expression.",
  },
  level14: {
    title: "Functions - Date",
    task: "Return each student name and the current date as `current_date`.",
    hint: "Use SQLite `date()` function.",
  },
  level15: {
    title: "Functions - String Processing",
    task: "For the student named `HotDog`, return `id`, `name`, and uppercase `name` as `upper_name`.",
    hint: "Use `UPPER(name)` and a `WHERE` filter.",
  },
  level16: {
    title: "Functions - Aggregation",
    task: "Return total, average, maximum, and minimum scores from `student`.",
    hint: "Use `SUM`, `AVG`, `MAX`, and `MIN`.",
  },
  level17: {
    title: "Grouping - Single Column",
    task: "Group by `class_id` and return average score of each class.",
    hint: "Use `GROUP BY class_id` with `AVG(score)`.",
  },
  level18: {
    title: "Grouping - Multiple Columns",
    task: "Group by `class_id` and `exam_num`, and return row count for each group.",
    hint: "Group by both columns and aggregate with `COUNT(*)`.",
  },
  level19: {
    title: "Grouping - HAVING",
    task: "Group by `class_id`, sum scores, and keep groups whose total score is greater than 150.",
    hint: "Use `HAVING` after `GROUP BY`.",
  },
  level20: {
    title: "Advanced Query - CROSS JOIN",
    task: "Cross join `student` and `class`, then return selected student/class fields.",
    hint: "A cross join returns combinations of rows from both tables.",
  },
  level21: {
    title: "Advanced Query - INNER JOIN",
    task: "Join `student` with `class` by class id and return matching rows.",
    hint: "Use `JOIN ... ON s.class_id = c.id`.",
  },
  level22: {
    title: "Advanced Query - LEFT JOIN",
    task: "Left join `student` with `class` and return all students with optional class info.",
    hint: "Use `LEFT JOIN` to keep all rows from the left table.",
  },
  level23: {
    title: "Advanced Query - Subquery with IN",
    task: "Return student name, score, class id where class id exists in class table ids.",
    hint: "Use `IN (SELECT DISTINCT id FROM class)`.",
  },
  level24: {
    title: "Advanced Query - Subquery with EXISTS",
    task: "Return students whose class id does not exist in class table.",
    hint: "Use `NOT EXISTS` correlated subquery.",
  },
  level25: {
    title: "Advanced Query - UNION ALL",
    task: "Combine rows from `student` and `student_new` with `UNION ALL`.",
    hint: "Ensure both queries have same column order and count.",
  },
  level26: {
    title: "Window Function - AVG OVER",
    task: "Return each student row and class average score with `AVG(score) OVER (PARTITION BY class_id)`.",
    hint: "Partition by class id.",
  },
  level27: {
    title: "Window Function - SUM OVER ORDER BY",
    task: "Return class-wise cumulative score ordered by score ascending.",
    hint: "Use `SUM(score) OVER (PARTITION BY class_id ORDER BY score ASC)`.",
  },
  level28: {
    title: "Window Function - RANK",
    task: "Rank students within each class by score descending.",
    hint: "Use `RANK() OVER (PARTITION BY class_id ORDER BY score DESC)`.",
  },
  level29: {
    title: "Window Function - ROW_NUMBER",
    task: "Assign row numbers within each class by score descending.",
    hint: "Use `ROW_NUMBER()` with `PARTITION BY` and `ORDER BY`.",
  },
  level30: {
    title: "Window Function - LAG / LEAD",
    task: "For each class, return previous and next student names by score descending.",
    hint: "Use `LAG` and `LEAD` in the same window definition.",
  },
};

const MAIN_ANSWER_OVERRIDES: Record<string, string> = {
  level3: "select name as student_name, age as student_age from student",
  level5: "select name, score from student where name = 'Yupi'",
  level6: "select name, age from student where name != 'HotDog'",
  level8: "select name, score from student where name not like '%Li%'",
  level9: "select name, score from student where name like '%Li%' or score > 500;",
  level13:
    "SELECT\n" +
    "  name,\n" +
    "  CASE WHEN (age > 60) THEN 'Senior'\n" +
    "       WHEN (age > 20) THEN 'Adult'\n" +
    "       ELSE 'Junior' END AS age_level\n" +
    "FROM\n" +
    "  student\n" +
    "ORDER BY\n" +
    "  name asc;",
  level14: "select name, date() as current_date from student",
  level15:
    "SELECT id, name, UPPER(name) AS upper_name\n" +
    "FROM student\n" +
    "WHERE name = 'HotDog';",
};

const CUSTOM_META: Record<string, LevelMeta> = {
  adventurer: {
    title: "Adventurers and Gold",
    task: "Solve this scenario challenge and match the expected result set.",
    hint: "Use grouping and aggregate functions.",
  },
  magicScores: {
    title: "Magic Academy",
    task: "Solve this scenario challenge and match the expected result set.",
    hint: "Use window functions.",
  },
  waveChicken: {
    title: "Chicken Elimination",
    task: "Solve this scenario challenge and match the expected result set.",
    hint: "Use `LIKE` pattern matching.",
  },
  ecommerce_analysis: {
    title: "E-commerce Analytics",
    task: "Solve this scenario challenge and match the expected result set.",
    hint: "Use `GROUP BY`, `SUM`, and `ORDER BY`.",
  },
  game_data_analysis: {
    title: "Game Data Analytics",
    task: "Solve this scenario challenge and match the expected result set.",
    hint:
      "Use `CASE WHEN` for win counts and `HAVING` for game count filtering. Handle division by zero carefully.",
  },
  financial_transaction_analysis: {
    title: "Investment Analytics",
    task: "Solve this scenario challenge and match the expected result set.",
    hint:
      "Use subqueries for hot stocks and compute volatility as (max - min) / average price.",
  },
  social_media_analysis: {
    title: "Social Feed Secrets",
    task: "Solve this scenario challenge and match the expected result set.",
    hint: "Use `SUM`, `AVG`, and ratio calculations with correct numeric casting.",
  },
  logistics_delivery_analysis: {
    title: "Logistics Arena",
    task: "Solve this scenario challenge and match the expected result set.",
    hint:
      "Use `JULIANDAY` for time difference, combine with subqueries/window functions, and sort percentage strings carefully.",
  },
  movie_box_office_analysis: {
    title: "Box Office Champion",
    task: "Solve this scenario challenge and match the expected result set.",
    hint: "Group by movie type and calculate total and average box office.",
  },
  restaurant_business_analysis: {
    title: "Food Empire",
    task: "Solve this scenario challenge and match the expected result set.",
    hint:
      "Group by category and calculate revenue, order count, average price, and member ratio.",
  },
  book_sales_analysis: {
    title: "Book Sales Analytics",
    task: "Solve this scenario challenge and match the expected result set.",
    hint:
      "Group by category and use subquery to locate the highest-grossing book per category.",
  },
  hospital_appointment_analysis: {
    title: "White Angel",
    task: "Solve this scenario challenge and match the expected result set.",
    hint:
      "Use grouping, subqueries for peak time slots, and `CASE WHEN` for gender ratio.",
  },
  delivery_performance_analysis: {
    title: "Delivery Masters",
    task: "Solve this scenario challenge and match the expected result set.",
    hint:
      "Use `SUM` and ratio formulas for success rate and efficiency. Filter order volume with `HAVING`.",
  },
  stock_trading_analysis: {
    title: "Wall Street Storm",
    task: "Solve this scenario challenge and match the expected result set.",
    hint:
      "Combine subqueries and window functions; pay attention to `HAVING` position and calculation order.",
  },
  ecommerce_user_behavior_analysis: {
    title: "Data Prospector",
    task: "Solve this scenario challenge and match the expected result set.",
    hint:
      "Use `CASE WHEN` for age buckets, subqueries for hot categories, and compute VIP/gender ratios.",
  },
  normalization1nf: {
    title: "Normalization Training - 1NF Atomic Values",
    task:
      "Flatten repeated course columns in `student_course_wide` and output `student_id`, `student_name`, and `course_name`.",
    hint: "Use `UNION ALL` and filter out null courses.",
  },
  normalization2nf: {
    title: "Normalization Training - 2NF Partial Dependency Removal",
    task:
      "Split `enrollment_raw` into student dimension, course dimension, and enrollment fact result sets.",
    hint: "Extract stable dimensions first, then keep fact table (`student_id`, `course_id`, `score`).",
  },
  normalization3nf: {
    title: "Normalization Training - 3NF / BCNF",
    task:
      "Remove transitive dependency in `teaching_record_raw` by producing student, advisor, department, course, and enrollment result sets.",
    hint: "Separate advisor-department dependency before preserving enrollment facts.",
  },
  dmlInsertStock: {
    title: "DML Training - Batch INSERT",
    task:
      "Insert required rows into `warehouse_stock`, then query all rows to verify the final table state.",
    hint: "You can insert multiple rows in one `INSERT` statement.",
  },
  dmlUpdateOrderDiscount: {
    title: "DML Training - Conditional UPDATE",
    task:
      "Update discount and final amount in `sales_order` based on payment status and membership.",
    hint: "Use `CASE WHEN` and `ROUND(..., 2)`.",
  },
  dmlDeleteRiskLogin: {
    title: "DML Training - DELETE Risk Logs",
    task:
      "Delete login records whose IP exists in blacklist, then aggregate remaining login counts by user.",
    hint: "`DELETE` with subquery is a common pattern.",
  },
  dmlInsertSelectCandidate: {
    title: "DML Training - INSERT INTO ... SELECT",
    task:
      "Insert qualified candidates from `applicant_raw` into `candidate_pool` and query final pool data.",
    hint: "Put screening rules inside `SELECT ... WHERE`.",
  },
  dmlUpdateTeacherBonus: {
    title: "DML Training - UPDATE Bonus Backfill",
    task:
      "Calculate and update teacher bonus using class count, score, and attendance penalty, then query bonuses.",
    hint: "Use correlated subquery for absence count and keep lower bound at 0.",
  },
  dmlArchiveCancelledOrders: {
    title: "DML Training - Archive and Delete Cancelled Orders",
    task:
      "Archive old cancelled orders from `orders_live` to `orders_archive`, then delete them from live table.",
    hint: "Run `INSERT ... SELECT` first, then `DELETE`.",
  },
};

const CUSTOM_INIT_SQL_OVERRIDES: Record<string, string> = {
  normalization1nf: normalization1nfSqlEn,
  normalization2nf: normalization2nfSqlEn,
  normalization3nf: normalization3nfSqlEn,
  dmlInsertStock: dmlInsertStockSqlEn,
  dmlUpdateOrderDiscount: dmlUpdateOrderDiscountSqlEn,
  dmlInsertSelectCandidate: dmlInsertSelectCandidateSqlEn,
  dmlUpdateTeacherBonus: dmlUpdateTeacherBonusSqlEn,
  dmlArchiveCancelledOrders: dmlArchiveCancelledOrdersSqlEn,
};

const CUSTOM_ANSWER_OVERRIDES: Record<string, string> = {
  dmlInsertStock:
    "INSERT OR IGNORE INTO warehouse_stock (product_id, product_name, category, qty, price, last_update)\n" +
    "VALUES\n" +
    "    (104, 'Bluetooth Earbuds', 'Digital', 35, 299.00, '2026-01-10'),\n" +
    "    (105, 'Ergonomic Chair', 'Furniture', 12, 899.00, '2026-01-10');\n" +
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
};

const humanizeLevelKey = (key: string) => {
  return key
    .replace(/([a-z\d])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const getEnglishOverrides = (level: LevelType): LocalizedLevelOverrides => {
  const mainMeta = MAIN_LEVEL_META[level.key];
  if (mainMeta) {
    return {
      title: mainMeta.title,
      hint: mainMeta.hint,
      content: buildEnglishChallengeContent(
        mainMeta.title,
        mainMeta.task,
        mainMeta.hint
      ),
      initSQL: getMainInitSqlByKey(level.key),
      answer: MAIN_ANSWER_OVERRIDES[level.key],
    };
  }

  const customMeta = CUSTOM_META[level.key];
  if (customMeta) {
    return {
      title: customMeta.title,
      hint: customMeta.hint,
      content: buildEnglishChallengeContent(
        customMeta.title,
        customMeta.task,
        customMeta.hint
      ),
      initSQL: CUSTOM_INIT_SQL_OVERRIDES[level.key],
      answer: CUSTOM_ANSWER_OVERRIDES[level.key],
    };
  }

  const fallbackTitle = humanizeLevelKey(level.key);
  return {
    title: fallbackTitle,
    hint: DEFAULT_ENGLISH_HINT,
    content: buildEnglishChallengeContent(
      fallbackTitle,
      "Solve this SQL challenge and match the expected result set.",
      DEFAULT_ENGLISH_HINT
    ),
  };
};

export const localizeLevel = (level: LevelType, locale: AppLocale): LevelType => {
  if (locale !== "en-US") {
    return level;
  }

  const overrides = getEnglishOverrides(level);
  return {
    ...level,
    ...Object.fromEntries(
      Object.entries(overrides).filter(([, value]) => value !== undefined)
    ),
  } as LevelType;
};

export const localizeLevels = (levels: LevelType[], locale: AppLocale) => {
  return levels.map((level) => localizeLevel(level, locale));
};
