import mongoose from "mongoose";
import booksModel from "./bookModel.js";
import authModel from "./authModel.js";

const reviewSchema = new mongoose.Schema(
  {
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: booksModel,
      required: true,
    },
    reviewerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: authModel,
      required: true,
    },

    reviewerName: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

const reviewsModel = new mongoose.model("review", reviewSchema);

export default reviewsModel;
