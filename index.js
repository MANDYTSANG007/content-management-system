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
  database: process.env.DB_NAME
});

con.connect((err) => {
  if (err) throw err;
  console.log("Connected to the cms_db database!");
});

// Start showMenu page.
const init = () => {
    inquirer.prompt(questions.showMenu).then((answer) => {
        const { startOptions } = answer;
        switch (startOptions) {
            case "View All Departments": {
                var sql = `SELECT * FROM departments`;
                viewTable(sql);
            } break;
        }
    })
}

const viewTable = (sql) => {
    con.query(sql, function(err, result) {
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
}

// Call the init function.
init();