const express = require('express')
const app = express()
const PORT = 3000

app.use(express.json())


// Basic get
app.get("/", rootPath)
app.get("/time-str", getTimeString)
app.get("/time-obj", getTimeObject)
app.get("/date-str", getDateString)
app.get("/date-obj", getDateObject)

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));


// Named functions
function rootPath(req, res) {
    res.send("Search for date and time information at /time-str or /time-obj or /date-str or /date-obj")
}

function getTimeString(req, res) {
    const dateTime = new Date();
    const timeLocal = dateTime.toLocaleTimeString();
    return res.send(timeLocal);
}

function getTimeObject(req, res) {
    const dateTime = new Date();
    let response = {
        "hours": String(dateTime.getHours()).padStart(2, '0'),
        "minutes": String(dateTime.getMinutes()).padStart(2, '0'),
        "seconds": String(dateTime.getSeconds()).padStart(2, '0')
    };
    return res.json(response);
}

function getDateString(req, res) {
    const dateTime = new Date();
    const timeLocal = dateTime.toLocaleDateString();
    return res.send(timeLocal);
}

function getDateObject(req, res) {
    const dateTime = new Date();
    let response = {
        "dayOfWeek": dateTime.getDay(),
        "dayOfMonth": dateTime.getDate(),
        "month": dateTime.getMonth()+1,
        "year": dateTime.getFullYear()
    };
    return res.json(response);
}
