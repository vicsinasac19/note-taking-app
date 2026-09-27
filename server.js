// Load variables from the .env file
require("dotenv").config();

const express = require("express");
const path = require("path");
const session = require("express-session");
const { MongoStore } = require("connect-mongo");
const { auth, requiresAuth } = require("express-openid-connect");
const connectDatabase = require("./config/database");
const authRoutes = require("./routes/authRoutes");
const syncAuth0User = require("./middleware/syncAuth0User");
const app = express();

connectDatabase();

const PORT = process.env.PORT || 3000;

// Tell Express to use EJS for views
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware for incoming form and JSON data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,

    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI
    }),

    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24
    }
  })
);
// Auth0 authentication middleware
app.use(
  auth({
    authRequired: false,
    auth0Logout: true,
    secret: process.env.SECRET,
    baseURL: process.env.BASE_URL,
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    issuerBaseURL: process.env.ISSUER_BASE_URL
  })
);
app.use(syncAuth0User);

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.oidc.isAuthenticated();
  res.locals.user = req.oidc.user || null;
  next();
});
// Make files inside the public folder available to the browser
app.use(express.static(path.join(__dirname, "public")));
app.use("/api/auth", authRoutes);

// Sign-up route
app.get("/signup", (req, res) => {
  res.oidc.login({
    returnTo: "/",
    authorizationParams: {
      screen_hint: "signup"
    }
  });
});

// Display the main page
app.get("/", (req, res) => {
  res.render("index", {
    pageTitle: "My Notes"
  });
});

// Temporary protected profile route
app.get("/profile", requiresAuth(), (req, res) => {
  res.status(200).json({
    success: true,
    user: req.oidc.user
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
