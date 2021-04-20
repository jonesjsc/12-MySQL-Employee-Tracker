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

async function start() {
  try {
    await showEmployees();
    await console.log("i bet this wont work");
    await showRoles();
    await console.log("look at me now");
  } catch (error) {
    console.error(error);
  } finally {
    connection.end();
  }
}

start();
