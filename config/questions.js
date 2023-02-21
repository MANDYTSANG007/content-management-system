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
        "Add an Employee"
    ]
};

const continueYN = {
    type: "list",
    message: "Would you like to continue?",
    name: "continue",
    choices: ["continue", "quit"],
}

const addDepartment = [
    {
        type: "input",
        message: "Department name: ",
        name: "name",
        default: "Marketing"
    }
];

const addEmployee = [
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
        type: "list",
        message: "Role ID: ",
        name: "role_id",
        default: 3
    },
    {
        type: "input",
        message: "Employee manager ID: ",
        name: "manager_id",
        default: 1
    }
];

export default { showMenu, continueYN, addDepartment, addEmployee };
