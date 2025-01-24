import express from "express";
const bookRouter = new express.Router();
import { createBook } from "../controllers/bookController.js";

bookRouter.route("/").get(createBook);

export default bookRouter;
