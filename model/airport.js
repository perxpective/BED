/* 
BED Assignment CA1
-   Name: Lee Quan Jun Ervin
-   Admin No: 2104005
-   Class: DISM/FT/2B/21
-   Filename: user.js
-   Description: Program to handle data from the airport table of the SP AIR database 
*/

/*
-----------------------------------------------------------------------
IMPORT DATABASE CONFIGURATIONS
-----------------------------------------------------------------------
*/
var db = require('./databaseConfig.js')

/*
-----------------------------------------------------------------------
DECLARATION OF AIRPORT DATABASE FUNCTION OBJECT
-----------------------------------------------------------------------
*/
var airportDB = {
    // Function to add a new airport to airport database (args: name of airport, country of airport and description)
    addAirport: (name, country, description, callback) => {
        var connection = db.getConnection()
        connection.connect((err) => {
            // Check for errors
            if (err) {
                console.log(err)
                return callback(err, null)
            } else {
                console.log("Connection established!")
                // SQL Command to insert new row of values into sp_air.user table
                var sql = "insert into sp_air.airport (name, country, description) values (?, ?, ?)"
                console.log(`RUNNING COMMAND: ${sql}`)
                connection.query(sql, [name, country, description], (err, result) => {
                    connection.end()
                    // Second check of errors
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
    
    // Function to get all airports from the airport database (args: callback)
    getAllAirports: (callback) => {
        // Connect to the database
        var connection = db.getConnection()
        connection.connect((err) => {
            // Check error connection
            if (err) {
                console.log(err)
                return callback(err, null)
            } else {
                console.log("Connection established!")

                // SQL command to select all data from the airport table
                var sql = "select * from sp_air.airport"
                console.log(`RUNNING COMMAND: ${sql}`)

                // Query the database
                connection.query(sql, (err, result) => {
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
EXPORT OF AIRPORT DATABASE FUNCTION OBJECT TO THE APP SCRIPT
-----------------------------------------------------------------------
*/
module.exports = airportDB