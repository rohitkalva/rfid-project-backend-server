const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')
const mysql = require('mysql')
const Client = require('ssh2').Client;
const ssh = new Client();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))

app.use(morgan('combined'))

const db = new Promise(function(resolve, reject){
	ssh.on('ready', function() {
	  ssh.forwardOut(
	    // source address, this can usually be any valid address
	    'localhost',
	    // source port, this can be any valid port number
	    3333,
	    // destination address (localhost here refers to the SSH server)
	    '165.227.137.107',
	    // destination port
	    22,
	    function (err, stream) {
	      if (err) throw err; // SSH error: can also send error in promise ex. reject(err)
	      // use `sql` connection as usual
	      	const connection = mysql.createConnection({
	          host     : '127.0.0.1',
	          user     : 'root',
              password : 'Komrc@94', 
              database: 'mysql',
	          stream: stream
	        });

	        // send connection back in variable depending on success or not
		connection.connect(function(err){
			if (!err) {
				resolve(connection)
			} else {
				reject(err)
			}
		});
	  });
	}).connect({
	  host: '165.227.137.107', //IP address where DB is hosted
	  port: 22,               //Port refering to the IP 
	  username: 'root',       //username to loginto the host  
	  password: 'rohitkalva'  //password to log into host
    });
});

//Retrieve route
app.get('/users', (req, res) => {
    //console.log("Fetching user with id: " + req.params.id)

const queryString = "SELECT * FROM user"

connection.query(queryString, (err, rows, fields) => {

    if(err){
        console.log("Failed to query " + err)
        res.sendStatus(500)
        return
    }
    console.log("Fetch Succesful")
    res.json(rows)
})
})


app.listen(3000, () => {
    console.log("Server is up and listerning on port 3000")
})
