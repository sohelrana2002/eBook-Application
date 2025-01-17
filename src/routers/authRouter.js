import express from "express";
import usersValidatorSchema from "../validator/authValidator.js";
import { register as authRegister } from "../controllers/authController.js";
const router = new express.Router();
import validate from "../middlewares/validateMiddleware.js";

// =====for sign up=====
router.route("/sign-up").post(validate(usersValidatorSchema), authRegister);

export default router;
