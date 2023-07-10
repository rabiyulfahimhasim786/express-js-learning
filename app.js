
const express = require('express');
const app = express();
const db = require('./db');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/hello', (req, res) => {
  res.send('Hello World!')
})


// Get all todos
app.get('/todos', (req, res) => {
  db.query('SELECT * FROM todos', (err, results) => {
    if (err) throw err;
    res.render('index', { todos: results });
  });
});

// Add a new todo
app.post('/todos', (req, res) => {
  const { title, completed } = req.body;
//   const completedValue = completed || false; // Set a default value if 'completed' is not provided
  const completedValue = completed || 'No'; // Set a default value if 'completed' is not provided
  db.query('INSERT INTO todos (title, completed) VALUES (?, ?)', [title, completedValue], (err, result) => {
    if (err) throw err;
    res.redirect('/todos');
  });
});

// Update a todo
// app.post('/todos/:id', (req, res) => {
//   const { id } = req.params;
//   const { _method } = req.body;
//   if (_method === 'PUT') {
//     const { title, completed } = req.body;
//     db.query('UPDATE todos SET title = ?, completed = ? WHERE id = ?', [title, completed, id], (err, result) => {
//       if (err) throw err;
//       res.redirect('/todos');
//     });
//   } else if (_method === 'DELETE') {
//     db.query('DELETE FROM todos WHERE id = ?', [id], (err, result) => {
//       if (err) throw err;
//       res.redirect('/todos');
//     });
//   }
// });
// Update a todo
// Update a todo
app.post('/todos/:id', (req, res) => {
    const { id } = req.params;
    const { _method, title, completed } = req.body;
    console.log(_method, title, completed)
  
    if (_method === 'PUT') {
      db.query('UPDATE todos SET title = ?, completed = ? WHERE id = ?', [title, completed, id], (err, result) => {
        if (err) throw err;
        res.redirect('/todos');
      });
    } else if (_method === 'DELETE') {
      db.query('DELETE FROM todos WHERE id = ?', [id], (err, result) => {
        if (err) throw err;
        res.redirect('/todos');
      });
    }
  });
  
  

// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});
