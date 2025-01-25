import booksModel from "../models/bookModel.js";

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
      coverImage,
      bookFile,
    } = req.body;

    const registerBook = await booksModel.create({
      title,
      author,
      description,
      genre,
      language,
      publicationDate,
      price,
      tags,
      coverImage,
      bookFile,
    });

    res.status(201).json({
      message: "Create new book successfully",
      id: registerBook._id,
    });
  } catch (err) {
    res.status(500).json({
      message: "internal server error",
      error: err,
    });
  }
};

export { createBook };
