import bookRequestModel from "../models/bookRequestModel.js";
import userModel from "../models/authModel.js";
import mongoose from "mongoose";

// Create a book request
const bookRequest = async (req, res) => {
  const { bookName, authorName, publicationDate, language } = req.body;

  const userId = req.jwtPayload.userId;

  try {
    const userExist = await userModel.findOne({ _id: userId });

    if (!userExist) {
      return res.status(400).json({
        message: "User id not valid",
      });
    }

    const newRequest = await bookRequestModel.create({
      userId,
      bookName,
      authorName,
      publicationDate,
      language,
    });
    res.status(201).json({
      message: "Added book request successfully",
      id: newRequest._id,
    });
  } catch (err) {
    console.log("error from server", err);

    res.status(500).json({
      message: "internal server error",
      error: err,
    });
  }
};

// Get all requests for a user
const getBookRequest = async (req, res) => {
  try {
    const userId = req.jwtPayload.userId;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        message: "Invalid user ID",
      });
    }

    const userExist = await userModel
      .findOne({ _id: userId })
      .select("name email");

    if (!userExist) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    const requests = await bookRequestModel
      .find({ userId: userId })
      .sort({ createdAt: -1 });

    if (!requests || requests.length === 0) {
      return res.status(404).json({
        message: "There are no book requests!",
      });
    }

    res.status(201).json({
      message: "success",
      totalRequest: requests.length,
      userData: userExist,
      allBookRequest: requests,
    });
  } catch (err) {
    console.log("error from server", err);

    res.status(500).json({
      message: "internal server error",
      error: err,
    });
  }
};

//  Admin updates status
const updateBookStatus = async (req, res) => {
  const { status } = req.body;
  const bookId = req.params.bookId;

  try {
    const updated = await bookRequestModel.findByIdAndUpdate(
      { _id: bookId },
      { status },
      { new: true }
    );

    res.status(201).json({
      message: "Book status updated successfully!",
      bookId: updated._id,
    });
  } catch (err) {
    console.log("error from server", err);

    res.status(500).json({
      message: "internal server error",
      error: err,
    });
  }
};

// delete requested book
const deleteRequestedBook = async (req, res) => {
  try {
    const bookId = req.params.bookId;

    const book = await bookRequestModel.findOne({ _id: bookId });

    if (!book) {
      return res.status(404).json({
        message: "Book not found!",
      });
    }

    await bookRequestModel.deleteOne({ _id: bookId });

    return res.status(200).json({
      message: "Requested book deleted successfully!",
      id: bookId,
    });
  } catch (err) {
    console.log("error from server", err);

    res.status(500).json({
      message: "internal server error",
      error: err,
    });
  }
};

// get all requested book
const allRequestedBook = async (req, res) => {
  try {
    const allRequest = await bookRequestModel
      .find()
      .populate("userId", "name email");

    res.status(200).json({
      message: "success",
      length: allRequest.length,
      requestedBook: allRequest,
    });
  } catch (err) {
    console.log("error from server", err);

    res.status(500).json({
      message: "internal server error",
      error: err,
    });
  }
};

// single requested book details
const singleRequestedBook = async (req, res) => {
  const { bookId } = req.params;
  try {
    const singleRequest = await bookRequestModel
      .find({ _id: bookId })
      .populate("userId", "name email");

    res.status(200).json({
      message: "success",
      length: singleRequest.length,
      singleRequestBook: singleRequest,
    });
  } catch (err) {
    console.log("error from server", err);

    res.status(500).json({
      message: "internal server error",
      error: err,
    });
  }
};

export {
  bookRequest,
  getBookRequest,
  updateBookStatus,
  deleteRequestedBook,
  allRequestedBook,
  singleRequestedBook,
};
