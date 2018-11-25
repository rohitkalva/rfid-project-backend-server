const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')
var connection = require('./config');


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))

app.use(morgan('short'))

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

var registerController = require('./controllers/register-controller');
var authenticateController = require('./controllers/authenticate-controller');
var dataController = require('./controllers/data-controller')

app.post('/api/register', registerController.register); //user registration
app.post('/api/authenticate', authenticateController.authenticate); //user authentication
app.post('/api/app/gettagdata', dataController.gettagdata); //get tag data in the app
app.post('/api/registration', dataController.registration); //new equipment registration
app.post('/api/app/updatetagdata', dataController.updatetagdata); //update tag data post inspection
app.post('/api/getreport', dataController.getreport); //fetch report between date ranges



//Default Route
app.get("/", (req, res) => {
    console.log("Responding to root route")
    res.send("Hello from ROOOOT")
})

// app.get('/users', (req, res) => {
//     //console.log("Fetching user with id: " + req.params.id)

// const queryString = "SELECT * FROM reg"

// connection.query(queryString, (err, rows, fields) => {

//     if(err){
//         console.log("Failed to query " + err)
//         res.sendStatus(500)
//         return
//     }
//     console.log("Fetch Succesful")
//     res.json(rows)
// })
// })

app.listen(1080, () => {
    console.log("Server is up and listerning on port 1080")
})