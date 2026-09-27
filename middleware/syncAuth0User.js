const User = require("../models/User");

async function syncAuth0User(req, res, next) {
  try {
    if (!req.oidc || !req.oidc.isAuthenticated()) {
      return next();
    }

    const { sub, name, nickname, email, picture } = req.oidc.user;

    if (!sub || !email) {
      return res.status(400).send(
        "The Auth0 profile is missing a user ID or email address."
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // First, look for a user already connected to this Auth0 identity.
    let user = await User.findOne({ auth0Id: sub });

    // If necessary, connect an existing account with the same email.
    if (!user) {
      user = await User.findOne({ email: normalizedEmail });

      if (user) {
        user.auth0Id = sub;
      } else {
        user = new User({
          auth0Id: sub,
          name: name || nickname || "Auth0 User",
          email: normalizedEmail,
          picture: picture || null
        });
      }
    }

    user.name = name || nickname || user.name;
    user.email = normalizedEmail;
    user.picture = picture || user.picture || null;

    await user.save();

    req.currentUser = user;
    res.locals.currentUser = user;

    next();
  } catch (error) {
    console.error("Auth0 user synchronization error:", error);
    next(error);
  }
}

module.exports = syncAuth0User;