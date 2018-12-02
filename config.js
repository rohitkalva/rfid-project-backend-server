var mysql = require('mysql2');
var Client = require('ssh2').Client;
var ssh = new Client();

var connection = new Promise(function(resolve, reject){
	ssh.on('ready', function() {
	  ssh.forwardOut(
	    // source address, this can usually be any valid address
	    '127.0.0.1',
	    // source port, this can be any valid port number
	    12345,
	    // destination address (localhost here refers to the SSH server)
	    '127.0.0.1',
	    // destination port
	    3306,
	    function (err, stream) {
	      if (err) throw err; // SSH error: can also send error in promise ex. reject(err)
	      // use `sql` connection as usual
	        var sql = mysql.createConnection({
            host: 'localhost',
            user: 'rfid',
            password: 'rfidproject',
            database: 'rfid',
            dateStrings: true,
	        stream: stream
	        });

	        // send connection back in variable depending on success or not
		sql.connect(function(err){
			if (err) {
				resolve(sql);
			} else {
				reject(err);
			}
		});
	  });
	}).connect({
	  host: '46.101.232.21',
	  port: 22,
	  username: 'root',
	  password: 'rfidproject'
	});
});

module.exports = connection;