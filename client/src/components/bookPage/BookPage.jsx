"use client";

import "./BooksPage.css";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import BookCard from "../bookCard/BookCard";
import Link from "next/link";
import { SquareChevronLeft } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import FilterBook from "../filterBook/FilterBook";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import Loading from "@/app/loading";
import { fetchBooks } from "@/lib/api";

const BookPage = ({ allBooks }) => {
  const [isFilterMenuShowing, setIsFilterMenuShowing] = useState(false);
  const filterMenuRef = useRef();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [selectedFilters, setSelectedFilters] = useState({
    search: "",
  });

  const genre = searchParams.get("genre");
  const author = searchParams.get("author");
  const language = searchParams.get("language");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const search = searchParams.get("search");

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

  // Initialize state from URL params
  useEffect(() => {
    const params = {
      search: searchParams.get("search") || "",
    };
    setSelectedFilters(params);
  }, [searchParams]);

  // Update URL with current filters
  const updateUrl = (newFilters) => {
    const params = new URLSearchParams();

    // Add search filter
    if (newFilters.search && newFilters.search !== "") {
      params.set("search", newFilters.search);
    }

    const queryString = params.toString();
    // console.log("queryString", queryString);

    router.push(queryString ? `/books?${queryString}` : "/books", {
      scroll: false,
    });
  };

  const { data, isLoading } = useQuery({
    queryKey: ["books", genre, author, language, minPrice, maxPrice, search],
    queryFn: () =>
      fetchBooks({ genre, author, language, minPrice, maxPrice, search }),
    placeholderData: keepPreviousData,
    initialData: allBooks,
  });

  // Handle price input changes
  const handleSearchBook = (type, value) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  // Debounced update when search change
  useEffect(() => {
    const timeout = setTimeout(() => {
      updateUrl(selectedFilters);
    }, 500);

    return () => clearTimeout(timeout);
  }, [selectedFilters.search]);

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
            <input
              type="search"
              placeholder="search book ..."
              value={selectedFilters.search || ""}
              onChange={(e) => handleSearchBook("search", e.target.value)}
            />
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
