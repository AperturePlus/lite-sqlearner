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
    (3001, 'Ethan Zhou', 88, 82, 'NEW'),
    (3002, 'Ivy Cheng', 91, 78, 'NEW'),
    (3003, 'Ryan Gu', 86, 83, 'NEW'),
    (3004, 'Nina Han', 84, 90, 'NEW'),
    (3005, 'Leo Lin', 93, 87, 'REVIEWED');

INSERT INTO candidate_pool (candidate_id, candidate_name, exam_score, interview_score, batch_no)
VALUES
    (2999, 'Seed Candidate', 90, 88, '2025W4');
