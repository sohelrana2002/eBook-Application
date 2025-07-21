import express from "express";
import { createNewsletter } from "../controllers/newsletterController.js";
import jwtAuthMiddleware from "../middlewares/jwtAuthMiddleware.js";
import authorizedRoles from "../middlewares/authorizedRole.js";

const newsletterRouter = new express.Router();

newsletterRouter
  .route("/")
  .post(jwtAuthMiddleware, authorizedRoles("admin", "user"), createNewsletter);

export default newsletterRouter;
