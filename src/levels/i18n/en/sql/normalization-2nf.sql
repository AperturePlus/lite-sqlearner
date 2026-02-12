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
    (1001, 'Evan Lin', 'Software Engineering', 501, 'Database Systems', 4, 86),
    (1001, 'Evan Lin', 'Software Engineering', 502, 'Operating Systems', 3, 90),
    (1002, 'Mia Su', 'Data Science', 501, 'Database Systems', 4, 92),
    (1002, 'Mia Su', 'Data Science', 503, 'Intro to Machine Learning', 3, 88),
    (1003, 'Noah Zhou', 'Software Engineering', 502, 'Operating Systems', 3, 79),
    (1003, 'Noah Zhou', 'Software Engineering', 504, 'Computer Networks', 3, 84);
