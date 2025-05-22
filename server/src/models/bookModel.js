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
      type: Array,
      required: true,
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
      type: Number,
      required: true,
    },

    tags: {
      type: [String],
      required: true,
      lowercase: true,
    },

    coverImage: {
      type: String,
      required: false,
    },

    bookFile: {
      type: String,
      required: false,
    },

    averageRating: { type: Number, default: 0 },

    isOscor: {
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

const booksModel = new mongoose.model("book", bookSchema);

export default booksModel;
