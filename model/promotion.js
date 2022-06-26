/* 
BED Assignment CA1
-   Name: Lee Quan Jun Ervin
-   Admin No: 2104005
-   Class: DISM/FT/2B/21
-   Filename: promotion.js
-   Description: Program to handle data from the promotion table of the SP AIR database
*/

/*
-----------------------------------------------------------------------
IMPORT DATABASE CONFIGURATIONS
-----------------------------------------------------------------------
*/
var db = require('./databaseConfig.js')

/*
-----------------------------------------------------------------------
DECLARATION OF PROMOTION DATABASE FUNCTION OBJECT
-----------------------------------------------------------------------
*/
var promotionDB = {
    // Function to add a new promotion to the promotion table
    newPromotion: (flightid, startDate, endDate, discount, callback) => {
        var connection = db.getConnection()
        connection.connect((err) => {
            // Check for errors
            if (err) {
                console.log(err)
                return callback(err, null)
            } else {
                // SQL command to insert new promotion information into promotion database
                var sql = "insert into sp_air.promotion (flightid, startDate, endDate, discount) values (?, ?, ?, ?)"
                console.log(`RUNNING COMMAND: ${sql}`)
                connection.query(sql, [flightid, startDate, endDate, discount], (err, result) => {
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

    // Function to get all promotion from promotion table
    getAllPromotions: (callback) => {
        var connection = db.getConnection()
        connection.connect((err) => {
            // Check for errors
            if (err) {
                console.log(err)
                return callback(err, null)
            } else {
                // SQL command to select all promotion from promotion table
                var sql = "select * from sp_air.promotion"
                console.log(`RUNNING COMMAND: ${sql}`)
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
    },

    // Function to retrieve promotion information from promotion table by promotionid
    getPromotionById: (promotionid, callback) => {
        var connection = db.getConnection()
        connection.connect((err) => {
            // Check for errors
            if (err) {
                console.log(err)
                return callback(err, null)
            } else {
                // SQL command to select promotion by promotionid
                var sql = "select * from sp_air.promotion where promotionid = ?"
                console.log(`RUNNING COMMAND: ${sql}`)
                connection.query(sql, [promotionid], (err, result) => {
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

    // Function to delete a promotion by promotionid
    deletePromotionById: (promotionid, callback) => {
        var connection = db.getConnection()
        connection.connect((err) => {
            // Check for errors
            if (err) {
                console.log(err)
                return callback(err, null)
            } else {
                // SQL command to delete a promotion from the promotion table
                var sql = "delete from sp_air.promotion where promotionid = ?"
                console.log(`RUNNING COMMAND: ${sql}`)
                connection.query(sql, [promotionid], (err, result) => {
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

    // Function to get promotions by flightid
    getPromotionByFlightId: (flightid, callback) => {
        var connection = db.getConnection()
        connection.connect((err) => {
            // Check for errors
            if (err) {
                console.log(err)
                return callback(err, null)
            } else {
                // SQL command to select promotion by flightid
                var sql = "select * from sp_air.promotion where flightid = ?"
                console.log(`RUNNING COMMAND: ${sql}`)
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

    // Function to extract discount from promotion for flight
    getDiscount: (flightid, callback) => {
        var connection = db.getConnection()
        connection.connect((err) => {
            // Check for errors
            if (err) {
                console.log(err)
                return callback(err, null)
            } else {
                // SQL command to select discount value from the promotion by the flightid
                var sql = "select discount from sp_air.promotion where flightid = ?"
                console.log(`RUNNING COMMAND: ${sql}`)
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
    }
}

/*
-----------------------------------------------------------------------
EXPORT OF PROMOTION DATABASE FUNCTION OBJECT TO THE APP SCRIPT
-----------------------------------------------------------------------
*/
module.exports = promotionDB