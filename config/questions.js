// Question declaration 
const showMenu = {
    type: "list",
    message: "What would you like to do?",
    name: "startOptions",
    choices: [
        "View All Departments",
        "View All Roles"
    ]
};

const continueYN = {
    type: "list",
    message: "Would you like to continue?",
    name: "continue",
    choices: ["continue", "quit"],
}

export default {showMenu, continueYN};