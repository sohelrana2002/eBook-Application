import express from "express";
const bookRequestRouter = new express.Router();
import jwtAuthMiddleware from "../middlewares/jwtAuthMiddleware.js";
import authorizedRoles from "../middlewares/authorizedRole.js";
import validate from "../middlewares/validateMiddleware.js";
import bookRequestValidatorSchema from "../validator/bookRequestValidator.js";
import {
  bookRequest,
  getBookRequest,
} from "../controllers/bookRequestController.js";

// Create a book request
bookRequestRouter
  .route("/")
  .post(
    validate(bookRequestValidatorSchema),
    jwtAuthMiddleware,
    authorizedRoles("admin", "user"),
    bookRequest
  );

// Create a book request
bookRequestRouter
  .route("/user/:userId")
  .get(jwtAuthMiddleware, authorizedRoles("admin", "user"), getBookRequest);

export default bookRequestRouter;
