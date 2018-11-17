var Cryptr = require('cryptr');
const express = require('express')
const app = express();
var connection = require('./../config');

// cryptr = new Cryptr('myTotalySecretKey');
 
module.exports.register=function(req,res){

//Input Type
//{
//	"name": "Rohit Kalva",
//	"username": "rohit",
//	"email": "rohitk@ovgu.de",
//	"password": "rohit"
//}

    var today = new Date();
  var encryptedString = cryptr.encrypt(req.body.password);
    var users={
        "name":req.body.name,
        "username":req.body.username,
        "email":req.body.email,
        "password":encryptedString,
        "created_at":today
    }
        connection.query('INSERT INTO users SET ?',users, function (error, results, fields) {
      if (error) {
        res.json({
            status:false,
	    data: results,
            message:'User already exists'
        })
      }else{
          res.json({
            status:true,
            data:results,
            message:'user registered sucessfully'
        })
      }
    });
}
