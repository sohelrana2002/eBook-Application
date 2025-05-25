"use client";

import { useState, useMemo, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { renderRatingStars } from "@/lib/renderRatingStars";
import { FaStar } from "react-icons/fa";
import { useMutation } from "@tanstack/react-query";
import { addReview } from "@/lib/api";
import { useAuthContext } from "@/context/authContext";

const ReviewSection = ({ initialReviews, bookId }) => {
  const [reviews, setReviews] = useState(initialReviews?.review || []);
  const [sortOrder, setSortOrder] = useState("newest");
  const [showReview, setShowReview] = useState(true);

  const { isLoggedIn } = useAuthContext();

  const [newReview, setNewReview] = useState({
    reviewerName: "",
    comment: "",
    rating: 0,
  });

  useEffect(() => {
    const name = localStorage.getItem("name");

    setNewReview((prev) => ({
      ...prev,
      reviewerName: name,
    }));
  }, []);

  const sortedReviews = useMemo(() => {
    return [...reviews].sort((a, b) => {
      const timeA = new Date(a.created_at).getTime();
      const timeB = new Date(b.created_at).getTime();

      return sortOrder === "newest" ? timeB - timeA : timeA - timeB;
    });
  }, [reviews, sortOrder]);

  const handleRatingClick = (value) => {
    setNewReview((prev) => ({ ...prev, rating: value }));
  };

  const handleInputChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setNewReview((prev) => ({ ...prev, [name]: value }));
  };

  const mutation = useMutation({
    mutationFn: ({ bookId, rating, comment }) =>
      addReview(bookId, rating, comment),
    onSuccess: (data) => {
      alert(data.message);

      setNewReview({
        comment: "",
        rating: 0,
      });
    },
    onError: (error) => {
      alert(error?.response?.data?.message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      alert("You must be logged in to submit a review.");
      return;
    }

    mutation.mutate({
      bookId: bookId,
      rating: newReview.rating,
      comment: newReview.comment,
    });
  };

  return (
    <div className="p-4 border border-[var(--border)] rounded-lg shadow-sm space-y-6">
      <h2 className="text-2xl font-bold">User Reviews</h2>

      <div className="flex gap-2 items-center">
        <button
          onClick={() => setShowReview(true)}
          className={`${
            showReview ? "bg-[#000] text-white" : "text-black border"
          } px-4 py-2 rounded font-bold cursor-pointer`}
        >
          Reviews
        </button>
        <button
          onClick={() => {
            if (!isLoggedIn) {
              alert("You must be logged in to add a review.");
              return;
            }
            setShowReview(false);
          }}
          className={`${
            showReview ? "text-black border" : "bg-[#000] text-white"
          } px-4 py-2 rounded font-bold cursor-pointer`}
        >
          Add Review
        </button>
      </div>

      {/* Submit Review Form */}
      {!showReview && (
        <form
          onSubmit={handleSubmit}
          className="space-y-4 bg-gray-50 p-4 rounded"
        >
          <div>
            <label className="block text-sm font-medium">Your Name</label>
            <input
              type="text"
              name="user"
              value={newReview?.reviewerName}
              disabled
              className="w-full border border-[var(--border)] px-3 py-2 rounded capitalize"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Comment</label>
            <textarea
              name="comment"
              rows={3}
              value={newReview.comment}
              onChange={handleInputChange}
              className="w-full border border-[var(--border)] px-3 py-2 rounded"
              required
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Rating</label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  size={24}
                  className={`cursor-pointer ${
                    newReview.rating >= star
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }`}
                  onClick={() => handleRatingClick(star)}
                />
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Submit Review
          </button>
        </form>
      )}

      {/* Reviews List */}
      {showReview &&
        (sortedReviews.length === 0 ? (
          <h2>There are currently no reviews for this book.</h2>
        ) : (
          <>
            {/* Sort Dropdown */}
            <div className="flex flex-col justify-between items-start gap-2 md:items-center md:flex-row ">
              <div>
                <label className="mr-2 font-medium">Sort by:</label>
                <select
                  className="border border-[var(--border)] rounded px-2 py-1"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>

              <div>Reviews ({sortedReviews.length})</div>
            </div>

            <ul className="space-y-4">
              {sortedReviews.map((review) => (
                <li
                  key={review._id}
                  className="border border-[var(--border)] p-4 rounded shadow-sm bg-white space-y-1"
                >
                  <div className="flex justify-between">
                    <span className="font-semibold capitalize">
                      {review.reviewerName}
                    </span>
                    <span className="text-gray-500 text-sm">
                      {formatDistanceToNow(new Date(review.created_at), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                  <div className="flex text-yellow-400">
                    {renderRatingStars(review.rating)}
                  </div>
                  <p className="capitalize">{review.comment}</p>
                </li>
              ))}
            </ul>
          </>
        ))}
    </div>
  );
};

export default ReviewSection;
