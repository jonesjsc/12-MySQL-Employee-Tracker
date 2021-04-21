const mysql = require("mysql");
const inquirer = require("inquirer");
const util = require("util");
const cTable = require("console.table");
const express = require("express");
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

function viewEmpByAll() {
  const query =
    "SELECT e.id, e.first_name, e.last_name, r.title, d.name 'department', r.salary, concat(m.first_name, ' ',m.last_name) 'Manager' FROM employee e LEFT JOIN employee m ON (e.manager_id = m.id) JOIN role r on e.role_id=r.id JOIN department d on r.department_id=d.id ORDER BY e.id;";
  connection.query(query, (err, res) => {
    console.table(res);
    start();
  });
}

async function viewEmpByDept() {
  const query = "SELECT name from department";
  connection.query(query, (err, results) => {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "choice",
          type: "list",
          message: "Which Department?",
          choices() {
            const choiceArray = [];
            results.forEach(({ name }) => {
              choiceArray.push({ name });
            });
            // console.log(choiceArray);
            return choiceArray;
          },
        },
      ])
      .then((answer) => {
        connection.query(
          "SELECT e.id, e.first_name, e.last_name, r.title, d.name 'department', r.salary, concat(m.first_name, ' ',m.last_name) 'Manager' FROM employee e LEFT JOIN employee m ON (e.manager_id = m.id) JOIN role r on e.role_id=r.id JOIN department d on r.department_id=d.id WHERE d.name = ? ORDER BY e.id;",
          [answer.choice],
          (err, res) => {
            console.table(res);
            start();
          }
        );
      });
  });
  //   start();
}

const viewEmpByMgr = () => {
  // query the database for a list of all the departments
  const query =
    "SELECT DISTINCT e.id, concat(e.first_name, ' ',e.last_name) 'name' FROM employee e JOIN employee m ON (m.manager_id = e.id) WHERE m.manager_id IS NOT NULL;";
  connection.query(query, (err, results) => {
    if (err) throw err;
    // console.table(results);
    inquirer
      .prompt({
        name: "choice",
        type: "list",
        choices() {
          const choiceArray = [];
          results.forEach(({ name }) => {
            choiceArray.push({ name });
          });
          //   console.log(choiceArray);
          return choiceArray;
        },
        message: "Which Manager",
      })
      .then((answer) => {
        connection.query(
          "SELECT e.id, e.first_name, e.last_name, r.title, d.name 'department', r.salary, concat(m.first_name, ' ',m.last_name) 'Manager' FROM employee e LEFT JOIN employee m ON (e.manager_id = m.id) JOIN role r on e.role_id=r.id JOIN department d on r.department_id=d.id WHERE (SELECT DISTINCT x.id from employee x WHERE concat(x.first_name,' ',x.last_name) = ?) = m.id;",
          [answer.choice],
          (err, res) => {
            console.table(res);
            start();
          }
        );
      });
  });
};

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
