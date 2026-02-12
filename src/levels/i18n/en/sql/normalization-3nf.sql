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
    (2001, 'Ethan Chen', 9001, 'Prof. Wang', 'A301', 10, 'School of Computer Science', '010-1001', 701, 'Database Systems', 91),
    (2001, 'Ethan Chen', 9001, 'Prof. Wang', 'A301', 10, 'School of Computer Science', '010-1001', 702, 'Data Warehouse', 88),
    (2002, 'Liam Li', 9002, 'Prof. Zhao', 'B207', 11, 'School of AI', '010-2001', 701, 'Database Systems', 85),
    (2002, 'Liam Li', 9002, 'Prof. Zhao', 'B207', 11, 'School of AI', '010-2001', 703, 'Machine Learning', 93),
    (2003, 'Nora Sun', 9001, 'Prof. Wang', 'A301', 10, 'School of Computer Science', '010-1001', 704, 'Operating Systems', 87),
    (2004, 'Olivia He', 9003, 'Prof. Liu', 'C105', 10, 'School of Computer Science', '010-1001', 703, 'Machine Learning', 89);
