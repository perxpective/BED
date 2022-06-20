/* 
BED Assignment CA1
-   Name: Lee Quan Jun Ervin
-   Class: DISM/FT/2B/21
-   Filename: flight.js
-   Description: Program to handle data from the flight table of the SP AIR database 
*/

// Import SQL database from databaseConfig.js
const timeout = require('nodemon/lib/config')   // Import nodemon for easy debugging
var db = require('./databaseConfig.js')
var flightDB = {
    // Function to add new flight to the flight database
    newFlight: (flightCode, aircraft, originAirport, destinationAirport, embarkDate, travelTime, price, flight_pic_url, callback) => {
        var connection = db.getConnection()
        connection.connect((err) => {
            // Check for errors
            if (err) {
                console.log(err)
                return callback(err, null)
            } else {
                // SQL command to insert new flight data into flight table
                var sql = "insert into sp_air.flight (flightCode, aircraft, originAirport, destinationAirport, embarkDate, travelTime, price, flight_pic_url) values (?, ?, ?, ?, ?, ?, ?,?)"
                console.log(`RUNNING COMMAND: ${sql}`)
                connection.query(sql, [flightCode, aircraft, originAirport, destinationAirport, embarkDate, travelTime, price, flight_pic_url], (err, result) => {
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
                // SQL Command to 
                var sql = `select flightId, flightCode, (select name from airport where airportid = ?) as originAirport, (select name from airport where airportid = ?) as destinationAirport, embarkdate, travelTime, price from flight where flight.originAirport = ? and flight.destinationAirport = ?`
                connection.query(sql, [originAirportId, destinationAirportId, originAirportId, destinationAirportId], (err, result) => {
                    connection.end()
                    if (err) {
                        console.log(err)
                        return callback(err, null)
                    } else {
                        return callback(null, result)
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

    // Function to get all transfer flights from transfer database
    getTransfers: (originAirportId, destinationAirportId, callback) => {
        var connection = db.getConnection()
        connection.connect((err) => {
            if (err) {
                console.log(err)
                return callback(err, null)
            } else {
                // SQL statement to delete flight based on flightid
                var sql = `
                create temporary table if not exists first_flight (flightid int not null, flightCode varchar(45) not null, aircraft varchar(45) not null, originAirport varchar(45) not null, destinationAirport varchar(45) not null, price float not null);
                insert into first_flight select flightid, flightCode, aircraft, originAirport, destinationAirport, price from flight where flight.originAirport = ? and flight.destinationAirport != ?;
                create temporary table if not exists second_flight (flightid int not null, flightCode varchar(45) not null, aircraft varchar(45) not null, originAirport varchar(45) not null, destinationAirport varchar(45) not null, price float not null);
                insert into second_flight select flightid, flightCode, aircraft, originAirport, destinationAirport, price from flight where flight.destinationAirport = ? and flight.originAirport != ?;
                select first_flight.flightid as firstFlightId, second_flight.flightid as secondFlightId, first_flight.flightCode as flightCode1, second_flight.flightCode as flightCode2, first_flight.aircraft as aircraft1, second_flight.aircraft as aircraft2, (select name from airport where airportid = first_flight.originAirport) as originAirport, (select name from airport where airportid = second_flight.originAirport) as transferAirport, (select name from airport where airportid = second_flight.destinationAirport) as destinationAirport , sum(first_flight.price + second_flight.price) as totalPrice from first_flight, second_flight where first_flight.destinationAirport = second_flight.originAirport;`
                
                connection.query(sql, [originAirportId, destinationAirportId, destinationAirportId, originAirportId], (err, result) => {
                    connection.end()
                    if (err) {
                        console.log(err)
                        return callback(err, null)
                    } else {
                        return callback(null, result)
                    }
                })
            }
        })
    },

    // Function to get flight by flightid
    getFlightPriceById: (flightid, callback) => {
        var connection = db.getConnection()
        connection.connect((err) => {
            if (err) {
                console.log(err)
                return callback(err, null)
            } else {
                // SQL statement to delete flight based on flightid
                var sql = "select price from flight where flightid = ?"
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

    // Function to search flights by airline code search query 
    searchFlightByAirline: (searchQuery, callback) => {
        var connection = db.getConnection()
        connection.connect((err) => {
            if (err) {
                console.log(err)
                return callback(err, null)
            } else {
                // SQL statement to select flight by airline code
                var sql = "select flightid, flightCode, aircraft, (select name from airport where airportid = flight.originAirport) as originAirport, (select name from airport where airportid = flight.destinationAirport) as destinationAirport, embarkDate, travelTime, price, flight_pic_url from sp_air.flight where flightCode like ?"
                connection.query(sql, [searchQuery], (err, result) => {
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

    // Function to select flight according to range user sets
    searchFlightsByPriceRange: (min, max, callback) => {
        var connection = db.getConnection()
        connection.connect((err) => {
            if (err) {
                console.log(err)
                return callback(err, null)
            } else {
                
                if (max == '' && min !== '') {          // If maximum price is given and minimum price is not given
                    sql = "select flightid, flightCode, aircraft, (select name from airport where airportid = flight.originAirport) as originAirport, (select name from airport where airportid = flight.destinationAirport) as destinationAirport, embarkDate, travelTime, price, flight_pic_url from sp_air.flight where price >= ?"
                    array = [min]
                } else if (min == '' && max !== '') {   // If minimum price is given but maximum price is not given
                    sql = "select flightid, flightCode, aircraft, (select name from airport where airportid = flight.originAirport) as originAirport, (select name from airport where airportid = flight.destinationAirport) as destinationAirport, embarkDate, travelTime, price, flight_pic_url from sp_air.flight where price <= ?"
                    array = [max]
                } else if (max !== '' && min !== '') {  // If both maximum and minimum price is given by the user
                    sql = "select flightid, flightCode, aircraft, (select name from airport where airportid = flight.originAirport) as originAirport, (select name from airport where airportid = flight.destinationAirport) as destinationAirport, embarkDate, travelTime, price, flight_pic_url from sp_air.flight where price between ? and ?"
                    array = [min, max]
                }

                connection.query(sql, array, (err, result) => {
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

module.exports = flightDB