//const values
const mysql = require("mysql2");
const inquirer = require("inquirer");
const consoleTable = require("console.table");
const dotenv = require("dotenv"); dotenv.config();

//connect to database
const db = mysql.createConnection(
    {
        host: "localhost",

//your mysql info, come back to it later
user: process.env.DB_US,
password: process.env.DB_PW,
databse: "employee",
    },
    console.log("Connected.")
);

function welcome() {
    console.log(`
    Welcome to the Employee Database
    `);
    nav();
}
//menu
function nav() {
    //inquirer 
    inquirer
    .prompt({
type: "list",
name: "navigation",
message: "Please make a selection.",
choices: [
    "View All Departments",
    "View All Roles",
    "View All Employees",
    "View Employees by Manager",
    "View Employees by Department",
    "View total budget of a Department",
    "Add a Department",
    "Add Role",
    "Add Employee",
    "Update Employee Role",
    "Update Employee Manager",
    "Delete Departments",
    "Delete Roles",
    "Delete Employees",
    "Exit",
  ],
    })
    .then((answer) => {
        if (nextPrompt === "View All Departments") {
            viewDepartments();
          } else if (nextPrompt === "View All Roles") {
            viewRoles();
          } else if (nextPrompt === "View All Employees") {
            viewEmployees();
          } else if (nextPrompt === "View Employees by Manager") {
            viewEmployeesByManager();
          } else if (nextPrompt === "View Employees by Department") {
            viewEmployeesByDepartment();
          } else if (nextPrompt === "View total budget of a Department") {
            viewBudget();
          } else if (nextPrompt === "Add a Department") {
            addDepartment();
          } else if (nextPrompt === "Add a Role") {
            addRole();
          } else if (nextPrompt === "Add an Employee") {
            addEmployee();
          } else if (nextPrompt === "Update an Employee Role") {
            updateEmployeeRole();
          } else if (nextPrompt === "Update an Employee Manager") {
            updateEmployeeManager();
          } else if (nextPrompt === "Delete Departments") {
            deleteDepartment();
          } else if (nextPrompt === "Delete Roles") {
            deleteRole();
          } else if (nextPrompt === "Delete Employees") {
            deleteEmployee();
          } else {
            goodbye();
          }
        });
    }

//departments
function viewDepartments() {
    console.log(`
  Departments
    `);
  db.query(`SELECT * FROM department`, function (err, result, fields) {
        if (err) throw err;
        console.table(result);
    
        nav();
      });
    }
//roles
function viewRoles() {
    console.log(`
  Roles
    `);
    //employees
    //db.query
    db.query(
        `SELECT employee.id, employee.first_name AS First, employee.last_name AS Last, roles.title AS Role, department.department_name AS Department, roles.salary AS Salary, CONCAT(manager.last_name, ", ", manager.first_name) AS Manager
        FROM employee
            LEFT JOIN roles 
                ON employee.role_id = roles.id
            LEFT JOIN department 
                ON roles.department_id = department.id
            LEFT JOIN employee AS manager ON manager.id = employee.manager_id`,
        function (err, result, fields) {
          if (err) throw err;
          console.table(result);
          nav();
        }
      );


//employees by department
function viewEmployeesByDepartment() {
    console.log(`
  Employees by Department Table
    `);
  
    db.query(
      `SELECT employee.id, employee.first_name AS First, employee.last_name AS Last, department.department_name AS Department
      FROM employee
      LEFT JOIN roles 
              ON employee.role_id = roles.id
      LEFT JOIN department 
              ON roles.department_id = department.id
      ORDER BY Department DESC;`,
      function (err, result, fields) {
        if (err) throw err;
        console.table(result);
  
        nav();
      }
    );
  }
//employees by manager
function viewEmployeesByManager() {
    console.log(`
  Employees by Manager Table
    `);
  
    db.query(
      `SELECT employee.id, employee.first_name AS First, employee.last_name AS Last, CONCAT(manager.last_name, ", ", manager.first_name) AS Manager
      FROM employee
      LEFT JOIN employee AS manager ON manager.id = employee.manager_id
      ORDER BY Manager DESC`,
      function (err, result, fields) {
        if (err) throw err;
        console.table(result);
  
        nav();
      }
    );
  }
//employees by salary
function viewBudget() {
    console.log(`
  Department Budget Table
    `);
  
    db.query(
      `SELECT department.department_name AS Department, SUM(roles.salary) AS Budget
      FROM employee
      INNER JOIN roles ON employee.role_id = roles.id
      INNER JOIN department ON roles.department_id = department.id
      GROUP BY department.department_name;`,
      function (err, result, fields) {
        if (err) throw err;
        console.table(result);
  
        nav();
      }
    );
  }
//add a department
function addDepartment() {
    console.log("Add Department");
    inquirer
      .prompt({
        type: "input",
        name: "departmentInput",
        message: "Enter new department name.",
        validate: (departmentInput) => {
          if (!departmentInput) {
            console.log("You must enter the department name.");
            return false;
          } else {
            return true;
          }
        },
      })
      .then((answer) => {
        newDept = answer.departmentInput;
  
        db.query(
          `INSERT INTO department (department_name)
          VALUES ("${newDept}")`,
          function (err, result, fields) {
            if (err) throw err;
            console.log("Department Added!");
//return to nav/inquirer
nav();
        }
      );
    });
}
//add a role
function addRole() {
//search for department
const whichDepartments = [];
db.query(`SELECT * FROM department`, function (err, result, fields) {
    if (err) throw err;
    result.forEach((dbData) => {
      var departments = dbData.id + ": " + dbData.department_name;
      whichDepartments.push(departments);
    });
  });
//new role
inquirer
    .prompt([
      {
        type: "input",
        name: "titleInput",
        message: "Enter the new role name.",
        validate: (titleInput) => {
          if (!titleInput) {
            console.log("You must enter the role name.");
            return false;
          } else {
            return true;
          }
        },
      },
      {
        type: "input",
        name: "salaryInput",
        message:
          "Please enter a salary for the new role.",
        validate: (salaryInput) => {
          if (!salaryInput) {
            console.log("You must put a salary for the role.");
            return false;
          } else {
            return true;
          }
        },
      },
      {
        type: "list",
        name: "departmentInput",
        message: "Choose which department this role belongs to.",
        choices: whichDepartments,
      },
    ])
    .then((answers) => {
      let title = answers.titleInput;
      let salary = answers.salaryInput;
      let deptArray = answers.departmentInput.split("");
      let departmentId = deptArray[0];

      db.query(
        `INSERT INTO roles (title, salary, department_id)
        VALUES ("${title}", ${salary}, ${departmentId})`,
        function (err, result, fields) {
          if (err) throw err;
          console.log(" Role Added! ");

          // return to menu
          nav();
        }
      );
    });
}
//add employee
function addEmployee() {
    const roleOptions = [];
    const managerOptions = [];
//ask for title and id
db.query(`SELECT * FROM roles`, function (err, result, fields) {
    if (err) throw err;
    result.forEach((dbData) => {
      var role = dbData.id + ": " + dbData.title;
      roleOptions.push(role);
    });
  });
//db query to get name and id
db.query(`SELECT * FROM employee`, function (err, result, fields) {
    if (err) throw err;
    result.forEach((dbData) => {
      var employees = dbData.id + ": " + dbData.first_name + dbData.last_name;
      managerOptions.push(employees);
    });
    managerOptions.push("null");
  });
  inquirer
    .prompt([
      {
        type: "input",
        name: "firstNameInput",
        message: "Enter the employee's first name.",
        validate: (firstNameInput) => {
          if (!firstNameInput) {
            console.log("You must enter the employee's first name.");
            return false;
          } else {
            return true;
          }
        },
      },
      {
        type: "input",
        name: "lastNameInput",
        message: "Enter the employee's last name.",
        validate: (lastNameInput) => {
          if (!lastNameInput) {
            console.log("You must enter the employee's last name.");
            return false;
          } else {
            return true;
          }
        },
      },
      {
        type: "list",
        name: "roleInput",
        message: "Please choose a role for this employee.",
        choices: roleOptions,
      },
      {
        type: "list",
        name: "managerInput",
        message: "Please choose the employee's manager.",
        choices: managerOptions,
      },
    ])
    .then((answers) => {
      let firstName = answers.firstNameInput;
      let lastName = answers.lastNameInput;
      let roleArray = answers.roleInput.split("");
      let roleId = roleArray[0];
//get manager id or null
let managerId = [];
      if (answers.managerInput === "null") {
        managerId.push("null");
      } else {
        let managerArray = answers.managerInput.split("");
        managerId.push(managerArray[0]);
      }
//query new employee
db.query(
    `INSERT INTO employee (first_name, last_name, role_id, manager_id)
    VALUES ("${firstName}", "${lastName}", ${roleId}, ${managerId});`,
    function (err, result, fields) {
      if (err) throw err;
      console.log("Employee Added.");
//return to menu
nav();
        }
      );
    });
}
//update employee role
function updateEmployeeRole() {
    const roleOptions = [];
    const employeeOptions = [];
//db query to get role and id
db.query(`SELECT * FROM roles`, function (err, result, fields) {
    if (err) throw err;
    result.forEach((dbData) => {
      var role = dbData.id + ": " + dbData.title;
      roleOptions.push(role);
    });
  });
  db.query(`SELECT * FROM employee`, function (err, result, fields) {
    if (err) throw err;
    result.forEach((dbData) => {
      var employees = dbData.id + ": " + dbData.first_name + dbData.last_name;
      employeeOptions.push(employees);
    });
    selectNewRole();
  });
//prompts for changes
function selectNewRole() {
    inquirer
      .prompt([
        {
          type: "list",
          name: "employeeChoice",
          message: "Choose employee to update.",
          choices: employeeOptions,
        }, {
            type: "list",
            name: "roleChoice",
            message: "Select the new role",
            choices: roleOptions,
          },
        ])
        .then((answers) => {
            roleArray = answers.roleChoice.split("");
        employeeArray = answers.employeeChoice.split("");
        roleArray = answers.roleChoice.split("");
        employeeArray = answers.employeeChoice.split("");

        db.query(
            `UPDATE employee 
            SET role_id = ${roleId} 
            WHERE employee.id = ${employeeId}`,
            function (err, result, fields) {
              if (err) throw err;
              console.log("Employee Role Updated.");
//return to menu
        nav();
      }
   );
  });
 }
}
//update manager
function updateManager() {
    const optionsManager = [];
    const optionsEmployee = [];
//db query to get employees name and id
db.query(`SELECT * FROM employee`, function (err, result, fields) {
    if (err) throw err;
    result.forEach((dbData) => {
      var employees = dbData.id + ": " + dbData.first_name + dbData.last_name;
      optionsEmployee.push(employees);
      optionsManager.push(employees);
    });
    optionsManager.push("null");
    selectNewManager();
  });
//prompts for info/select new manager
function selectNewManager() {
    inquirer
      .prompt([
        {
          type: "list",
          name: "employeeChoice",
          message: "Choose employee to update.",
          choices: optionsEmployee,
        },
        {
          type: "list",
          name: "managerChoice",
          message: "Select their new manager.",
          choices: optionsManager,
        },
      ])
      .then((answers) => {employeeArray = answers.employeeChoice.split("");
      let employeeId = employeeArray[0];
//manager id or null
let managerId = [];
        if (answers.managerChoice === "null") {
          managerId.push("null");
        } else {
          let managerArray = answers.managerChoice.split("");
          managerId.push(managerArray[0]);
        }
//query to update role
db.query(
    `UPDATE employee 
    SET manager_id = ${managerId} 
    WHERE employee.id = ${employeeId}`,
    function (err, result, fields) {
      if (err) throw err;
      console.log("Employee Manager Updated.");
//return to menu
nav();
          }
        );
      });
  }
}
//delete a department
function removeDepartment() {
//db query to get department name and id
const whichDepartments = [];
db.query(`SELECT * FROM department`, function (err, result, fields) {
    if (err) throw err;
    result.forEach((dbData) => {
      var departments = dbData.id + ": " + dbData.department_name;
      whichDepartments.push(departments);
    });
//inquierer prompts
function chooseDepartment() {
    inquirer
      .prompt([
        {
          type: "list",
          name: "departmentChoice",
          message: "Choose a department to delete.",
          choices: whichDepartments,
        },
      ])
      .then((answer) => {
//turn answer into array
deptArray = answer.departmentChoice.split("");
let departmentId = deptArray[0];
//remove department from db
db.query(
    `DELETE FROM department
    WHERE department.id = ${departmentId}`,
    function (err, result, fields) {
      if (err) throw err;
      console.log("Department Removed.");
//return to menu
nav();
          }
        );
      });
  }
},
//delete a role
function removeRole() {
//role choice
const optionsForRole = [];
//db query for role and id
db.query(`SELECT * FROM roles`, function (err, result, fields) {
    if (err) throw err;
    result.forEach((dbData) => {
      var role = dbData.id + ": " + dbData.title;
      optionsForRole.push(role);
    });
    selectRole();
  });
//prompts
function roleSelection() {
    inquirer
      .prompt({
        type: "list",
        name: "roleChoice",
        message: "Choose a role to delete.",
        choices: optionsForRole,
      })
      .then((answer) => {
//array
roleArray = answer.roleChoice.split("");
//get id
let roleId = roleArray[0];
//query to remove role
db.query(
    `DELETE FROM roles
    WHERE roles.id = ${roleId}`,
    function (err, result, fields) {
      if (err) throw err;
      console.log("Role Removed");
//return to menu
nav();
          }
        );
      });
  }
//delete employee
function theyGone() {
    const doWhat = [];
//db query for name and id
db.query(`SELECT * FROM employee`, function (err, result, fields) {
    if (err) throw err;
    result.forEach((dbData) => {
      var employees = dbData.id + ": " + dbData.first_name + dbData.last_name;
      doWhat.push(employees);
    });
    selectEmployee();
  });
//prompts
function selectEmployee() {
    inquirer
      .prompt({
        type: "list",
        name: "employeeChoice",
        message: "Choose an employee to remove.",
        choices: doWhat,
      })
      .then((answer) => {
//array 
employeeArray = answer.employeeChoice.split("");
let employeeId = employeeArray[0];
//remove an employee from db
db.query(
    `DELETE FROM employee 
    WHERE employee.id = ${employeeId};`,
    function (err, result, fields) {
      if (err) throw err;
      console.log("Employee Removed.")
//return to menu
nav();
          }
        );
      });
  }
}
//exit
function done() {
    console.log(`
    Work Complete
    `);
}

doWhat();
