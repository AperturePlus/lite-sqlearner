-- `student`
create table if not exists `student`
(
    `id`       integer          not null primary key AUTOINCREMENT,
    `name`     varchar(256)     not null,
    `age`      int              null,
    `class_id` bigint           not null,
    `score`    double default 0 null,
    `exam_num` int    default 0 null
);

insert into `student` (`name`, `age`, `class_id`, `score`, `exam_num`)
values ('Jake', 25, 1, 2.5, 1);
insert into `student` (`name`, `age`, `class_id`, `score`, `exam_num`)
values ('Yupi', 18, 1, 400, 4);
insert into `student` (`name`, `age`, `class_id`, `score`, `exam_num`)
values ('HotDog', 40, 2, 600, 4);
insert into `student` (`name`, `age`, `class_id`, `score`, `exam_num`)
values ('Fish', null, 2, 360, 4);
insert into `student` (`name`, `age`, `class_id`, `score`, `exam_num`)
values ('Liam', 19, 3, 120, 2);
insert into `student` (`name`, `age`, `class_id`, `score`, `exam_num`)
values ('Lily', 56, 3, 500, 4);
insert into `student` (`name`, `age`, `class_id`, `score`, `exam_num`)
values ('Linda', 24, 4, 390, 3);
insert into `student` (`name`, `age`, `class_id`, `score`, `exam_num`)
values ('Watt', 23, 4, 0, 4);
insert into `student` (`name`, `age`, `class_id`, `score`, `exam_num`)
values ('Zack', 80, 4, 600, 4);
insert into `student` (`name`, `age`, `class_id`, `score`, `exam_num`)
values ('Sunny', 60, 5, 100.5, 1);

-- `student_new`
create table if not exists `student_new`
(
    `id`       integer          not null primary key AUTOINCREMENT,
    `name`     varchar(256)     not null,
    `age`      int              null,
    `class_id` bigint           not null,
    `score`    double default 0 null,
    `exam_num` int    default 0 null
);

insert into `student_new` (`name`, `age`, `class_id`, `score`, `exam_num`)
values ('NewStudent1', 20, 1, 120, 1);
insert into `student_new` (`name`, `age`, `class_id`, `score`, `exam_num`)
values ('NewStudent2', 21, 2, 180, 2);
insert into `student_new` (`name`, `age`, `class_id`, `score`, `exam_num`)
values ('Jake', 25, 1, 2.5, 1);
insert into `student_new` (`name`, `age`, `class_id`, `score`, `exam_num`)
values ('Yupi', 18, 1, 400, 4);
