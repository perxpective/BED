/* 
BED Assignment CA1
-   Name: Lee Quan Jun Ervin
-   Class: DISM/FT/2B/21
-   Filename: databaseConfig.js
-   Description: JS script to connect to the SQL database
*/

/*
Tables to add in SP AIR Database
- user 
- flight
- airport
- bookings 
*/

/*
-----------------------------------------------------------------------
IMPORT SQL
-----------------------------------------------------------------------
*/
// Importing the MySQL Library into databaseConfig.js'
var mysql = require('mysql')    

/*
-----------------------------------------------------------------------
SQL DATABASE CONNECTION TO SERVER
-----------------------------------------------------------------------
*/
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

/*
-----------------------------------------------------------------------
EXPORT OF DATABASE CONFIGURATIONS AND CONNECTION TO FUNCTION SCRIPTS
-----------------------------------------------------------------------
*/
module.exports = dbconnect  


