INSERT INTO departments (department_name)
VALUES 
    ("Engineering"),
    ("Security"),
    ("Development"),
    ("Management");

INSERT INTO roles (title, salary, department_id)
VALUES
    ("Engineer", 120000, 1),
    ("Head of Security", 150000, 2),
    ("Scientist", 200000, 3),
    ("Intern", 80000, 3),
    ("CEO", 10000, 4);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
    ("TONY", "STARK", 4, null),
    ("Peter", "Parker", 3, null),
    ("Happy", "Hogan", 2, null),
    ("Bruce", "Banner", 3, null),
    ("Pepper", "Potts", 4, null),
    ("Natalie", "Rushman", 2, null),
    ("Albert", "Einstein", 1, null);

SELECT * FROM departments;
SELECT * FROM employees;
SELECT * FROM roles;

