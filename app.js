const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')
var connection = require('./config');
var fs = require('fs');


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
app.get('/api/app/gettagdata/:tagid', dataController.gettagdata); //get tag data in the app
app.post('/api/registration', dataController.registration_data); //new equipment registration
app.post('/api/app/updatetagdata', dataController.updatetagdata); //update tag data post inspection
app.post('/api/getreport', dataController.getreport); //fetch report between date ranges
app.post('/api/futureinspection', dataController.futureinspection); //fetch report for future inspections
app.post('/app/imageupload/:tagid', dataController.imageupload) //Post API to upload image
app.get('/api/app/images/:public/:uploads/:folder/:file_name', dataController.imagedownload) // GET API for image download
app.post('/api/updateolddata', dataController.updateolddata)
app.get('/api/unamecheck/:username', dataController.unamecheck) //Endpoint to validate username during new user creation
app.post('/api/user/changepassword', authenticateController.passchange) //Endpoint to update or modify userpassword
app.get('/api/getdayreport/:date', dataController.getdayreport) //Endpoint to fetch inspection records for given date

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