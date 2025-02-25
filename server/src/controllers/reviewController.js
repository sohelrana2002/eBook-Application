import booksModel from "../models/bookModel.js";
import reviewsModel from "../models/reviewModel.js";

// -----Add a Review-----
const addReview = async (req, res, next) => {
  try {
    const bookId = req.params.bookId;
    const { rating, comment } = req.body;
    const reviewerName = req.jwtPayload.name;
    const reviewerId = req.jwtPayload.userId;

    // console.log("reviewerName", reviewerName);

    const book = await booksModel.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    const existingReview = await reviewsModel.findOne({ bookId, reviewerId });

    if (existingReview) {
      return res.status(400).json({
        message: "You have already reviewed this book",
      });
    }

    const review = new reviewsModel({
      bookId,
      reviewerId,
      reviewerName,
      rating,
      comment,
    });
    await review.save();

    // Recalculate and update book's average rating
    const reviews = await reviewsModel.find({ bookId });

    const avgRating =
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    book.averageRating = avgRating.toFixed(1);
    await book.save();

    res.status(201).json({
      message: "Review added successfully",
      review_Id: review._id,
    });
  } catch (err) {
    console.error("Internal server error", err);

    res.status(500).json({
      message: "Internal server error",
      error: err,
    });
  }
};

// ---------Get All Reviews for a Book-----------
const allReview = async (req, res, next) => {
  try {
    const bookId = req.params.bookId;

    const reviews = await reviewsModel.find({ bookId }).sort({ createdAt: -1 });

    if (reviews.length === 0) {
      return res.status(404).json({
        message: "Review not found!",
      });
    } else {
      res.status(200).json({
        message: "success",
        totalReview: reviews.length,
        review: reviews,
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

// -------update review controller----
const updateReview = async (req, res, next) => {
  try {
    const reviewId = req.params.reviewId;
    const { rating, comment } = req.body;

    const review = await reviewsModel.findByIdAndUpdate(
      reviewId,
      {
        rating,
        comment,
      },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({
        message: "Review not found!",
      });
    }

    // Recalculate and update book's average rating
    const reviews = await reviewsModel.find({ bookId: review.bookId });
    const avgRating =
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    await booksModel.findByIdAndUpdate(review.bookId, {
      averageRating: avgRating.toFixed(1),
    });

    res.status(200).json({
      message: "Review updated successfully",
      review: review,
    });
  } catch (err) {
    console.error("Internal server error", err);

    res.status(500).json({
      message: "Internal server error",
      error: err,
    });
  }
};

export { addReview, allReview, updateReview };
