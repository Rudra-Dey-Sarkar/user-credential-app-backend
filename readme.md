# User Credential App Backend

This is the backend for a user credential management system built using Node.js, Express, and MongoDB. It includes user registration, login, password reset using OTP, and email notifications.

## Features

- User registration with unique username and email validation.
- User login with password verification.
- Password recovery via OTP sent to the user’s email.
- Password update functionality after OTP verification.

## Directory Structure

```
Rudra-Dey-Sarkar-user-credential-app-backend/
├── package.json          # Project dependencies and scripts
├── server.js             # Main server file
├── vercel.json           # Configuration for Vercel deployment
└── src/
    ├── config/
    │   └── db.js         # Database connection configuration
    └── models/
        └── user.js       # Mongoose schema for user data
```

## Endpoints

### Root Endpoint

**GET /**

**Description**:- Test route to ensure the server is running.

**Response**:-

- **Status 200**:- Returns "Working" message.

### User Registration

**POST /register**

**Description**:- Registers a new user if the username and email do not already exist.

**Request Body**:-

```json
{
  "username":- "string",
  "email":- "string",
  "password":- "string"
}
```

**Response**:-

- **Status 200**:- Returns user data on successful registration.
- **Status 404**:- Returns error messages if username or email already exists.

### User Login

**POST /login**

**Description**:- Authenticates a user using either username or email and password.

**Request Body**:-

```json
{
  "username":- "string",  // Optional
  "email":- "string",     // Optional
  "password":- "string"
}
```

**Response**:-

- **Status 200**:- Returns user data if credentials are valid.
- **Status 404**:- Returns an error message for incorrect credentials.

### Password Recovery (OTP Request)

**POST /forget-otp**

**Description**:- Sends a fixed OTP to the user's email for password reset.

**Request Body**:-

```json
{
  "username":- "string",  // Optional
  "email":- "string"      // Optional
}
```

**Response**:-

- **Status 200**:- Confirms that OTP has been sent to the email.
- **Status 404**:- Returns an error if the user is not found.

### Password Update After OTP Verification

**PUT /forget**

**Description**on\*\*on\*\*:- Updates the user's password after verifying the OTP.

**Request Body**:-

```json
{
  "otp":- "string",
  "username":- "string",  // Optional
  "email":- "string",     // Optional
  "password":- "string"
}
```

**Response**:-

- **Status 200**:- Returns a success message and updated user data.
- **Status 400**:- Returns an error for incorrect OTP.
- **Status 404**:- Returns an error if the user is not found.

## Environment Variables

Create a `.env` file in the root directory with the following variables:-

```
PORT=<port_number>
EMAIL=<email_address>
PW=<email_pasword>
```

###  Dependencies

- `express` - Web framework for Node.js
- `mongoose` - MongoDB object modeling for Node.js
- `cors` - Middleware for enabling CORS
- `dotenv` - Loads environment variables from .env
- `nodemailer` - For sending email notifications

## Usage

Install dependencies:-

```
npm install
```

Start the server:-

```
npm start
```

## Deployment

The project is configured for deployment on Vercel. Make sure `vercel.json` is correctly set up for your environment.

This backend is part of a larger system for managing user credentials securely and efficiently.

