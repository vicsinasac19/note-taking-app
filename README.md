# Note-Taking App

A secure full-stack note-taking application created as a midterm project for the Circuit Stream Web Developer program. Users can authenticate with Auth0 and create, view, edit, and delete their own notes through a responsive Bootstrap interface.

## Project Overview

The application demonstrates how a browser interface, Express server, REST API, authentication service, and MongoDB database work together in a full-stack project.

Each saved note is connected to its authenticated owner. The server assigns ownership from the logged-in user rather than accepting an owner ID from the browser. Database queries also include the owner ID so users can access only their own notes.

## Features

- Auth0 signup, login, and logout
- User records synchronized with MongoDB
- Create, read, update, and delete notes
- Notes restricted to their authenticated owner
- Server-side input validation
- RESTful API routes and JSON responses
- MongoDB storage using Mongoose
- Responsive interface built with Bootstrap 5
- User-friendly success and error messages
- Development support with Nodemon
- Secrets excluded from Git through `.gitignore`

## Technologies Used

- JavaScript
- Node.js
- Express
- EJS
- MongoDB and MongoDB Atlas
- Mongoose
- Auth0
- Bootstrap 5
- HTML5
- Git and GitHub

## Project Structure

```text
note-taking-app/
├── config/
│   └── database.js
├── controllers/
│   ├── authController.js
│   └── noteController.js
├── middleware/
│   └── syncAuth0User.js
├── models/
│   ├── Note.js
│   └── User.js
├── public/
│   ├── js/
│   │   └── notes.js
│   └── favicon.svg
├── routes/
│   ├── authRoutes.js
│   └── noteRoutes.js
├── views/
│   └── index.ejs
├── .env
├── .gitignore
├── package.json
├── package-lock.json
└── server.js
```

> The local `.env` file contains private configuration and must never be committed to GitHub.

## REST API Endpoints

| Method | Endpoint | Authentication | Purpose |
| --- | --- | --- | --- |
| `GET` | `/api/health` | Public | Confirms that the API is running |
| `GET` | `/api/notes` | Required | Returns all notes owned by the current user |
| `GET` | `/api/notes/:id` | Required | Returns one note owned by the current user |
| `POST` | `/api/notes` | Required | Creates a note for the current user |
| `PUT` | `/api/notes/:id` | Required | Updates a note owned by the current user |
| `DELETE` | `/api/notes/:id` | Required | Deletes a note owned by the current user |
| `GET` | `/profile` | Required | Returns the authenticated Auth0 profile |

## Prerequisites

To run the application locally, you need:

- Node.js and npm
- A MongoDB database or MongoDB Atlas cluster
- An Auth0 Regular Web Application
- Git

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   ```

2. Open the project directory:

   ```bash
   cd note-taking-app
   ```

3. Install the dependencies:

   ```bash
   npm install
   ```

4. Create a file named `.env` in the project root.

5. Add the required environment-variable names shown below and provide your own private values locally.

6. Ensure the local application URL and callback URL are configured in the Auth0 application settings.

7. Start the development server:

   ```bash
   npm run dev
   ```

8. Open the application in a browser:

   ```text
   http://localhost:3000
   ```

## Environment Variables

The application reads its configuration from a local `.env` file. The file must use the following variable names:

```dotenv
PORT=
MONGODB_URI=
SESSION_SECRET=
SECRET=
BASE_URL=
CLIENT_ID=
CLIENT_SECRET=
ISSUER_BASE_URL=
NODE_ENV=
```

| Variable | Required | Purpose |
| --- | --- | --- |
| `PORT` | No | Server port; the application defaults to port `3000` |
| `MONGODB_URI` | Yes | MongoDB connection string |
| `SESSION_SECRET` | Yes | Secret used by the Express session middleware |
| `SECRET` | Yes | Secret used by `express-openid-connect` to protect Auth0 session data |
| `BASE_URL` | Yes | Root URL where the application is running |
| `CLIENT_ID` | Yes | Auth0 application client identifier |
| `CLIENT_SECRET` | Yes | Auth0 application client secret |
| `ISSUER_BASE_URL` | Yes | Auth0 tenant issuer URL |
| `NODE_ENV` | No | Runtime environment, such as development or production |

Never add real values, passwords, connection strings, or Auth0 secrets to this README or commit them to GitHub.

## Available Commands

Start the application normally:

```bash
npm start
```

Start the application with Nodemon for development:

```bash
npm run dev
```

Check installed production dependencies for known vulnerabilities:

```bash
npm audit --omit=dev
```

## Authentication and Note Ownership

Auth0 handles user authentication. After a successful login, the application synchronizes the Auth0 identity with a MongoDB user record.

When a note is created, the server assigns the authenticated MongoDB user's ID to the note's `owner` field. Read, update, and delete operations query by both the note ID and owner ID. This prevents one authenticated user from accessing another user's notes through the API.

## CRUD Operations

- **Create:** Submit the note form to save a new note.
- **Read:** Load all notes belonging to the logged-in user.
- **Update:** Select **Edit**, revise the note, and save the changes.
- **Delete:** Select **Delete** and confirm the request.

## Author

Victor Sinasac

## Project Status

Completed as a midterm full-stack web development project.
