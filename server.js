const inquirer = require('inquirer');
const mysql = require('mysql2');

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        port: 3306, 
        password: '',
        database: 'employeeTracker_db'
    },
    console.log(`Connected to the employeeTracker database.`)
);

db.connect((err) => {
    if (err) {
      throw err;
    }
    console.log('Connected to the database.');
    // Call the start function to begin the application
    start();
  });

// starts inquirer
function start() {
    inquirer
        .prompt({
            type: "list",
            name: "action",
            message: "What would you like to do?",
            choices: [
                "View all departments",
                "View all roles",
                "Add a department",
                "Add a role",
                "Add an employee",
                "Add A manager",
                "Update an employee role",
                "View employees by manager",
                "View employees by department",
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
                case "Add a role":
                    addRole();
                    break;
                case "Add a department":
                    addDepartment();
                    break;
                case "Add an employee":
                    addEmployee();
                    break;
                case "Add an manager":
                    addManager();
                    break;
                case "Update an employee role":
                    updateEmployeeRole();
                    break;
                case "View employees by manager":
                    viewEmployeesByManager();
                    break;
                case "View employees by department":
                    viewEmployeesByDepartment();
                    break;
                case "Delete departments | Roles | Employees":
                    deleteDepartmentsRolesEmployees();
                    break; 
                case "Exit":
                    db.end();
                    console.log("Bye");
                    break;
            }
        });
}

function addRole() {
    const query = 'SELECT * FROM departments';
    db.query(query, (err, res) => {
        if (err) throw err;

        inquirer
            .prompt([
                {
                    type: 'input', 
                    name: 'title',
                    message: 'Enter the title of the new role:',
                },
                {
                    type: 'input', 
                    name: 'salary',
                    message: 'Enter the salary of the new role:',
                },
                {
                    type: 'list',
                    name: 'department',
                    message: 'Select the department for the new role:',
                    choices: res.map((department) => department.department_name), 
                },
            ])
            .then ((answers) => {
                const department = res.find(
                    (department) => 
                        department.department_name === answers.department
                );
                const query = 'INSERT INTO roles SET ?';
                db.query(
                    query,
                    {
                        title: answers.title,
                        salary: answers.salary,
                        department_id: department.id,
                    },
                    (err, res) => {
                        if (err) throw err;
                        console.log(
                            'Added role ${answers.title} with salary ${answers.salary} to the ${answers.department} department in the database.'
                        );
                        start();
                    }
                );
            });
    });
}

// function that allows you to view all the departments
function viewAllDepartments() {
    const query = "SELECT * FROM departments";
    db.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        start();
    });
}

// function that allows you to view all roles
function viewAllRoles() {
    const query = "SELECT roles.title, roles.id, departments.department_name, roles.salary from roles join departments on roles.department_id = departments.id";
    db.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        start();
    });
}

// function that allows you to view all employees
function viewAllEmployees() {
    const query = `
    SELECT e.id, e.first_name, e.last_name, r.title, d.department_name, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager_name
    FROM employee e
    LEFT JOIN roles r ON e.role_id = r.id
    LEFT JOIN departments d ON r.department_id = d.id
    LEFT JOIN employee m ON e.manager_id = m.id;
    `;
    db.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        start();
    });
}

// Function that adds a department
function addDepartment() {
    inquirer
        .prompt({
            type: "input",
            name: "name",
            message: "Enter the name of the new department:",
        })
        .then((answer) => {
            console.log(answer.name);
            const query = `INSERT INTO departments (department_name) VALUES ("${answer.name}")`;
            db.query(query, (err, res) => {
                if (err) throw err;
                console.log(`Added department ${answer.name} to the database.`);
                start();
                console.log(answer.name);
            });
        });
}

function addRole() {
    const query = "SELECT * FROM departments";
    db.query(query, (err, res) => {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    type: "input",
                    name: "title",
                    message: "Enter the title of the new role:",
                },
                {
                    type: "input",
                    name: "salary",
                    message: "Enter the salary of the new role:",
                },
                {
                    type: "list",
                    name: "department",
                    message: "Select the department for the new role:",
                    choices: res.map(
                        (department) => department.department_name
                    ),
                },
            ])
            .then((answers) => {
                const department = res.find(
                    (department) => department.department_name === answers.department
                );
                const query = "INSERT INTO roles SET ?";
                db.query(
                    query,
                    {
                        title: answers.title,
                        salary: answers.salary,
                        department_id: department.id,
                    },
                    (err, res) => {
                        if (err) throw err;
                        console.log(
                            `Added role ${answers.title} with salary ${answers.salary} to the ${answers.department} department in the database.`
                        );
                        start();
                    }
                );
            });
    });
}

// function that adds an employee
function addEmployee() {
    // produces a list of roles from the database
    db.query("SELECT id, title FROM roles", (error, results) => {
        if (error) {
            console.error(error);
            return;
        }

        const roles = results.map(({ id, title }) => ({
            name: title,
            value: id,
        }));

        console.log('Roles');
        console.table(roles);


        // As a manager retrieve a list of employees from a database to use
        db.query(
            'SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employee',
            (error, results) => {
                if (error) {
                    console.error(error);
                    return;
                }

                const managers = results.map(({ id, name }) => ({
                    name,
                    value: id,
                }));

                // Prompts the user for employee info
                inquirer
                    .prompt([
                        {
                            type: "input",
                            name: "firstName",
                            message: "Enter the employee's first name:",
                        },
                        {
                            type: "input",
                            name: "lastName",
                            message: "Enter the employee's last name:",
                        },
                        {
                            type: "list",
                            name: "roleId",
                            message: "Select the employee role:",
                            choices: roles,
                        },
                        {
                            type: "list",
                            name: "managerId",
                            message: "Select the employee manager:",
                            choices: [
                                { name: "None", value: null },
                                ...managers,
                            ],
                        },
                    ])
                    .then((answers) => {
                        // Place the employee into the database
                        const sql =
                            "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)";
                        const values = [
                            answers.firstname,
                            answers.lastname,
                            answers.roleId,
                            answers.managerId,
                        ];
                        db.query(sql, values, (error) => {
                            if (error) {
                                console.error(error);
                                return;
                            }

                            console.log("Employee added successfully");
                            start();
                        });
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            }
        );
    });
}

// Adds a Manager
function addManager() {
    const queryDepartments = "SELECT * FROM departments";
    const queryEmployees = "SELECT * FROM employee";

    db.query(queryDepartments, (err, resDepartments) => {
        if (err) throw err;
        db.query(queryEmployees, (err, resEmployees) => {
            if (err) throw err;
            inquirer
                .prompt([
                    {
                        type: "list",
                        name: "department",
                        message: "Select the department:",
                        choices: resDepartments.map(
                            (department) => department.department_name
                        ),
                    },
                    {
                        type: "list",
                        name: "employees",
                        message: "Select the employee to add a manger to:",
                        choices: resEmployees.map(
                            (employee) =>
                                `${employee.first_name} ${employee.last_name}`
                        ),
                    },
                    {
                        type: "list",
                        name: "employee",
                        message: "Select the employee's manager:",
                        choices: resEmployees.map(
                            (employee) =>
                                `${employee.first_name} ${employee.last_name}`
                        ),
                    },
                ])
                .then((answers) => {
                    const department = resDepartments.find(
                        (department) =>
                            department.department_name === answers.department

                    );
                    const employee = resEmployees.find(
                        (employee) =>
                            `${employee.first_name} ${employee.last_name}` ===
                            answers.employee

                    );
                    const manager = resEmployees.find(
                        (employee) =>
                            `${employee.first_name} ${employee.last_name}` ===
                            answers.manager

                    );
                    const query =
                        "UPDATE employee SET manager_id = ? WHERE id = ? AND role_id IN (SELECT id FROM roles WHERE department_id = ?)";
                    db.query(
                        query,
                        [manager.id, employee.id, department.id],
                        (err, res) => {
                            if (err) throw err;
                            console.log(
                                `Added manager ${manager.first_name} ${manager.last_name} to employee ${employee.first_name} ${employee.last_name} in department ${department.department_name}.`
                            );
                            start();
                        }
                    );
                });
        });
    });
}

// function to update employee role
function updateEmployeeRole() {
    const queryEmployees =
        "SELECT employee.id, employee.first_name, employee.last_name, roles.title FROM employee LEFT JOIN roles ON employee.role_id = roles.id";
    const queryRoles = "SELECT * FROM roles";
    db.query(queryEmployees, (err, resEmployees) => {
        if (err) throw err;
        db.query(queryRoles, (err, resRoles) => {
            if (err) throw err;
            inquirer
                .prompt([
                    {
                        type: "list",
                        name: "employee",
                        message: "Select the employee to update:",
                        choices: resEmployees.map(
                            (employee) =>
                                `${employee.first_name} ${employee.last_name}`
                        ),
                    },
                    {
                        type: "list",
                        name: "role",
                        message: "Select the new role:",
                        choices: resRoles.map((role) => role.title),

                    },
                ])
                .then((answers) => {
                    const employee = resEmployees.find(
                        (employee) =>
                            `${employee.first_name} ${employee.last_name}` ===
                            answers.employee
                    );
                    const query =
                        "UPDATE employee SET role_id = ? WHERE id = ?";
                    db.query(
                        query,
                        [role.id, employee.id],
                        (err, res) => {
                            if (err) throw err;
                            console.log(
                                `Updated ${employee.first_name} ${employee.last_name}'s role to ${role.title} in the database.`
                            );
                            start();
                        }
                    );
                });
        });
    });
}

// View employee by manager
function viewEmployeesByManager() {
    const query = `
        SELECT 
            e.id,
            e.first_name,
            e.last_name,
            r.title,
            d.department_name,
            CONCAT(m.first_name, ' ', m.last_name) AS manager_name
           FROM 
            employee e
            INNER JOIN roles r ON e.role_id = r.id
            INNER JOIN departments d ON r.department_id = d.id
            LEFT JOIN employee m ON e.manager_id = m.id
           ORDER BY
            manager_name,
            e.last_name,
            e.first_name
        `;
    db.query(query, (err, ress) => {
        if (err) throw err;

        // employees grouped by manager
        const viewEmployeesByManager = res.reduce((acc, cur) => {
            const managerName = cur.manager_name;
            if (acc[managerName]) {
                acc[managerName].push(curl);
            } else {
                acc[managerName] = [curl];
            }
            return acc;
        }, {});

        // displays employees by manager
        console.log("Employees by manager:");
        for (const managerName in employeesByManager) {
            console.log(`\n${managerName}:`);
            const employees = employeesByManager[managerName];
            employees.forEach((employee) => {
                console.log(
                    ` ${employee.first_name} ${employee.last_name} | ${employee.title} | ${employee.department_name}`
                );
            });
        }
        start();
    });
}

// Views employees by department
function viewEmployeesByDepartment() {
    const query =
        "SELECT departments.department_name, employee.first_name, employee.last_name FROM employee INNER JOIN roles On employee.role_id = roles.id INNER JOIN departments ON roles.department_id = departments.id ORDER BY departments.departments_name ASC";

    db.query(query, (err, res) => {
        if (err) throw err;
        console.log("\nEmployees by department:");
        console.table(res);
        start();
    });
}

// Delete departments roles employees
function deleteDepartmentsRolesEmployees() {
    inquirer
        .prompt({
            type: "list",
            name: "data",
            message: "What would you like to delete?",
            choices: ["Employee", "Role", "Department"],
        })
        .then((answer) => {
            switch (answer.data) {
                case "Employee":
                    deleteEmployee();
                    break;
                case "Role":
                    deleteRole();
                    break;
                case "Department":
                    deleteDepartment();
                    break;
                default:
                    console.log(`Invalid data: ${answer.dat}`);
                    start();
                    break;
            }
        });
}

// Delete employees
function deleteEmployee() {
    const query = "SELECT * FROM employee";
    db.query(query, (err, res) => {
        if (err) throw err;
        const employeeList = res.map((employee) => ({
            name: `${employee.first_name} ${employee.last_name}`,
            value: employee.id,
        }));
        
        // adds a back option
        employeeList.push({ name: "Go Back", value: "back" });
        inquirer
            .prompt({
                type: "list",
                name: "id",
                message: "Select the employee you want to delete:",
                choices: employeeList,
            })
            .then((answer) => {
                if (answer.id === "back") {
                    deleteDepartmentsRolesEmployees();
                    return;
                }
                const query = "DELETE FROM employee WHERE id = ?";
                connection.query(query, [answer.id], (err, res) => {
                    if (err) throw err;
                    console.log(
                        `Deleted employee with ID ${answer.id} from the database.`
                    );
                    start();
                });
            });
    });
}

// Deletes role
function deleteRole() {
    // all roles that is available wiil be retrieved from the database
    const query = "SELECT * FROM roles";
    db.query(query, (err, res) => {
        if (err) throw err;
        const choices = res.map((role) => ({
            name: `${role.title} (${role.id}) - ${role.salary}`,
            value: role.id,
        }));
        choices.push({ name: "Go Back", value: null });
        inquirer
            .prompt({
                type: "list",
                name: "roleId",
                message: "Select the role you want to delete:",
                choices: choices,
            })
            .then((answer) => {
                if(answer.roleID === null) {
                    deleteDepartmentsRolesEmployees();
                    return;
                }
                const query = "DELETE FROM roles WHERE id = ?";
                db.query(query, [answer.roleId], (err, res) => {
                    if (err) throw err;
                    console.log(
                        `Deleted role with ID ${answer.roleId} from the database.`
                    );
                    start();
                });
            });
    });
}

// Deletes department
function deleteDepartment() {
    const query = "SELECT * FROM departments";
    db.query(query, (err, res) => {
        if (err) throw err;
        const departmentChoices = res.map((department) => ({
            name: department.department_name,
            value: department.id,
        }));
    
        // this section will prompt the user to select a department 
        inquirer
            .prompt({
                type: "list",
                name: "departmentId",
                message: "Which department do you want to delete?",
                choices: [
                    ...departmentChoices,
                    {name: "Go Back", value: "back" },
                ],
            })
            .then((answer) => {
                if (answer.departmentId === "back") {
                    deleteDepartmentsRolesEmployees();
                } else {
                    const query = "DELETE FROM departments WHERE id = ?";
                    db.query(
                        query,
                        [answer.departmentId],
                        (err, res) => {
                            if (err) throw err;
                            console.log(
                                `Deleted department with ID ${answer.departmentId} from the database.`
                            );
                            start();
                        }
                    );
                }
                
            });
    });
}

// close connection when the application exits 
process.on("exit", () => {
    db.end();
});