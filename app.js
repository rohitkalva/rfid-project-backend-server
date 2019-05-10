const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')
var connection = require('./config');
var fs = require('fs');
const http = require('http');
const fb = require('./index.js');
const path = require('path');

//Code for file browser. Reference: https://github.com/sumitchawla/file-browser
fb.configure({
    removeLockString: true,

    /*
     * Example of otherRoots.
     * The other roots are listed and displayed, but their
     * locations need to be calculated by the server.
     * See OTHERROOTS in the app.
     */
    otherRoots: [ '/tmp', '/broken' ]
});

function checkValidity(argv) {
  if (argv.i && argv.e) return new Error('Select -i or -e.');
  if (argv.i && argv.i.length === 0) return new Error('Supply at least one extension for -i option.');
  if (argv.e && argv.e.length === 0) return new Error('Supply at least one extension for -e option.');
  return true;
}

var argv = require('yargs')
  .usage('Usage: $0 <command> [options]')
  .command('$0', 'Browse file system.')
  .example('$0 -e .js .swf .apk', 'Exclude extensions while browsing.')
  .alias('i', 'include')
  .array('i')
  .describe('i', 'File extension to include.')
  .alias('e', 'exclude')
  .array('e')
  .describe('e', 'File extensions to exclude.')
  .alias('p', 'port')
  .describe('p', 'Port to run the file-browser. [default:8088]')
  .help('h')
  .alias('h', 'help')
  .check(checkValidity)
  .argv;

var dir =  process.cwd();
app.get('/b', function(req, res) {
    let file;
    if (req.query.r === '/tmp') {

        /*
         * OTHERROOTS
         * This is an example of a manually calculated path.
         */
        file = path.join(req.query.r,req.query.f);
    } else {
        file = path.join(dir,req.query.f);
    }
    res.sendFile(file);
})


app.use(express.static(__dirname)); // module directory
console.log(__dirname + "\\public\\uploads")
var server = http.createServer(app);

fb.setcwd(dir, argv.include, argv.exclude);

if(!argv.port) argv.port = 1080;


// eslint-disable-next-line no-console
console.log("Please open the link in your browser http://localhost:" +
            argv.port);

app.get('/files', fb.get);

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))

//Main code
app.use(morgan('short'))

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

var registerController = require('./controllers/register-controller');
var authenticateController = require('./controllers/authenticate-controller');
var dataController = require('./controllers/data-controller')

app.post('/api/register', registerController.register); //user registration
app.post('/api/authenticate', authenticateController.authenticate); //user authentication
app.post('/api/app/gettagdata', dataController.gettagdata); //get tag data in the app
app.post('/api/registration', dataController.registration_data); //new equipment registration
app.post('/api/app/updatetagdata', dataController.updatetagdata); //update tag data post inspection
app.post('/api/getreport', dataController.getreport); //fetch report between date ranges
app.post('/api/futureinspection', dataController.futureinspection); //fetch report for future inspections
app.post('/app/imageupload/:tagid', dataController.imageupload) //Post API to upload image
app.get('/api/app/images/:public/:uploads/:folder/:file_name', dataController.imagedownload) // GET API for image download
app.post('/api/updateolddata', dataController.updateolddata)
app.get('/api/unamecheck/:username', dataController.unamecheck) //Endpoint to validate username during new user creation
app.post('/api/user/changepassword', authenticateController.passchange) //Endpoint to update or modify userpassword
app.get('/api/getdayreport/:date', dataController.getdayreport) //Endpoint to fetch inspection records for given date
app.get("/file-browser", (req, res) => {res.redirect('lib/template.html')}) //Routing for file-browser within webbrowser

//Default Route
app.get("/", (req, res) => {
    console.log("Responding to root route")
    res.send("Hello from ROOOOT")
})

app.get('/pingcheck', (req,res) => {
    res.json({
        message: "I am alive"
      })
})
// app.get('/users', (req, res) => {
//     //console.log("Fetching user with id: " + req.params.id)

// const queryString = "SELECT * FROM reg"

// connection.query(queryString, (err, rows, fields) => {

//     if(err){
//         console.log("Failed to query " + err)
//         res.sendStatus(500)
//         return
//     }
//     console.log("Fetch Succesful")
//     res.json(rows)
// })
// })

app.listen(1080, () => {
    console.log("Server is up and listerning on port 1080")
})