import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    author: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    description: {
      type: String,
    },

    genre: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    language: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    publicationDate: {
      type: Date,
      required: true,
    },

    price: {
      type: Double,
      required: true,
    },

    tags: {
      type: Array,
      required: true,
      lowercase: true,
    },

    coverImage: {
      type: String,
      required: true,
    },

    bookFile: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

const booksModel = new mongoose.model("book", bookSchema);

export default booksModel;
