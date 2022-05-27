/* 
BED Assignment CA1
-   Name: Lee Quan Jun Ervin
-   Class: DISM/FT/2B/21
-   Filename: flight.js
-   Description: Program to handle data from the flight table of the SP AIR database 
*/

// Import SQL database from databaseConfig.js
const { timeout } = require('nodemon/lib/config')
var db = require('./databaseConfig.js')
var flightDB = {
    // Function to add new flight to the flight database
    newFlight: (flightCode, aircraft, originAirport, destinationAirport, embarkDate, travelTime, price, callback) => {
        var connection = db.getConnection()
        connection.connect((err) => {
            // Check for errors
            if (err) {
                console.log(err)
                return callback(err, null)
            } else {
                // SQL command to insert new flight data into flight table
                var sql = "insert into sp_air.flight (flightCode, aircraft, originAirport, destinationAirport, embarkDate, travelTime, price) values (?, ?, ?, ?, ?, ?, ?)"
                console.log(`RUNNING COMMAND: ${sql}`)
                connection.query(sql, [flightCode, aircraft, originAirport, destinationAirport, embarkDate, travelTime, price], (err, result) => {
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
    
    // Function to get flight information based on origin and destination airport IDs
    findFlight: (originAirportId, destinationAirportId, callback) => {
        var connection = db.getConnection()
        connection.connect((err) => {
            if (err) {
                console.log(err)
                return callback(err, null)
            } else {
                console.log("Connection established!")
                /*
                -------------------------------------------------------------------------------------------------
                SQL command to retrieve airport names from airport table and flight information from flight table
                -------------------------------------------------------------------------------------------------
                */

                // SQL Command to create a temporary table to store all retrieve data from flight and airport tables
                // SQL Line 1: Create a temporary table if it does not exist yet to store origin and destination airport names
                var SQLclearTable = "create temporary table if not exists find_flight2 (originAirport varchar(45) not null, destinationAirport varchar(45) not null);"
                console.log(`RUNNING COMMAND: ${SQLclearTable}`)
                connection.query(SQLclearTable, (err2, result2) => {
                    if (err2) {
                        console.log(err2)
                        return callback(err2, null)
                    } else {
                        // SQL Line 2: Clear table regularly
                        var SQLcreateTemporaryTable = "truncate table find_flight2;"
                        console.log(`RUNNING COMMAND: ${SQLcreateTemporaryTable}`)
                        connection.query(SQLcreateTemporaryTable, (err3, result3) => {
                            if (err3) {
                                console.log(err3)
                                return callback(err3, null)
                            } else {
                                // SQL Line 3: Store selected origin airport name in a variable @originAirportVar
                                var SQLvariable1 = "set @originAirportVar = (select name from airport where airportid = ?);"
                                console.log(`RUNNING COMMAND: ${SQLvariable1}`)
                                connection.query(SQLvariable1, [originAirportId], (err4, result4) => {
                                    if (err4) {
                                        console.log(err4)
                                        return callback(err4, null)
                                    } else {
                                        // SQL Line 4: Store selected destination airport name in a variable @destinationAirportVar
                                        var SQLvariable2 = "set @destinationAirportVar = (select name from airport where airportid = ?);"
                                        console.log(`RUNNING COMMAND: ${SQLvariable2}`)
                                        connection.query(SQLvariable2, [destinationAirportId], (err5, result5) => {
                                            if (err5) {
                                                console.log(err5)
                                                return callback(err5, null)
                                            } else {
                                                // SQL Line 5: Insert the two variables in the temporary table called find_flight2
                                                var SQLinsertIntoTempTable = "insert into find_flight2 (originAirport, destinationAirport) values (@originAirportVar, @destinationAirportVar);"
                                                console.log(`RUNNING COMMAND: ${SQLinsertIntoTempTable}`)
                                                connection.query(SQLinsertIntoTempTable, (err5, result5) => {
                                                    if (err5) {
                                                        console.log(err5)
                                                        return callback(err5, null)
                                                    } else {
                                                        // SQL Line 6: Select data from flight and find_flight2 tables to form a joined table
                                                        var SQLselectTempTable = "select flight.flightid, flight.flightCode, flight.aircraft, find_flight2.originAirport, find_flight2.destinationAirport, flight.embarkDate, flight.travelTime, flight.price from flight, find_flight2 where flight.originAirport = ? and flight.destinationAirport = ?;"
                                                        console.log(`RUNNING COMMAND: ${SQLselectTempTable}`)
                                                        connection.query(SQLselectTempTable, [originAirportId, destinationAirportId], (err6, result6) => {
                                                            connection.end()
                                                            if (err6) {
                                                                console.log(err6)
                                                                return callback(err6, null)
                                                            } else {
                                                                console.table(result6)
                                                                return callback(null, result6)
                                                            }
                                                        })
                                                    }
                                                })
                                            }
                                        })   
                                    }
                                })
                            }
                        })
                    }
                })
            }
        }) 
    },

    // Function to delete flights and their related bookings from the database
    deleteFlight: (flightid, callback) => {
        var connection = db.getConnection()
        connection.connect((err) => {
            if (err) {
                console.log(err)
                return callback(err, null)
            } else {
                // SQL statement to delete flight based on flightid
                var sql = "delete from flight where flightid = ?"
                connection.query(sql, [flightid], (err, result) => {
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

    // Function to add a new transfer flight to the transfers database
    newTransfer: (firstFlightId, secondFlightId, flightCode1, flightCode2, aircraft1, aircraft2, originAirport, transferAirport, destinationAirport, totalPrice, callback) => {
        var connection = db.getConnection()
        connection.connect((err) => {
            if (err) {
                console.log(err)
                return callback(err, null)
            } else {
                // SQL Command to insert new flights with transfers into the transfer database
                var sql = "insert into transfer (firstFlightId, secondFlightId, flightCode1, flightCode2, aircraft1, aircraft2, originAirport, transferAirport, destinationAirport, totalPrice) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
                connection.query(sql, [firstFlightId, secondFlightId, flightCode1, flightCode2, aircraft1, aircraft2, originAirport, transferAirport, destinationAirport, totalPrice], (err, result) => {
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

    // Function to get transfer flights from the flight database based on origin airport and destination airport
    getTransfers: (originAirportId, destinationAirportId, callback) => {
        // Function to get airport name based on id
        function getAirportName(id) {
            var connection = db.getConnection()
            connection.connect((err) => {
                if (err) {
                    console.log(err)
                    return callback(err, null)
                } else {
                    // SQL statement to delete flight based on flightid
                    var sql = "select * from sp_air.airport where airportid = ?"
                    connection.query(sql, [id], (err, result) => {
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

        var connection = db.getConnection()
        connection.connect((err) => {
            if (err) {
                console.log(err)
                return callback(err, null)
            } else {
                var originAirport = JSON.parse(getAirportName(originAirportId))
                var destinationAirport = JSON.parse(getAirportName(destinationAirportId))
                console.log(originAirport)
                console.log(destinationAirport)
                var sql = "select * from sp_air.flight where originAirport = ? and destinationAirport = ?"
                connection.query(sql, [originAirport, destinationAirport], (err, result) => {
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

module.exports = flightDB