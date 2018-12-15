const express = require('express')
const app = express();
var connection = require('./../config');


module.exports.registration_data = function (req, res) {

  console.log(req.body);
  // var jsondata = req.body;
  // var values = [];
  // for(var i=0; i< jsondata.length; i++)
  //   values.push([jsondata[i].tagid,jsondata[i].equipment, jsondata[i].orderdate, jsondata[i].equipment_type, jsondata[i].labelling])
  const manufacturer = req.body.manufacturer;
  const model = req.body.model;
  const variant = req.body.variant;
  const serial_no = req.body.serial_no;
  const lead_front = req.body.lead_front;
  const lead_back = req.body.lead_back;
  const year_of_mfg = req.body.year_of_mfg;
  const colour = req.body.colour;
  const size = req.body.size;
  const length = req.body.length;
  const tagid = req.body.tagid;
  const label = req.body.label;
  const localid = req.body.localid;
  const clinic = req.body.clinic;
  const building = req.body.building;
  const department = req.body.department;
  const location = req.body.location;
  const nextinspdate = req.body.nextinspdate;
  const touch_test = "ok";
  const xray_test = "ok";
  const testremarks = "New Registration";
  const test_status = "Pass";
  const user_name = req.body.user_name;
  const check_interval = "36 Months";
  const comments = "New Registration";

  var item_data = 'INSERT INTO item_data (manufacturer, model, variant, serial_no, lead_front, lead_back, year_of_mfg, colour, size, length) VALUES (?,?,?,?,?,?,?,?,?,?)'
  var location_data = 'INSERT INTO location_data (serial_no, tagid, label, localid, clinic, building, department, location, nextinspdate) VALUES (?,?,?,?,?,?,?,?,?)'
  var test_data = 'INSERT INTO test_data (tagid, touch_test, xray_test, testremarks, test_status, test_date, user_name, check_interval, comments) VALUES (?,?,?,?,?,now(),?,?,?)'

  // connection.query(queryString, [tagid, equipment, orderdate, equipment_type, labelling, tagid, orderdate], function(err,result) {
  //     if (err) throw err;
  //     return res.send({ error: false, data: result, message: 'Entry Successful!' });    })

  //var query1 = "INSERT INTO dates (tagid, nextinspdate) VALUES (?, ?)"
  // connection.query(query1, [tagid, orderdate], function(err,result){
  //     if(err) throw err;
  //     return res.send({error: false, data: result, message: 'Entry Successful!'});
  // }) 

  connection.beginTransaction(function (err) {
    if (err) {
      throw err;
    }
    connection.query(item_data, [manufacturer, model, variant, serial_no, lead_front, lead_back, year_of_mfg, colour, size, length], function (err, result) {
      if (err) {
        connection.end();
        connection.rollback(function () {
          throw err;
        });
        return res.send({
          error: err,
          data: result,
          message: 'Entry Unsuccessful!'
        });
      }  

      connection.query(location_data, [serial_no, tagid, label, localid, clinic, building, department, location, nextinspdate], function (err, result) {
        if (err) {
          connection.end();
          connection.rollback(function () {
            throw err;
          });
          return res.send({
            error: err,
            data: result,
            message: 'Entry Unsuccessful!'
          });
        }

        connection.query(test_data, [tagid, touch_test, xray_test, testremarks, test_status, user_name, check_interval, comments], function (err, result) {
          if (err) {
            connection.end();
            connection.rollback(function () {
              throw err;
            });
          } 
          
          connection.commit(function (err) {
            if (err) {
              connection.rollback(function () {
                throw err;
              });
            }
            console.log('Transaction Complete.');
            return res.send({
              error: err,
              data: result,
              message: 'Entry Successful!'
            });
          });         
        });       
      });
    });
  });
}

module.exports.gettagdata = function (req, res) {
  const tagid = req.params.tagid
  console.log(tagid)

  //SQL query to fetch tag information with recent inspected date data.
  const queryString = `SELECT  l.tagid, i.serial_no, i.manufacturer, i.model, i.variant,  i.colour, l.label, l.localid as Identification, l.clinic, l.building, l.department, l.location, t.touch_test, t.xray_test, t.testremarks, t.test_status, DATE (t.test_date) as Test_Date, t.check_interval, DATE(l.nextinspdate) as Next_Check, t.comments
  FROM item_data i, location_data l, test_data t
  WHERE i.serial_no = l.serial_no AND l.tagid = t.tagid AND t.tagid IN (?) AND t.test_date = (SELECT MAX(x.test_date) FROM test_data x WHERE x.tagid = t.tagid)`
  connection.query(queryString, [tagid], (err, result, fields) => {

    if (err) {
      console.log("Failed to query " + err)
      res.sendStatus(500)
      return
    } 
    //Condition to check if response set is null or not.
    if (!result.length){
     return res.send({
    error: "TagID not present in database."
    });     
    }
    else
    return res.json({
      TagData: result
    })
  
  })
}


module.exports.updatetagdata = function (req, res) {

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

  var queryString = 'INSERT INTO inspection (tagid, equipment_status, inspdate, remarks, username) VALUES (?, ?, now(), ?, ?)'


  connection.beginTransaction(function (err) {
    if (err) {
      throw err;
    }
    connection.query(queryString, [tagid, equipment_status, remarks, username], function (err, result) {
      if (err) {
        connection.end();
        connection.rollback(function () {
          throw err;
        });
        return res.send({
          error: err,
          data: result,
          message: 'Entry Unsuccessful!'
        });
      }

      var query1 = "UPDATE registration SET nextinspdate = ? WHERE tagid =?"

      connection.query(query1, [newinspdate, tagid], function (err, result) {
        if (err) {
          connection.rollback(function () {
            throw err;
          });
        }
        connection.commit(function (err) {
          if (err) {
            connection.rollback(function () {
              throw err;
            });
          }
          console.log('Transaction Complete.');
          return res.send({
            error: false,
            data: result,
            message: 'Entry Successful!'
          });
        });
      });
    });
  });
}



module.exports.getreport = function (req, res) {
  console.log(req.body)
  //body content
  // {
  //      "fromdate":"2018-11-20",
  //	"todate": "2018-11-25"
  // }
  var fromdate = req.body.fromdate;
  var todate = req.body.todate;

  const queryString = " select @a:=@a+1 as SNo, r.tagid as TagID, r.labelling as Label, Date (i.inspdate) as Inspection_Date, i.equipment_status as Test_Result, i.remarks as Remarks, i.username as User from registration r JOIN inspection i,(select @a:=0) initvars where r.tagid = i.tagid AND (i.inspdate between ? AND ?)"
  connection.query(queryString, [fromdate, todate], (err, result, fields) => {

    if (err) {
      console.log("Failed to query " + err)
      res.sendStatus(500)
      return
    }
    console.log("Fetch Succesful")
    //res.json(rows)

    return res.send({
      error: false,
      data: result,
      message: 'Fetch Successful!'
    });
  })
}

module.exports.updateolddata = function (req, res) {
   console.log(req.body)
  
    var jsondata = req.body;
    var values = [];
     
     for(var i=0; i< jsondata.length; i++)
     values.push([jsondata[i].tagid,jsondata[i].Test_Result, jsondata[i].Inspection_Date, jsondata[i].Remarks, jsondata[i].User])

  const queryString ="INSERT INTO inspection(tagid,equipment_status,inspdate,remarks,username) VALUES ?"
  connection.query(queryString, [values], (err, result, fields) => {

    if (err) {
      console.log("Failed to query " + err)
      res.sendStatus(500)
      return
    }
    console.log("Entry Succesful")
    //res.json(rows)

    return res.send({
      error: false,
      data: result,
      message: 'Entry Successful!'
    });
  })
}