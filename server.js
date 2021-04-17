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
  runMain();
});

// connection.end();

async function runMain() {
  console.log("in main");
  connection.query("SELECT * FROM department", (err, results) => await {
    if (err) throw err;
    console.table(results, "name");
  });
}
