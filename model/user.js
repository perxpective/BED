/* 
BED Assignment CA1
-   Name: Lee Quan Jun Ervin
-   Class: DISM/FT/2B/21
-   Filename: user.js
-   Description: Program to handle data from the user table of the SP AIR database 
*/

/*
-----------------------------------------------------------------------
IMPORT DATABASE CONFIGURATIONS
-----------------------------------------------------------------------
*/
var db = require('./databaseConfig.js')

/*
-----------------------------------------------------------------------
DECLARATION OF USER DATABASE FUNCTION OBJECT
-----------------------------------------------------------------------
*/
var userDB = {
    // Function to get all users from the database
    getAllUsers: (callback) => {
        // Establish a connection with the database
        var connection = db.getConnection()
        connection.connect((err) => {
            // If error from connection detected
            if (err) {
                console.log(err)
                return callback(err, null)
            } else {
                console.log("Connection established!")
                
                // SQL command to select all data from the user table
                var sql = 'select * from sp_air.user'
                console.log(`RUNNING COMMAND: ${sql}`)

                connection.query(sql, (err, result) => {
                    connection.end()
                    if (err) {
                        console.log(err)   
                        // Error detected, return callback function with error and null results
                        return callback(err, null)
                    } else {
                        // Result successfully retrieved and return callback with null error and result
                        console.log(result)
                        console.table(result)
                        return callback(null, result)
                    }
                })
            }
        })
    },

    // Function to add a new user to the user table
    addUser: (username, email, contact, password, role, profile_pic_url, callback) => {
        var connection = db.getConnection()
        connection.connect((err) => {
            // Check for errors
            if (err) {
                console.log(err)
                return callback(err, null)
            } else {
                console.log("Connection established!")
                // SQL Command to insert new row of values into sp_air.user table
                var sql = "insert into sp_air.user (username, email, contact, password, role, profile_pic_url) values (?, ?, ?, ?, ?, ?)"
                console.log(`RUNNING COMMAND: ${sql}`)
                connection.query(sql, [username, email, contact, password, role, profile_pic_url], (err, result) => {
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

    // Function to retrieve a user data by its ID
    getUserByID: (userid, callback) => {
        var connection = db.getConnection()
        connection.connect((err) => {
            if (err) {
                console.log(err)
                return callback(err, null)
            } else {
                console.log("Connection established!")
                // Insert userid into the SQL query to replace the ? sign
                var sql = "select * from sp_air.user where userid = ?"
                console.log(`RUNNING COMMAND: ${sql}`)
                connection.query(sql, [userid], (err, result) => {
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

    // Function to update user data by its userid
    updateUserByID: (userid, username, email, contact, password, role, profile_pic_url, callback) => {
        var connection = db.getConnection()
        connection.connect((err) => {
            // First check of errors
            if (err) {
                console.log(err)
                return callback(err, null)
            } else {
                console.log("Connection established!")
                // SQL command to select the user row by userid requested
                var SQLgetUserData = 'select * from sp_air.user where userid = ?'
                console.log(`RUNNING SQL COMMAND: ${SQLgetUserData}`)
                connection.query(SQLgetUserData, [userid], (err, result) => {
                    // SQL Error handling
                    if (err) {
                        console.log(err)
                        return callback(err, null)
                    } else {
                        // Extract result object from single element object array
                        selected_result = result[0]

                        // If result is not defined, the object which user selects with id does not exist
                        if (selected_result == undefined) {
                            return callback(null, null)
                        } else {
                            // Start extracting previous user data to detect duplicates in data entries except for userid and created_at
                            var previousContact = selected_result.contact
                            var previousPassword = selected_result.password
                            var previousRole = selected_result.role
                            var previousProfilePic = selected_result.profile_pic_url

                            // Else, make sure blank entries are equal to previous data fields to prevent null errors in SQL
                            if (contact == undefined) {
                                contact = previousContact
                            } if (password == undefined) {
                                password = previousPassword
                            } if (role == undefined) {
                                role = previousRole
                            } if (profile_pic_url == undefined) {
                                profile_pic_url = previousProfilePic
                            }

                            // SQL query to update the respective data fields
                            var SQLupdateTable = "update user set username = ?, email = ?, contact = ?, password = ?, role = ?, profile_pic_url = ? where userid = ?"
                            console.log(`RUNNING SQL COMMAND: ${SQLupdateTable}`)
                            connection.query(SQLupdateTable, [username, email, contact, password, role, profile_pic_url, userid], (err2, result2) => {
                                connection.end()
                                if (err2) {
                                    console.log(err2)
                                    return callback(err2, null)
                                } else {
                                    console.log(result2)
                                    console.table(result2)
                                    return callback(null, result2)
                                }
                            })
                        }
                    }
                })
            }
        })
    }
}

/*
-----------------------------------------------------------------------
EXPORT OF USER DATABASE FUNCTION OBJECT TO THE APP SCRIPT
-----------------------------------------------------------------------
*/
module.exports = userDB