#### Backend API Project

This is a robust backend API built with Node.js, TypeScript, and TypeORM, designed to handle user authentication (JWT-based), manage authors and books with a relational database, implement rate limiting, and support file uploads.


##### Install dependencies:

npm install --force

Node version is need above 20

### Redis server

sudo systemctl status redis-server
sudo systemctl enable redis-server # To ensure it starts on boot
sudo systemctl start redis-server  # To start it if not running
sudo systemctl stop redis-server   # To stop it
sudo systemctl restart redis-server # To restart it

##### Features

JWT-Based Authentication: Secure user registration and login with JSON Web Tokens.

1.User Management: Endpoints for creating users and authenticating them.

2.Author & Book Management:

3.Authors: Full CRUD (Create, Read, Update, Delete) operations for authors.

4.Books: Full CRUD operations for books, with a one-to-many relationship to authors.

5.API Rate Limiting: Protects sensitive endpoints from excessive requests using express-rate-limit.

6.File Upload & Processing:

Secure endpoint for uploading image files.

File type and size validation (images only, max 5MB).

Image processing (resizing, compression) using sharp.

Uploaded files are stored locally.

Database Integration: Uses MySQL as the relational database, managed by TypeORM for object-relational mapping.

Environment Configuration: Utilizes .env files for secure management of sensitive data and settings.

#### Technologies Used

Node.js: JavaScript runtime environment.

TypeScript: Superset of JavaScript that compiles to plain JavaScript, providing static typing.

Express.js: Fast, unopinionated, minimalist web framework for Node.js.

TypeORM: An ORM (Object-Relational Mapper) that allows you to write database queries using TypeScript/JavaScript objects.

MySQL: Relational database system.

bcryptjs: Library for hashing and comparing passwords securely.

jsonwebtoken: Implements JSON Web Tokens for secure authentication.

multer: Middleware for handling multipart/form-data, primarily used for file uploads.

sharp: High-performance Node.js image processing library.

express-rate-limit: Middleware to limit repeated requests to public APIs or endpoints.

dotenv: Loads environment variables from a .env file.

nodemon: Utility that monitors for any changes in your source and automatically restarts your server.

ts-node: TypeScript execution environment for Node.js.

#### Prerequisites

Before you begin, ensure you have the following installed on your system:

Node.js: Version 18.17.0 or higher (recommended LTS version 20.x). You can use nvm (Node Version Manager) to manage Node.js versions.

npm (Node Package Manager) or Yarn: Comes with Node.js installation.

MySQL Server: A running MySQL database instance.

A MySQL Client: To connect to your database (e.g., mysql CLI, MySQL Workbench, DBeaver).

#### Installation

Follow these steps to set up the project locally:

Clone the repository:

git clone





Create and configure your .env file:
Create a file named .env in the root of your project directory and add the following environment variables. Replace the placeholder values with your actual MySQL credentials and a strong JWT secret.



### Database Setup (MySQL):

Create the database: You need to manually create the database specified in DB_NAME (e.g., Zervvo_db) in your MySQL server. TypeORM will handle the table creation.

CREATE DATABASE zervvo_db;

Ensure User Permissions: Make sure the DB_USER specified in your .env has appropriate permissions to create tables and perform CRUD operations on the zervvo_db database.

### Running the Application

### Development Mode

To run the application in development mode with nodemon (which provides auto-restarting on file changes):

npm run dev

The server will start on the port specified in your .env file (default: 3000).

You should see output like:

Upload directory created or already exists: ./uploads
Data Source has been initialized!
Server running on port 3000
Access the API at http://localhost:3000


### Production Mode

To build and run the compiled JavaScript code:

Build the TypeScript project:

npm run build

This compiles the TypeScript files from src/ into JavaScript files in the dist/ directory.

Start the production server:

npm start





### Important Notes
synchronize: true in src/config/data-source.ts: This setting is currently enabled for development convenience. It automatically creates or updates database tables based on your TypeORM entities every time the application starts. It is highly recommended to set synchronize: false and use TypeORM migrations for production environments to manage schema changes in a controlled and reliable manner.

MySQL Server Stability: If you encounter QueryFailedError: Cannot enqueue Query after invoking quit. errors on startup, it likely indicates your MySQL server isn't fully ready when the Node.js application tries to connect. Ensure your MySQL server is running stably before starting the Node.js app. The retry logic in server.ts helps, but a stable MySQL server is key.

Security: The JWT_SECRET in your .env file must be a strong, random, and confidential string, especially in production. Do not hardcode it or use weak secrets.