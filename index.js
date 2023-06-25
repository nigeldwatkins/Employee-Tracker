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

// starts inquirer
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
    // create answers for the choices given
    .then((answer) => {
        switch (answer.action) {
            case "View all departments":
                viewAllDepartments();
                break;
            case "View all roles":
                viewAllRoles();
                break;
            case "View employees":
                viewAllEmployees();
                break;
            case "Add a department":
                addDepartment();
                break;
            case "Add an employee":
                addEmployee();
                break;
            case "Update an employee role":
                updateEmployeeRole();
                break;
            case "Exit":
                db.end();
                console.log("Bye");
                break;
            }
    });
}