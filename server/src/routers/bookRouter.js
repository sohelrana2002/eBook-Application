import express from "express";
const bookRouter = new express.Router();
import { createBook } from "../controllers/bookController.js";
import booksValidatorSchema from "../validator/bookValidator.js";
import validate from "../middlewares/validateMiddleware.js";

bookRouter.route("/").post(validate(booksValidatorSchema), createBook);

export default bookRouter;
