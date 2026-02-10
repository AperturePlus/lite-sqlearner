CREATE TABLE IF NOT EXISTS enrollment_raw
(
    student_id   INTEGER      NOT NULL,
    student_name VARCHAR(50)  NOT NULL,
    major_name   VARCHAR(100) NOT NULL,
    course_id    INTEGER      NOT NULL,
    course_name  VARCHAR(100) NOT NULL,
    credit       INTEGER      NOT NULL,
    score        INTEGER      NOT NULL
);

INSERT INTO enrollment_raw (student_id, student_name, major_name, course_id, course_name, credit, score)
VALUES
    (1001, '林晨', '软件工程', 501, '数据库原理', 4, 86),
    (1001, '林晨', '软件工程', 502, '操作系统', 3, 90),
    (1002, '苏沐', '数据科学', 501, '数据库原理', 4, 92),
    (1002, '苏沐', '数据科学', 503, '机器学习导论', 3, 88),
    (1003, '周琪', '软件工程', 502, '操作系统', 3, 79),
    (1003, '周琪', '软件工程', 504, '计算机网络', 3, 84);
