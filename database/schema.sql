-- ==========================================
-- Student Management System - Database setup
-- Run this in MySQL before starting the app the first time
-- (Spring Boot will also auto-create the table via
--  spring.jpa.hibernate.ddl-auto=update, but this script is
--  handy for manual setup and for the sample data.)
-- ==========================================

CREATE DATABASE IF NOT EXISTS student_management_db;
USE student_management_db;

CREATE TABLE IF NOT EXISTS students (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    first_name      VARCHAR(50)  NOT NULL,
    last_name       VARCHAR(50)  NOT NULL,
    email           VARCHAR(100) NOT NULL UNIQUE,
    phone           VARCHAR(15),
    course          VARCHAR(100) NOT NULL,
    date_of_birth   DATE         NOT NULL,
    year_of_study   INT,
    gpa             DOUBLE
);

-- Sample data (optional)
INSERT INTO students (first_name, last_name, email, phone, course, date_of_birth, year_of_study, gpa) VALUES
('Aarav', 'Sharma', 'aarav.sharma@example.com', '+91 9876543210', 'B.Tech CSE', '2004-03-15', 2, 8.7),
('Diya', 'Patel', 'diya.patel@example.com', '+91 9812345678', 'B.Sc Mathematics', '2003-11-02', 3, 9.1),
('Rohan', 'Iyer', 'rohan.iyer@example.com', '+91 9900112233', 'B.Tech ECE', '2005-06-21', 1, 8.2);
