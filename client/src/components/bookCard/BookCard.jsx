import { Star } from "lucide-react";

const BookCard = ({ coverImage, title, averageRating, price, author }) => {
  return (
    <div className="w-full md:max-w-xs bg-white shadow-lg rounded-2xl  hover:shadow-xl transition-shadow duration-300 border border-[var(--border)] overflow-auto">
      <img src="/book.jpg" alt={title} className="w-full h-60 object-cover" />
      <div className="p-4 space-y-2 border-t-2 border-[var(--border)] flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-800 line-clamp-2 capitalize max-w-[200px]">
            {title.length > 17 ? `${title.substring(0, 17)}...` : title}
          </h2>

          <h2 className="text-sm font-semibold text-gray-800 line-clamp-2 capitalize">
            {author}
          </h2>
        </div>
        <div className="flex flex-col items-end">
          <p className="text-lg font-bold text-[var(--blue)]">${price}</p>
          <div className="flex items-center gap-1 text-yellow-500">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                fill={i < averageRating ? "#facc15" : "none"}
                stroke={i < averageRating ? "#facc15" : "currentColor"}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
