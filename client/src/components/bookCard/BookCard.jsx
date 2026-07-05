import Image from "next/image";
const defaultImage = "/book.jpg";
import { FaStar } from "react-icons/fa";

import Link from "next/link";
import CardButton from "../cardButton/CardButton";

const BookCard = ({
  _id,
  slug,
  coverImage,
  title,
  averageRating,
  price,
  author,
}) => {
  return (
    <div className="w-full  md:max-w-xs bg-[var(--light-gray)] shadow-lg rounded-lg  hover:shadow-xl transition-shadow duration-300 border-2 border-[var(--border)] overflow-hidden flex flex-col justify-between">
      <Link href={`/books/${slug}`} className="block flex-1">
        {/* Image wrapper */}
        <div className="relative w-full h-40">
          <Image
            src={coverImage || defaultImage}
            alt={title}
            fill
            style={{ objectFit: "cover" }}
            className="rounded-t-lg"
          />
        </div>

        <div className="p-[10px] space-y-1 border-t-2 border-[var(--border)]">
          <div>
            <h2 className="text-[17px] font-bold text-[var(--dark)] line-clamp-2 uppercase text-left">
              {title}
            </h2>

            <h2 className="text-[13.5px] font-semibold text-[var(--medium-gray)] line-clamp-2 capitalize text-left">
              {author}
            </h2>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-[17px] font-bold text-[var(--blue)]">${price}</p>
            <div className="flex items-center gap-1 text-yellow-500">
              <FaStar className="text-yellow-500 text-[17px]" />
              <span className="text-[17px] font-medium">{averageRating}</span>
            </div>
          </div>
        </div>
      </Link>

      {/* bottom section  */}
      <CardButton bookid={_id} />
    </div>
  );
};

export default BookCard;
