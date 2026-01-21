import express from "express";
import jwtAuthMiddleware from "../middlewares/jwtAuthMiddleware.js";
import authorizedRoles from "../middlewares/authorizedRole.js";
import { createContact } from "../controllers/contact.controller.js";
import contactValidatorSchema from "../validator/contactValidator.js";
import validate from "../middlewares/validateMiddleware.js";

const contactRouter = new express.Router();

contactRouter
  .route("/")
  .post(
    jwtAuthMiddleware,
    authorizedRoles("admin", "user"),
    validate(contactValidatorSchema),
    createContact,
  );

export default contactRouter;
