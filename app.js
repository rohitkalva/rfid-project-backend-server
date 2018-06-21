const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')
const mysql = require('mysql')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))

app.use(morgan('combined'))

//DB Connection Configuration
const  connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'rfid',
    password : 'rfidproject',
    database: 'rfid'
})

//Connect to DB
connection.connect(function(err) {
    if (err) {
      console.error('error connecting: ' + err.stack)
      return;
    }
  
    console.log('connected as id ' + connection.threadId)
  })

//Default Route
app.get("/", (req, res) => {
    console.log("Responding to root route")
    res.send("Hello from ROOOOT")
})

    app.get('/users1', (req, res) => {
        //console.log("Fetching user with id: " + req.params.id)

    const queryString = "SELECT * FROM db"

    connection.query(queryString, (err, rows, fields) => {

        if(err){
            console.log("Failed to query " + err)
            res.sendStatus(500)
            return
        }
        console.log("Fetch Succesful")
        res.json(rows)
    })
    })

//Retrieve route
app.get('/users', (req, res) => {
    //console.log("Fetching user with id: " + req.params.id)

const queryString = "SELECT * FROM users"

connection.query(queryString, (err, rows, fields) => {

    if(err){
        console.log("Failed to query " + err)
        res.sendStatus(500)
        return
    }
    console.log("Fetch Succesful")
    res.json(rows)
})
})
app.post('/registration', function(req, res) {

    var jsondata = req.body;
    var values = [];
    
    for(var i=0; i< jsondata.length; i++)
      values.push([jsondata[i].tagID,jsondata[i].product, jsondata[i].purchasedate, jsondata[i].invoicenumber, jsondata[i].nextinspdate])
    
    //Bulk insert using nested array [ [a,b],[c,d] ] will be flattened to (a,b),(c,d)
    connection.query('INSERT INTO registration (tagID, product, purchasedate, invoicenumber, nextinspdate) VALUES ?', [values], function(err,result) {
        if (err) throw err;
        res.end(JSON.stringify(result))
    })
    })

app.post('/users', function(req, res) {

    var jsondata = req.body;
    var values = [];
    
    for(var i=0; i< jsondata.length; i++)
      values.push([jsondata[i].id,jsondata[i].first_name, jsondata[i].last_name])
    
    //Bulk insert using nested array [ [a,b],[c,d] ] will be flattened to (a,b),(c,d)
    connection.query('INSERT INTO users (id, first_name, last_name) VALUES ?', [values], function(err,result) {
        if (err) throw err;
        res.end(JSON.stringify(result))
    })
    })

app.listen(1080, () => {
    console.log("Server is up and listerning on port 3000")
})
