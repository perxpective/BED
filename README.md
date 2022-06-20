# BED Assignment 1

Back-End Web Development (BED) CA1 Assignment
Developed endpoints in the back-end side for a flight booking website

## SQL Tables Created

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
  - product listing image

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

## Foreign Keys

- airport.airportid = flight.originAirport and flight.destinationAirport
- flight.flightid = booking.flightid
- user.userid = booking.userid
- user.username = booking.name
- flight.flightid = promotion.flightid

## Summary of Endpoints Created

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

## Bonus Requirement Fufillment

- Implementation of Multer in app.js to support uploading of image files into form-data in POSTMAN
  
  - File size limited to 1MB, otherwise error will be outputted
  - Only JPG and PNG files are accepted, using fileFilter function in Multer object and comparing with file mimetype
  - Feature is only available for user and flight endpoints
  - Uploaded files can be found under the uploads folder

- Endpoints related to promotional discounts for certain periods
  
  - Retrieves flightid and cross references promotion table to check if promotion exists for the flight
  - Checks if promotion applicable for flight by checking if booking date within promotion period, if not no discount
  - Applies discount if there is promotion for flight within promotion period
  1. Endpoint 12 - POST /promotions/:flightid - Create a new promotion
  2. Endpoint 13 - GET /promotions - Get all promotions
  3. Endpoint 14 - GET /promotions/:promotionid - Get promotion by promotionid
  4. Endpoint 15 - DELETE /promotion/:promotionid - Delete a promotion by promotionid

## Advanced Features

- Checkout Feature
  
  - Endpoint 16 - GET /checkout/:bookingid
  - Check if booking exists to be checked out
  - Gives user option to select flight class in their booked flight (Economy, Business, First)
    - Standard price for flights is for Economy Class
    - Business Class tickets cost 50% more than Economy Class tickets
    - First Class tickets cost 100% more than Economy Class tickets
  - Users can indicate quantity of tickets (must be for the same class)
  - Final price will be calculated, taking into account discounts, class and quantity
  - Checkout information will be displayed and resets every time a new checkout is made

- Searching for flights based on airline
  
  - Endpoint 17 - GET /searchAirline?query=
  - Shows all the flights offered by the airline (all origin and destination cities)

- Searching for flights between certain ranges user specifies
  
  - Endpoint 18 - GET /flights/price?min=&max=
  - Minimum and maximum range to be specified by the user in the body
