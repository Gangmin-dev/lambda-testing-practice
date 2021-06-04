ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '12345678';
CREATE USER 'user'@'%' IDENTIFIED BY '12345678';

CREATE DATABASE IF NOT EXISTS `test_db`;

GRANT ALL PRIVILEGES ON test_db.* TO 'user'@'%';
FLUSH PRIVILEGES;

-- USE `practice0427`;

-- CREATE TABLE IF NOT EXISTS `author` (
--   `id` VARCHAR(3) NOT NULL,
--   `name` VARCHAR(12) NOT NULL,
--   PRIMARY KEY (`id`));

-- CREATE TABLE IF NOT EXISTS `subject` (
--   `id` INT NOT NULL AUTO_INCREMENT,
--   `title` VARCHAR(10) NOT NULL,
--   PRIMARY KEY (`id`));

-- CREATE TABLE IF NOT EXISTS `course` (
--   `id` INT NOT NULL AUTO_INCREMENT,
--   `title` VARCHAR(15) NOT NULL,
--   `subject_id` INT NOT NULL,
--   PRIMARY KEY (`id`),
--   CONSTRAINT `fk_course_subject_id`
--     FOREIGN KEY (`subject_id`)
--     REFERENCES `subject` (`id`));

-- CREATE TABLE IF NOT EXISTS `chapter` (
--   `id` INT NOT NULL AUTO_INCREMENT,
--   `course_id` INT NOT NULL,
--   `title` VARCHAR(45) NOT NULL,
--   `number` TINYINT NOT NULL,
--   PRIMARY KEY (`id`),
--   CONSTRAINT `fk_chapter_course_id`
--     FOREIGN KEY (`course_id`)
--     REFERENCES `course` (`id`));

-- CREATE TABLE IF NOT EXISTS `part` (
--   `id` INT NOT NULL AUTO_INCREMENT,
--   `chapter_id` INT NOT NULL,
--   `description` VARCHAR(100),
--   `title` VARCHAR(45) NOT NULL,
--   `feature` VARCHAR(45),
--   PRIMARY KEY (`id`),
--   CONSTRAINT `fk_field_chapter_id`
--     FOREIGN KEY (`chapter_id`)
--     REFERENCES `chapter` (`id`));

-- CREATE TABLE IF NOT EXISTS `teacher` (
--   `id` INT NOT NULL AUTO_INCREMENT,
--   `name` VARCHAR(10) NOT NULL,
--   `image` VARCHAR(1000),
--   PRIMARY KEY (`id`));

-- CREATE TABLE IF NOT EXISTS `logic` (
--   `id` INT NOT NULL AUTO_INCREMENT,
--   `title` VARCHAR(100) NOT NULL,
--   `description` VARCHAR(500) NOT NULL,
--   `teacher_id` INT NOT NULL,
--   PRIMARY KEY (`id`),
--   CONSTRAINT `fk_logic_teacher_id`
--     FOREIGN KEY (`teacher_id`)
--     REFERENCES `teacher` (`id`));

-- CREATE TABLE IF NOT EXISTS `class` (
--   `id` INT NOT NULL AUTO_INCREMENT,
--   `created_year` YEAR NOT NULL,
--   `teacher_id` INT NOT NULL,
--   `name` VARCHAR(12) NOT NULL,
--   `class_type` VARCHAR(45),
--   `subject_id` INT NOT NULL,
--   PRIMARY KEY (`id`),
--   CONSTRAINT `fk_class_subject_id`
--     FOREIGN KEY (`subject_id`)
--     REFERENCES `subject` (`id`),
--   CONSTRAINT `fk_class_teacher_id`
--     FOREIGN KEY (`teacher_id`)
--     REFERENCES `teacher` (`id`));

-- CREATE TABLE IF NOT EXISTS `student` (
--   `id` VARCHAR(20) NOT NULL,
--   `name` VARCHAR(12) NOT NULL,
--   `student_phone` VARCHAR(13),
--   `parent_phone` VARCHAR(13),
--   `email` VARCHAR(45),
--   `enrollment_flag` TINYINT(1) NOT NULL,
--   `created_time` TIMESTAMP NOT NULL,
--   `updated_time` TIMESTAMP,
--   `last_study_time` TIMESTAMP,
--   PRIMARY KEY (`id`));

-- CREATE TABLE IF NOT EXISTS `class_has_student` (
--   `class_id` INT NOT NULL,
--   `student_id` VARCHAR(20) NOT NULL,
--   PRIMARY KEY (`class_id`, `student_id`),
--   CONSTRAINT `fk_class_has_student_class_id`
--     FOREIGN KEY (`class_id`)
--     REFERENCES `class` (`id`),
--   CONSTRAINT `fk_class_has_student_student_id`
--     FOREIGN KEY (`student_id`)
--     REFERENCES `student` (`id`));

-- CREATE TABLE IF NOT EXISTS `problem` (
--   `id` INT NOT NULL AUTO_INCREMENT,
--   `ipad_image` VARCHAR(1000),
--   `phone_image` VARCHAR(1000),
--   `answer` VARCHAR(45) NOT NULL,
--   `created_date` DATE NOT NULL,
--   `updated_date` DATE,
--   `part_id` INT NOT NULL,
--   `author_id` VARCHAR(3) NOT NULL,
--   `difficulty` VARCHAR(3),
--   `code` VARCHAR(45) NOT NULL,
--   PRIMARY KEY (`id`),
--   CONSTRAINT `fk_problem_author_id`
--     FOREIGN KEY (`author_id`)
--     REFERENCES `author` (`id`),
--   CONSTRAINT `fk_problem_field_id`
--     FOREIGN KEY (`part_id`)
--     REFERENCES `part` (`id`));


-- CREATE TABLE IF NOT EXISTS `solved_problem` (
--   `id` INT NOT NULL AUTO_INCREMENT,
--   `student_id` VARCHAR(20) NOT NULL,
--   `solved_time` TIMESTAMP,
--   `repeated_number` TINYINT NOT NULL DEFAULT '0',
--   `problem_id` INT NOT NULL,
--   `taken_time` TIME NULL,
--   PRIMARY KEY (`id`),
--   CONSTRAINT `fk_solved_problem_student_id`
--     FOREIGN KEY (`student_id`)
--     REFERENCES `student` (`id`),
--   CONSTRAINT `fk_solved_problem_problem_id`
--     FOREIGN KEY (`problem_id`)
--     REFERENCES `problem` (`id`));

-- CREATE TABLE IF NOT EXISTS `problem_has_logic` (
--   `problem_id` INT NOT NULL,
--   `logic_id` INT NOT NULL,
--   PRIMARY KEY (`problem_id`, `logic_id`),
--   CONSTRAINT `fk_problem_has_logic_problem_id`
--     FOREIGN KEY (`problem_id`)
--     REFERENCES `problem` (`id`),
--   CONSTRAINT `fk_problem_has_logic_logic_id`
--     FOREIGN KEY (`logic_id`)
--     REFERENCES `logic` (`id`));