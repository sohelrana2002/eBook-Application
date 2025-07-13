import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

export const renderRatingStars = (rating) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) {
      stars.push(
        <FaStar key={i} size={17} className="text-yellow-400 text-2xl" />
      );
    } else if (i === fullStars + 1 && hasHalfStar) {
      stars.push(
        <FaStarHalfAlt key={i} size={17} className="text-yellow-400 text-2xl" />
      );
    } else {
      stars.push(
        <FaRegStar key={i} size={17} className="text-gray-300 text-2xl" />
      );
    }
  }

  return stars;
};
