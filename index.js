import inquirer from 'inquirer';
import mysql from 'mysql2';
import * as dotenv from 'dotenv'
dotenv.config()
import questions from "./config/questions.js";
import consoleTable from 'console.table';

// Create a connection to the database
const con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

con.connect((err) => {
    if (err) throw err;
    console.log("Connected to the cms_db database!");
});

let employeeArray;
let roleArray;
let departmentArray;

// Start showMenu page.
const init = () => {
    inquirer.prompt(questions.showMenu).then((answer) => {
        const { startOptions } = answer;
        switch (startOptions) {
            case "View All Departments": {
                var sql = `SELECT * FROM departments`;
                viewTable(sql);
            } break;
            case "View All Employees": {
                var sql = `SELECT * FROM employees`;
                viewTable(sql);
            } break;
            case "View All Roles": {
                var sql = `SELECT * FROM roles`;
                viewTable(sql);
            } break;
            case "Add a Department": {
                addDepartment();
            } break;
            case "Add an Employee": {
                addEmployee();
            } break;
            case "Add a Role": {
                addRole();
            } break;
            case "Update an Employee": {
                updateEmployee();
            } break;
            case "Delete a Department": {
                deleteDepartment();
            } break;
            case "Exit": {
                exitYN();
            } break;
        }
    })
}

const viewTable = (sql) => {
    con.query(sql, function (err, result) {
        console.table(result);
        continueQuestion();
    })
}

// Ask the user whether they would like to continue
const continueQuestion = () => {
    inquirer.prompt(questions.continueYN).then((answer) => {
        if (answer.continue === "continue") {
            init();
        } else {
            console.log("Thank you for using CMS.")
            // Instructs Node.js to terminate the process synchronously.
            process.exit();
        }
    })
};

// Add new department into the database.
const addDepartment = () => {
    inquirer.prompt(
        [
            {
                type: "input",
                message: "What is the department's name?",
                name: "name",
                default: "Marketing"
            }
        ]
    ).then((answer) => {
        const sql = `INSERT INTO departments (department_name) VALUES (?)`;
        const department_name = [answer.name];

        con.query(sql, department_name, (err, result) => {
            if (err) {
                console.log.json({ error: err.message });
                init();
            }
            console.log(`${department_name} is added successfully.`)
            let sql = `SELECT * FROM departments`
            viewTable(sql);
        })
    })
};

// Add new employee into the database.
const addEmployee = () => {
    inquirer.prompt(
        [
            {
                type: "input",
                message: "Employee first name: ",
                name: "first_name",
                default: "Tony"
            },
            {
                type: "input",
                message: "Employee last name: ",
                name: "last_name",
                default: "Stark"
            },
            {
                type: "array",
                message: "What is the employee's role? Enter role ID number.",
                name: "role",
                xPrompt: {
                    type: "list",
                    multiselect: true,
                    choices: roleArray   //roleArray ["1 - Engineer", "2 = Head of Security", ...]       
                }
            },
            {
                type: "list",
                message: "Employee manager: ",
                name: "manager",
                choices: employeeArray,
            }
        ]
    ).then((answer) => {
        const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
        const newEmployee = [
            answer.first_name,
            answer.last_name,
            answer.role1,
            answer.manager.split(" ")[0]
        ];
        con.query(sql, newEmployee, (err, result) => {
            //console.log("roleArray", roleArray)  // return roleArray ["1 - Engineer", "2 = Head of Security", ...]
            // console.log("departmentArray", departmentArray) // return departmentArray ["1 - Engineering", "2 - Security", ...]
            if (err) {
                console.log({ error: err.message });
                init();
            }
            console.log(`New employee is added into the Employees database`)
            let sql = `SELECT * FROM employees`;
            viewTable(sql);
        })
    })
};
// Add new role into the database.
const addRole = () => {
    inquirer.prompt(
        [
            {
                type: "input",
                message: "What is the title? ",
                name: "title",
                default: "Marketing"
            },
            {
                type: "input",
                message: "What is the salary? ",
                name: "salary",
                default: 120000
            },
            {
                type: "array",
                message: "Department: ",
                name: "department",
                xPrompt: {
                    type: "list",
                    multiselect: true,
                    choices: departmentArray
                }
            }
        ]
    ).then((answer) => {
        console.log(answer);
        const sql = `INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)`;
        const newRole = [
            answer.title,
            answer.salary,
            answer.department.split(" ")[0]
        ]
        con.query(sql, newRole, (err, result) => {
            if (err) {
                console.log({ error: err.message });
                init();
            }
            console.log(`The new role has been added into the Roles database`)
            let sql = `SELECT * FROM roles`;
            viewTable(sql);
        })
    })
};
// Update employee information
const updateEmployee = () => {
    getRoleArray();
    inquirer.prompt(
        [
            {
                type: "list",
                message: "Which employee would you like to update?",
                name: "fullName",
                choices: employeeArray
            },
            {
                type: "list",
                message: "What is the employee's new job title?",
                name: "title",
                choices: roleArray
            }
        ]
    ).then((answer) => {
        var employee_id = answer.fullName.split(" ")[0];
        var role_id = answer.title.split(" ")[0];
        const sql = `UPDATE employees SET role_id = ? WHERE id = ?`;
        const update = [role_id, employee_id];
        con.query(sql, update, (err, result) => {
            if (err) {
                console.log({ error: err.message });
                init();
            }
            console.log(`Employee's role has been updated.`)
            let sql = `SELECT * FROM employees`;
            viewTable(sql);
        })
    })
};

// Department has a relationship with roles and employees, needs to update all tables to refect the change
const deleteDepartment = () => {
    inquirer.prompt(
        [
            {
                type: "array",
                message: "Department: ",
                name: "selectedDept",
                xPrompt: {
                    type: "list",
                    multiselect: true,
                    choices: departmentArray
                }
            }
        ]
    ).then((answer) => {
        console.log("departmentArray", departmentArray) // return departmentArray ["1 - Engineering", "2 - Security", ...]
        const selectedDepartment = answer.selectedDept;
        const sql = `DELETE FROM departments WHERE departments.id = ${selectedDepartment}`;
        con.query(sql, selectedDepartment, (err, result) => {
            if (err) {
                console.log({ error: err.message });
                init();
            }
            console.log(`Department ${selectedDepartment} has been deleted.`)
            let sql = `SELECT * FROM departments`;
            viewTable(sql);
        })
    })
};

// This will resolve the ListPrompt error as the output is provided ` " + name + "` parameter.
const getEmployeeArray = () => {
    employeeArray = [];
    con.query(`SELECT id, first_name, last_name FROM employees`, function (err, results) {
        results.forEach(employee => {
            let fullName = employee.id + " - " + employee.first_name + " " + employee.last_name;
            employeeArray.push(fullName);
        })
    })
}
getEmployeeArray();

const getRoleArray = () => {
    roleArray = [];
    con.query(`SELECT id, title FROM roles`, function (err, results) {
        results.forEach(role => {
            let title = role.id + " - " + role.title;
            roleArray.push(title);
        })
    })
};
getRoleArray();

const getDepartmentArray = () => {
    departmentArray = [];
    con.query(`SELECT id, department_name FROM departments`, (err, results) => {
        results.forEach(department => {
            let newDepartment = department.id + " - " + department.department_name;
            departmentArray.push(newDepartment);
        })
    })
};
getDepartmentArray();

const exitYN = () => {
    inquirer.prompt(questions.exitYN).then((answer) => {
        if (answer.exit === "exit") {
            console.log("Thank you for using CMS.")
            process.exit();
        } else {
            init();
        }
    })
}

// Call the init function.
init();

