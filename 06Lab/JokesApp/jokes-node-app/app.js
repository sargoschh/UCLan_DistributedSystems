const express = require('express');
const app = express();
require('dotenv').config();
const path = require('path');

const DB_TYPE = process.env.DB_TYPE || 'mongo-db'
const MYSQL_MODULE = process.env.MYSQL_MODULE || '../dbModules/mysql-database-fns'
const MONGO_MODULE = process.env.MONGO_MODULE || '../dbModules/mongo-database-fns'
const db = (DB_TYPE === 'MYSQL') ? require(`${MYSQL_MODULE}`) : require(`${MONGO_MODULE}`) // import all mysql or mongo database functions as an object

const PORT = process.env.ETL_PORT || 3000

app.use(express.static(path.join(__dirname, 'public')));


app.get("/", (req, res) => {
  res.send("Get your daily dose of jokes here!");
});

app.get('/types', (req, res) => {
  console.log(DB_TYPE);
  console.log(db);
  console.log(PORT);
  db.getData('types', []).then((results, err) => {
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

  db.getData('jokes', [type]).then((results, err) => {
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
  });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
