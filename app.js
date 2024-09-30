// npm install mysql2

const express = require('express');
const mysql = require('mysql2'); // MySQL module
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method')); // Allows us to use PUT and DELETE methods
app.set('view engine', 'ejs');

// MySQL connection setup
var db = mysql.createConnection({
  host: 'Hiten-Terminal8',
  user: 'root',
  password: 'India@143',
  database: 'userDB',
  port: 3306
});

// Connect to the MySQL database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  } else console.log('Connected to MySQL');
});

// Routes

// Home route to list users
app.get('/', (req, res) => {
  const query = 'SELECT * FROM users'; // MySQL query to fetch all users
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).send("Error fetching users");
    }
    res.render('index', { users: results }); // Pass the fetched users to the 'index' view
  });
});

// Form to create a new user
app.get('/getUser', (req, res) => {
  res.render('new');
});

// Create a new user
app.post('/add', (req, res) => {
  const { username, email, address } = req.body;
  const query = 'INSERT INTO users (username, email, address) VALUES (?, ?, ?)';
  db.query(query, [username, email, address], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Error saving the user");
    }
    res.redirect('/'); // Redirect to the homepage after successful save
  });
});

// Edit user form
app.get('/users/:id/edit', (req, res) => {
  const query = 'SELECT * FROM users WHERE id = ?'; // MySQL query to fetch user by id
  db.query(query, [req.params.id], (err, result) => {
    if (err || result.length === 0) {
      return res.status(500).send("User not found");
    }
    res.render('edit', { user: result[0] }); // Pass the user to the 'edit' view
  });
});

// Update user
app.put('/users/:id', (req, res) => {
  const { username, email, address } = req.body;
  const query = 'UPDATE users SET username = ?, email = ?, address = ? WHERE id = ?';
  db.query(query, [username, email, address, req.params.id], (err, result) => {
    if (err) {
      return res.status(500).send("Error updating the user");
    }
    res.redirect('/');
  });
});

// Delete user
app.delete('/users/:id', (req, res) => {
  const query = 'DELETE FROM users WHERE id = ?';
  db.query(query, [req.params.id], (err, result) => {
    if (err) {
      return res.status(500).send("Error deleting the user");
    }
    res.redirect('/');
  });
});

// Delete all users
app.delete('/users', (req, res) => {
  const query = 'DELETE FROM users'; // MySQL query to delete all users
  db.query(query, (err, result) => {
    if (err) {
      return res.status(500).send("Error deleting all users");
    }
    res.redirect('/');
  });
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
