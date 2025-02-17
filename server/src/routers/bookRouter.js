import express from "express";
const bookRouter = new express.Router();
import {
  createBook,
  updateBook,
  listBook,
  getSingleBook,
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

bookRouter
  .route("/")
  .get(jwtAuthMiddleware, authorizedRoles("admin", "user"), listBook);

bookRouter
  .route("/:bookId")
  .get(jwtAuthMiddleware, authorizedRoles("admin", "user"), getSingleBook);

export default bookRouter;
