const express = require('express')
const app = express();
var connection = require('./../config');


module.exports.registration=function(req,res){

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
}


module.exports.app1=function(req, res){
    const tagid = req.body.tagids
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
    }



module.exports.app2=function(req,res){

  console.log(req.body); 
  
  const tagid = req.body.tagid;
  const test_result = req.body.test_result;
  const remarks = req.body.remarks;
  const username = req.body.username;
  const nextinspdate = req.body.nextinspdate;
  var today = new Date();
  var queryString ='INSERT INTO insp (tagid, test_result, remarks, username, inspdate) VALUES (?, ?, ?, ?, ?)'


  connection.beginTransaction(function(err) {
      if (err) { throw err; }
      connection.query(queryString, [tagid, test_result, remarks, username, today], function(err,result) {
        if (err) { 
          connection.rollback(function() {
            throw err;
          });
        }
     
        var query1 = "INSERT INTO dates (tagid, nextinspdate) VALUES (?, ?)"
     
        connection.query(query1, [tagid, nextinspdate], function(err,result) {
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
}
