CREATE TABLE IF NOT EXISTS teaching_record_raw
(
    student_id     INTEGER      NOT NULL,
    student_name   VARCHAR(50)  NOT NULL,
    advisor_id     INTEGER      NOT NULL,
    advisor_name   VARCHAR(50)  NOT NULL,
    advisor_office VARCHAR(30)  NOT NULL,
    dept_id        INTEGER      NOT NULL,
    dept_name      VARCHAR(100) NOT NULL,
    dept_phone     VARCHAR(20)  NOT NULL,
    course_id      INTEGER      NOT NULL,
    course_name    VARCHAR(100) NOT NULL,
    score          INTEGER      NOT NULL
);

INSERT INTO teaching_record_raw
(student_id, student_name, advisor_id, advisor_name, advisor_office, dept_id, dept_name, dept_phone, course_id, course_name, score)
VALUES
    (2001, '陈舟', 9001, '王教授', 'A301', 10, '计算机学院', '010-1001', 701, '数据库系统', 91),
    (2001, '陈舟', 9001, '王教授', 'A301', 10, '计算机学院', '010-1001', 702, '数据仓库', 88),
    (2002, '李沫', 9002, '赵教授', 'B207', 11, '人工智能学院', '010-2001', 701, '数据库系统', 85),
    (2002, '李沫', 9002, '赵教授', 'B207', 11, '人工智能学院', '010-2001', 703, '机器学习', 93),
    (2003, '孙宁', 9001, '王教授', 'A301', 10, '计算机学院', '010-1001', 704, '操作系统', 87),
    (2004, '何嘉', 9003, '刘教授', 'C105', 10, '计算机学院', '010-1001', 703, '机器学习', 89);
