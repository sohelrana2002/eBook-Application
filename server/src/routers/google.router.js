import express from "express";
import passport from "passport";
import "../config/passport.js";
import { config } from "../config/config.js";

const googleRouter = express.Router();

// === Google Login Request ===
googleRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// === Google Callback ===
googleRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login",
  }),
  async (req, res) => {
    try {
      const user = req.user;

      // Use your existing generateToken method
      const token = await user.generateToken();

      // You can redirect or respond with the token
      res.redirect(`${config.frontEndBaseURL}/google?token=${token}`);
    } catch (err) {
      console.error("Google Auth Error:", err);
      res.status(500).json({ message: "Google Auth Error" });
    }
  }
);

export default googleRouter;
