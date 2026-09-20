// Load variables from the .env file
require("dotenv").config();

const express = require("express");
const path = require("path");
const connectDatabase = require("./config/database");

const app = express();

connectDatabase();

const PORT = process.env.PORT || 3000;

// Tell Express to use EJS for views
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware for incoming form and JSON data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Make files inside the public folder available to the browser
app.use(express.static(path.join(__dirname, "public")));

// Display the main page
app.get("/", (req, res) => {
  res.render("index", {
    pageTitle: "My Notes"
  });
});

// Simple API test route
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Note-Taking API is running"
  });
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});