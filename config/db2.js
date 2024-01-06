const mysql = require("mysql");
const env = require("./env.js");

const db_config = {
  host: "localhost",
  user: env.username,
  password: env.password,
  database: env.database,

  pool: {
    connectionLimit: 100,
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};

const conn = mysql.createPool(db_config);

module.exports = conn;
