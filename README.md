
# Digital Wallet API

A secure, modular, and role-based backend API for a digital wallet system (similar to Bkash or Nagad) built with Express.js and Mongoose. The system supports user registration, wallet management, and core financial operations like adding money, withdrawing funds, sending money, and more.

---

## Table of Contents

* [Features](#features)
* [Tech Stack](#tech-stack)
* [Installation](#installation)
* [API Documentation](#api-documentation)
* [Authentication](#authentication)
* [Configuration](#configuration)
* [Testing](#testing)
* [Deployment](#deployment)
* [License](#license)

---

## Features

* **User Management**: Registration, login, and role-based access control.
* **Wallet Operations**: Add funds, withdraw, and transfer money.
* **Real-Time Transactions**: Powered by Socket.IO for real-time updates.
* **Modular Architecture**: Organized by domain (e.g., users, transactions).
* **Secure Authentication**: JSON Web Tokens (JWT) for stateless authentication.
* **Swagger UI**: Interactive API documentation for easy testing.

---

## Tech Stack

* **Backend**: Node.js with Express.js
* **Database**: MongoDB with Mongoose
* **Real-Time Communication**: Socket.IO
* **Authentication**: JWT (JSON Web Tokens)
* **API Documentation**: Swagger
* **Environment Management**: dotenv
* **Code Quality**: ESLint, Prettier

---

## Installation

### Prerequisites

* Node.js (v16 or higher)
* MongoDB (local or remote instance)
* npm or bun

### Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/muhammadranju/digital-wallet-api-in-socketio.git
   cd digital-wallet-api-in-socketio
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   bun install
   ```

3. Configure environment variables:

   Copy `.env.example` to `.env` and update the values:

   ```bash
   cp .env.example .env
   ```

4. Start the application:

   ```bash
   npm start
   # or
   bun start
   ```

   The server will run on `http://localhost:3000`.

---

## API Documentation

The API follows RESTful principles and includes the following endpoints:

* **Authentication**

  * `POST /auth/register`: Register a new user.
  * `POST /auth/login`: Login and receive a JWT.
  * `POST /auth/logout`: Logout and invalidate the JWT.

* **Users**

  * `GET /users`: List all users (admin only).
  * `GET /users/:id`: Get user details.
  * `PUT /users/:id`: Update user information.
  * `DELETE /users/:id`: Delete a user.

* **Wallets**

  * `GET /wallet`: Get wallet balance.
  * `POST /wallet/add`: Add funds to wallet.
  * `POST /wallet/withdraw`: Withdraw funds from wallet.
  * `POST /wallet/transfer`: Transfer funds to another wallet.

* **Transactions**

  * `GET /transactions`: List all transactions.
  * `GET /transactions/:id`: Get transaction details.

For detailed API specifications, refer to the Swagger UI at `http://localhost:3000/api-docs`.

---

## Authentication

The API uses JWT for authentication:

* **Register**: Obtain a token by registering a new user.
* **Login**: Use the credentials to get a JWT.
* **Access Protected Routes**: Include the token in the `Authorization` header as `Bearer <token>`.

---

## Configuration

The application settings are managed via environment variables in the `.env` file:

* `PORT`: Port number for the server.
* `MONGO_URI`: MongoDB connection string.
* `JWT_SECRET`: Secret key for signing JWTs.
* `JWT_EXPIRATION`: Expiration time for JWTs.

---

## Testing

To run tests:

```bash
npm test
# or
bun test
```

The project uses Jest for unit and integration testing.

---

## Deployment

For deployment, consider using platforms like:

* **Vercel**: For serverless deployment.
* **Heroku**: For easy Node.js application hosting.
* **Docker**: Containerize the application for consistent environments.

Ensure to set the appropriate environment variables in the deployment platform.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
