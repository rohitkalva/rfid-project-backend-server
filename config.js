var mysql = require('mysql');

var connection = mysql.createConnection({
		host: '', // Host IP Address
		port: 3306,
        user: '', //DB username
        password: '', //DB password
        database: 'rfid_project',
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
