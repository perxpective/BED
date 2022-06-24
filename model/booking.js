/* 
BED Assignment CA1
-   Name: Lee Quan Jun Ervin
-   Class: DISM/FT/2B/21
-   Filename: flight.js
-   Description: Program to handle data from the booking table of the SP AIR database 
*/

/*
-----------------------------------------------------------------------
IMPORT DATABASE CONFIGURATIONS
-----------------------------------------------------------------------
*/
var db = require('./databaseConfig.js')

/*
-----------------------------------------------------------------------
DECLARATION OF BOOKING DATABASE FUNCTION OBJECT
-----------------------------------------------------------------------
*/
var bookingDB = {
    // Function to create a new booking for a flight in the booking database
    newBooking: (name, passport, nationality, age, userid, flightid, callback) => {
        var connection = db.getConnection()
        connection.connect((err) => {
            if (err) {
                console.log(err)
                return callback(err, null)
            } else {
                console.log("Connection established!")
                // SQL Command to insert new data into the booking table
                var sql = "insert into sp_air.booking (name, passport, nationality, age, userid, flightid) values (?, ?, ?, ?, ?, ?)"
                console.log(`RUNNING COMMAND: ${sql}`)
                connection.query(sql, [name, passport, nationality, age, userid, flightid], (err, result) => {
                    connection.end()
                    if (err) {
                        console.log(err)
                        return callback(err, null)
                    } else {
                        console.log(result)
                        console.table(result)
                        return callback(null, result)
                    }
                }) 
            }
        })
    },


    checkoutBooking: (bookingid, callback) => {
        var connection = db.getConnection()
        connection.connect((err) => {
            if (err) {
                console.log(err)
                return callback(err, null)
            } else {
                console.log("Connection established!")
                // SQL Command to insert new data into the booking table
                var sql = "select * from sp_air.booking where bookingid = ?"
                console.log(`RUNNING COMMAND: ${sql}`)
                connection.query(sql, [bookingid], (err, result) => {
                    connection.end()
                    if (err) {
                        console.log(err)
                        return callback(err, null)
                    } else {
                        console.log(result)
                        console.table(result)
                        return callback(null, result)
                    }
                })
            }
        })
    },

    // Function to get flightid from booking
    getFlightIdFromBooking: (bookingid, callback) => {
        var connection = db.getConnection()
        connection.connect((err) => {
            if (err) {
                console.log(err)
                return callback(err, null)
            } else {
                console.log("Connection established!")
                // SQL Command to insert new data into the booking table
                var sql = "select flightid from sp_air.booking where bookingid = ?"
                console.log(`RUNNING COMMAND: ${sql}`)
                connection.query(sql, [bookingid], (err, result) => {
                    connection.end()
                    if (err) {
                        console.log(err)
                        return callback(err, null)
                    } else {
                        console.log(result)
                        console.table(result)
                        return callback(null, result)
                    }
                })
            }
        })     
    }
}

/*
-----------------------------------------------------------------------
EXPORT OF BOOKING DATABASE FUNCTION OBJECT TO THE APP SCRIPT
-----------------------------------------------------------------------
*/
module.exports = bookingDB