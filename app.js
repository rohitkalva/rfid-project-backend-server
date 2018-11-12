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

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
  

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

//Update route
app.post('/reg', function(req, res) {

    console.log(req.body); 
    // var jsondata = req.body;
    // var values = [];
    // for(var i=0; i< jsondata.length; i++)
    //   values.push([jsondata[i].tagid,jsondata[i].equipment, jsondata[i].orderdate, jsondata[i].equipment_type, jsondata[i].labelling])
    const tagid = req.body.tagid;
    const equipment = req.body.equipment;
    const orderdate = req.body.orderdate;
    const equipment_type = req.body.equipment_type;
    const labelling = req.body.labelling;
    //Bulk insert using nested array [ [a,b],[c,d] ] will be flattened to (a,b),(c,d)
    var queryString ='INSERT INTO reg (tagid, equipment, orderdata, equipment_type, labelling) VALUES (?, ?, ?, ?, ?)'

    connection.query(queryString, [tagid, equipment, orderdate, equipment_type, labelling], function(err,result) {
        if (err) throw err;
        return res.send({ error: false, data: result, message: 'Entry Successful!' });    })
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

    app.get('/users', (req, res) => {
        //console.log("Fetching user with id: " + req.params.id)

    const queryString = "SELECT * FROM reg"

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

app.listen(1080, () => {
    console.log("Server is up and listerning on port 1080")
})
