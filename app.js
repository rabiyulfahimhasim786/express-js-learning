const express = require("express");
const mongoose = require("mongoose");

// mongoose.set('strictQuery', true);
// mongoose.connect('mongodb://127.0.0.1:27017/todo_express', {useNewUrlParser:true});

const app = express();

// conenction to mongodb
mongoose.connect("mongodb://127.0.0.1:27017/todo_express", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// mongoose.set('strictQuery', true);
// mongoose.connect("mongodb://localhost:27017/todo_express", { useNewUrlParser: true ,  useUnifiedTopology: true 
//  });

console.log("Connected")


// middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");



// routes
app.use(require("./routes/index"))
app.use(require("./routes/todo"))


// server configurations....
app.listen(3000, () => console.log("Server started listening on port: 3000"));
