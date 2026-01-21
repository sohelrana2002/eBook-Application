import express from "express";
import { featuredBook } from "../controllers/featuredBook.controller.js";

const featuredBookRouter = new express.Router();

featuredBookRouter.route("/").get(featuredBook);

export default featuredBookRouter;
