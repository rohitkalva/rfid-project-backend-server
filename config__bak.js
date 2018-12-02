var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'rfid',
    password: 'rfidproject',
    database: 'rfid',
    dateStrings: true
})

connection.connect(function (err) {
    if (!err) {
        console.log("Database is connected");
    } else {
        console.log("Error while connecting with database");
    }
});
module.exports = connection; //exporting connection