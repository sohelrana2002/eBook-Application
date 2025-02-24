import { log } from "console";
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
    const { genre, language, minPrice, maxPrice, title, sortBy, order } =
      req.query;

    let query = {};

    // ---for genre---
    if (genre) {
      query.genre = {
        $in: genre.split(",").map((g) => new RegExp(`^${g}$`, "i")),
      };
    }

    // ---for language---
    if (language) {
      query.language = language.toLowerCase();
    }

    // ----for price---
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    // ---for title---
    if (title) {
      query.title = { $regex: title, $options: "i" };
    }

    // console.log("query", query);

    let sortQuery = {};
    const validSortFields = ["genre", "language", "price"];
    if (sortBy && validSortFields.includes(sortBy)) {
      sortQuery[sortBy] = order === "desc" ? -1 : 1;
    }

    // console.log("sortQuery", sortQuery);

    const books = await booksModel.find(query).sort(sortQuery);

    res.status(200).json({
      message: "success",
      length: books.length,
      books: books,
    });
  } catch (err) {
    console.error("Internal server error", err);

    res.status(500).json({
      message: "Internal server error",
      error: err,
    });
  }
};

const getSingleBook = async (req, res, next) => {
  try {
    const bookId = req.params.bookId;
    // console.log("bookId", bookId);

    const singleBook = await booksModel.find({ _id: bookId });

    if (!singleBook) {
      res.status(404).json({
        message: "Book not found!",
      });
    } else {
      res.status(200).json({
        message: "success",
        singeBook: singleBook,
      });
    }
  } catch (err) {
    console.error("Internal server error", err);

    res.status(500).json({
      message: "Internal server error",
      error: err,
    });
  }
};

const deleteBook = async (req, res, next) => {
  const bookId = req.params.bookId;

  const book = await booksModel.findOne({ _id: bookId });

  if (!book) {
    res.status(404).json({
      message: "Book not found!",
    });
  } else {
    await booksModel.deleteOne({ _id: bookId });

    res.status(200).json({
      message: "Book deleted successfully!",
      id: bookId,
    });
  }
};

export { createBook, updateBook, listBook, getSingleBook, deleteBook };
