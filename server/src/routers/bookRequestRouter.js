import express from "express";
const bookRequestRouter = new express.Router();
import jwtAuthMiddleware from "../middlewares/jwtAuthMiddleware.js";
import authorizedRoles from "../middlewares/authorizedRole.js";
import validate from "../middlewares/validateMiddleware.js";
import {
  bookRequestValidatorSchema,
  bookRequestUpdateSchema,
} from "../validator/bookRequestValidator.js";
import {
  bookRequest,
  getBookRequest,
  updateBookStatus,
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

// get all request
bookRequestRouter
  .route("/user")
  .get(jwtAuthMiddleware, authorizedRoles("admin", "user"), getBookRequest);

//  Admin updates status
bookRequestRouter
  .route("/:bookId/status")
  .post(
    validate(bookRequestUpdateSchema),
    jwtAuthMiddleware,
    authorizedRoles("admin"),
    updateBookStatus
  );

export default bookRequestRouter;
