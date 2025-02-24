import express from "express";
const reviewRouter = new express.Router();
import { addReview } from "../controllers/reviewController.js";
import jwtAuthMiddleware from "../middlewares/jwtAuthMiddleware.js";

reviewRouter.route("/:bookId/review").post(jwtAuthMiddleware, addReview);

export default reviewRouter;
