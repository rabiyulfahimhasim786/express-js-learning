# express-js-learning
expressjs-learning

Creating a Login and Registration Form with Node.js, Express.js and MySQL database
#
node
#
express
#
mysql
#
beginners
Today we will learn how to create a login and registration form with node.js, express.js and mysql.

Our goal
Entering the data entered by the user in the registration form into the MySQL database, after checking whether such information has been entered into the database. In the login form, checking whether the data entered by the user is available in the MySQL database and working with sessions.

We will download the necessary programs
File structure:
```
node_modules
failLog.html
failReg.html
login.html
package-lock.json
package.json
register.html
server.js
```

Creating our app folder:
```
mkdir myform && cd myform
```
Creating a Node Project and Initialize:
```
npm init -y
```
For this we need Node.js, AppServ and MySQL database. We download some libraries from NPM:
```
npm i express mysql cookie-parser express-session body-parser
```
We create a database to store data in MySQL

In the SQL editor of phpMyAdmin, we use the following SQL code:
```
CREATE DATABASE myform
```
After creating a database named myform, we create a table named users inside it:
```
CREATE TABLE users (
id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
firstname VARCHAR(30) NOT NULL,
lastname VARCHAR(30) NOT NULL,
username VARCHAR(50) NOT NULL,
password VARCHAR(50) NOT NULL,
reg_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)
````
Creating web server in Node.js and Express.js

To create a web server, we create a file named server.js.
```
// server.js
const express = require("express");

const app = express();

app.get('/', (req, res)=>{
   res.send("Hello, world!");
});

app.listen(4000, ()=>{
   console.log("Server running on port 4000");
});
```
Now we will create a registration form on the home page of this server. For this, we create a file named register.html and insert the following codes into it:

```
<!--register.html-->
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Login and register form with Node.js, Express.js and MySQL</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
  </head>
  <body>
    <div class="container">
      <h2>Login and register form with Node.js, Express.js and MySQL</h2>
      <h3>Register form</h3>
      <form action="/register" method="POST">
        <div class="form-group mb-3">
            <label>First name</label>
            <input type="text" class="form-control" placeholder="First name" name="firstName">
        </div>
        <div class="form-group mb-3">
            <label>Last name</label>
            <input type="text" class="form-control" placeholder="Last name" name="lastName">
        </div>
        <div class="form-group mb-3">
            <label>Username</label>
            <input type="text" class="form-control" placeholder="Username" name="userName">
        </div>
        <div class="form-group mb-3">
            <label>Password</label>
            <input type="password" class="form-control" placeholder="Password" name="password">
          </div>
        <div class="d-grid mt-3">
        <button type="submit" class="btn btn-primary form-control">Submit</button>
        </div>
      </form>
    </div>
  </body>
</html>
```
We upload the register.html file to the home page of our web server and use body-parser to extract the user data from it:
const express = require('express');

var parseUrl = require('body-parser');
const app = express();


let encodeUrl = parseUrl.urlencoded({ extended: false });

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/register.html');
})

app.post('/register', encodeUrl, (req, res) => {
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var userName = req.body.userName;
    var password = req.body.password;
});

app.listen(4000, ()=>{
    console.log("Server running on port 4000");
});
We enter the data into the MySQL database
We check the database to see if this user has registered before:
const express = require('express');
const cookieParser = require("cookie-parser");
const sessions = require('express-session');
const http = require('http');
var parseUrl = require('body-parser');
const app = express();

var mysql = require('mysql');

let encodeUrl = parseUrl.urlencoded({ extended: false });

//session middleware
app.use(sessions({
    secret: "thisismysecrctekey",
    saveUninitialized:true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 24 hours
    resave: false
}));

app.use(cookieParser());

var con = mysql.createConnection({
    host: "localhost",
    user: "root", // my username
    password: "123456789", // my password
    database: "myform"
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/register.html');
})

app.post('/register', encodeUrl, (req, res) => {
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var userName = req.body.userName;
    var password = req.body.password;

    con.connect(function(err) {
        if (err){
            console.log(err);
        };
        // checking user already registered or no
        con.query(`SELECT * FROM users WHERE username = '${userName}' AND password  = '${password}'`, function(err, result){
            if(err){
                console.log(err);
            };
            if(Object.keys(result).length > 0){
                res.sendFile(__dirname + '/failReg.html');
            }else{
            //creating user page in userPage function
            function userPage(){
                // We create a session for the dashboard (user page) page and save the user data to this session:
                req.session.user = {
                    firstname: firstName,
                    lastname: lastName,
                    username: userName,
                    password: password 
                };

                res.send(`
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <title>Login and register form with Node.js, Express.js and MySQL</title>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1">
                    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
                </head>
                <body>
                    <div class="container">
                        <h3>Hi, ${req.session.user.firstname} ${req.session.user.lastname}</h3>
                        <a href="/">Log out</a>
                    </div>
                </body>
                </html>
                `);
            }
                // inserting new user data
                var sql = `INSERT INTO users (firstname, lastname, username, password) VALUES ('${firstName}', '${lastName}', '${userName}', '${password}')`;
                con.query(sql, function (err, result) {
                    if (err){
                        console.log(err);
                    }else{
                        // using userPage function for creating user page
                        userPage();
                    };
                });

        }

        });
    });


});

app.listen(4000, ()=>{
    console.log("Server running on port 4000");
});
<!--failReg.html-->
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Login and register form with Node.js, Express.js and MySQL</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
  </head>
  <body>
    <div class="container">
        <center>
            <h3 class="text-danger">This user already registered!</h3>
            <a href="/">Try again</a>
        </center>
    </div>
  </body>
</html>
All of the above was code written for the registration form!

We will create a login form
To create a login form, first create a file named login.html and add the following codes to it:
<!--login.html-->
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Login and register form with Node.js, Express.js and MySQL</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
  </head>
  <body>
    <div class="container">
      <h2>Login and register form with Node.js, Express.js and MySQL</h2>
      <h3>Login form</h3>
      <form action="/dashboard" method="POST">
        <div class="form-group mb-3">
            <label>Username</label>
            <input type="text" class="form-control" placeholder="Username" name="userName">
        </div>
        <div class="form-group mb-3">
            <label>Password</label>
            <input type="password" class="form-control" placeholder="Password" name="password">
          </div>
        <div class="d-grid mt-3">
        <button type="submit" class="btn btn-primary form-control">Submit</button>
        </div>
      </form>
    </div>
  </body>
</html>
Now we enter the codes of the login form in our server.js file:
//server.js

// upload `login.html` file to /login page
app.get("/login", (req, res)=>{
    res.sendFile(__dirname + "/login.html");
});

// get user data to /dashboard page
app.post("/dashboard", encodeUrl, (req, res)=>{
    var userName = req.body.userName;
    var password = req.body.password;

    con.connect(function(err) {
        if(err){
            console.log(err);
        };
//get user data from MySQL database
        con.query(`SELECT * FROM users WHERE username = '${userName}' AND password = '${password}'`, function (err, result) {
          if(err){
            console.log(err);
          };
// creating userPage function to create user page
          function userPage(){
            // We create a session for the dashboard (user page) page and save the user data to this session:
            req.session.user = {
                firstname: result[0].firstname, // get MySQL row data
                lastname: result[0].lastname, // get MySQL row dataa
                username: userName,
                password: password 
            };

            res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <title>Login and register form with Node.js, Express.js and MySQL</title>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
            </head>
            <body>
                <div class="container">
                    <h3>Hi, ${req.session.user.firstname} ${req.session.user.lastname}</h3>
                    <a href="/">Log out</a>
                </div>
            </body>
            </html>
            `);
        }

        if(Object.keys(result).length > 0){
            userPage();
        }else{
            res.sendFile(__dirname + '/failLog.html');
        }

        });
    });
});
<!--failLog.html-->
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Login and register form with Node.js, Express.js and MySQL</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
  </head>
  <body>
    <div class="container">
        <center>
            <h3 class="text-danger">This username or password error!</h3>
            <a href="/">Try again</a>
        </center>
    </div>
  </body>
</html>

All the code in server.js:
```
const express = require('express');
const cookieParser = require("cookie-parser");
const sessions = require('express-session');
const http = require('http');
var parseUrl = require('body-parser');
const app = express();

var mysql = require('mysql');
const { encode } = require('punycode');

let encodeUrl = parseUrl.urlencoded({ extended: false });

//session middleware
app.use(sessions({
    secret: "thisismysecrctekey",
    saveUninitialized:true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 24 hours
    resave: false
}));

app.use(cookieParser());

var con = mysql.createConnection({
    host: "localhost",
    user: "root", // my username
    password: "123456789", // my password
    database: "myform"
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/register.html');
})

app.post('/register', encodeUrl, (req, res) => {
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var userName = req.body.userName;
    var password = req.body.password;

    con.connect(function(err) {
        if (err){
            console.log(err);
        };
        // checking user already registered or no
        con.query(`SELECT * FROM users WHERE username = '${userName}' AND password  = '${password}'`, function(err, result){
            if(err){
                console.log(err);
            };
            if(Object.keys(result).length > 0){
                res.sendFile(__dirname + '/failReg.html');
            }else{
            //creating user page in userPage function
            function userPage(){
                // We create a session for the dashboard (user page) page and save the user data to this session:
                req.session.user = {
                    firstname: firstName,
                    lastname: lastName,
                    username: userName,
                    password: password 
                };

                res.send(`
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <title>Login and register form with Node.js, Express.js and MySQL</title>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1">
                    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
                </head>
                <body>
                    <div class="container">
                        <h3>Hi, ${req.session.user.firstname} ${req.session.user.lastname}</h3>
                        <a href="/">Log out</a>
                    </div>
                </body>
                </html>
                `);
            }
                // inserting new user data
                var sql = `INSERT INTO users (firstname, lastname, username, password) VALUES ('${firstName}', '${lastName}', '${userName}', '${password}')`;
                con.query(sql, function (err, result) {
                    if (err){
                        console.log(err);
                    }else{
                        // using userPage function for creating user page
                        userPage();
                    };
                });

        }

        });
    });


});

app.get("/login", (req, res)=>{
    res.sendFile(__dirname + "/login.html");
});

app.post("/dashboard", encodeUrl, (req, res)=>{
    var userName = req.body.userName;
    var password = req.body.password;

    con.connect(function(err) {
        if(err){
            console.log(err);
        };
        con.query(`SELECT * FROM users WHERE username = '${userName}' AND password = '${password}'`, function (err, result) {
          if(err){
            console.log(err);
          };

          function userPage(){
            // We create a session for the dashboard (user page) page and save the user data to this session:
            req.session.user = {
                firstname: result[0].firstname,
                lastname: result[0].lastname,
                username: userName,
                password: password 
            };

            res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <title>Login and register form with Node.js, Express.js and MySQL</title>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
            </head>
            <body>
                <div class="container">
                    <h3>Hi, ${req.session.user.firstname} ${req.session.user.lastname}</h3>
                    <a href="/">Log out</a>
                </div>
            </body>
            </html>
            `);
        }

        if(Object.keys(result).length > 0){
            userPage();
        }else{
            res.sendFile(__dirname + '/failLog.html');
        }

        });
    });
});

app.listen(4000, ()=>{
    console.log("Server running on port 4000");
});```

Thank you for your attention!!!
