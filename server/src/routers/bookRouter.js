import express from "express";
const bookRouter = new express.Router();
import {
  createBook,
  updateBook,
  listBook,
  getSingleBook,
  deleteBook,
  recommendedBooks,
  getAllBooksWithJSONFormet,
  // deleteAllBooks,
} from "../controllers/bookController.js";
import booksValidatorSchema from "../validator/bookValidator.js";
import validate from "../middlewares/validateMiddleware.js";
import { upload } from "../middlewares/multerMiddleware.js";
import jwtAuthMiddleware from "../middlewares/jwtAuthMiddleware.js";
import authorizedRoles from "../middlewares/authorizedRole.js";

// =====create book===
bookRouter.route("/").post(
  jwtAuthMiddleware,
  authorizedRoles("admin"),
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "bookFile", maxCount: 1 },
  ]),
  validate(booksValidatorSchema),
  createBook
);

// =====update book =====
bookRouter.route("/:bookId").patch(
  jwtAuthMiddleware,
  authorizedRoles("admin"),
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "bookFile", maxCount: 1 },
  ]),
  validate(booksValidatorSchema),
  updateBook
);

// =====list of all books (for user plan)====
// bookRouter
//   .route("/")
//   .get(jwtAuthMiddleware, authorizedRoles("admin", "user"), listBook);

// =====list of all books (for current plan)====
bookRouter.route("/").get(listBook);

// ===details of individual book===
bookRouter.route("/:slug").get(getSingleBook);

bookRouter
  .route("/:bookId")
  .delete(jwtAuthMiddleware, authorizedRoles("admin"), deleteBook);

// recommeneded book
bookRouter.route("/by-tags/:bookId").get(recommendedBooks);

// delete all books router
// bookRouter.route("/delete/allbooks").delete(deleteAllBooks);

// get all books as json formet
bookRouter
  .route("/json/allBooks")
  .get(jwtAuthMiddleware, authorizedRoles("admin"), getAllBooksWithJSONFormet);

export default bookRouter;
