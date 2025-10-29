const express = require('express');
const mysql = require('mysql2');
const app = express();
const PORT = 3000;
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

let conStr = {
  host: 'localhost',
  user: 'root',
  password: 'admin',
  database: 'jokesapp'
}

const db = mysql.createConnection(conStr);

db.connect((err) => {
  if (err) {
    console.log(`Failed to connect to MySQL database: ${conStr.database}`)
    process.exit(1)
  } else
    console.log(`Connected to MySQL database: ${conStr.database}`)
})

app.get("/", (req, res) => {
  res.send("Get your daily dose of jokes here!");
});

// --- GET /types ---
// Gives all available joke types
app.get('/types', (req, res) => {
  const query = 'SELECT * FROM types';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching joke types:', err);
      return res.sendStatus(500);
    } else {
      res.json(results);
    }
  })
});

app.get('/jokes/:type?', (req, res) => {
  const type = req.params.type;
  const count = parseInt(req.query.count) || 1;

  if (!type) return res.sendStatus(400);

  let query = `SELECT j.id,
       t.type,
       j.setup,
       j.punchline
      FROM jokes AS j
      JOIN types AS t ON t.id = j.type`;

  if (type !== '1') { 
    query += ` WHERE j.type = ${db.escape(type)} `;
  }

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching joke types:', err);
      return res.sendStatus(500);
    } else {
      if (results.length === 0) return res.sendStatus(404);
      if (count > results.length) return res.sendStatus(413);

      const selected = results.sort(() => 0.5 - Math.random()).slice(0, count);

      if (count === 1) return res.json(selected[0]);

      return res.json(selected);
    }
  })
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
