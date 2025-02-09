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
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "bookFile", maxCount: 1 },
  ]),
  validate(booksValidatorSchema),
  jwtAuthMiddleware,
  authorizedRoles("admin"),
  createBook
);

// =====update book =====
bookRouter.route("/:bookId").patch(
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "bookFile", maxCount: 1 },
  ]),
  validate(booksValidatorSchema),
  jwtAuthMiddleware,
  authorizedRoles("admin"),
  updateBook
);

export default bookRouter;
