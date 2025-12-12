import booksModel from "../models/bookModel.js";
import path from "path";
import { fileURLToPath } from "url";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";
import mongoose from "mongoose";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// create a book
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
      isOscar,
      isNovel,
      isShortStory,
      isPoetry,
      isKidsBook,
    } = req.body;

    const { coverImage, bookFile } = req.files;
    // console.log("req.files:", req.files);
    // console.log("coverImage", coverImage);
    // console.log("bookFile path:", bookFile[0].path);

    const coverImageMimeType = coverImage?.[0]?.mimetype?.split("/")?.at(-1);
    const fileName = coverImage?.[0]?.filename;
    const filePath = path?.resolve(__dirname, "../../public/uploads", fileName);

    const coverImageUpload = await cloudinary?.uploader?.upload(filePath, {
      public_id: path.parse(fileName).name,
      overwrite: true,
      folder: "cover-image",
      format: coverImageMimeType,
    });

    // console.log("coverImageUpload", coverImageUpload);

    const bookFileName = bookFile?.[0]?.filename;
    const bookFilePath = path?.resolve(
      __dirname,
      "../../public/uploads",
      bookFileName
    );

    const bookFilesUpload = await cloudinary?.uploader?.upload(bookFilePath, {
      public_id: path.parse(bookFileName).name,
      overwrite: true,
      resource_type: "raw",
      folder: "book-pdfs",
      format: "pdf",
    });

    const registerBook = await booksModel.create({
      title,
      author,
      description,
      genre,
      language,
      publicationDate,
      price: parseFloat(price),
      tags,
      isOscar,
      isNovel,
      isShortStory,
      isPoetry,
      isKidsBook,
      coverImage: coverImageUpload?.secure_url,
      bookFile: bookFilesUpload?.secure_url,
    });

    await fs.promises.unlink(filePath);
    await fs.promises.unlink(bookFilePath);

    // WebSocket: emit event after book is created
    const io = req.app.get("io");
    io.emit("new_book", {
      id: registerBook._id,
      title: registerBook.title,
      author: registerBook.author,
      createdAt: new Date(),
    });

    res.status(201).json({
      message: "Create new book successfully!",
      id: registerBook._id,
    });
  } catch (error) {
    console.error("Book creation error.", error.message);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

// update a book
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
      isOscar,
      isNovel,
      isShortStory,
      isPoetry,
      isKidsBook,
    } = req.body;

    const { coverImage, bookFile } = req.files;
    const bookId = req.params.bookId;

    const book = await booksModel.findOne({ _id: bookId });

    if (!book) {
      res.status(404).json({
        message: "Book not found.",
      });
    }

    let completeCoverImage = "";
    if (coverImage) {
      const coverImageMimeType = coverImage?.[0]?.mimetype.split("/").at(-1);
      const fileName = coverImage?.[0]?.filename;
      const filePath = path.resolve(
        __dirname,
        "../../public/uploads",
        fileName
      );

      completeCoverImage = fileName;
      const coverImageUpload = await cloudinary.uploader.upload(filePath, {
        public_id: path.parse(completeCoverImage).name,
        overwrite: true,
        folder: "cover-image",
        format: coverImageMimeType,
      });

      completeCoverImage = coverImageUpload.secure_url;
      await fs.promises.unlink(filePath);
    }

    let completeBookFile = "";
    if (bookFile) {
      const bookFileName = bookFile?.[0]?.filename;
      const bookFilePath = path.resolve(
        __dirname,
        "../../public/uploads",
        bookFileName
      );

      completeBookFile = bookFileName;
      const bookFilesUpload = await cloudinary.uploader.upload(bookFilePath, {
        public_id: path.parse(completeBookFile).name,
        overwrite: true,
        resource_type: "raw",
        folder: "book-pdfs",
        format: "pdf",
      });

      completeBookFile = bookFilesUpload.secure_url;
      await fs.promises.unlink(bookFilePath);
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
        isOscar,
        isNovel,
        isShortStory,
        isPoetry,
        isKidsBook,
        coverImage: completeCoverImage ? completeCoverImage : book.coverImage,
        bookFile: completeBookFile ? completeBookFile : book.bookFile,
      },
      {
        new: true,
      }
    );

    if (!updatedBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json({
      message: "Book update successfully!",
      id: updatedBook._id,
    });
  } catch (error) {
    console.error("Update book error.", error.message);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

// all book list
const listBook = async (req, res, next) => {
  try {
    const {
      genre,
      language,
      author,
      minPrice,
      maxPrice,
      title,
      sortBy,
      order,
      page,
      limit,
      search,
      isOscar,
    } = req.query;

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

    // ---for author---
    if (author) {
      query.author = author.toLowerCase();
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

    if (isOscar) {
      query.isOscar = isOscar.toLowerCase();
    }

    // ---for search---
    if (search) {
      query = {
        $or: [{ title: { $regex: search, $options: "i" } }],
      };
    }

    // console.log("query", query);

    let sortQuery = {};
    const validSortFields = ["genre", "title", "price"];
    if (sortBy && validSortFields.includes(sortBy)) {
      sortQuery[sortBy] = order === "desc" ? -1 : 1;
    }

    // console.log("sortQuery", sortQuery);

    // --- Pagination----
    const pageNumber = parseInt(page) || 1;
    const pageSize = parseInt(limit) || 12;
    const skip = (pageNumber - 1) * pageSize;

    // ---count total book list---
    const totalBooks = await booksModel.countDocuments(query);

    const books = await booksModel
      .find(query)
      .sort(sortQuery)
      .skip(skip)
      .limit(pageSize);

    res.status(200).json({
      message: "success",
      totalBooks: totalBooks,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalBooks / pageSize),
      currentLength: books.length,
      books: books,
    });
  } catch (error) {
    console.error("List all book error.", error.message);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

// get single book information
const getSingleBook = async (req, res, next) => {
  try {
    const { slug } = req.params;
    // console.log("bookId", bookId);
    const isObjectId = mongoose.Types.ObjectId.isValid(slug);

    const singleBook = await booksModel.findOne(
      isObjectId ? { $or: [{ _id: slug }, { slug: slug }] } : { slug: slug }
    );

    // console.log("singleBook", singleBook);

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
  } catch (error) {
    console.error("Single book details error.", error.message);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

// delete a book
const deleteBook = async (req, res, next) => {
  const io = req.app.get("io");

  try {
    const bookId = req.params.bookId;

    const book = await booksModel.findByIdAndDelete({ _id: bookId });

    if (!book) {
      return res.status(404).json({
        message: "Book not found!",
      });
    }

    const io = req.app.get("io");
    io.emit("delete_book", book._id.toString());

    return res.status(200).json({
      message: "Book deleted successfully!",
      id: bookId,
    });
  } catch (error) {
    console.error("Deleted book error.", error.message);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

//smart recommended books
const recommendedBooks = async (req, res) => {
  const { bookId } = req.params;

  try {
    const currentBook = await booksModel.findOne({ slug: bookId });

    if (!currentBook) {
      return res.status(404).json({
        message: "Book not found!",
      });
    }

    // Find books with similar tags, excluding the current one
    const bookRecommentation = await booksModel
      .find({
        slug: { $ne: bookId },
        tags: { $in: currentBook.tags },
      })
      .limit(8);

    res.status(200).json({
      message: "success",
      length: bookRecommentation.length,
      recommendations: bookRecommentation,
    });
  } catch (error) {
    console.error("Recommended book error.", error.message);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

// controllers/bookController.js
const getAllBooksWithJSONFormet = async (req, res) => {
  try {
    // Exclude _id, __v, created_at, updated_at
    const allBooks = await booksModel.find(
      {},
      {
        _id: 0,
        __v: 0,
        created_at: 0,
        updated_at: 0,
        coverImage: 0,
        bookFile: 0,
      }
    );

    res.status(200).json(allBooks);
  } catch (error) {
    console.error("Get All Books WithJ SONFormet error.", error.message);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

// delete all book at once
/*
const deleteAllBooks = async (req, res) => {
  try {
    const result = await booksModel.deleteMany({}); // delete all documents

    res.status(200).json({
      message: "All books have been deleted.",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Error deleting books:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message || error,
    });
  }
};
*/

export {
  createBook,
  updateBook,
  listBook,
  getSingleBook,
  deleteBook,
  recommendedBooks,
  getAllBooksWithJSONFormet,
  // deleteAllBooks,
};
