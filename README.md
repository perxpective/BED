# BED Assignment 1
Back-End Web Development (BED) CA1 Assignment
Developed endpoints in the back-end side for a flight booking website

# SQL Tables Created
Database name: sp_air
- user - stores user information
    - user id
    - username
    - email
    - contact number
    - password
    - role
    - profile picture

- flight - stores flight information
    - flight id 
    - flight code
    - aircraft type
    - origin airport
    - destination airport
    - embark date
    - travel time
    - price
 
- airport - stores airport name and country
    - airport id
    - name of airport
    - country of airport
    - description of airport

- bookings - stores booking made by a user
    - booking id
    - name
    - passport
    - nationality
    - age

- promotion - store promotion period dates and discounts
    - promotion id
    - flight id
    - startDate
    - endDate
    - discount

# Summary of Endpoints Created
1. Endpoint 1 - POST /users/ - Create a new user
2. Endpoint 2 - GET /users/ - Get all users from the user database
3. Endpoint 3 - GET /users/:id - Get user by their id
4. Endpoint 4 - PUT /users/:id - Update a user by their id
5. Endpoint 5 - POST /airport - Add a new airport
6. Endpoint 6 - GET /airport - Get all airports from the airport database
7. Endpoint 7 - POST /flight - Update airport information
8. Endpoint 8 - GET /flightDirect/:originAirportId/:destinationAirportId - Get flights travelling from origin airport to destination airport
9. Endpoint 9 - POST /booking/:userid/:flightid - Add a new booking to the booking database
10. Endpoint 10 - DELETE /flight/:id/ - Delete a flight by its id
11. Endpoint 11 - GET /transfer/flight/:originAirportId/:destinationAirportId - Get transfer flights to destination
12. Endpoint 12 - POST /transfer/flight - Add new flights with connections (transfers)

# Bonus Requirement Fufillment
- Implementation of Multer in app.js to support uploading of image files into form-data in POSTMAN
    - File size limited to 1MB, otherwise error will be outputted
    - Only JPG and PNG files are accepted, using fileFilter function in Multer object and comparing with file mimetype
    -  Feature is only available for user endpoints
    - Uploaded files can be found under the uploads folder

- Endpoints related to promotional discounts for certain periods
    1. Endpoint 13 - POST /promotions/:flightid - Create a new promotion
    2. Endpoint 14 - GET /promotions - Get all promotions
    3. Endpoint 15 - GET /promotions/:promotionid - Get promotion by promotionid
    4. Endpoitn 16 - DELETE /promotion/:promotionid - Delete a promotion by promotionid

# Advanced Features
- Checkout Feature
    - Gives user option to select flight class in their booked flight (Economy, Business, First)
        - Standard price for flights is for Economy Class
        - Business Class tickets cost 50% more than Economy Class tickets
        - First Class tickets cost 100% more than Economy Class tickes
        - Users can enter the quantity desired
        - Assumption is that the users book the same class for both flights with transfers
        - Cheap flight tickets are priced $500 or lower
        - Flights are filtered based on this condition
        - Transfer flights are searched separately by the parameter (yes, no)
        - Yes = Search transfer flights, No = Search flights without transfers
    - Checkout information will be displayed and resets every time a new checkout is made

- Searching for cheap flights based on origin and destination airport
    - Transfer flights are searched separately
    - Standard prices that are $500 and below are considered cheap

- Searching for flights based on airline
    - Transfer flights with at least one of the airlines will also be shown but is also searched separately
    - Shows all the flights offered by the airline (all origin and destination cities)
