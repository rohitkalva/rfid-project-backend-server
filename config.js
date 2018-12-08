var mysql = require('mysql');

var connection = mysql.createConnection({
		host: '141.44.18.16',
		port: 3306,
        user: 'inka',
        password: '#inkaOvgu2018',
        database: 'rfid',
        dateStrings: true
})

// Old Server access
// var connection = mysql.createConnection({
//     host: '46.101.232.21',
//     port: 3306,
//     user: 'rfid',
//     password: 'Rfid@123',
//     database: 'rfid',
//     dateStrings: true
// })

connection.connect(function (err) {
    if (!err) {
        console.log("Database is connected");
    } else {
        console.log("Error while connecting with database");
    }
});
module.exports = connection; //exporting connection