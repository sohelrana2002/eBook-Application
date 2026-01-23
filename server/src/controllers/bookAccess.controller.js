import User from "../models/auth.model.js";
import Book from "../models/book.model.js";
import { config } from "../config/config.js";

// check book access
const checkBookAccess = async (req, res) => {
  try {
    const { userId } = req.jwtPayload;
    const { bookId } = req.params;

    if (!userId) {
      return res.status(200).json({
        success: true,
        hasAccess: false,
        reason: "NOT_LOGGED_IN",
      });
    }

    const user = await User.findById(userId).select("purchasedBooks");

    const hasAccess = user?.purchasedBooks?.includes(bookId);

    return res.status(200).json({
      success: true,
      hasAccess,
      downloadUrl: hasAccess
        ? `${config.backEndBaseURL}/api/book-access/${bookId}/download`
        : null,
    });
  } catch (error) {
    console.log("check book access error: ", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// download book
const downloadBook = async (req, res) => {
  try {
    const { userId } = req.jwtPayload;
    const { bookId } = req.params;

    const user = await User.findById(userId);

    if (!user?.purchasedBooks?.includes(bookId)) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to download this book",
      });
    }

    const book = await Book.findById(bookId);
    // console.log("book", book);

    if (!book?.bookFile) {
      return res.status(404).json({
        success: false,
        message: "Book file not found.",
      });
    }

    return res.redirect(book.bookFile);
  } catch (error) {
    console.log("download book error: ", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

export { checkBookAccess, downloadBook };
