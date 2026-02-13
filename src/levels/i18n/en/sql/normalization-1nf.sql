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
    (1001, 'Evan Lin', 'Database Systems', 'Computer Networks', NULL),
    (1002, 'Mia Su', 'Calculus', 'Discrete Mathematics', 'Probability'),
    (1003, 'Noah Zhou', 'Database Systems', NULL, NULL),
    (1004, 'Ava Tang', 'Operating Systems', 'Computer Architecture', 'Database Systems');
