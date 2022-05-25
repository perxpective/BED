/* 
BED Assignment CA1
-   Name: Lee Quan Jun Ervin
-   Class: DISM/FT/2B/21
-   Filename: server.js
-   Description: JS code to host the web application on localhost
*/

var app = require('./controller/app.js')        // Import express server from app.js
var port = 8081                                 // Default port for HTTP

// Start the server
var server = app.listen(port, function () {
    console.log('Web App Hosted at http://localhost:%s', port);
})