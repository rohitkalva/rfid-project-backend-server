const express = require('express')
const app = express();
var connection = require('./../config');

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