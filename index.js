const inquirer = require('inquirer');
const mysql = require('mysql2');

// MYSQL connection
const connection = mysql.createConnection({
    host: "localhost",  
    user: "root",
    password: "",
    database: "employeeTracker_db",
});

// database connection
connection.connect((err) => {
    if (err) throw err;
    console.log("Connected to the database");
    start();
});

//
function start() {
    inquirer
    .prompt({
        type: "list",
        name: "action",
        message: "What would you like to do?",
        Choices: [
            "View all departments",
            "View all roles",
            "Add a department",
            "Add a role",
            "Add an employee",
            "Add A manager",
            "Update an employee role",
            "View employees by manager",
            "View employes by department",
            "Delete departments | Roles | Employees",
            "Exit",
        ],
    })
};