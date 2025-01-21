import express from "express";
const router = new express.Router();
import usersValidatorSchema from "../validator/authValidator.js";
import {
  register as authRegister,
  login as authLogin,
  getUserInfo,
  userProfile,
} from "../controllers/authController.js";
import validate from "../middlewares/validateMiddleware.js";
import jwtAuthMiddleware from "../middlewares/jwtAuthMiddleware.js";

// =====for sign up=====
router.route("/sign-up").post(validate(usersValidatorSchema), authRegister);

// =====for login====
router.route("/login").post(authLogin);

// ====for get users informantion=========
router.route("/users-info").get(getUserInfo);

// ====for individual profile information===
router.route("/user-profile").get(jwtAuthMiddleware, userProfile);

export default router;
