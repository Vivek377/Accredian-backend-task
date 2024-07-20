const mysql = require("mysql2");
require("dotenv").config();

const connection = mysql.createConnection({
  host: "sql12.freesqldatabase.com",
  user: "sql12721092",
  password: process.env.MYSQL_PASS,
  database: "sql12721092",
});

module.exports = connection;
