/* 
BED Assignment CA1
-   Name: Lee Quan Jun Ervin
-   Class: DISM/FT/2B/21
-   Filename: app.js
-   Description: This file is where all the endpoints are stored (Tested using POSTMAN)

# TABLES CREATED
- user
- flight
- airport
- booking
- promotion
- transfer

# FOREIGN KEYS USED
.
.
.

# SUMMARY OF ENDPOINTS CREATED
1. Endpoint 1 - POST /users/
2. Endpoint 2 - GET /users/
3. Endpoint 3 - GET /users/:id
4. Endpoint 4 - PUT /users/:id
5. Endpoint 5 - POST /airport
6. Endpoint 6 - GET /airport
7. Endpoint 7 - POST /flight
8. Endpoint 8 - GET /flightDirect/:originAirportId/:destinationAirportId
9. Endpoint 9 - POST /booking/:userid/:flightid
10. Endpoint 10 - DELETE /flight/:id/
11. Endpoint 11 - GET /transfer/flight/:originAirportId/:destinationAirportId
12. Endpoint 12 - POST /transfer/flight/

# BONUS REQUIREMENTS FUFILLMENT
- Additional endpoints related to handling a database for transfer flights

- Implementation of Multer in app.js to support uploading of image files into form-data in POSTMAN
    > File size limited to 1MB, otherwise error will be outputted
    > Only JPG and PNG files are accepted, using fileFilter function in Multer object and comparing with file mimetype
    > Feature is only available for user endpoints

- Endpoints related to promotional discounts for certain periods
    13. Endpoint 13 - POST /promotions/:flightid - Create a new promotion
    14. Endpoint 14 - GET /promotions - Get all promotions
    15. Endpoint 15 - GET /promotions/:promotionid - Get promotion by promotionid
    16. Endpoint 16 - DELETE /promotion/:promotionid - Delete a promotion by promotionid


# ADVANCED FEATURES IMPLEMENTATIONS
1. Checking out booked flights (applying promotional discounts if there are any) [booking table modified from requirements]
    > Create new checkout table
    > Apply and validate promotions based on date of booking and promotion period
    > User can select a class (First, Business, Economy)
    > Calculate price based on class seat booked
        + Flight prices are default economy
        + Business class seats will be 30% more expensive than economy class
        + First class seats will be 100% more expensive than economy class seats
        + Users will book the same class seat for both transfer flights
        
    > Class is inputted from request body and will appear in the checkout
    > Final price will be calculated and written to the checkout database
    > Checkout can be retreived to view transcations and payment information

2. Search for cheap flights based on origin and destination city [GET /searchCheapFlights/:originAirportId/:destinationAirportId/:transfer]
    > Cheap flight tickets are priced $500 or lower
    > Flights are filtered based on this condition
    > Transfer flights are searched separately by the parameter (yes, no)
    > Yes = Search transfer flights, No = Search flights without transfers

3. Search for all flights by airline [GET /searchAirline/:airlineCode/:transfer]
    > Transfer flights are searched separately

- Searching for cheap flights based on origin and destination city [GET /searchCheapFlights/:originAirportId/:destinationAirportId]

*/

// Libraries and Objects to import
var express = require("express")                    // Loading the express library
var app = express()                                 // Creation of the express instance
var user = require("../model/user.js")              // Load code from user.js
var airport = require("../model/airport.js")        // Load code from airport.js
var flight = require("../model/flight.js")          // Load code from flight.js
var booking = require("../model/booking.js")        // Load code from booking.js
var bodyParser = require("body-parser")             // Load body parser library


var urlencodedParser = bodyParser.urlencoded({extended: true})      // Parse HTTP POST data
const multer = require("multer")                                    // Load multer library for image file uploads


// Multer: middleware responsible for handling multipart/form-data used for uploading images to database
// Image Uploading Feature with Multer 
var storage = multer.diskStorage({
    // Decide which folder to save the file to
    destination: (req, file, callback) => {
        callback(null, "./uploads")
    },
    // Name to uploaded file within the destination
    filename: (req, file, callback) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-')
        callback(null, fileName)
    }
})

// Multer handles the uploading of image file
const upload = multer({
    dest: 'uploads/',               // Destination path of uploaded file
    storage: storage,               // Where to store the uploaded file
    limits: {fileSize: 1000000},    // File size limit of 1MB

    // Function to decide which files to accept or reject based on file types supported
    // Outputs errors into content if file is too large or invalid image file format 
    fileFilter: (req, file, callback) => {
        filetypes = ['image/png', 'image/jpeg', 'image/jpg']
        if (filetypes.includes(file.mimetype)) {
            callback(null, true)
        } else {
            callback(null, false)
            return callback(new Error("Only image files allowed!"))
        }
    }
})

// Body Parser
app.use(bodyParser.json())          // Parse application/json
app.use(express.json())
app.use(urlencodedParser)           // Parse application/x-www-form-urlencoded

// Endpoint #1: Using the POST method to add a new user to the database
app.post("/users/", upload.single('profile_pic_url'), (req, res) => {

    // Retrieve POST data field representing columns of data from the user table
    var username = req.body.username
    var email = req.body.email
    var contact = req.body.contact
    var password = req.body.password
    var role = req.body.role
    
    // Log all user data requested
    console.log("[REQUEST BODY]")
    console.log(req.body)

    // Check if file exists
    if (!req.file) {
        console.log("IMAGE NOT FOUND")
        res.status(500).send("Please upload an image")
    } else {
        console.log("[IMAGE CONTENTS]")
        console.log(req.file)
        // Set the profile pic URL to the file path and link 
        var profile_pic_url = './uploads/' + req.file.originalname.toLowerCase().split(' ').join('-')
        // Function to add a new user and its data fields into the database
        user.addUser(username, email, contact, password, role, profile_pic_url, (err, result) => {
            // Checking for errors. Output erorr code 500 if error detected
            if (!err) {
                // Responds by sending the result insertId (primary key) via a JSON string 
                console.log("Inserted userid: " + result.insertId)
                res.status(201).send(JSON.stringify({'userid': result.insertId}))   // Return error code 201
            } else if (err.errno == 1062) {
                // Checking for duplicate error of input data
                console.log("[ERROR DETECTED] 422")
                console.log("[422] Duplicate Entry Detected.")
                res.status(422).send("[422] Unprocessable Entity (Duplicated Entry Detected)")
            } else {
                console.log("[ERROR DETECTED] 500")
                res.status(500).send("[500] Unknown Error")
            }
        })
    }


})

// Endpoint #2: Using the GET method to get array of all users from the database
app.get("/users/", (req, res) => {
    user.getAllUsers((err, result) => {
        if (!err) {
            res.status(200).send(result)    // Return error code 200 and send the result over to POSTMAN
        } else {
            console.log("[ERROR DETECTED] 500")
            res.status(500).send("[500] Unknown Error.")
        }
    })
})

// Endpoint #3: Using the GET method to retrieve user data by userid
app.get("/users/:id", (req, res) => {
    // Retrieve the userid from the request parameters
    var userid = req.params.id
    user.getUserByID(userid, (err, result) => {
        // Check for errors
        if (!err) {
            res.status(200).send(result)    // Return error code 200 and send the result over to POSTMAN
        } else {
            console.log("[ERROR DETECTED] 500")
            res.status(500).send("[500] Unknown Error")
        }
    })
})

// Endpoint #4: Using the PUT method to update user data by userid
app.put("/users/:id", upload.single('profile_pic_url'), (req, res) => {

    // Get user data from request parameters
    var userid = req.params.id
    var username = req.body.username
    var email = req.body.email  
    var contact = req.body.contact
    var password = req.body.password
    var role = req.body.role

    console.log("[REQUEST BODY]")
    console.log(req.body)

    // Check if file exists
    if (!req.file) {
        console.log("IMAGE NOT FOUND")
        res.status(500).send("Please upload an image")  // Returns an error if image is not uploaded to POSTMAN form-data
    } else {
        // Output the contents of the image file object if upload detected
        console.log("[IMAGE CONTENTS]")
        console.log(req.file)
        // Set the profile pic URL to the file path and link 
        var profile_pic_url = './uploads/' + req.file.originalname.toLowerCase().split(' ').join('-')
    }

    // Initiate function to update user by userid
    user.updateUserByID(userid, username, email, contact, password, role, profile_pic_url, (err, result) => {
        // Check for errors
        if (!err) {
            res.status(204).send(result)    // Return error code 204
        } else if (err.errno == 1062) {
            console.log("[ERROR DETECTED] 422")
            console.log("[422] Duplicate Entry Detected.")
            res.status(422).send("[422] Unprocessable Entity (Duplicated Entry Detected)")
        } else {
            console.log("[ERROR DETECTED] 500")
            res.status(500).send("[500] Unknown Error")
        }
    })
})

// Endpoint #5: Using the POST method to insert a new airport and its data into the database
app.post("/airport/", (req, res) => {
    // Retrieve POST data field representing columns of airport table in sp_air database
    var name = req.body.name
    var country = req.body.country
    var description = req.body.description
    console.log("[REQUEST BODY]")
    console.log(req.body)

    // Initiate addAirport function to add new airport data into airport table
    airport.addAirport(name, country, description, (err, result) => {
        if (!err) {
            res.status(204).send(result)
        } else if (err.errno == 1062) {
            // Output error code 422 if duplicate entries found in database
            console.log("[ERROR DETECTED] 422")
            console.log("[422] Duplicate Entry Detected.")  
            res.status(422).send("[422] Unprocessable Entity (Duplicated Entry Detected)")
        } else {
            console.log("[ERROR DETECTED] 500")
            res.status(500).send("[500] Unknown Error")
        }
    })
})

// Endpoint #6: Using the GET method to extract all data from the airport database
app.get("/airport/", (req, res) => {
    // Retreive airport request body data
    airport.getAllAirports((err, result) => {
        if (!err) {
            res.status(200).send(result)
        } else {
            console.log("[ERROR DETECTED] 500")
            res.status(500).send("[500] Unknown Error")
        }
    })
})

// Endpoint #7: Using the POST method to add new flight data to the flight database
app.post("/flight/", upload.single("flight_pic_url"), (req, res) => {
    // Retrieve POST flight data from request body
    var flightCode = req.body.flightCode
    var aircraft = req.body.aircraft
    var originAirport = req.body.originAirport
    var destinationAirport = req.body.destinationAirport
    var embarkDate = req.body.embarkDate
    var travelTime = req.body.travelTime
    var price = req.body.price
    // Check if file exists
    if (!req.file) {
        console.log("IMAGE NOT FOUND")
        res.status(500).send("Please upload an image")  // Returns an error if image is not uploaded to POSTMAN form-data
    } else {
        // Output the contents of the image file object if upload detected
        console.log("[IMAGE CONTENTS]")
        console.log(req.file)
        // Set the profile pic URL to the file path and link 
        var flight_pic_url = './uploads/' + req.file.originalname.toLowerCase().split(' ').join('-')
        // Function to create a flight in the flight database
        flight.newFlight(flightCode, aircraft, originAirport, destinationAirport, embarkDate, travelTime, price, flight_pic_url, (err, result) => {
            // Check if file exists
            if (!req.file) {
                console.log("IMAGE NOT FOUND")
                res.status(500).send("Please upload an image")  // Returns an error if image is not uploaded to POSTMAN form-data
            } else {
                // Output the contents of the image file object if upload detected
                console.log("[IMAGE CONTENTS]")
                console.log(req.file)
                // Set the profile pic URL to the file path and link 
                var profile_pic_url = './uploads/' + req.file.originalname.toLowerCase().split(' ').join('-')
            }
            
            if (!err) {
                console.log("Inserted flightid " + result.insertId)
                res.status(201).send(JSON.stringify({'flightid': result.insertId }))   // Return error code 201
            } else {
                console.log("[ERROR DETECTED] 500")
                res.status(500).send("[500] Unknown Error")
            }
        })
    }
})

// Endpoint #8: Using the GET method to retrieve flight information travelling from origin to destination airport
app.get("/flightDirect/:originAirportId/:destinationAirportId", (req, res) => {
    // Get parameters (originAirportID and destinationAirportId)
    var originAirportId = req.params.originAirportId
    var destinationAirportId = req.params.destinationAirportId

    // Function to search for flights with the inputted origin and destination airport
    flight.findFlight(originAirportId, destinationAirportId, (err, result) => {
        if (!err) {
            console.log("Found a flight!")
            console.log(result)
            res.status(201).send((result[result.length - 1]))
        } else {
            console.log("[ERROR DETECTED]")
            res.status(500).send("[500] Unknown Error")
        }
    })
})

// Endpoint #9: Using the POST method to add a new booking to the booking database
app.post("/booking/:userid/:flightid", upload.single(), (req, res) => {
    // Get request parameters
    var userid = req.params.userid
    var flightid = req.params.flightid

    // Get booking information from request body data 
    var name = req.body.name
    var passport = req.body.passport
    var nationality = req.body.nationality
    var age = req.body.age

    booking.newBooking(name, passport, nationality, age, userid, flightid, (err, result) => {
        if (!err) {
            console.log("Booked a flight!")
            res.status(201).send({bookingId: `${result.insertId}`})
        } else if (err.errno == 1452) {
            console.log("Foreign Key Contraint Failed!")
            res.status(500).send("[500] Foreign Key Constraint Failed")
        } else {
            console.log("[ERROR DETECTED]")
            res.status(500).send("[500] Unknown Error")
        }
    })
})

// Endpoint #10: Using the DELETE method to delete flights and associated bookings by flightid
app.delete("/flight/:id", (req, res) => {
    // Get flightid from request parameters
    var flightid = req.params.id

    // Function to delete a flight from the flight database
    flight.deleteFlight(flightid, (err, result) => {
        if (!err) {
            res.status(200).send({"Message":"Deletion Successful!"})
        } else {
            res.status(500).send("[500] Unknown Error")
        }
    })
})

// Endpoint #11: Retrieve data of all flights from origin airport to destination airport with one transfer
app.get("/transfer/flight/:originAirportId/:destinationAirportId", (req, res) => {

    // Get originAirportId and destinationAirportId from request parameters
    var originAirportId = req.params.originAirportId
    var destinationAirportId = req.params.destinationAirportId

    // Function to get transfers
    flight.getTransfers(originAirportId, destinationAirportId, (err, result) => {
        if (err) {
            res.status(500).send("[500] Unknown Error")
        } else if ((result[result.length - 1])[0].firstFlightId == null) {
            res.status(500).send("No transfer flights available from your search query!")
        } else {
            res.status(200).send(result[result.length-1])
        }
    })
})


// Endpoint #13: Using the POST method to create a new promotion on the promotion database
app.post("/promotion/", (req, res) => {
    // Function to add a new promotion and their dates into the promotion database
    if (!err) {
        res.status(201).send(result)
    } else {
        res.status(500).send("[500] Unknown Error")
    }
})


// Export app over to the main server.js file
module.exports = app