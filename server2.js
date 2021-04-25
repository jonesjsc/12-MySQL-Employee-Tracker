const mysql = require("mysql");
const inquirer = require("inquirer");
const confirm = require("inquirer-confirm");
const util = require("util");
const cTable = require("console.table");
// const express = require("express");
require("dotenv").config();
var role_to_add = "";
var fn_to_add = "";
var ln_to_add = "";
var manager_to_add = "";

function confirmed() {
  console.log("confirmed");
}

function cancelled() {
  console.log("CANCELLED");
}

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
  const query6 =
    "SELECT concat(e.first_name, ' ',e.last_name) 'name' FROM employee e ORDER BY name";
  const employeeRows = await query(query6);
  const employees = Object.values(JSON.parse(JSON.stringify(employeeRows)));

  inquirerPrompt = await inquirer
    .prompt([
      {
        name: "name",
        type: "list",
        message: "Which employee are we removing?",
        choices() {
          const choiceArray = [];
          employees.forEach(({ name }) => {
            choiceArray.push(name);
          });
          return choiceArray;
        },
      },
      {
        name: "confirm",
        type: "list",
        message: (answers) => `Confirm DELETE of ${answers.name}`,
        choices: ["No", "Yes"],
      },
    ])
    .then(async (answer) => {
      if (answer.confirm == "Yes") {
        query7 =
          "DELETE FROM employee e WHERE concat(e.first_name, ' ',e.last_name) = ?;";
        where7 = answer.name;
        const employeeRows = await query(query7, where7);
      }
    });

  start();
}

async function updateEmpByRole() {
  const query8 =
    "SELECT concat(e.first_name, ' ',e.last_name) 'name' FROM employee e ORDER BY name";
  const query9 = "select id, title from role";

  const allEmployeesRows = await query(query8);
  const allEmployees = Object.values(
    JSON.parse(JSON.stringify(allEmployeesRows))
  );

  const allRolesRows = await query(query9);
  const allRoles = Object.values(JSON.parse(JSON.stringify(allRolesRows)));

  inquirerPrompt = await inquirer
    .prompt([
      {
        name: "name",
        type: "list",
        message: "Which employee are changing the Role for?",
        choices() {
          const choiceArray = [];
          allEmployees.forEach(({ name }) => {
            choiceArray.push(name);
          });
          return choiceArray;
        },
      },
      {
        name: "role",
        type: "list",
        message: "What role will the Employee have now?",
        choices() {
          const choiceArray = [];
          allRoles.forEach(({ title }) => {
            choiceArray.push(title);
          });
          return choiceArray;
        },
      },
      {
        name: "confirm",
        type: "list",
        message: (answers) =>
          `Confirm - for ${answers.name} set role to  ${answers.role}`,
        choices: ["No", "Yes"],
      },
    ])
    .then(async (answer) => {
      if (answer.confirm == "Yes") {
        console.log("lets update this shizzle");
        console.table(answer);
        const query10 = "SELECT id FROM role WHERE title = ?";
        const where10 = [answer.role];
        const roleIdRow = await query(query10, where10);
        const roleId = Object.values(JSON.parse(JSON.stringify(roleIdRow)));
        const query11 =
          "UPDATE employee e SET role_id = ? WHERE concat(e.first_name, ' ',e.last_name) = ?";
        const where11 = [roleId[0].id, answer.name];
        const updateEmp = await query(query11, where11);

        // query10 =
        //   "UPDATE FROM employee e WHERE concat(e.first_name, ' ',e.last_name) = ?;";
        // where7 = answer.name;
        // const employeeRows = await query(query7, where7);
      }
    });

  start();
}

async function updateEmpByMgr() {
  await console.log("updateEmpByMgr");
  start();
}
