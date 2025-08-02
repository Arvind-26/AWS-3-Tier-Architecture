const express = require('express');
const mysql = require('mysql2');
const app = express();

app.use(express.json());

const db = mysql.createConnection({
  host: 'your-rds-endpoint',
  user: 'admin',
  password: 'yourpassword',
  database: 'yourdbname',
});

db.connect(err => {
  if (err) {
    console.error('DB connection failed:', err.message);
    process.exit(1);
  }
  console.log('✅ Connected to MySQL RDS');
});

app.get('/', (req, res) => {
    res.sendFile('success');
});

app.get('/create-table', (req, res) => {
  const query = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100),
      email VARCHAR(100),
      age INT
    )
  `;
  db.query(query, (err) => {
    if (err) return res.status(500).send('Error creating table');
    res.send('✅ Users table created');
  });
});

app.post('/add-user', (req, res) => {
  const { name, email, age } = req.body;
  const query = 'INSERT INTO users (name, email, age) VALUES (?, ?, ?)';
  db.query(query, [name, email, age], (err, result) => {
    if (err) return res.status(500).send('Error adding user');
    res.send('✅ User added with ID: ' + result.insertId);
  });
});

app.get('/users', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) return res.status(500).send('Error fetching users');
    res.json(results);
  });
});

app.listen(3000, () => {
  console.log('🚀 Server running on http://localhost:3000');
});