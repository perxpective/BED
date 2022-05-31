/* 
BED Assignment CA1
-   Name: Lee Quan Jun Ervin
-   Class: DISM/FT/2B/21
-   Filename: databaseConfig.js
*/

/*
Tables to add in SP AIR Database
- user 
- flight
- airport
- bookings 
*/

// Importing the MySQL Library into databaseConfig.js'
var mysql = require('mysql')    

// Establishing a connection with the SP AIR MySQL Databse 
var dbconnect = {
    getConnection: () => {
        var connection = mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "lightPainting28012004@",     // Enter your own password from your MySQL Workstation
            database: "sp_air",
            multipleStatements: true
        })
        return connection
    }
}

module.exports = dbconnect  // Exporting the dbconnect function to controller


