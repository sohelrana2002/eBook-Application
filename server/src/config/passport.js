import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import userModel from "../models/authModel.js";
import { config } from "./config.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: config.googleClientId,
      clientSecret: config.googleClientSecret,
      callbackURL: config.googleCallBackURL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const existingUser = await userModel.findOne({
          email: profile.emails[0].value,
        });

        if (existingUser) {
          return done(null, existingUser);
        }

        const newUser = await userModel.create({
          name: profile.displayName,
          email: profile.emails[0].value,
          password: "GOOGLE_OAUTH_NO_PASSWORD", // you can skip password validation later
          role: "user",
        });

        done(null, newUser);
      } catch (err) {
        done(err, null);
      }
    }
  )
);
