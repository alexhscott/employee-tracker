const inquirer = require("inquirer");
const mySQL = require("mysql2");
const db = require("./db/connection");


const mainMenu = async () => {
    console.log("working");
    const answer = await inquirer.prompt([
      {
        type: "list",
        name: "menu",
        message: "What would you like to do?",
        choices: ["View all departments", "View all roles", "View all employees", "Add a department", "Add a role", "Add an employee", "Update an employee role"]
      },

    ]);
    // add all choices to case/break;
   switch(answer.menu) {
        case "View all departments":
            console.log(answer);
            viewAllDepartments();
        break;
        case "View all roles":
            viewAllRoles();
        break;
        case "Add a department":
            addNewDepartment();
        break;
        case "Add a role":
            addNewRole();
        break;
        case "Add an employee":
            addNewEmployee();
        break;
        case "Update an employee role":
            updateEmployeeRole();
        break;
    };
   
    // return answer;
};

function viewAllDepartments() {
    db.query(`SELECT * FROM department;`,(err,res) => {
        if (err) {
            console.log(err);
        } 
        console.table(res);
    });
    mainMenu();
};

function viewAllRoles() {
    db.query(`SELECT * FROM role;`,(err,res) => {
        if (err) {
            console.log(err);
        } 
        console.table(res);
    });
    mainMenu();
};

function viewAllEmployees() {
    db.query(`SELECT * FROM employee;`,(err,res) => {
        if (err) {
            console.log(err);
        } 
        console.table(res);
    });
    mainMenu();
};

function input(value) {
    if (value) {
        return true;
    } else {
        console.log('Please enter a department');
        return false;
    }
};

const addNewDepartment = async () => {
    const answer = await inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'What is the name of the new department?',
            validate: input,
        },
    ]);

    const departmentName = answer.name;
    db.query(`INSERT INTO department (name) VALUES ("${departmentName}");`, (err,res) => {
            if (err) {
                console.log(err);
            }
            console.log(res);
        });
    mainMenu();
};

const addNewRole = async () => {

    const selectDepartment = bd(({ name, id }) => ({ name, value: id }));

    const answer = await inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'What is the name of the new role?',
            validate: input,
        },
        {
            type: 'input',
            name: 'name',
            message: 'What is the salary for this role?',
            validate: input,
        },
        {
            type: 'list',
            name: 'name',
            message: 'What department does this role belong to?',
            choices: selectDepartment,
        },
    ]);

    db.query(`INSERT INTO role (title, salary, department_id) VALUES ("${selectDepartment}");`, (err,res) => {
        if (err) {
            console.log(err);
        }
        console.log(res);
    });
mainMenu();
    // db.addARole(answer.name, answer.salary, answer.department).then(() => {
    //     db.findAllRoles().then(([rows]) => {
    //         console.table(rows);
    //         return mainMenu();
    //     });
    // });
};

const addNewEmployee = async () => {
    const [rowsA] = await db.findAllRoles();
    console.table(rowsA);

    const selectRole = rowsA.map(({ id, title }) => ({
       name: title,
       value: id, 
    }));
    console.log(selectRole);

    const [rowsB] = await db.findAllEmployees();
    const employeeChoice = rowsB.map(mapEmployeeChoice);
    console.log(employeeChoice);

    const managerChoice = [...employeeChoice, { name: 'Null' }];
    console.log(managerChoice);

    const answer = await inquirer.prompt([
        {
            type: 'input',
            name: 'firstName',
            message: 'What is the first name of the employee?',
            validate: input,
        },
        {
            type: 'input',
            name: 'lastName',
            message: 'What is the last name of the employee?',
            validate: input,
        },
        {
            type: 'list',
            name: 'role',
            message: 'Wat is the role of the employee?',
            choices: selectRole,
        },
        {
            type: 'confirm',
            name: 'managerOrEmployee',
            message: 'Does this employee have a manager?',
            default: true,
        },
        {
            type: 'list',
            name: 'managerName',
            when: function (answers) {
                return answers.managerOrEmployee === true;
            },
            message: 'What is the name of the manager for the employee?',
            choices: managerChoice,
        },
    ]);

    db.addAnEmployee(answer).then(() => {
        db.findAllEmployees().then(() => {
            console.table(rows);
            return mainMenu();
        });
    });
};

const updateEmployeeRole = async () => {
    const [rowsA] = await db.findAllRoles();
    console.table(rowsA);

    const selectRole = rowsA.map(({ id, title}) => ({
        name: title,
        value: id,
    }));
    console.log(selectRole);

    const [rowsB] = await db.findAllEmployees();
    const employeeChoice = rowsB.map(mapEmployeeChoice);
    console.log(employeeChoice);

    const answer = await inquirer.prompt([
        {
            type: 'list',
            name: 'employee',
            message: 'Which employee would you like to update?',
            choices: employeeChoice,
        },
        {
            type: 'list',
            name: 'role',
            message: 'What is the new role of the employee?',
            choices: selectRole,
        },
    ]);
    console.log(answer);

    db.updateEmployeeRole(answer.role, answer.employee).then(() => {
        db.query(``)
        
        db.findAllEmployees().then(([rows]) => {
            console.table(rows);
            return mainMenu();
        });
    });
};


mainMenu();