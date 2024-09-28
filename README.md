# Hotel Booking System API

This project is a hotel booking system API built using Node.js, Express, MySQL, and TypeScript. The system includes several core features, such as user authentication (with access and refresh tokens), error handling, and the use of generic types for dynamic typing and structure. The project supports adding, managing, and booking hotels, along with options and reservations.

## Features

- **Authentication**: JWT-based authentication with access and refresh tokens for secure login and session management.
- **Error Handling**: Centralized error handling for clean and maintainable code.
- **Dynamic Typing**: Use of TypeScript generic types to make the code more dynamic and flexible.
- **Hotel Management**: Add and manage hotel information, including location, price, and descriptions.
- **Booking System**: Allows users to make and manage hotel reservations.
- **MySQL Database**: Stores users, hotels, reservations, and options in a MySQL database.
- **Structured Logging**: Logging important events and errors using Winston.

## Project Structure

- **/src**: Contains all the TypeScript source files.
- **/config**: Contains environment variable configurations.
- **/routes**: API routes for users, hotels, and reservations.
- **/controllers**: Handles the core logic for interacting with the database.
- **/middlewares**: Custom middleware for authentication and error handling.

## Dependencies

```json
"dependencies": {
    "bcrypt": "^5.1.1",
    "cookie-parser": "^1.4.6",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.19.2",
    "joi": "^17.13.3",
    "jsonwebtoken": "^9.0.2",
    "lodash": "^4.17.21",
    "mysql2": "^3.11.0",
    "qs": "^6.13.0",
    "winston": "^3.14.2"
},
"devDependencies": {
    "@types/bcrypt": "^5.0.2",
    "@types/cookie-parser": "^1.4.7",
    "@types/cors": "^2.8.17",
    "@types/express": "^4.17.21",
    "@types/jsonwebtoken": "^9.0.7",
    "@types/lodash": "^4.17.9",
    "@types/node": "^22.5.3",
    "@types/qs": "^6.9.15",
    "nodemon": "^3.1.4",
    "ts-node": "^10.9.2",
    "typescript": "^5.5.4"
}

## Database Schema Setup

To set up the database schema, use the following SQL statements:

```sql
CREATE TABLE `bookmarks` (
  `id` int NOT NULL AUTO_INCREMENT,
  `city_name` varchar(50) NOT NULL,
  `country` varchar(50) NOT NULL,
  `country_code` varchar(5) NOT NULL,
  `latitude` decimal(10,7) NOT NULL,
  `longitude` decimal(10,7) NOT NULL,
  `host_location` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
);
CREATE TABLE `hotels` (
  `id` int NOT NULL AUTO_INCREMENT,
  `picture_url` varchar(255) NOT NULL,
  `smart_location` varchar(100) NOT NULL,
  `name` varchar(255) NOT NULL,
  `price` mediumint NOT NULL,
  `summary` text NOT NULL,
  `description` text NOT NULL,
  `street` varchar(255) NOT NULL,
  `city` varchar(50) NOT NULL,
  `state` varchar(50) NOT NULL,
  `country` varchar(50) NOT NULL,
  `latitude` decimal(10,7) NOT NULL,
  `longitude` decimal(10,7) NOT NULL,
  PRIMARY KEY (`id`),
  FULLTEXT KEY `idx_multi_columns` (`smart_location`, `name`, `summary`, `description`, `street`, `city`, `state`, `country`)
);
CREATE TABLE `options` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(25) NOT NULL,
  `max_limit` tinyint NOT NULL,
  `hotel_id` int NOT NULL,
  `min_limit` tinyint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `options_to_hotels_idx` (`hotel_id`),
  CONSTRAINT `options_to_hotels` FOREIGN KEY (`hotel_id`) REFERENCES `hotels` (`id`)
);
CREATE TABLE `users` (
  `id` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `email` varchar(200) NOT NULL,
  PRIMARY KEY (`id`)
);
CREATE TABLE `reservations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `hotel_id` int NOT NULL,
  `check_in` date NOT NULL,
  `check_out` date NOT NULL,
  PRIMARY KEY (`id`),
  KEY `reservation_to_hotels_idx` (`hotel_id`),
  CONSTRAINT `reservation_to_hotels` FOREIGN KEY (`hotel_id`) REFERENCES `hotels` (`id`)
);

