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
  
//roles
function viewRoles() {
    console.log(`
  Roles
    `);
//employees
//db.query
//employees by department
//employees by manager
//employees by salary
//add a department
//return to nav/inquirer
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