const inquirer = require("inquirer");
const mySQL = require("mysql2");
const db = require("./db");

require("console.table");

const mainMenu = async () => {
    const answer = await inquirer.prompt([
      {
        type: "list",
        name: "menu",
        message: "What would you like to do?",
        choices: [
          { name: "View all departments", value: viewAllDepartments },
          { name: "View all roles", value: viewAllRoles },
          { name: "View all employees", value: viewAllEmployees },
          { name: "Add a department", value: addNewDepartment },
          { name: "Add a role", value: addNewRole },
          { name: "Add an employee", value: addNewEmployee },
          { name: "Update an employee role", value: updateEmployeeRole },
          { name: "Exit", value: exit },
        ],
      },
    ]);
  
    answer.menu();
};

function viewAllDepartments() {
    db.findAllDepartments().then(([rows]) => {
        console.log(rows);
        return mainMenu();
    });
};

function viewAllRoles() {
    db.findAllRoles().then(([rows]) => {
        console.log(rows);
        return mainMenu();
    });
};

function viewAllEmployees() {
    db.findAllEmployees().then(([rows]) => {
        console.log(rows);
        return mainMenu();
    });
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
    db.addADepartment(departmentName).then(() => {
        db.findAllDepartments().then(([rows]) => {
            console.table(rows);
            return mainMenu();
        });
    });
};

const addNewRole = async () => {
    const [rows] = await db.findAllDepartments();
    console.table(rows);

    const selectDepartment = rows.map(({ name, id }) => ({ name, value: id }));

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

    db.addARole(answer.name, answer.salary, answer.department).then(() => {
        db.findAllRoles().then(([rows]) => {
            console.table(rows);
            return mainMenu();
        });
    });
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
        db.findAllEmployees().then(([rows]) => {
            console.table(rows);
            return mainMenu();
        });
    });
};

mainMenu();