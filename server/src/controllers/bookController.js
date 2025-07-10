import booksModel from "../models/bookModel.js";
import path from "path";
import { fileURLToPath } from "url";

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
      coverImage: coverImage?.[0]?.path,
      bookFile: bookFile?.[0]?.path,
    });

    res.status(201).json({
      message: "Create new book successfully!",
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

    // if (coverImage) {
    //   const oldCoverImage = coverImage;
    //   const coverImagePath = path.join(
    //     __dirname,
    //     "../../public/uploads/",
    //     oldCoverImage.originalname
    //   );
    //   await oldCoverImage.mv(coverImagePath);
    //   coverImage.oldCoverImage = `../../public/uploads/${oldCoverImage.originalname}`;
    // }

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

    res.status(200).json({
      message: "Book update successfully!",
      id: updatedBook._id,
    });
  } catch (err) {
    console.log(err, "error from server");

    res.status(500).json({
      message: "internal server error",
      error: err,
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
  } catch (err) {
    console.error("Internal server error", err);

    res.status(500).json({
      message: "Internal server error",
      error: err,
    });
  }
};

// get single book information
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

// delete a book
const deleteBook = async (req, res, next) => {
  try {
    const bookId = req.params.bookId;

    const book = await booksModel.findOne({ _id: bookId });

    if (!book) {
      return res.status(404).json({
        message: "Book not found!",
      });
    } else {
      await booksModel.deleteOne({ _id: bookId });

      res.status(200).json({
        message: "Book deleted successfully!",
        id: bookId,
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

//smart recommended books
const recommendedBooks = async (req, res) => {
  const { bookId } = req.params;

  try {
    const currentBook = await booksModel.findById({ _id: bookId });

    if (!currentBook) {
      return res.status(404).json({
        message: "Book not found!",
      });
    }

    // Find books with similar tags, excluding the current one
    const bookRecommentation = await booksModel
      .find({
        _id: { $ne: bookId },
        tags: { $in: currentBook.tags },
      })
      .limit(8);

    res.status(200).json({
      message: "success",
      length: bookRecommentation.length,
      recommendations: bookRecommentation,
    });
  } catch (err) {
    console.error("Internal server error", err);

    res.status(500).json({
      message: "Internal server error",
      error: err,
    });
  }
};

export {
  createBook,
  updateBook,
  listBook,
  getSingleBook,
  deleteBook,
  recommendedBooks,
};
