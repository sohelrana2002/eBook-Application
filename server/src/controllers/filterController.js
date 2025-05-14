import BookModel from "../models/bookModel.js";

const allAuthor = async (req, res) => {
  try {
    const authors = await BookModel.distinct("author");
    res.status(200).json({
      message: "success",
      allAuthorName: authors,
    });
  } catch (error) {
    res.status(500).json({
      message: "failed",
      error: error.message,
    });
  }
};

const allLanguage = async (req, res) => {
  try {
    const languages = await BookModel.distinct("language");
    res.status(200).json({
      message: "success",
      allLanguageName: languages,
    });
  } catch (error) {
    res.status(500).json({
      message: "failed",
      error: error.message,
    });
  }
};

export { allAuthor, allLanguage };
