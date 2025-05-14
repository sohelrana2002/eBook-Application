import express from "express";
const filterRouter = new express.Router();
import { allAuthor, allLanguage } from "../controllers/filterController.js";

filterRouter.route("/authors").get(allAuthor);
filterRouter.route("/language").get(allLanguage);

export default filterRouter;
