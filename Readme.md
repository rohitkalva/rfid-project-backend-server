# RFID Project
> A Digital Engineering Inter Disciplinary team project that involves inventory management of radiology equipments at University Klinikum using modern and scalable web architecture and tools.

## Installation
Have the below dependencies installed globally on your machine.
```sh
$ npm install forever --global
$ npm install nodemon --global
```

## Development setup
This project is built using Node-JS. 
```sh
clone or download the repository
$ cd project directory
$ npm install
$ npm start
```
`npm start` will run the program with nodemon dependency. All the interactions can be seen on the terminal window.

To run the application without interruption use 
```sh
$ forever start app.js
```

To stop the running instance with forever
```sh
$ forever stop app.js
```

# List of API end-points

The response samples as presented here are basically sample of the response and the size of the real response are in exponential of what is made available in this documentation

## URL: /api/registration
    METHOD : POST
    DESCRIPTION: To store registration data for new equipments.
    Request Sample:  {
					 "manufacturer" : "GE",
					 "model" : "RA660", 
					 "variant" : "M",
					 "serial_no" : "1",
					 "lead_front" : "0.25",
					 "lead_back" : "0.35",
					 "year_of_mfg" : "2018",
					 "colour" : "Red",
					 "size" : "XL",
					 "length" : "100 cm",
					 "tagid" : "1122334455",
					 "label" : "Prof X-Ray",
					 "localid" : "KW-001122",
					 "clinic" : "Radiology",
					 "building" : "60a",
					 "department" : "Angio",
					 "location" : "Raum 123",
					 "nextinspdate" : "2021-12-12",
					 "user_name" : "kalva"
                    }


