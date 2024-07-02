// src/db.js
const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'chuy17915',
  database: 'almacen'
});

module.exports = pool.promise();
