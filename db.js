const mysql = require('mysql2');

// const connection = mysql.createConnection({
//   host: 'localhost',
//   user: 'your_mysql_username',
//   password: 'your_mysql_password',
//   database: 'todo_app'
// });

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'todoapp'
  });
  

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to the MySQL database');
});

module.exports = connection;
