"use client";

import "./BooksPage.css";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { listBooks } from "@/lib/api";
import BookCard from "../bookCard/BookCard";
import Link from "next/link";
import { SquareChevronLeft } from "lucide-react";

const BookPage = ({ allBooks }) => {
  //   const {
  //     data: allBooks,
  //     isLoading,
  //     isError,
  //     error,
  //   } = useQuery({
  //     queryKey: ["books"],
  //     queryFn: listBooks,
  //     staleTime: 10000,
  //     placeholderData: keepPreviousData,
  //   });

  console.log("data", allBooks);

  return (
    <div className="book__conatiner">
      {/* ----left side book -----  */}
      <div className="left__conatiner-book">left</div>

      {/* ----right side book ---  */}
      <div className="right__container-book">
        {/* ----right top side ----  */}
        <div className="right__top">
          {/* ---search book --  */}
          <div className="search__book">
            {/* ---colapse filter menu--- */}
            <div className="colapse__menu">
              <SquareChevronLeft />
            </div>
            <input type="search" placeholder="search book ..." />
          </div>
          {/* ----filter ----  */}
          <div className="sort__filter">
            <select>
              <option value="atoz">A to Z</option>
              <option value="ztoa">Z to Z</option>
              <option value="atoz">A to Z</option>
            </select>
          </div>
        </div>
        {/* ----right cntent ----  */}
        <div className="right__book__content">
          {allBooks?.books?.map((curElem) => {
            return (
              <Link href="#">
                <BookCard key={curElem._id} {...curElem} />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BookPage;
