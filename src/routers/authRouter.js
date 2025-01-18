import express from "express";
import usersValidatorSchema from "../validator/authValidator.js";
import {
  register as authRegister,
  login as authLogin,
  getUserInfo,
} from "../controllers/authController.js";
const router = new express.Router();
import validate from "../middlewares/validateMiddleware.js";

// =====for sign up=====
router.route("/sign-up").post(validate(usersValidatorSchema), authRegister);

// =====for login====
router.route("/login").post(authLogin);

// ====for get users informantion=========
router.route("/users-info").get(getUserInfo);

export default router;
