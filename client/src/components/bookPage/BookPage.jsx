"use client";

import "./BooksPage.css";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { listBooks } from "@/lib/api";
import BookCard from "../bookCard/BookCard";
import Link from "next/link";
import { SquareChevronLeft } from "lucide-react";
import { useState, useEffect, useRef } from "react";

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

  // console.log("data", allBooks);

  const [isFilterMenuShowing, setIsFilterMenuShowing] = useState(false);
  const filterMenuRef = useRef();

  const handleMenuButton = () => {
    setIsFilterMenuShowing((prev) => !prev);
  };

  useEffect(() => {
    const handleOutSideNav = (e) => {
      if (!filterMenuRef.current?.contains(e.target)) {
        setIsFilterMenuShowing(false);
      }
    };

    document.addEventListener("mousedown", handleOutSideNav);

    return () => {
      document.removeEventListener("mousedown", handleOutSideNav);
    };
  }, []);

  return (
    <div className="book__conatiner">
      {/* ----left side book -----  */}
      <div
        ref={filterMenuRef}
        className={`left__conatiner-book ${isFilterMenuShowing && "show"}`}
      >
        left
      </div>

      {/* ----right side book ---  */}
      <div className="right__container-book">
        {/* ----heading--- */}
        <h1 className="heading">Discover Your Next Read</h1>

        {/* ----right top side ----  */}
        <div className="right__top">
          {/* ---search book --  */}
          <div className="search__book">
            {/* ---colapse filter menu--- */}
            <div className="colapse__menu" onClick={handleMenuButton}>
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
