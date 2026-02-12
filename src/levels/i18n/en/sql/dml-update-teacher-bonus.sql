CREATE TABLE IF NOT EXISTS teacher_bonus
(
    teacher_id    INTEGER      NOT NULL PRIMARY KEY,
    teacher_name  VARCHAR(50)  NOT NULL,
    class_count   INTEGER      NOT NULL,
    avg_score     NUMERIC      NOT NULL,
    bonus         NUMERIC      NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS teacher_attendance
(
    teacher_id    INTEGER      NOT NULL PRIMARY KEY,
    absent_times  INTEGER      NOT NULL
);

INSERT INTO teacher_bonus (teacher_id, teacher_name, class_count, avg_score, bonus)
VALUES
    (801, 'Teacher Wang', 22, 87.5, 0),
    (802, 'Teacher Li', 18, 79.0, 0),
    (803, 'Teacher Zhao', 26, 91.0, 0),
    (804, 'Teacher Zhou', 16, 83.0, 0);

INSERT INTO teacher_attendance (teacher_id, absent_times)
VALUES
    (801, 1),
    (802, 0),
    (803, 3),
    (804, 2);
