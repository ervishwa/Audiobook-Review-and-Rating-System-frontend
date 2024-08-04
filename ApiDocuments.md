# API Documentation

## Overview

This Express.js application provides endpoints for managing audiobooks and their reviews. It connects to a MongoDB Atlas database to store and retrieve data. The application features CRUD operations for audiobooks and review management.

## Application Architecture

- **Backend Framework**: Express.js
- **Database**: MongoDB Atlas (using Mongoose ODM)
- **Middleware**: 
  - `express.json()`: Parses JSON bodies for incoming requests.
  - `cors()`: Enables Cross-Origin Resource Sharing.
- **Models**:
  - `Audiobook`: Represents an audiobook with attributes like title, author, coverImage, description, genre, and averageRating.
  - `Review`: Represents a review for an audiobook with attributes like audiobookId, userId, rating, reviewText, and createdAt.

## API Endpoints

### 1. Get All Audiobooks

**URL**: `/audiobooks`  
**Method**: `GET`  
**Description**: Retrieves a list of all audiobooks from the database.  

**Response**:  
- **Status Code**: `200 OK`  
- **Body**: An array of audiobook objects, each containing:
  - `title`: String
  - `author`: String
  - `coverImage`: String
  - `description`: String
  - `genre`: String
  - `averageRating`: Number

**Example**:
```json
[
  {
    "_id": "60c72b2f5b1f4c001f9d2b8d",
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "coverImage": "link_to_image",
    "description": "A novel set in the Roaring Twenties...",
    "genre": "Fiction",
    "averageRating": 4.5
  }
]
```

### 2. Get Audiobook Details

**URL**: `/audiobooks/:id`  
**Method**: `GET`  
**Description**: Retrieves details of a single audiobook by ID along with its reviews.

**URL Parameters**:
- `id` (required): The ID of the audiobook.

**Response**:  
- **Status Code**: `200 OK`  
- **Body**: An object containing:
  - `audiobook`: The audiobook object.
  - `reviews`: An array of review objects for the audiobook.

**Example**:
```json
{
  "audiobook": {
    "_id": "60c72b2f5b1f4c001f9d2b8d",
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "coverImage": "link_to_image",
    "description": "A novel set in the Roaring Twenties...",
    "genre": "Fiction",
    "averageRating": 4.5
  },
  "reviews": [
    {
      "_id": "60c72b3e5b1f4c001f9d2b8e",
      "audiobookId": "60c72b2f5b1f4c001f9d2b8d",
      "userId": "user123",
      "rating": 5,
      "reviewText": "Amazing book!",
      "createdAt": "2024-07-21T15:12:00.000Z"
    }
  ]
}
```

### 3. Submit or Update Review

**URL**: `/audiobooks/:id/reviews`  
**Method**: `POST`  
**Description**: Submits a new review or updates an existing review for an audiobook.

**URL Parameters**:
- `id` (required): The ID of the audiobook.

**Request Body**:
- `userId` (required): The ID of the user submitting the review.
- `rating` (required): Rating given to the audiobook (number).
- `reviewText` (required): Text of the review.

**Response**:  
- **Status Code**: `201 Created` (for a new review) or `200 OK` (for an updated review)  
- **Body**: The review object.

**Example**:
```json
{
  "_id": "60c72b3e5b1f4c001f9d2b8e",
  "audiobookId": "60c72b2f5b1f4c001f9d2b8d",
  "userId": "user123",
  "rating": 5,
  "reviewText": "Amazing book!",
  "createdAt": "2024-07-21T15:12:00.000Z"
}
```

### 4. Update Audiobook Details

**URL**: `/audiobooks/:id`  
**Method**: `PUT`  
**Description**: Updates details of an existing audiobook. Currently, only the `averageRating` can be updated.

**URL Parameters**:
- `id` (required): The ID of the audiobook.

**Request Body**:
- `averageRating` (required): The updated average rating (number).

**Response**:  
- **Status Code**: `200 OK`  
- **Body**: The updated audiobook object.

**Example**:
```json
{
  "_id": "60c72b2f5b1f4c001f9d2b8d",
  "title": "The Great Gatsby",
  "author": "F. Scott Fitzgerald",
  "coverImage": "link_to_image",
  "description": "A novel set in the Roaring Twenties...",
  "genre": "Fiction",
  "averageRating": 4.7
}
```

## Deployment Steps

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-repository/audiobooks-api.git
   cd audiobooks-api
   ```

2. **Install Dependencies**:
   Ensure you have Node.js installed. Run:
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**:
   Create a `.env` file in the root directory of the project and add the following:
   ```env
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
   PORT=5001
   ```
   Replace `username`, `password`, `cluster`, and `database` with your MongoDB credentials and details.

4. **Start the Server**:
   ```bash
   npm start
   ```

5. **Verify the API**:
   Open your browser or use tools like Postman to test the API endpoints at `http://localhost:5001`.

## Conclusion

This Express.js application provides a straightforward API for managing audiobooks and their reviews. It connects to a MongoDB Atlas database and uses Mongoose for data modeling. The documentation includes details on the API endpoints and deployment steps to help you get the application up and running.

Feel free to adjust or expand the documentation based on additional features or requirements for your application.