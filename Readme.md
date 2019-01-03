# RFID Project
> A Digital Engineering Inter Disciplinary team project that involves inventory management of radiology equipments at University Klinikum using modern and scalable web architecture and tools.

## Installation
Have the below dependencies installed globally on your machine. `sudo` permission required to execute below installation commands in Linux.
```sh
$ npm install forever --global
$ npm install nodemon --global
```

## Development setup
This project is built using Node-JS. 
```sh
clone or download the repository
$ cd project_directory
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

    Response Sample: {
                        "error": null,
                        "data": {
                        "fieldCount": 0,
                        "affectedRows": 1,
                        "insertId": 0,
                        "serverStatus": 3,
                        "warningCount": 0,
                        "message": "",
                        "protocol41": true,
                        "changedRows": 0
                        },
                        "message": "Entry Successful!"
                    }

## URL: /api/app/gettagdata/:tagid
    METHOD : GET
    DESCRIPTION: The end point to fetch the data for individual tagid.

Requests can also be sent using be below format where the tagid's are separated by a ',' to get response at once.
```ssh
http://localhost:1080/api/app/gettagdata/tagid1,tagid2
```
	
    Response Sample: {"TagData": [{
							"tagid": "112233445566778899",
							"serial_no": "167260000012",
							"manufacturer": "Mavig",
							"model": "RA660",
							"variant": "M",
							"colour": "Indian Summer",
							"label": "Prox X-Ray",
							"Identification": "KRN-001",
							"clinic": "Radiologie",
							"building": "60a",
							"department": "Angio",
							"location": "Angio 3 / Raum 123",
							"touch_test": "ok",
							"xray_test": "ok",
							"testremarks": "NA",
							"test_status": "Pass",
							"Test_Date": "2018-12-15",
							"check_interval": "12 Months",
							"Next_Check": "2019-12-02",
							"comments": "Everything is good."
							"File_name": "111133B2DDD9014000000000-1545848806245.jpg",
      						"File_path": "./public/uploads/26-12-2018/"
						}]
					}


## URL: /api/app/updatetagdata
    METHOD : POST
    DESCRIPTION: To update tag relavent data post inspection.
	Request Sample: {
					"tagid" : "112233445566778899",
					"touch_test" : "ok",
					"xray_test" : "ok",
					"testremarks" : "ok",
					"test_status" : "Pass",
					"user_name"  : "kalva",
					"check_interval" : "14 Months",
					"comments" : "Good Condition",
					"nextinspdate" : "2020-12-16"
					}

	Response Sample: {
					"error": false,
					"message": "Entry Successful!"
					}

## URL: /api/getreport
	METHOD : POST
	DESCRIPTION: Endpoint to fetch inspection data over a period of time between two date ranges. 

	Request Sample: {
  					"fromdate":"2018-11-20 00:00:00",
  					"todate": "2018-11-25 23:59:59"
  					}

## URL: /api/getdayreport/:date
	METHOD: GET
	DESCRIPTION: Endpoint to fetch details of inspected items on a given date supplied in the URL


## URL: /app/imageupload/:tagid
    METHOD : POST
    DESCRIPTION: To upload images corresponding to the supplied tagID.

	Response Sample: {
					"message": "Upload Successful!"
					}

	Respective details also stored in DB.


## URL: /api/app/images/:public/:uploads/:folder/:file_name
    METHOD : GET
    DESCRIPTION: The end point to fetch stored images per individual tagid.

	Its a combination of File_path + File_name
```ssh
URL Example: /api/app/images/public/uploads/26-12-2018/111133B2DDD9014000000000-1545848806245.jpg
```

## URL: /api/authenticate
	METHOD : POST
    DESCRIPTION: Authenticate user with stored password.
	Request Sample: {
    				"username": "username",
    				"password": "password"
    				}

	Response Sample: {
 					 "status":"true",
                     "message": "Successful"
					}

					OR

					{
 					 "status":"false",
                     "message": "Mismatch"
					}

					OR

					{
 					 "status":"false",
                     "message": "No User"
					}


## URL: /api/register
	METHOD : POST
    DESCRIPTION: API for user registration	

	Request Sample: {
					"email": "email@ovgu.de",
					"name": "Name",
					"username": "username",
					"password": "password"
					}


## URL: /api/unamecheck/:username
	METHOD : GET
	Description: Endpoint to check is supplied username is present in existing data.

	Response Sample: {
					"result": 1
					}
					When the username already exists

					{
					"result": 0
					}
					When the username is not taken

## URL: /api/user/changepassword
	METHOD : POST
	Description: Endpoint for changing password for given username.

	Request Sample: {
					"username": "username",
					"password": "password"
					"newpassword": "newpassword"
					}

	Response Sample: {
                       status: true,
                       message: "Update successful"
                       }

					   OR

					   {
                        status: false,
                        message: "Wrong password"
                    	}