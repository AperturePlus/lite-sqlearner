CREATE TABLE IF NOT EXISTS student_course_wide
(
    student_id   INTEGER      NOT NULL,
    student_name VARCHAR(50)  NOT NULL,
    course_1     VARCHAR(100) NULL,
    course_2     VARCHAR(100) NULL,
    course_3     VARCHAR(100) NULL
);

INSERT INTO student_course_wide (student_id, student_name, course_1, course_2, course_3)
VALUES
    (1001, '林晨', '数据库原理', '计算机网络', NULL),
    (1002, '苏沐', '高等数学', '离散数学', '概率论'),
    (1003, '周琪', '数据库原理', NULL, NULL),
    (1004, '唐越', '操作系统', '计算机组成原理', '数据库原理');
