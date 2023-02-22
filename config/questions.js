// Question declaration 
const showMenu = {
    type: "list",
    message: "What would you like to do?",
    name: "startOptions",
    choices: [
        "View All Departments",
        "View All Employees",
        "View All Roles",
        "Add a Department",
        "Add an Employee",
        "Add a Role",
        "Update an Employee",
        "Delete a Department",
        "Exit"
    ]
};

const continueYN = {
    type: "list",
    message: "Would you like to continue?",
    name: "continue",
    choices: ["continue", "quit"],
}

const exitYN = {
    type: "list",
    message: "Would you like to exit?",
    name: "exit",
    choices: ["continue", "exit"],
}

export default { showMenu, continueYN, exitYN };
