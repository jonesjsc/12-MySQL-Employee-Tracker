const mysql = require("mysql");
const inquirer = require("inquirer");
const util = require("util");
const cTable = require("console.table");
require("dotenv").config();

const connection = mysql.createConnection({
  host: "localhost",
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const query = util.promisify(connection.query).bind(connection);

// (async () => {
//   try {
//     const rows = await query("select * from employee");
//     console.table(rows);
//   } catch (error) {
//     console.error(error);
//   } finally {
//     connection.end();
//   }
// })();

async function showEmployees() {
  try {
    const rows = await query("select * from employee");
    console.table(rows);
  } catch (error) {
    console.error(error);
  }
  //   finally {
  //     connection.end();
  //   }
}

async function showRoles() {
  try {
    const rows = await query("select * from role");
    console.table(rows);
  } catch (error) {
    console.error(error);
  }
  //   finally {
  //     connection.end();
  //   }
}

// showEmployees();
// console.log("after Employees");
// showRoles();

// async function start() {
//   try {
//     await showEmployees();
//     await console.log("i bet this wont work");
//     await showRoles();
//     await console.log("look at me now");
//   } catch (error) {
//     console.error(error);
//   } finally {
//     connection.end();
//   }
// }

const start = () => {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View All Employees",
        "View All Employees By Department",
        "View All Employees By Manager",
        "Add Employee",
        "Remove Employee",
        "Update Employee Role",
        "Update Employee Manager",
      ],
    })
    .then((answer) => {
      switch (answer.action) {
        case "View All Employees":
          viewEmpByAll();
          break;

        case "View All Employees By Department":
          viewEmpByDept();
          break;

        case "View All Employees By Manager":
          viewEmpByMgr();
          break;

        case "Add Employee":
          addEmployee();
          break;

        case "Remove Employee":
          removeEmployee();
          break;

        case "Update Employee Role":
          updateEmpByRole();
          break;

        case "Update Employee Manager":
          updateEmpByMgr();
          break;

        default:
          console.log(`Invalid action: ${answer.action}`);
          break;
      }
    });
};
start();

async function viewEmpByAll() {
  await console.log("viewEmpByAll");
  start();
}

async function viewEmpByDept() {
  await console.log("viewEmpByDept");
  start();
}

async function viewEmpByMgr() {
  await console.log("viewEmpByMgr");
  start();
}

async function addEmployee() {
  await console.log("addEmployee");
  start();
}

async function removeEmployee() {
  await console.log("removeEmployee");
  start();
}

async function updateEmpByRole() {
  await console.log("updateEmpByRole");
  start();
}

async function updateEmpByMgr() {
  await console.log("updateEmpByMgr");
  start();
}
