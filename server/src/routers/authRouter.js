import express from "express";
const authRouter = new express.Router();
import usersValidatorSchema from "../validator/authValidator.js";
import {
  register as authRegister,
  login as authLogin,
  getUserInfo,
  userProfile,
  getAdminInfo,
} from "../controllers/authController.js";
import validate from "../middlewares/validateMiddleware.js";
import jwtAuthMiddleware from "../middlewares/jwtAuthMiddleware.js";
import authorizedRole from "../middlewares/authorizedRole.js";

// =====for sign up=====
authRouter.route("/sign-up").post(validate(usersValidatorSchema), authRegister);

// =====for login====
authRouter.route("/login").post(authLogin);

// ====for get users informantion=========
authRouter
  .route("/users-info")
  .get(jwtAuthMiddleware, authorizedRole("admin"), getUserInfo);

// ====for get admin informantion=========
authRouter
  .route("/admin-info")
  .get(jwtAuthMiddleware, authorizedRole("admin"), getAdminInfo);

// ====for individual profile information===
authRouter
  .route("/user-profile")
  .get(jwtAuthMiddleware, authorizedRole("admin", "user"), userProfile);

export default authRouter;
