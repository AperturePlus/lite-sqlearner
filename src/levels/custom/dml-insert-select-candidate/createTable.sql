CREATE TABLE IF NOT EXISTS applicant_raw
(
    applicant_id      INTEGER      NOT NULL PRIMARY KEY,
    applicant_name    VARCHAR(50)  NOT NULL,
    exam_score        INTEGER      NOT NULL,
    interview_score   INTEGER      NOT NULL,
    status            VARCHAR(20)  NOT NULL
);

CREATE TABLE IF NOT EXISTS candidate_pool
(
    candidate_id      INTEGER      NOT NULL PRIMARY KEY,
    candidate_name    VARCHAR(50)  NOT NULL,
    exam_score        INTEGER      NOT NULL,
    interview_score   INTEGER      NOT NULL,
    batch_no          VARCHAR(20)  NOT NULL
);

INSERT INTO applicant_raw (applicant_id, applicant_name, exam_score, interview_score, status)
VALUES
    (3001, '周岳', 88, 82, 'NEW'),
    (3002, '程柠', 91, 78, 'NEW'),
    (3003, '顾然', 86, 83, 'NEW'),
    (3004, '韩沫', 84, 90, 'NEW'),
    (3005, '林皓', 93, 87, 'REVIEWED');

INSERT INTO candidate_pool (candidate_id, candidate_name, exam_score, interview_score, batch_no)
VALUES
    (2999, '预置候选人', 90, 88, '2025W4');
