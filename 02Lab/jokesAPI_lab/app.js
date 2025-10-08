const express = require('express')
const app = express()
let jokes = require('./jokes.json') // Include some data to emulate a database
const PORT = 3000

// Middleware to parse JSON as we want to send JSON in a POST. This will create req.body
app.use(express.json())


// Basic get
app.get("/", rootPath);
app.get("/jokes", getAllJokes);

// By type
app.get("/jokes/type/:type", getJokesByType); 
// → /jokes/type/general

// By amount
app.get("/jokes/amount/:amount", getFixedNumberOfJokes); 
// → /jokes/amount/3

// By type and amount
app.get("/jokes/type/:type/amount/:amount", getFixedNumberOfJokesByType);
// → /jokes/type/general/amount/3

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));


function rootPath(req, res) {
  res.send("Search for jokes at /jokes or /jokes/type/:type or /jokes/amount/:amount or /jokes/type/:type/amount/:amount")
}

function getAllJokes(req, res) {
  res.json(jokes) 
}

function getJokesByType(req, res) {
  let type = req.params.type;
  if (!type) return res.send("Please choose from 'general', 'programming' or 'knock-knock'");

  let score = jokes.filter(element => element.type.toLowerCase() === type.toLowerCase())
  if (score.length == 0) return res.sendStatus(404)
  else
    return res.json(score)
}

function getFixedNumberOfJokes(req, res) {
  let amount = parseInt(req.params.amount)
  if (isNaN(amount)) return res.send("Please provide a number.")

  let available = amount > jokes.length;
  if (available) return res.send("Error 413: Too many jokes. Please reduce number.");
  else
    return res.json(jokes.slice(0, amount));
}

function getFixedNumberOfJokesByType(req, res) {
  let amount = parseInt(req.params.amount)
  if (isNaN(amount)) return res.send("Please provide a number.")

  let type = req.params.type;
  if (!type) return res.send("Please choose from 'general', 'programming' or 'knock-knock'");

  let score = jokes.filter(element => element.type.toLowerCase() === type.toLowerCase());
  if (score.length == 0) return res.sendStatus(404); 
  else if (amount > score.length) return res.send("Error 413: Too many jokes. Please reduce number.");
  else
    return res.json(score.slice(0, amount))
}
