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

export { createBook };
