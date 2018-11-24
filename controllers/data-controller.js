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
  const nextinspdate = req.body.nextinspdate;
  const equipment_status = "functional";
  const remarks = "New registration";
  const username = req.body.username;
  //var today = new Date();
  var queryString ='INSERT INTO registration (tagid, equipment, orderdate, equipment_type, labelling, nextinspdate) VALUES (?, ?, ?, ?, ?,?)'

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
      connection.query(queryString, [tagid, equipment, orderdate, equipment_type, labelling, nextinspdate], function(err,result) {
        if (err) { 
          connection.end();
          connection.rollback(function() {
            throw err;
          });
          return res.send({ error: err, data: result, message: 'Entry Unsuccessful!' });
        }
     
        var query1 = 'INSERT INTO inspection (tagid, equipment_status, inspdate, remarks, username) VALUES (?, ?, now(), ?, ?)'
     
        connection.query(query1, [tagid, equipment_status, remarks, username ], function(err,result) {
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
            return res.send({ error: err, data: result, message: 'Entry Successful!' });            
          });
        });
      });
    });
}

module.exports.gettagdata=function(req, res){
    const tagid = req.body.tagids
    console.log(tagid)

    //["11a4b3c243", "11a4b3c245", "11a4b3c247"] JSON Input for the API

    //const queryString = "select r.tagid, r.equipment, d.nextinspdate, r.equipment_type, r.labelling from reg r JOIN dates d WHERE r.tagid = d.tagid AND r.tagid IN (?)"
    const queryString = "SELECT r.tagid, r.nextinspdate, r.labelling, i.equipment_status, i.remarks, i.inspdate FROM registration r JOIN inspection i WHERE r.tagid = i.tagid AND r.tagid IN (?) AND i.inspdate = (SELECT MAX(d.inspdate) FROM inspection d WHERE d.tagid = r.tagid);"
    connection.query(queryString, [tagid], (err, result, fields) => {
      
      if(err){
      console.log("Failed to query " + err)
      res.sendStatus(500)
       return
      }
      console.log("Fetch Succesful")
      //res.json(rows)

      return res.send({ error: false, data: result, message: 'Fetch Successful!' });
      })
    }



module.exports.updatetagdata=function(req,res){

  console.log(req.body); 

  // Sample response
  // {
  //   "tagid": "1143243",
  //   "equipment_status": "1",
  //   "remarks": "Everything looks good",
  //   "username":"demouser",
  //   "nextinspdate": "2020-03-22"
  // }
  
  const tagid = req.body.tagid;
  const equipment_status = req.body.equipment_status;
  const remarks = req.body.remarks;
  const username = req.body.username;
  const nextinspdate = req.body.nextinspdate;
  //var today = 'now()';

  var newinspdate = nextinspdate.split("/").reverse().join("-");
  // console.log("Date:>>"+newinspdate); 

  var queryString ='INSERT INTO inspection (tagid, equipment_status, inspdate, remarks, username) VALUES (?, ?, now(), ?, ?)'


  connection.beginTransaction(function(err) {
      if (err) { throw err; }
      connection.query(queryString, [tagid, equipment_status,remarks, username], function(err,result) {
        if (err) { 
          connection.end();
          connection.rollback(function() {
            throw err;
          });
          return res.send({ error: err, data: result, message: 'Entry Unsuccessful!' });
        }
     
        var query1 = "UPDATE registration SET nextinspdate = ? WHERE tagid =?"
     
        connection.query(query1, [newinspdate, tagid], function(err,result) {
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
          });
        });
      });
    });
}



module.exports.getreport=function(req,res){
//
var fromdate = req.body.fromdate;
var todate = req.body.todate;

const queryString = "SELECT @a:=@a+1 as S_No, r.tagid, r.labelling, i.inspdate, i.equipment_status, i.remarks, i.username FROM registration r JOIN inspection i,(select @a:=0) initvars WHERE r.tagid = i.tagid AND (inspdate between ? AND ?)"
    connection.query(queryString, [fromdate],[todate], (err, result, fields) => {
      
      if(err){
      console.log("Failed to query " + err)
      res.sendStatus(500)
       return
      }
      console.log("Fetch Succesful")
      //res.json(rows)

      return res.send({ error: false, data: result, message: 'Fetch Successful!' });
      })
}