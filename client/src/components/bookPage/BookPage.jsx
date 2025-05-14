"use client";

import "./BooksPage.css";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import BookCard from "../bookCard/BookCard";
import Link from "next/link";
import { SquareChevronLeft } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import FilterBook from "../filterBook/FilterBook";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Loading from "@/app/loading";
import { fetchBooks } from "@/lib/api";

const BookPage = ({ allBooks }) => {
  const searchParams = useSearchParams();
  const genre = searchParams.get("genre");
  const author = searchParams.get("author");
  const language = searchParams.get("language");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");

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

  const { data, isLoading } = useQuery({
    queryKey: ["books", genre, author, language, minPrice, maxPrice],
    queryFn: () => fetchBooks({ genre, author, language, minPrice, maxPrice }),
    placeholderData: keepPreviousData,
    initialData: allBooks,
  });

  return (
    <div className="book__conatiner">
      {/* ----left side book -----  */}
      <div
        ref={filterMenuRef}
        className={`left__conatiner-book ${isFilterMenuShowing && "show"}`}
      >
        <FilterBook />
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
          {data?.books?.length === 0 ? (
            <h1>There are no books available</h1>
          ) : (
            <Suspense fallback={<Loading />}>
              {data?.books?.map((curElem) => (
                <Link
                  key={curElem._id}
                  href={`/books/${curElem._id}`} // Use proper href
                >
                  <BookCard {...curElem} />
                </Link>
              ))}
            </Suspense>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookPage;
