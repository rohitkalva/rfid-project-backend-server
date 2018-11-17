var Cryptr = require('cryptr');
cryptr = new Cryptr('myTotalySecretKey');
 
var connection = require('./../config');
module.exports.authenticate=function(req,res){
    var username=req.body.username;
    var password=req.body.password;
  
//Input format 
//{
//	"username": "rohit",
//	"password": "roht"
//}
   
    connection.query('SELECT * FROM users WHERE username  = ?',[username], function (error, results, fields) {
      if (error) {
          res.json({
            status:false,
            message:'there are some error with query'
            })
      }else{
       
        if(results.length >0){
  decryptedString = cryptr.decrypt(results[0].password);
            if(password==decryptedString){
                res.json({
                    status:true,
                    message:'successfully authenticated'
                })
            }else{
                res.json({
                  status:false,
                  message:"Email and password does not match"
                 });
            }
          
        }
        else{
          res.json({
              status:false,    
            message:"User does not exit"
          });
        }
      }
    });
}