import express from "express";
const bookRouter = new express.Router();
import { createBook, updateBook } from "../controllers/bookController.js";
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

export default bookRouter;
