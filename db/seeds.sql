USE employee_db;

INSERT INTO department
    (name)
VALUES
    ('sales'),
    ('legal'),
    ('IT');

INSERT INTO roles
    (title, salary, department_id)
VALUES
    ('salesperson', 100000, 1),
    ('hr', 75000, 2),
    ('coder', 125000, 3);

INSERT INTO employee
    (first_name, last_name, role_id, manager_id)
VALUES
    ('Jane', 'Doe', 2, NULL),
    ('John', 'Doe', 3, 3),
    ('Jack', 'Doe', 3, NULL);