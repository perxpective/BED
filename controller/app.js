/* 
BED Assignment CA1
-   Name: Lee Quan Jun Ervin
-   Class: DISM/FT/2B/21
-   Filename: app.js
-   Description: This node.js script is where all the express API endpoints are stored (Tested using POSTMAN)
*/

// Libraries and Objects to import
var express = require("express")                    // Loading the express library
var app = express()                                 // Creation of the express instance

// Import codes from other model files
const user = require("../model/user.js")              // Load code from user.js
const airport = require("../model/airport.js")        // Load code from airport.js
const flight = require("../model/flight.js")          // Load code from flight.js
const booking = require("../model/booking.js")        // Load code from booking.js
const promotion = require("../model/promotion.js")    // Load code from promotion.js

const bodyParser = require("body-parser")             // Load body parser library

const urlencodedParser = bodyParser.urlencoded({extended: true})    // Parse HTTP POST data
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
        // List of image file types allowed
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
        res.status(500).send({ "Error Message": "Please upload an image!" })
    } else {
        console.log("[IMAGE CONTENTS]")
        console.log(req.file)
        // Set the profile pic URL to the file path and link 
        var profile_pic_url = 'http://localhost:8081/uploads/' + req.file.originalname.toLowerCase().split(' ').join('-')
        // Function to add a new user and its data fields into the database
        user.addUser(username, email, contact, password, role, profile_pic_url, (err, result) => {
            // Checking for errors. Output erorr code 500 if error detected
            if (!err) {
                // Responds by sending the result insertId (primary key) via a JSON string 
                console.log("Inserted userid: " + result.insertId)
                res.status(201).send({'userid': result.insertId})   // Return error code 201
            } else if (err.errno == 1062) {
                // Checking for duplicate error of input data
                console.log("[ERROR DETECTED] 422")
                console.log("[422] Duplicate Entry Detected.")
                res.status(422).send({"Error Message":"[422] Unprocessable Entity (Duplicated Entry Detected)"})
            } else {
                console.log("[ERROR DETECTED] 500")
                res.status(500).send({ "Error Message": "[500] Unknown Error" })
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
            res.status(500).send({ "Error Message": "[500] Unknown Error" })
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
            res.status(500).send({ "Error Message": "[500] Unknown Error" })
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
        var profile_pic_url = 'http://localhost:8081/uploads/' + req.file.originalname.toLowerCase().split(' ').join('-')
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
            res.status(500).send({ "Error Message": "[500] Unknown Error" })
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
            res.status(204).send()
        } else if (err.errno == 1062) {
            // Output error code 422 if duplicate entries found in database
            console.log("[ERROR DETECTED] 422")
            console.log("[422] Duplicate Entry Detected.")  
            res.status(422).send({"Error Message" : "[422] Unprocessable Entity (Duplicated Entry Detected)"})
        } else {
            console.log("[ERROR DETECTED] 500")
            res.status(500).send({ "Error Message": "[500] Unknown Error" })
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
            res.status(500).send({ "Error Message": "[500] Unknown Error" })
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
        var flight_pic_url = 'http://localhost:8081/uploads/' + req.file.originalname.toLowerCase().split(' ').join('-')
        // Function to create a flight in the flight database
        flight.newFlight(flightCode, aircraft, originAirport, destinationAirport, embarkDate, travelTime, price, flight_pic_url, (err, result) => {
            if (!err) {
                console.log("Inserted flightid " + result.insertId)
                res.status(201).send({'flightid': result.insertId })   // Return error code 201
            } else {
                console.log("[ERROR DETECTED] 500")
                res.status(500).send({ "Error Message": "Airport does not exist!" })
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
            res.status(200).send((result[result.length - 1]))
        } else {
            console.log("[ERROR DETECTED]")
            res.status(500).send({ "Error Message": "[500] Unknown Error" })
        }
    })
})

// Endpoint #9: Using the POST method to add a new booking to the booking database
app.post("/booking/:userid/:flightid", upload.none(), (req, res) => {
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
            res.status(500).send({ "Error Message": "Flight ID, Name or user ID does not exist in the database!" })
        } else {
            console.log("[ERROR DETECTED]")
            res.status(500).send({ "Error Message": "[500] Unknown Error" })
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
            res.status(500).send({ "Error Message": "[500] Unknown Error" })
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
            res.status(500).send({ "Error Message": "[500] Unknown Error" })
        } else if ((result[result.length - 1])[0].firstFlightId == null) {
            res.status(500).send({ "Error Message": "No transfer flights available from your search query!" })
        } else {
            console.table(result[result.length - 1])
            res.status(200).send(result[result.length-1])
        }
    })
})

// Endpoint #12: Using the POST method to create a new promotion on the promotion database
app.post("/promotion/:flightid", upload.none(), (req, res) => {
    // Get flightid from request parameters
    var flightid = req.params.flightid

    // Get promotion information from request body data
    var startDate = req.body.startDate
    var endDate = req.body.endDate
    var discount = req.body.discount

    // Function to add a new promotion and their dates into the promotion database
    promotion.newPromotion(flightid, startDate, endDate, discount, (err, result) => {
        if (!err) {
            res.status(201).send({"promotionid": result.insertId})
        } else if (err.errno == 1292) {
            res.status(500).send({ "Error Message": "Invalid Data Type Received!" })
        } else if (err.errno == 1452) {
            res.status(500).send({ "Error Message": "Cannot create promotion for nonexistent flight!" })
        } else {
            res.status(500).send({ "Error Message": "[500] Unknown Error" })
        }
    })
})

// Endpoint #13: Using the GET method to get all promotion information from the promotion database
app.get('/promotion/', (req, res) => {
    // Function to get all promotion data from the promotion table
    promotion.getAllPromotions((err, result) => {
        if (!err) {
            res.status(201).send(result)
        } else {
            res.status(500).send({ "Error Message": "[500] Unknown Error" })
        }
    })
})

// Endpoint #14: Using the GET method to get a promotion by its id
app.get('/promotion/:promotionid', (req, res) => {
    // Get request parameters
    var promotionid = req.params.promotionid

    // Function to get promotion data from promotion table by promotionid
    promotion.getPromotionById(promotionid, (err, result) => {
        if (!err) {
            res.status(201).send(result)
        } else {
            res.status(500).send({ "Error Message": "[500] Unknown Error" })
        }
    })
})

// Endpoint #15: Using the DELETE method to delete a promotion by promotionid
app.delete('/promotion/:promotionid', (req, res) => {
    // Get request parameters
    var promotionid = req.params.promotionid

    // Function to delete promotion by promotionid
    promotion.deletePromotionById(promotionid, (err, result) => {
        if (!err) {
            res.status(200).send({"Message":"Successfully deleted a promotion!"})
        } else {
            res.status(500).send({ "Error Message": "[500] Unknown Error" })
        }
    })
})

// Endpoint #16: Using the GET method to checkout an existing booking 
app.get('/checkout/:bookingid', (req, res) => {
    // Get bookingid from request parameters
    var bookingid = req.params.bookingid

    // Get quantity from request body
    var quantity = req.body.quantity
    var classid = req.body.class    // classid: 1 for First, 2 for Business, 3 for Economy

    // List of seat classes for a flight
    classList = ["First", "Business", "Economy"]

    /*
    List of values to multiply starting price of booked flight with
    - First class seats are 2x the default price
    - Business class seats are 1.5x the default price
    - Economy class seats cost the default price 
    */ 
    classCost = [2, 1.5, 1]

    // Check if the classid given is in the range of the 3 list values
    if (classid > classList.length || classid <= 0 || classid == undefined) {
        res.status(500).send({ "Error Message": "Invalid Class" })
    } else {

        // Function to retrieve booking information from the booking database
        booking.checkoutBooking(bookingid, (err, result) => {
            if (err) {
                res.status(500).send({ "Error Message": "[500] Unknown Error" })
            } else if (result[0] == undefined) {    // Return an error if the booking does not exist in the database
                res.status(500).send({ "Error Message": "Booking does not exist" })
            } else {
                // Get seat class string from list by classid index
                seatClass = classList[classid-1]

                // Get flightid from bookingid selection
                booking.getFlightIdFromBooking(bookingid, (err2, result2) => {
                    if (err2) {
                        res.status(500).send({ "Error Message": "[500] Unknown Error" })
                    } else if (result2[0] == undefined) {
                        // Output to check if there are no promotions for the selected flight
                        console.log("NO PROMOTIONS FOR THIS FLIGHT")
                    } else {
                        // Get flightid from result2
                        var flightid = result2[0]["flightid"]

                        // Get price of flight from flightid in booking
                        flight.getFlightPriceById(flightid, (err3, result3) => {
                            if (err3) {
                                res.status(500).send({ "Error Message": "[500] Unknown Error" })
                            } else {
                                // Store flight price into flightPrice variable
                                var flightPrice = result3[0]["price"]

                                // Check for promotions for flight
                                promotion.getPromotionByFlightId(flightid, (err4, result4) => {

                                    // Get date of booking from result
                                    var bookingDate = new Date(result[0]["booked_at"])

                                    // Declare function to check all promotions for a flight
                                    function checkPromotions(result, bookingDate) {
                                        // Run a for loop to check multiple promotions for the flight
                                        // Check if date of booking is within promotiong period
                                        for (var i = 0; i < result.length; i++) {
                                            // Get start, end and today dates of promotion
                                            var startDate = new Date(result[i]["startDate"])
                                            var endDate = new Date(result[i]["endDate"])

                                            // Check dates in range
                                            if (startDate <= bookingDate && bookingDate <= endDate) {
                                                // Apply discount if the booking date is within the promotion period
                                                var discount = result[i]["discount"]
                                                break   // Break loop if discount detected in promotion

                                            } else {
                                                // Otherwise, discount will be zero
                                                var discount = 0
                                            }
                                        }

                                        return discount
                                    }

                                    if (err4) {
                                        res.status(500).send({ "Error Message": "[500] Unknown Error" })
                                    } else {
                                        // Run function to check for discounts from promotions of flight
                                        discount = checkPromotions(result4, bookingDate)
                                    }

                                    // Calculate the final price of flight tickets, taking into account quantity, discounts and class seat
                                    var finalPrice = flightPrice * (1 - discount) * (classCost[classid-1]) * quantity

                                    // Compile all booking data for checkout in an object to send to POSTMAN
                                    checkoutObject = {
                                        "booking": result,          // Booking information
                                        "class": seatClass,         // Seat class
                                        "discount": discount,       // Discounts from promotions if any (otherwise, 0)
                                        "finalPrice": finalPrice,   // Final calculated price
                                        "quantity": quantity        // Number of tickets booked by the user
                                    }
                                    // Send the compiled object to POSTMAN for checkout
                                    res.status(200).send(checkoutObject)
                                })
                            }
                        })

                    }
                })
            }
        })
    }
})

// Endpoint #17: Using the GET method to query search for flights by airline code
app.get("/searchAirline", (req, res) => {
    // Get query string from request parameters
    searchQuery = "%" + req.query.query + "%"

    // Initiate function to search airline by airline code (keyword from user)
    flight.searchFlightByAirline(searchQuery, (err, result) => {
        if (!err) {
            res.status(201).send(result)
        } else {
            res.status(500).send({ "Error Message": "[500] Unknown Error" })
        }
    })
})

// Endpoint #18: Using the GET method to search for flights within price range
app.get("/flights/price", (req, res) => {
    // Get request parameters (minimum price and maximum price)
    min = req.query.min     // Minimum price
    max = req.query.max     // Maximum price

    // Return error message if neither min and max price is specified by the user
    if (min == '' && max == '') {
        res.status(500).send({"Error Message":"Please specify price ranges!" })
    } else {
        // Initiate the function to search flights based on given price range by user
        flight.searchFlightsByPriceRange(min, max, (err, result) => {
            if (!err) {
                // Send results to POSTMAN
                res.status(201).send(result)
            } else {
                res.status(500).send({"Error Message":"[500] Unknown Error"})
            }
        })
    }
})


// Export app over to the main server.js file
module.exports = app