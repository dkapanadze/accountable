# Royal Library Backend System

## Tech Stack

- **Node.js with TypeScript**
- **Express.js** - Web framework for Node.js
- **MongoDB** - NoSQL database

## Features

- **Manage Book References**: Add, delete, and retrieve book references.
- **Catalog Search**: Search books by genre, title, or author.
- **Reservation & Borrowing System**: Users can reserve and borrow books online, track availability, and view reservation history.
- **Reminder System**: Automated email notifications for upcoming due dates and late returns.
- **Wallet System**: Users can maintain a balance for borrowing books and pay late fees.

## Installation and Setup

### Prerequisites

- **Docker**
- **Docker Compose**

### Steps to Run the Application

1. **Clone the Repository**

   ```bash
   git clone git@github.com:dkapanadze/accountable.git
   cd accountable
   ```

## 2. Create a `.env` File

Create a `.env` file at the root of the project and add the following environment variables:

````env
PORT=8080
MONGODB_URI=mongodb://mongodb:27017/accountable
JWT_SECRET=your_jwt_secret
EMAIL_SERVICE=smtp.example.com
EMAIL_USER=your-email@example.com
EMAIL_PASS=your-email-password

## 3. Build and Run with Docker Compose

Run the following command to build and start the application and its dependencies using Docker Compose:

docker-compose up --build

This will start the following services:

- **Node.js/Express Application**: Running on [http://localhost:8080](http://localhost:8080)
- **MongoDB**: Running as a Docker container

## 4. Go to Docker Container and Run Seeders

1. Access the Docker container:

    ```bash
    docker exec -it accountable_app /bin/bash
    ```

2. Run the seeders:

    ```bash
    npm run seed:books
    npm run seed:users
    npm run seed:wallets
    ```

3. Exit the container:

    ```bash
    exit
    ```

## 5. Access the Application

Once the services are up and running, you can access the application at:

[http://localhost:8080](http://localhost:8080)

The API documentation will be available at:

[http://localhost:8080/docs](http://localhost:8080/docs)






API Endpoints:

Get all books:

GET /api/v1/books
Retrieves a list of all books in the library.

response schema

[
{
\_id: string
title: string
author: string
publicationYear: date
publisher: string
quantity: number
price: number

}
]

Get Book By ID
Endpoint: GET /api/v1/books/{id}

Description: Retrieves details of a book by its ID.

Parameters:

id (path parameter): The ID of the book.

response schema

{
\_id: string
title: string
author: string
publicationYear: date
publisher: string
quantity: number
price: number

}

Add a Book
Endpoint: POST /api/v1/books

Description: Adds a new book, or new copy to the library catalog.

Request body:

{
"title": string,
"author": string,
"publicationYear": date,
"price": number,
"isNewBook": boolean, //field to mark if it's a new book or not
"publisher" : string,
"quantity": number
}

Response:

Status Code: 201 Created

{
"newBook": {
\_id: number
"title": string,
"author": string,
"publicationYear": number,
"publisher": string,
"availableQuantity": number,
"totalQuantity": number,
"price": number,
"createdAt": ISO date,
"updatedAt": ISO date,

    }

}

Search Books
Endpoint: GET /api/v1/books/search

Description: Searches for books in the library catalog based on the provided query parameters.

Query Parameters:

title (optional): The title of the book to search for.
author (optional): The author of the book to search for.
publisher (optional): The publisher of the book to search for.

Response:

Status Code: 200

[
{
\_id: number
"title": string,
"author": string,
"publicationYear": number,
"publisher": string,
"availableQuantity": number,
"totalQuantity": number,
"price": number,
"createdAt": ISO date,
"updatedAt": ISO date,
},
]

Delete a Book
Endpoint: DELETE /api/v1/books/{id}

Description: Deletes a book from the library catalog based on the provided book ID.

Path Parameter:

id (required): The unique identifier of the book to be deleted. This should be a valid MongoDB ObjectId.

Request Example: DELETE /api/v1/books/605c72ef8f8c2f001f647f3b

Response Example:

{
"message": "Book deleted successfully",
"quantityLeft": 3
}

Delete a Book
Endpoint: DELETE /api/v1/books/{id}

Description: Deletes a book from the library catalog based on the provided book ID.

Path Parameter:

id (required): The unique identifier of the book to be deleted. This should be a valid MongoDB ObjectId.
Request Example:

http
Copy code
DELETE /api/v1/books/605c72ef8f8c2f001f647f3b
Response:

Status Code: 200 OK (if the book was successfully deleted)
Response Body:

{
"message": "Book deleted successfully",
"quantityLeft": "number" // The number of copies left in the catalog after deletion
}

Response Example:

{
"message": "Book deleted successfully",
"quantityLeft": 3
}

Errors:

404 Not Found: If the book with the specified ID does not exist.

Response Body:

{
"message": "Book not found"
}

400 Bad Request: If the ID format is invalid.

Response Body:

{
"message": "Invalid ID format"
}

Create transaction

Endpoint Details
Endpoint: POST /api/v1/transactions
Description: Creates a new transaction based on the provided data.

Request Body

{
"userId": string,
"type": string, [RESERVATION, LATE_FEE ]
"status": string, [PENDING, SUCCESS, CANCELLED, REJECTED]
"bookId": string,
"walletId": string
}

Get reservation history

Endpoint Details
Endpoint: GET /api/v1/books/reservation-history
Description: Retrieves a list of reservation history entries based on optional query parameters for filtering and date ranges.

Request Body
The request body should include the following optional fields:

userId: (Optional) ID of the user who made the reservation.
bookId: (Optional) ID of the book that was reserved.
walletId: (Optional) ID of the wallet used for the reservation.
operationType: (Optional) Type of operation (e.g., "BUY", "RESERVE").
before: (Optional) Filter reservations made before this date (ISO 8601 format).
after: (Optional) Filter reservations made after this date (ISO 8601 format).

Response Body
[
{
\_id: string
userId : string
bookId : string
walletId : string
operationType : string
createdAt : date
updatedAt: date
}
]
````
