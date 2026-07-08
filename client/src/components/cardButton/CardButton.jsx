"use client";

import { FaHeart } from "react-icons/fa";
import { CiHeart } from "react-icons/ci";

const CardButton = ({ books }) => {
  const addToCart = (books) => {
    console.log("Id: ", books._id);
  };

  const handleWishList = (books) => {
    console.log("Wish Id: ", books._id);
  };

  return (
    <div className="flex items-center justify-between p-[10px] pt-1 gap-2 bg-[var(--light-gray)]">
      <button
        className="flex-1 bg-black px-5 h-[30px] md:h-[38px] text-white rounded-sm text-[12px] md:text-[13px] cursor-pointer hover:bg-zinc-900 transition-colors"
        onClick={() => addToCart(books)}
      >
        Add To Cart
      </button>
      <button
        className="bg-black w-[30px] md:w-[38px] h-[30px] md:h-[38px] rounded-sm flex items-center justify-center cursor-pointer shrink-0 hover:bg-zinc-900 transition-colors"
        onClick={() => handleWishList(books)}
      >
        <FaHeart className="text-red-500 text-[15px] md:text-[23px]" />
      </button>
    </div>
  );
};

export default CardButton;
