INSERT INTO departments (department_name)
VALUES 
    ("Engineering"),
    ("Security"),
    ("Development"),
    ("Management");

INSERT INTO roles (title, salary, department_id)
VALUES
    ("Engineer", 200000, 1),
    ("Head of Security", 199999, 2),
    ("Scientist", 200000, 3),
    ("Intern", 80000, 3),
    ("CEO", 10000, 4);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
    ("Tony", "Stark", 5, null),
    ("Pepper", "Potts", 5, null),
    ("Peter", "Parker", 4, 1),
    ("Happy", "Hogan", 2, 1),
    ("Bruce", "Banner", 3, null),
    ("Natalie", "Rushman", 2, 2),
    ("Albert", "Einstein", 1, null);

SELECT * FROM departments;
SELECT * FROM employees;
SELECT * FROM roles;

