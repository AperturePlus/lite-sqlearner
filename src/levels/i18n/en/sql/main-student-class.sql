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

-- `class`
create table if not exists `class`
(
    `id`             integer      not null primary key AUTOINCREMENT,
    `name`           varchar(256) not null,
    `level`          varchar(256) not null,
    `student_num`    integer default 0 not null,
    `head_teacher_id` bigint      not null
);

insert into `class` (`id`, `name`, `level`, `student_num`, `head_teacher_id`)
values (1, 'Singing', 'A', 10, 1);
insert into `class` (`id`, `name`, `level`, `student_num`, `head_teacher_id`)
values (2, 'Dance', 'B', 12, 2);
insert into `class` (`id`, `name`, `level`, `student_num`, `head_teacher_id`)
values (3, 'Rap', 'C', 15, 3);
insert into `class` (`id`, `name`, `level`, `student_num`, `head_teacher_id`)
values (6, 'Basketball', 'A', 20, 4);
