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
app.post('/api/updateolddata', dataController.updateolddata)


// app.get('/download/:url/:url1/:url2/:file', function(req, res){

//     const url = req.params.url
//     const url1 = req.params.url1
//     const url2 = req.params.url2
//     const file = req.params.file
//     const link = "./" + url + "/" + url1 + "/" + url2 + "/" + file 
//     console.log(link)
//     // var destination = fs.realpathSync('111133B2DDD9014000000000.jpg', []);
//     // var file = './public/uploads/26-12-2018/111133B2DDD9014000000000-1545842116601.jpg';
//      res.download(link); // Set disposition and send it.
//     // console.log(destination)
//   });

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