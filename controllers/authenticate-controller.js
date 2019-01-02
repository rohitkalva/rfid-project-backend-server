var Cryptr = require('cryptr');
cryptr = new Cryptr('myTotalySecretKey');

var connection = require('./../config');
module.exports.authenticate = function (req, res) {
    var username = req.body.username;
    var password = req.body.password;

    //Input format 
    //{
    //	"username": "username",
    //	"password": "password"
    //}

    connection.query('SELECT * FROM users WHERE username  = ?', [username], function (error, results, fields) {
        if (error) {
            res.json({
                status: false,
                message: 'Connection error'
            })
        } else {

            if (results.length > 0) {
                decryptedString = cryptr.decrypt(results[0].password);
                if (password == decryptedString) {
                    res.json({
                        status: true,
                        message: 'Successful'
                    })
                } else {
                    res.json({
                        status: false,
                        message: "Mismatch"
                    });
                }

            } else {
                res.json({
                    status: false,
                    message: "No User"
                });
            }
        }
    });
}

module.exports.passchange = function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var newpass = cryptr.encrypt(req.body.newpassword);

    //Input format 
    //{
    //	"username": "username",
    //	"password": "password"
    //  "newpassword": "newpassword"
    //}

    connection.query('SELECT * FROM users WHERE username  = ?', [username], function (error, results, fields) {
        if (error) {
            res.json({
                status: false,
                message: 'Connection error'
            })
        } else {

            if (results.length > 0) {
                decryptedString = cryptr.decrypt(results[0].password);
                if (password == decryptedString) {
                    connection.query('UPDATE users SET password = ? WHERE username =? ',[newpass, username], function(error,results,fields){
                        return res.json({
                            status: true,
                            message: "Update successful"
                        })
                    })
                } else {
                    res.json({
                        status: false,
                        message: "Wrong password"
                    });
                }

            } 
        }
    });
}