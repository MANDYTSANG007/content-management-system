import inquirer from 'inquirer';
import mysql from 'mysql2';
import * as dotenv from 'dotenv'
dotenv.config()
import questions from "./config/questions.js";
// import consoleTable from 'console.table';


// Create a connection to the database
const con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

con.connect((err) => {
    if (err) throw err;
    console.log("Connected to the cms_db database!");
});

let employeeArray;
let roleArray;

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
    inquirer.prompt(questions.addDepartment).then((answer) => {
        const sql = `INSERT INTO departments (department_name) VALUES (?)`;
        const department_name = [answer.name];

        con.query(sql, department_name, (err, result) => {
            if (err) {
                console.log.json({ error: err.message });
                return;
            }
            console.log(`Added ${department_name} into the Departments database.`)
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
                message: "What is the employee's role?",
                name: "role",
                xPrompt: {
                    type: "list",
                    multiselect: true,
                    choices: roleArray
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
            answer.role,
            answer.manager.split(" ")[0]
        ];
        // console.log(newEmployee);
        con.query(sql, newEmployee, (err, result) => {
            if (err) {
                console.log({ error: err.message });
                return;
            }
            console.log(`New employee is added into the Employees database`)
            let sql = `SELECT * FROM employees`;
            viewTable(sql);
        })
    })
}

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



// Call the init function.
init();