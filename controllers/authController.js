const User = require("../models/User");

async function registerUser(req, res) {
  try {
    const { name, email, password } = req.body;

    // Basic request validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required"
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least 8 characters"
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check whether the email is already registered
    const existingUser = await User.findOne({
      email: normalizedEmail
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists"
      });
    }

    // The User model hashes the password before saving
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password
    });

    // Remember which user is logged in
    req.session.userId = user._id;

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error("Registration error:", error);

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(
        validationError => validationError.message
      );

      return res.status(400).json({
        success: false,
        message: messages.join(", ")
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unable to create the account"
    });
  }
}

module.exports = {
  registerUser
};