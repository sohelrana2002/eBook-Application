import express from "express";
import jwtAuthMiddleware from "../middlewares/jwtAuthMiddleware.js";
import authorizedRoles from "../middlewares/authorizedRole.js";
import { createContact } from "../controllers/contactController.js";

const contactRouter = new express.Router();

contactRouter
  .route("/")
  .post(jwtAuthMiddleware, authorizedRoles("admin", "user"), createContact);

export default contactRouter;
