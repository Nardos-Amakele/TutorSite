const GoogleStrategy = require("passport-google-oauth20").Strategy;
require("dotenv").config();
const { v4: uuidv4 } = require("uuid");
const passport = require("passport");
const { google } = require("googleapis");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback",
      scope: ["profile", "email"],
    },
    async function (accessToken, refreshToken, profile, cb) {
      console.log(profile);

      let user = {
        full_name: profile._json.name,
        email: profile._json.email,
        password: uuidv4(),
        avatar: profile._json.picture,
      };
      console.log(user);
      return cb(null, user);
    }
  )
);

const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI // not needed for server-to-server but can be dummy
);

oAuth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

module.exports = { passport, oAuth2Client };
