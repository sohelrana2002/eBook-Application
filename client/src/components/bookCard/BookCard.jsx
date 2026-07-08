import Image from "next/image";
const defaultImage = "/book.jpg";
import { FaStar } from "react-icons/fa";

import Link from "next/link";
import CardButton from "../cardButton/CardButton";

const BookCard = ({ books }) => {
  return (
    <div className="w-full  md:max-w-xs bg-[var(--light-gray)] shadow-lg rounded-lg  hover:shadow-xl transition-shadow duration-300 border-2 border-[var(--border)] overflow-hidden flex flex-col justify-between">
      <Link href={`/books/${books?.slug}`} className="block flex-1">
        {/* Image wrapper */}
        <div className="relative w-full h-25 md:h-40">
          <Image
            src={books?.coverImage || defaultImage}
            alt={books?.title || "Book card image"}
            fill
            style={{ objectFit: "cover" }}
            className="rounded-t-lg"
          />
        </div>

        <div className="p-[10px] space-y-1 border-t-2 border-[var(--border)]">
          <div>
            <h2 className="text-[12px] md:text-[17px] font-bold text-[var(--dark)] line-clamp-1 uppercase text-left">
              {books?.title}
            </h2>

            <h2 className="text-[8px] md:text-[13.5px] font-semibold text-[var(--medium-gray)] line-clamp-1 capitalize text-left">
              {books?.author}
            </h2>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-[14px] md:text-[17px] font-bold text-[var(--blue)]">
              ${books?.price}
            </p>
            <div className="flex items-center gap-1 text-yellow-500">
              <FaStar className="text-yellow-500 text-[14px] md:text-[17px]" />
              <span className="text-[14px] md:text-[17px] font-medium">
                {books?.averageRating}
              </span>
            </div>
          </div>
        </div>
      </Link>

      {/* bottom section  */}
      <CardButton books={books} />
    </div>
  );
};

export default BookCard;
