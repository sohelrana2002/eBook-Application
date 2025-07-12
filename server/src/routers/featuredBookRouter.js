import express from "express";
import { featuredBook } from "../controllers/featuredBookController.js";

const featuredBookRouter = new express.Router();

featuredBookRouter.route("/").get(featuredBook);

export default featuredBookRouter;
