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
  deleteRequestedBook,
  allRequestedBook,
  singleRequestedBook,
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

// delete book requested
bookRequestRouter.route("/delete/:bookId").delete(deleteRequestedBook);

// get all book request
bookRequestRouter
  .route("/all-request")
  .get(jwtAuthMiddleware, authorizedRoles("admin"), allRequestedBook);

// single book request details
bookRequestRouter
  .route("/single-book-request/:bookId")
  .get(jwtAuthMiddleware, authorizedRoles("admin"), singleRequestedBook);

export default bookRequestRouter;
