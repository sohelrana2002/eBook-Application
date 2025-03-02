import express from "express";
const reviewRouter = new express.Router();
import {
  addReview,
  allReview,
  updateReview,
  deleteReview,
} from "../controllers/reviewController.js";
import jwtAuthMiddleware from "../middlewares/jwtAuthMiddleware.js";

// ----add review router----
reviewRouter.route("/:bookId/review").post(jwtAuthMiddleware, addReview);

// ----get all review router----
reviewRouter.route("/:bookId/reviews").get(allReview);

// --------update review router---
reviewRouter.route("/review/:reviewId").put(updateReview);

// ----delete review router----
reviewRouter.route("/review/:reviewId").delete(deleteReview);

export default reviewRouter;
