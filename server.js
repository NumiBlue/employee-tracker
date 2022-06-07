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
//search for department
//new role
//return to menu
//add employee
//ask for title and id
//db query to get name and id
//get manager id or null
//query new employee
//return to menu
//update employee role
//db query to get role and id
//prompts for changes
//return to menu
//update manager
//db query to get employees name and id
//prompts for info/select new manager
//manager id or null
//query to update role
//return to menu
//delete a department
//db query to get department name and id
//inquierer prompts
//turn answer into array
//remove department from db
//return to menu
//delete a role
//role choice
//db query for role and id
//prompts
//array
//get id
//query to remove role
//return to menu
//delete employee
//db query for name and id
//prompts
//array 
//remove an employee from db
//return to menu
//exit