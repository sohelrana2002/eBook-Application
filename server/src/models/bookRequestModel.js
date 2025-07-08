import mongoose from "mongoose";

const bookRequestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user", //model name(auth model name) as string
      required: true,
    },
    bookName: {
      type: String,
      required: true,
    },
    authorName: {
      type: String,
      required: true,
    },
    publicationDate: {
      type: Date,
      required: true,
    },
    language: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "available", "not-found"],
      default: "pending",
    },
    isSeen: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

const bookRequestModel = new mongoose.model("bookrequest", bookRequestSchema);

export default bookRequestModel;
