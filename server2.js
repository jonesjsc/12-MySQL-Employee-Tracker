const mysql = require("mysql");
const inquirer = require("inquirer");
const util = require("util");
const cTable = require("console.table");
// const express = require("express");
require("dotenv").config();
var role_to_add = "";
var fn_to_add = "";
var ln_to_add = "";
var manager_to_add = "";

const connection = mysql.createConnection({
  host: "localhost",
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const query = util.promisify(connection.query).bind(connection);

async function setArrays() {
  try {
    const roles = await query("select title from role");
    const managers = await query(
      "SELECT DISTINCT concat(e.first_name, ' ',e.last_name) 'name' FROM employee e JOIN employee m ON (m.manager_id = e.id) WHERE m.manager_id IS NOT NULL;"
    );
    console.log("loading " + roles + " and " + managers);
    console.table(roles);
    console.table(managers);
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

// setArrays();
start();

function viewEmpByAll() {
  const query =
    "SELECT e.id, e.first_name, e.last_name, r.title, d.name 'department', r.salary, concat(m.first_name, ' ',m.last_name) 'Manager' FROM employee e LEFT JOIN employee m ON (e.manager_id = m.id) JOIN role r on e.role_id=r.id JOIN department d on r.department_id=d.id ORDER BY e.id;";
  connection.query(query, (err, res) => {
    console.table(res);
    start();
  });
}

function viewEmpByDept() {
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

const addEmployee = async () => {
  // prompt for info about the item being put up for auction
  const query2 = "SELECT title from role;";
  const query3 =
    "SELECT DISTINCT concat(e.first_name, ' ',e.last_name) 'name' FROM employee e JOIN employee m ON (m.manager_id = e.id) WHERE m.manager_id IS NOT NULL;";
  const roleDataRows = await query(query2);
  const roleData = Object.values(JSON.parse(JSON.stringify(roleDataRows)));
  const mgrDataRows = await query(query3);
  const mgrData = Object.values(JSON.parse(JSON.stringify(mgrDataRows)));

  const managerData = await query(query3);

  inquirerPrompt = await inquirer
    .prompt([
      {
        name: "first_name",
        type: "input",
        message: "What is the employee's first name?",
      },
      {
        name: "last_name",
        type: "input",
        message: "What is the employee's last name?",
      },
      {
        name: "title",
        type: "list",
        message: "What is the employee's role?",
        choices() {
          const choiceArray = [];
          roleData.forEach(({ title }) => {
            choiceArray.push(title);
          });
          return choiceArray;
        },
      },
      {
        name: "manager",
        type: "list",
        message: "Who is the Manager?",
        choices() {
          const choiceArray = [];
          mgrData.forEach(({ name }) => {
            choiceArray.push(name);
          });
          return choiceArray;
        },
      },
    ])
    .then(async (answer) => {
      const query4 = "SELECT id FROM role WHERE title = ?";
      const where4 = [answer.title];
      const query5 =
        "select id from employee e where concat(e.first_name, ' ',e.last_name) = ?";
      const where5 = [answer.manager];

      const titleIdRow = await query(query4, where4);
      const mgrIdRow = await query(query5, where5);

      // this is a titleIdRow amd mgrIdRow are RowDataPacket format.  To convert to usable data we need to do this:
      const titleId = Object.values(JSON.parse(JSON.stringify(titleIdRow)));
      const mgrId = Object.values(JSON.parse(JSON.stringify(mgrIdRow)));
      // these returned objects are arrays - so we're just after the [0].id in them

      connection.query(
        "INSERT INTO employee SET ?",
        {
          first_name: answer.first_name,
          last_name: answer.last_name,
          role_id: titleId[0].id,
          manager_id: mgrId[0].id,
        },
        (err) => {
          if (err) throw err;
          console.log(
            answer.first_name +
              " " +
              answer.last_name +
              " SUCCESSFULLY ADDED  (role_id=" +
              titleId[0].id +
              " manager_id=" +
              mgrId[0].id +
              ")"
          );
          // re-prompt the user for next action
          start();
        }
      );
    });
};

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
