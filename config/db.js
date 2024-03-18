const mysql = require("mysql");

const pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "",
  database: "db_ifws", // Ganti dengan nama database Anda
});

module.exports = pool;
