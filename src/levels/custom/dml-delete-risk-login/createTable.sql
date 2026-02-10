CREATE TABLE IF NOT EXISTS user_login_log
(
    log_id      INTEGER      NOT NULL PRIMARY KEY,
    user_id     INTEGER      NOT NULL,
    login_time  DATETIME     NOT NULL,
    ip_addr     VARCHAR(50)  NOT NULL,
    device      VARCHAR(50)  NOT NULL
);

CREATE TABLE IF NOT EXISTS ip_blacklist
(
    ip_addr     VARCHAR(50)  NOT NULL PRIMARY KEY,
    risk_level  VARCHAR(20)  NOT NULL
);

INSERT INTO ip_blacklist (ip_addr, risk_level)
VALUES
    ('10.0.0.1', 'HIGH'),
    ('172.16.3.9', 'HIGH');

INSERT INTO user_login_log (log_id, user_id, login_time, ip_addr, device)
VALUES
    (1, 101, '2026-01-11 08:30:00', '10.0.0.1', 'iPhone'),
    (2, 101, '2026-01-11 20:12:00', '192.168.1.8', 'Mac'),
    (3, 102, '2026-01-12 07:02:00', '172.16.3.9', 'Android'),
    (4, 102, '2026-01-12 19:40:00', '172.16.8.8', 'Windows'),
    (5, 103, '2026-01-12 22:19:00', '192.168.1.9', 'Windows'),
    (6, 103, '2026-01-13 09:11:00', '10.0.0.1', 'Linux'),
    (7, 103, '2026-01-13 21:15:00', '192.168.1.9', 'iPad');
