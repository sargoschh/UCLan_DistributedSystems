const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const jokes = JSON.parse(fs.readFileSync(path.join(__dirname, 'jokes.json')));

app.get("/", (req, res) => {
  res.send("Get your daily dose of jokes here!");
});

app.get("/jokes", (req, res) => {
  res.status(400);
});

app.get('/jokes/types', (req, res) => {
  const types = [...new Set(jokes.map(joke => joke.type))];
  res.json(types);
});

app.get("/jokes/type/:type", (req, res) => {
  let type = req.params.type;
  if (!type) return res.status(404);

  if(type === "any") return res.json(jokes);

  let score = jokes.filter(element => element.type.toLowerCase() === type.toLowerCase());
  if (score.length == 0) return res.sendStatus(404);
  else
    return res.json(score);
});

app.get("/jokes/type/:type/amount/:amount", (req, res) => {
    let amount = parseInt(req.params.amount)
  if (isNaN(amount)) return res.status(400);

  let type = req.params.type;
  if (!type) return res.status(404);

  if(type === "any"){
    if (amount > jokes.length) return res.status(413);
    else return res.json(jokes.slice(0, amount));
  }

  let score = jokes.filter(element => element.type.toLowerCase() === type.toLowerCase());
  if (score.length == 0) return res.sendStatus(404);
  else if (amount > score.length) return res.send("Error 413: Too many jokes. Please reduce number.");
  else
    return res.json(score.slice(0, amount))
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));


// // Basic get


// // By type

// // → /jokes/type/general

// // By amount
// app.get("/jokes/amount/:amount", getFixedNumberOfJokes);
// // → /jokes/amount/3

// // By type and amount

// // → /jokes/type/general/amount/3




// function rootPath(req, res) {

// }

// function getAllJokes(req, res) {
//   res.json(jokes)
// }

// function getJokesByType(req, res) {

// }

// function getFixedNumberOfJokes(req, res) {
//   let amount = parseInt(req.params.amount)
//   if (isNaN(amount)) return res.send("Please provide a number.")

//   let available = amount > jokes.length;
//   if (available) return res.send("Error 413: Too many jokes. Please reduce number.");
//   else
//     return res.json(jokes.slice(0, amount));
// }

// function getFixedNumberOfJokesByType(req, res) {

// }
