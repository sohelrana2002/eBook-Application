import BookModel from "../models/bookModel.js";

const allAuthor = async (req, res) => {
  try {
    const authors = await BookModel.distinct("author");
    res.status(200).json({
      message: "success",
      allAuthorName: authors,
    });
  } catch (error) {
    console.error("All author count error.", error.message);

    res.status(500).json({
      message: "Internal server error",
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
    console.error("All language count error.", error.message);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

// all genres
const allGenre = async (req, res) => {
  try {
    const genres = await BookModel.distinct("genre");
    res.status(200).json({
      message: "success",
      allGenreName: genres,
    });
  } catch (error) {
    console.error("All genre error.", error.message);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export { allAuthor, allLanguage, allGenre };
