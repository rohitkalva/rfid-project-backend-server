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

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

  var registerController=require('./controllers/register-controller');
  var authenticateController=require('./controllers/authenticate-controller');

  app.post('/api/register',registerController.register);
  app.post('/api/authenticate',authenticateController.authenticate);


//Default Route
app.get("/", (req, res) => {
    console.log("Responding to root route")
    res.send("Hello from ROOOOT")
})

//API to add registration details to DB
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
    var queryString ='INSERT INTO reg (tagid, equipment, orderdate, equipment_type, labelling) VALUES (?, ?, ?, ?, ?)'

    // connection.query(queryString, [tagid, equipment, orderdate, equipment_type, labelling, tagid, orderdate], function(err,result) {
    //     if (err) throw err;
    //     return res.send({ error: false, data: result, message: 'Entry Successful!' });    })

        //var query1 = "INSERT INTO dates (tagid, nextinspdate) VALUES (?, ?)"
    // connection.query(query1, [tagid, orderdate], function(err,result){
    //     if(err) throw err;
    //     return res.send({error: false, data: result, message: 'Entry Successful!'});
    // }) 

    connection.beginTransaction(function(err) {
        if (err) { throw err; }
        connection.query(queryString, [tagid, equipment, orderdate, equipment_type, labelling, tagid, orderdate], function(err,result) {
          if (err) { 
            connection.rollback(function() {
              throw err;
            });
          }
       
          var query1 = "INSERT INTO dates (tagid, nextinspdate) VALUES (?, ?)"
       
          connection.query(query1, [tagid, orderdate], function(err,result) {
            if (err) { 
              connection.rollback(function() {
                throw err;
              });
            }  
            connection.commit(function(err) {
              if (err) { 
                connection.rollback(function() {
                  throw err;
                });
              }
              console.log('Transaction Complete.');
              return res.send({ error: false, data: result, message: 'Entry Successful!' });
              connection.end();
            });
          });
        });
      });

    })

  //API to fetch TagIDs for mobile app
  app.post('/app1', function(req, res){
    const tagid = req.body
    console.log(tagid)

    //["11a4b3c243", "11a4b3c245", "11a4b3c247"] JSON Input for the API

    const queryString = "select r.tagid, r.equipment, d.nextinspdate, r.equipment_type, r.labelling from reg r JOIN dates d WHERE r.tagid = d.tagid AND r.tagid IN (?)"

    connection.query(queryString, [tagid], (err, result, fields) => {
      
      if(err){
      console.log("Failed to query " + err)
      res.sendStatus(500)
       return
      }
      console.log("Fetch Succesful")
      //res.json(rows)

      return res.send({ error: false, data: result, message: 'Entry Successful!' });
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
