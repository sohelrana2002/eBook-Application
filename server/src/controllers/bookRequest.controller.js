import bookRequestModel from "../models/bookRequest.model.js";
import userModel from "../models/auth.model.js";
import mongoose from "mongoose";
import { customMessage } from "../constants/customMessage.js";

// Create a book request
const bookRequest = async (req, res) => {
  const { bookName, authorName, publicationDate, language } = req.body;

  const userId = req.jwtPayload.userId;

  try {
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: customMessage.notFound("User", userId),
      });
    }

    const newRequestedBook = await bookRequestModel.create({
      userId,
      bookName,
      authorName,
      publicationDate,
      language,
    });

    res.status(201).json({
      success: true,
      message: customMessage.created("Requested book"),
      id: newRequestedBook._id,
    });
  } catch (error) {
    console.error("Create requedted book error: ", error.message);

    res.status(500).json({
      success: false,
      message: customMessage.serverError(),
    });
  }
};

// Get all requests for a user
const getBookRequest = async (req, res) => {
  try {
    const { search, status, page, limit } = req.query;
    const userId = req.jwtPayload.userId;
    // console.log("User id: ", userId);

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    let filter = { userId };

    // SEARCH FUNCTIONALITY
    if (search) {
      const searchRegex = { $regex: search, $options: "i" };

      filter.$or = [{ bookName: searchRegex }, { authorName: searchRegex }];
    }

    // STATUS FILTERING FUNCTIONALITY
    if (status) {
      const statusArray = status.split(",");
      filter.status = { $in: statusArray };
    }

    // PAGINATION FUNCTIONALITY
    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 10;
    const skip = (pageNumber - 1) * limitNumber;

    const requestedBook = await bookRequestModel
      .find(filter)
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limitNumber)
      .lean(); //SPEED UP PERFORMANCE

    const totalRequestedBook = await bookRequestModel.countDocuments({
      userId,
    });
    const filteredRequestedBook = await bookRequestModel.countDocuments(filter);

    return res.status(200).json({
      success: true,
      message: customMessage.found("Requested book"),
      data: {
        requestedBook,
        pagination: {
          totalRequestedBook,
          filteredRequestedBook,
          pageNumber,
          totalPage: Math.ceil(totalRequestedBook / limitNumber),
          limit: limitNumber,
        },
      },
    });
  } catch (error) {
    console.error("Get book requested error:", error);

    return res.status(500).json({
      success: false,
      message: customMessage.serverError(),
    });
  }
};

//  Admin updates status
const updateBookStatus = async (req, res) => {
  const { status } = req.body;
  const { bookId } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({
        success: false,
        message: customMessage.invalidId("mongoose", bookId),
      });
    }

    const updated = await bookRequestModel.findByIdAndUpdate(
      bookId,
      { status },
      { new: true },
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        mesage: customMessage.notFound("Requested book", bookId),
      });
    }

    res.status(200).json({
      success: true,
      message: customMessage.updated("Requested book", bookId),
      id: bookId,
    });
  } catch (error) {
    console.error("Update requested book error: ", error.message);

    res.status(500).json({
      success: false,
      message: customMessage.serverError(),
    });
  }
};

// delete requested book
const deleteRequestedBook = async (req, res) => {
  try {
    const { bookId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({
        success: false,
        message: customMessage.invalidId("mongoose", bookId),
      });
    }

    const deletedBook = await bookRequestModel.findByIdAndDelete(bookId);

    if (!deletedBook) {
      return res.status(404).json({
        success: false,
        message: customMessage.notFound("Requested book", bookId),
      });
    }

    return res.status(200).json({
      success: true,
      message: customMessage.deleted("Requested book", bookId),
      id: bookId,
    });
  } catch (error) {
    console.error("Delete requested book error: ", error.message);

    res.status(500).json({
      success: false,
      message: customMessage.serverError(),
    });
  }
};

// get all requested book
const allRequestedBook = async (req, res) => {
  try {
    const allRequest = await bookRequestModel
      .find()
      .populate("userId", "name email")
      .sort({ created_at: -1 });

    res.status(200).json({
      message: "success",
      length: allRequest.length,
      requestedBook: allRequest,
    });
  } catch (error) {
    console.error("All requested book error: ", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

// single requested book details
const singleRequestedBook = async (req, res) => {
  const { bookId } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({
        success: false,
        message: customMessage.invalidId("mongoose", bookId),
      });
    }

    const requestedBook = await bookRequestModel
      .findById(bookId)
      .populate("userId", "name email phoneNumber -_id");

    if (!requestedBook) {
      return res.status(404).json({
        success: false,
        message: customMessage.notFound("Requested book", bookId),
      });
    }

    res.status(200).json({
      success: true,
      message: customMessage.found("Requested book", bookId),
      data: { requestedBook },
    });
  } catch (error) {
    console.error("Fetch requested book details error: ", error.message);

    res.status(500).json({
      success: false,
      message: customMessage.serverError(),
    });
  }
};

// count new request
const newRequestCount = async (req, res) => {
  try {
    const count = await bookRequestModel.countDocuments({ isSeen: false });

    res.status(200).json({
      success: true,
      message: "New requested books count successfully.",
      count: count,
    });
  } catch (error) {
    console.error("New requested book count error: ", error.message);

    res.status(500).json({
      success: false,
      message: customMessage.serverError(),
    });
  }
};

// mark as the request seen after seen the details
const markRequestSeen = async (req, res) => {
  try {
    const { bookId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({
        success: false,
        message: customMessage.invalidId("mongoose", bookId),
      });
    }

    // Find the current request
    const requestedBook = await bookRequestModel.findById(bookId);

    if (!requestedBook) {
      return res.status(404).json({
        success: false,
        message: customMessage.notFound("Requested book", bookId),
      });
    }

    //  Only update if it's not already seen
    if (!requestedBook.isSeen) {
      await bookRequestModel.findByIdAndUpdate(bookId, { isSeen: true });
    }

    res.status(200).json({
      success: true,
      message: requestedBook.isSeen ? "Already seen" : "Marked as seen",
      id: bookId,
    });
  } catch (error) {
    console.error("Mark request book seen error: ", error.message);

    res.status(500).json({
      success: false,
      message: customMessage.serverError(),
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
