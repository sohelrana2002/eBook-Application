import { Star } from "lucide-react";

const BookCard = ({ coverImage, title, rating, price }) => {
  return (
    <div className="max-w-xs bg-white shadow-lg rounded-2xl  hover:shadow-xl transition-shadow duration-300">
      <img src="/book.jpg" alt={title} className="w-full h-60 object-cover" />
      <div className="p-4 space-y-2 border-t-2 border-[var(--border)]">
        <h2 className="text-lg font-semibold text-gray-800 line-clamp-2 capitalize">
          {title}
        </h2>
        <div className="flex items-center gap-1 text-yellow-500">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={16}
              fill={i < rating ? "#facc15" : "none"}
              stroke={i < rating ? "#facc15" : "currentColor"}
            />
          ))}
        </div>
        <p className="text-lg font-bold text-[var(--blue)]">${price}</p>
      </div>
    </div>
  );
};

export default BookCard;
