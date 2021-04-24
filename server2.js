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

const addEmployee = async () => {
  // prompt for info about the item being put up for auction
  const query2 = "SELECT title from role;";
  const query3 =
    "SELECT DISTINCT concat(e.first_name, ' ',e.last_name) 'name' FROM employee e JOIN employee m ON (m.manager_id = e.id) WHERE m.manager_id IS NOT NULL;";
  const roleDataRows = await query(query2);
  const roleData = Object.values(JSON.parse(JSON.stringify(roleDataRows)));
  console.table(roleData);
  roleDataRows.forEach((element) => console.log(element));
  roleData.forEach((element) => console.log(element));
  // const result = Object.values(JSON.parse(JSON.stringify(rows)));

  // console.log(typeof roleData);
  // console.log("xoxoxo");
  // console.log("row 2 " + roleData[2].title);

  const managerData = await query(query3);
  console.table(managerData);

  const inquirerPrompt = await inquirer.prompt([
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
          choiceArray.push({ title });
        });
        //   console.log(choiceArray);
        return choiceArray;
      },
      // choices: roleData,
      // choices() {
      //   const choiceArray = [];
      //   roleData.forEach(({ name }) => {
      //     choiceArray.push({ name });
      //   });
      //   // console.log("this is a console.table of " + choiceArray);
      //   return choiceArray;
      // },
    },
    // choices: roleData,
    // choices() {
    //   // const choiceArray = [];
    //   // roleData.forEach(({ title }) => {
    //   //   choiceArray.push({ title });
    //   // });
    //   return roleData;
    // },
    {
      name: "manager",
      type: "list",
      message: "Who is the Manager?",
      choices() {
        const choiceArray = [];
        managerData.forEach(({ mgr }) => {
          choiceArray.push({ mgr });
        });
        return choiceArray;
      },
    },
  ]);

  //       choices() {
  //         //     return roles;
  //         //   },
  //         // choices() {
  //         const choiceArray = [];
  //         results.forEach(({ title }) => {
  //           choiceArray.push({ title });
  //         });
  //         const titles = choiceArray.map((role) => {
  //           return role.title;
  //         });
  //         return titles;
  //       },
  //     },
  //   ])
  //         choices() {
  //           connection.query("SELECT e.id, e.first_name, e.last_name, r.title, d.name 'department', r.salary, concat(m.first_name, ' ',m.last_name) 'Manager' FROM employee e LEFT JOIN employee m ON (e.manager_id = m.id) JOIN role r on e.role_id=r.id JOIN department d on r.department_id=d.id WHERE (SELECT DISTINCT x.id from employee x WHERE concat(x.first_name,' ',x.last_name) = ?) = m.id;",
  //           [answer.title],
  //           (err, results) => {
  //               console.table(results);
  //             const choiceArray = [];
  //             results.forEach(({ title }) => {
  //               choiceArray.push({ title });
  //             });
  //             const titles = choiceArray.map((role) => {
  //               return role.title;
  //             });
  //             return titles;
  //           },
  //    )}
  // .then((answer) => {
  //   fn_to_add = answer.first_name;
  //   ln_to_add = answer.last_name;
  //   role_to_add = answer.title;
  //   const query =
  //     "SELECT DISTINCT e.id, concat(e.first_name, ' ',e.last_name) 'name' FROM employee e JOIN employee m ON (m.manager_id = e.id) WHERE m.manager_id IS NOT NULL;";
  //   connection.query(query, (err, results) => {
  //     if (err) throw err;
  //     console.table(results);
  //     inquirer.prompt({
  //       name: "manager",
  //       type: "list",
  //       message: "What is the Managers Name?",
  //       choices() {
  //         const choiceArray = [];
  //         results.forEach(({ name }) => {
  //           choiceArray.push({ name });
  //         });
  //         return choiceArray;
  //       },
  //     }).then(data => {
  //       console.log(data)
  //     })
  //   });
  // })
  // .then((answer) => {
  //   console.log("answer is " + answer);
  //   console.table(answer);
  //   // manager_to_add = answer.name;
  //   console.log("first name " + fn_to_add);
  //   console.log("last name " + ln_to_add);
  //   console.log("role to add " + role_to_add);
  //   console.log("manager name " + manager_to_add);
  //   // connection.query(
  //   //   "INSERT INTO auctions SET ?",
  //   //   // QUESTION: What does the || 0 do?
  //   //   {
  //   //     item_name: answer.item,
  //   //     category: answer.category,
  //   //     starting_bid: answer.startingBid || 0,
  //   //     highest_bid: answer.startingBid || 0,
  //   //   },
  //   //   (err) => {
  //   //     if (err) throw err;
  //   //     console.log("Your auction was created successfully!");
  //   //     // re-prompt the user for if they want to bid or post
  //   //     start();
  //   //   }
  //   // );
  // });
  // });
};

// async function addEmployee() {
//   await console.log("addEmployee");
//   start();
// }

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
