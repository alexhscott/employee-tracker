DROP DATABASE IF EXISTS employee_db;

CREATE DATABASE employee_db;

USE employees;

CREATE TABLE department(
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR NOT NULL
);

CREATE TABLE role(
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR NOT NULL,
    salary DECIMAL,
    department_id INT
    FOREIGN KEY (department_id) REFERENCES department(department_id)
);

CREATE TABLE employee(
    id INT AUTO_INCRMEENT PRIMARY KEY,
    first_name VARCHAR NOT NULL,
    last_name VARCHAR NOT NULL,
    role_id INT,
    FOREIGN KEY (role_id) REFERENCES role(role_id),
    manager_id INT
    FOREIGN KEY (manager_id) REFERENCES employee(id)
);

