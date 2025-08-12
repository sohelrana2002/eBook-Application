import { renderRatingStars } from "@/lib/renderRatingStars";
import Image from "next/image";
const defaultImage = "/book.jpg";

const BookCard = ({ coverImage, title, averageRating, price, author }) => {
  return (
    <div className="w-full  md:max-w-xs bg-white shadow-lg rounded-2xl  hover:shadow-xl transition-shadow duration-300 border border-[var(--border)] overflow-auto">
      {/* Image wrapper */}
      <div className="relative w-full h-60">
        <Image
          src={coverImage || defaultImage}
          alt={title}
          fill
          style={{ objectFit: "cover" }}
          className="rounded-t-2xl"
        />
      </div>

      <div className="p-4 space-y-2 border-t-2 border-[var(--border)] flex items-start justify-between">
        <div>
          <h2 className="text-[17px] font-semibold text-gray-800 line-clamp-2 capitalize max-w-[200px] text-left">
            {title.length > 12 ? `${title.substring(0, 12)}...` : title}
          </h2>

          <h2 className="text-[14px] font-semibold text-gray-800 line-clamp-2 capitalize text-left">
            {author.length > 12 ? `${author.substring(0, 12)}...` : author}
          </h2>
        </div>
        <div className="flex flex-col items-end">
          <p className="text-[17px] font-bold text-[var(--blue)]">${price}</p>
          <div className="flex items-center gap-1 text-yellow-500">
            {renderRatingStars(averageRating)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
