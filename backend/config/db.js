const mysql = require("mysql2");

// Create the pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '', 
  database: 'fullstack_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// We export the pool directly. 
// Your controller uses db.query, which the pool supports perfectly.
module.exports = pool;

console.log("MySQL Pool Created and Exported");