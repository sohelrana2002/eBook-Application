import express from "express";
const bookRouter = new express.Router();
import { createBook } from "../controllers/bookController.js";
import booksValidatorSchema from "../validator/bookValidator.js";
import validate from "../middlewares/validateMiddleware.js";
import { upload } from "../middlewares/multerMiddleware.js";

bookRouter.route("/").post(
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "bookFile", maxCount: 1 },
  ]),
  validate(booksValidatorSchema),
  createBook
);

export default bookRouter;
