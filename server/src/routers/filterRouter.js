import express from "express";
const filterRouter = new express.Router();
import { allAuthor } from "../controllers/filterController.js";

filterRouter.route("/authors").get(allAuthor);

export default filterRouter;
