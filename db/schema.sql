DROP DATABASE IF EXISTS employeeDB;
CREATE DATABASE employeeDB;
USE employeeDB;

CREATE TABLE department (
  department_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  department_name VARCHAR(30)
);

CREATE TABLE role (
  role_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(30),
  salary DECIMAL,
  department_id INT
);

CREATE TABLE employee (
  employee_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30),
  last_name VARCHAR(30),
  manager_id INT,
  role_id INT
);

INSERT INTO department (department_name)
VALUES ('Sales'),('Engineering'),('Finance'),('Legal');

INSERT INTO role (title, salary, department_id )
VALUES('Sales Lead','100000',1),
      ('Salesperson','80000',1),
      ('Lead Engineer','150000',2),
      ('Software Engineer','120000',2),
      ('Account Manager', '160000',3),
      ('Accountant','125000',3),
      ('Legal Team Lead','250000',4),
      ('Lawyer','190000',4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('John','Doe',2,NULL),
       ('Mike','Chan',2,1),
       ('Ashley','Rodriguez',5,NULL),
       ('Kevin','Tupik',4,3),
       ('Kunal','Singh',4,NULL),
       ('Malia','Brown',3,5),
       ('Sarah','Lourd',1,NULL),
       ('Tom','Allen',4,7);

SELECT * FROM department;
SELECT * FROM role;
SELECT * FROM employee;