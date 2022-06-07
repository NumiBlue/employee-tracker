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
    "View Departments"
]
    })
}

//departments
//roles
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