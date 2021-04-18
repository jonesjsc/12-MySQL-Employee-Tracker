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
          }
        );
      })
      .then(start());
  });
  // start();
};

// const bidAuction = () => {
//   // query the database for all items being auctioned
//   connection.query("SELECT * FROM auctions", (err, results) => {
//     if (err) throw err;
//     // once you have the items, prompt the user for which they'd like to bid on
//     inquirer
//       .prompt([
//         {
//           name: "choice",
//           type: "rawlist",
//           choices() {
//             const choiceArray = [];
//             results.forEach(({ item_name }) => {
//               choiceArray.push(item_name);
//             });
//             return choiceArray;
//           },
//           message: "What auction would you like to place a bid in?",
//         },
//         {
//           name: "bid",
//           type: "input",
//           message: "How much would you like to bid?",
//         },
//       ])
//       .then((answer) => {
//         // get the information of the chosen item
//         let chosenItem;
//         results.forEach((item) => {
//           if (item.item_name === answer.choice) {
//             chosenItem = item;
//           }
//         });

//         // determine if bid was high enough
//         if (chosenItem.highest_bid < parseInt(answer.bid)) {
//           // bid was high enough, so update db, let the user know, and start over
//           connection.query(
//             "UPDATE auctions SET ? WHERE ?",
//             [
//               {
//                 highest_bid: answer.bid,
//               },
//               {
//                 id: chosenItem.id,
//               },
//             ],
//             (error) => {
//               if (error) throw err;
//               console.log("Bid placed successfully!");
//               start();
//             }
//           );
//         } else {
//           // bid wasn't high enough, so apologize and start over
//           console.log("Your bid was too low. Try again...");
//           start();
//         }
//       });
//   });
// };

const viewEmpByMgr = () => {
  const query = "SELECT * FROM employee";
  connection.query(query, (err, res) => {
    res.forEach(({ row }) => console.log(row));
    start();
  });
};

const addEmployee = () => {
  const query = "SELECT * FROM employee";
  connection.query(query, (err, res) => {
    res.forEach(({ row }) => console.log(row));
    start();
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
