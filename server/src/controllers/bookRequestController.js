import bookRequestModel from "../models/bookRequestModel.js";
import userModel from "../models/authModel.js";

// Create a book request
const bookRequest = async (req, res) => {
  const { userId, bookName, authorName, publicationDate, language } = req.body;

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
    const userId = req.params.userId;
    const requests = await bookRequestModel
      .find({ userId: userId })
      .sort({ createdAt: -1 });

    if (!requests) {
      res.status(404).json({
        message: "There are no book request!",
      });
    }

    res.status(201).json({
      message: "success",
      totalRequest: requests.length,
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
export { bookRequest, getBookRequest, updateBookStatus };
