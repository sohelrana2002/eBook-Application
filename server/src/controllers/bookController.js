import booksModel from "../models/bookModel.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createBook = async (req, res, next) => {
  try {
    const {
      title,
      author,
      description,
      genre,
      language,
      publicationDate,
      price,
      tags,
    } = req.body;

    const { coverImage, bookFile } = req.files;
    // console.log("req.files:", req.files);
    // console.log("coverImage", coverImage);
    // console.log("bookFile path:", bookFile[0].path);

    const registerBook = await booksModel.create({
      title,
      author,
      description,
      genre,
      language,
      publicationDate,
      price: Number(price),
      tags,
      coverImage: coverImage?.[0]?.path,
      bookFile: bookFile?.[0]?.path,
    });

    res.status(201).json({
      message: "Create new book successfully",
      id: registerBook._id,
    });
  } catch (err) {
    console.log(err, "error from server");

    res.status(500).json({
      message: "internal server error",
      error: err,
    });
  }
};

const updateBook = async (req, res, next) => {
  try {
    const {
      title,
      author,
      description,
      genre,
      language,
      publicationDate,
      price,
      tags,
    } = req.body;

    const { coverImage, bookFile } = req.files;
    const bookId = req.params.bookId;

    const book = await booksModel.findOne({ _id: bookId });

    if (!book) {
      res.status(404).json({
        message: "Book not found.",
      });
    }

    if (coverImage) {
      const oldCoverImage = coverImage;
      const coverImagePath = path.join(
        __dirname,
        "../../public/uploads/",
        oldCoverImage.originalname
      );
      await oldCoverImage.mv(coverImagePath);
      coverImage.oldCoverImage = `../../public/uploads/${oldCoverImage.originalname}`;
    }

    const updatedBook = await booksModel.findByIdAndUpdate(
      { _id: bookId },
      {
        title,
        author,
        description,
        genre,
        language,
        publicationDate,
        price: Number(price),
        tags,
        coverImage: coverImage?.[0]?.path,
        bookFile: bookFile?.[0]?.path,
      },
      {
        new: true,
      }
    );

    if (!updatedBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json(updatedBook);
  } catch (err) {
    console.log(err, "error from server");

    res.status(500).json({
      message: "internal server error",
      error: err,
    });
  }
};

const listBook = async (req, res, next) => {
  try {
    const books = await booksModel.find({});

    res.json({
      message: "success",
      length: books.length,
      books: books,
    });
  } catch (err) {
    console.error("Internal server error", err);

    res.json({
      message: "Internal server error",
      error: err,
    });
  }
};

export { createBook, updateBook, listBook };
