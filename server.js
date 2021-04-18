// const express = require("express");
// const routes = require("./routes/api/userRoutes");

const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");

require("dotenv").config();

// create the connection information for the sql database
const connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: process.env.DB_PORT,

  // Your username
  user: process.env.DB_USER,

  // Your password
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

connection.connect((err) => {
  if (err) throw err;
  start();
});

// connection.end();

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

const viewEmpByAll = () => {
  const query =
    "SELECT e.id, e.first_name, e.last_name, r.title, d.name 'department', r.salary, concat(m.first_name, ' ',m.last_name) 'Manager' FROM employee e LEFT JOIN employee m ON (e.manager_id = m.id) JOIN role r on e.role_id=r.id JOIN department d on r.department_id=d.id ORDER BY e.id;";
  connection.query(query, (err, res) => {
    console.table(res);
    start();
  });
};

const viewEmpByDept = () => {
  // query the database for a list of all the departments
  const query = "SELECT * FROM department";
  connection.query(query, (err, results) => {
    if (err) throw err;
    console.table(results);
    // results.forEach((e) => console.log(e.name));

    inquirer
      .prompt({
        name: "choice",
        type: "list",
        // dynamically build the choices array by iterating through the select * from department
        choices() {
          const choiceArray = [];
          results.forEach(({ name }) => {
            choiceArray.push(name);
          });
          return choiceArray;
        },
        message: "Which Department",
      })
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
};

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

const addEmployee = () => {
  // prompt for info about the item being put up for auction
  const query = "SELECT title from role";
  connection.query(query, (err, results) => {
    if (err) throw err;
    console.table(results);
    const roleArray = [];
    results.forEach(({ title }) => {
      roleArray.push({ title });
    });
    console.table(roleArray);
    console.log(["one", "two"]);
    console.log([...roleArray]);
    inquirer
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
          name: "role",
          type: "list",
          choices: [...roleArray],
          // choices() {
          //   const choiceArray = [];
          //   results.forEach(({ title }) => {
          //     choiceArray.push({ title });
          //   });
          //   return choiceArray;
          // },
          message: "What is the employee's role?",
        },
        {
          name: "manager",
          type: "input",
          message: "Who is the employee's manager?",
        },
      ])
      .then((answer) => {
        // when finished prompting, insert a new item into the db with that info
        console.table(answer);
        // connection.query(
        //   "INSERT INTO auctions SET ?",
        //   // QUESTION: What does the || 0 do?
        //   {
        //     item_name: answer.item,
        //     category: answer.category,
        //     starting_bid: answer.startingBid || 0,
        //     highest_bid: answer.startingBid || 0,
        //   },
        //   (err) => {
        //     if (err) throw err;
        //     console.log("Your auction was created successfully!");
        //     // re-prompt the user for if they want to bid or post
        //     start();
        //   }
        // );
      });
  });
};

const removeEmployee = () => {
  const query = "SELECT * FROM employee";
  connection.query(query, (err, res) => {
    res.forEach(({ row }) => console.log(row));
    start();
  });
};

const updateEmpByRole = () => {
  const query = "SELECT * FROM employee";
  connection.query(query, (err, res) => {
    res.forEach(({ row }) => console.log(row));
    start();
  });
};

const updateEmpByMgr = () => {
  const query = "SELECT * FROM employee";
  connection.query(query, (err, res) => {
    res.forEach(({ row }) => console.log(row));
    start();
  });
};

// connection.query("SELECT * FROM department", (err, results) => {
//   if (err) throw err;
//   console.table(results, "name");
// });
