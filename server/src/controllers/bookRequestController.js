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
  } catch (error) {
    console.error("Book requedted error.", error.message);

    res.status(500).json({
      message: "Internal server error",
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
  } catch (error) {
    console.error("Get book requested error.", error.message);

    res.status(500).json({
      message: "Internal server error",
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
  } catch (error) {
    console.error("Update book requested error.", error.message);

    res.status(500).json({
      message: "Internal server error",
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
  } catch (error) {
    console.error("Delete book request error.", error.message);

    res.status(500).json({
      message: "Internal server error",
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
  } catch (error) {
    console.error("All requested book error.", error.message);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

// single requested book details
const singleRequestedBook = async (req, res) => {
  const { bookId } = req.params;
  try {
    const singleRequest = await bookRequestModel
      .findById({ _id: bookId })
      .populate("userId", "name email");

    res.status(200).json({
      message: "success",
      singleRequestBook: singleRequest,
    });
  } catch (error) {
    console.error("Single requested error.", error.message);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

// count new request
const newRequestCount = async (req, res) => {
  try {
    const count = await bookRequestModel.countDocuments({ isSeen: false });
    res.status(200).json({
      message: "success",
      count: count,
    });
  } catch (error) {
    console.error("New book requested book error.", error.message);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

// mark as the request seen after seen the details
const markRequestSeen = async (req, res) => {
  try {
    const { bookId } = req.params;

    // Find the current request
    const existingRequest = await bookRequestModel.findById(bookId);

    if (!existingRequest) {
      return res.status(404).json({ message: "Book request not found" });
    }

    //  Only update if it's not already seen
    if (!existingRequest.isSeen) {
      await bookRequestModel.findByIdAndUpdate(bookId, { isSeen: true });
    }

    res.status(200).json({
      message: existingRequest.isSeen ? "Already seen" : "Marked as seen",
      id: bookId,
    });
  } catch (error) {
    console.error("Mark book request seen error.", error.message);

    res.status(500).json({
      message: "Internal server error",
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
  newRequestCount,
  markRequestSeen,
};
