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

const BookPage = ({ initialBookData, serverParams }) => {
  const [isFilterMenuShowing, setIsFilterMenuShowing] = useState(false);
  const filterMenuRef = useRef();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [selectedFilters, setSelectedFilters] = useState({
    genre: serverParams.genre,
    author: serverParams.author,
    language: serverParams.language,
    minPrice: serverParams.minPrice,
    maxPrice: serverParams.maxPrice,
    search: serverParams.search,
    sortBy: serverParams.sortBy,
    order: serverParams.order,
    isOscar: serverParams.isOscar,
    page: serverParams.page,
  });

  // console.log("selectedFilters", selectedFilters);

  const genreParams = searchParams.get("genre");
  const genre = genreParams ? genreParams.split(",") : [];
  const author = searchParams.get("author");
  const language = searchParams.get("language");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const search = searchParams.get("search");
  const sortBy = searchParams.get("sortBy");
  const order = searchParams.get("order");
  const isOscar = searchParams.get("isOscar");
  const page = parseInt(searchParams.get("page") || "1");

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

  // ---Update URL with current filters
  const updateUrl = (newFilters) => {
    const params = new URLSearchParams();

    // Add genre filters
    if (newFilters.genre && newFilters.genre.length > 0) {
      params.set("genre", newFilters.genre.join(","));
    }

    // Add author filter if not "none"
    if (newFilters.author && newFilters.author !== "none") {
      params.set("author", newFilters.author);
    }

    // Add language filter if not "none"
    if (newFilters.language && newFilters.language !== "none") {
      params.set("language", newFilters.language);
    }

    // Add price filters
    if (newFilters.minPrice) params.set("minPrice", newFilters.minPrice);
    if (newFilters.maxPrice) params.set("maxPrice", newFilters.maxPrice);

    // ---Add search filter
    if (newFilters.search && newFilters.search !== "") {
      params.set("search", newFilters.search);
    }

    // ---Add sortby filter
    if (newFilters.sortBy && newFilters.sortBy !== "") {
      params.set("sortBy", newFilters.sortBy);
    }

    // ---Add order filter
    if (newFilters.order && newFilters.order !== "") {
      params.set("order", newFilters.order);
    }

    // ---Add oscar filter
    if (newFilters.isOscar && newFilters.isOscar !== "") {
      params.set("isOscar", newFilters.isOscar);
    }

    // Add page for pagination
    if (newFilters.page && newFilters.page !== 1) {
      params.set("page", String(newFilters.page));
    }

    const queryString = params.toString();
    // console.log("queryString", queryString);

    router.push(queryString ? `/books?${queryString}` : "/books", {
      scroll: false,
    });
  };

  const limit = 5;
  const { data, isLoading, isFetching } = useQuery({
    queryKey: [
      "books",
      genre,
      author,
      language,
      minPrice,
      maxPrice,
      search,
      sortBy,
      order,
      isOscar,
      page,
      limit,
    ],
    queryFn: () =>
      fetchBooks({
        genre,
        author,
        language,
        minPrice,
        maxPrice,
        search,
        sortBy,
        order,
        isOscar,
        page,
        limit,
      }),
    placeholderData: keepPreviousData,
    initialData: initialBookData,
    scroll: false,
  });

  // -------Handle search input changes-----------
  const handleSearchBook = (type, value) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  // ----handle sort and order ----
  const handleSortChange = (e) => {
    const value = e.target.value;

    if (value === "_") {
      const newFilters = {
        ...selectedFilters,
        sortBy: "",
        order: "",
      };
      setSelectedFilters(newFilters);
      updateUrl(newFilters);
      return;
    }

    const [sortBy, order] = value.split("_");
    const newFilters = { ...selectedFilters, sortBy, order };
    setSelectedFilters(newFilters);
    updateUrl(newFilters);
  };

  // ----------Debounced update when search change----------
  useEffect(() => {
    const timeout = setTimeout(() => {
      updateUrl(selectedFilters);
    }, 700);

    return () => clearTimeout(timeout);
  }, [
    selectedFilters.search,
    selectedFilters.minPrice,
    selectedFilters.maxPrice,
  ]);

  console.log("data: ", data);

  // handle pagination
  const handlePagination = (pageNumber) => {
    const newFilters = { ...selectedFilters, page: pageNumber };

    setSelectedFilters(newFilters);
    updateUrl(newFilters);
  };

  return (
    <div className="book__conatiner">
      {/* ----left side book -----  */}
      <div
        ref={filterMenuRef}
        className={`left__conatiner-book ${isFilterMenuShowing && "show"}`}
      >
        <FilterBook
          selectedFilters={selectedFilters}
          setSelectedFilters={setSelectedFilters}
          updateUrl={updateUrl}
        />
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
            <select
              onChange={handleSortChange}
              value={
                selectedFilters.sortBy && selectedFilters.order
                  ? `${selectedFilters.sortBy}_${selectedFilters.order}`
                  : "_"
              }
            >
              <option value="_">Sort By</option>
              <option value="title_asc">A to Z</option>
              <option value="title_desc">Z to A</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* ----right cntent ----  */}
        <div className="right__book__content">
          {!isFetching && data?.books?.length === 0 ? (
            <h1>There are no books available</h1>
          ) : (
            <Suspense fallback={<Loading />}>
              {data?.books?.map((curElem) => (
                <BookCard key={curElem._id} books={curElem} />
              ))}
            </Suspense>
          )}
        </div>

        {/* Pagination  */}
        <div className="my-7 md:my-10 flex items-center justify-center gap-3 flex-wrap md:gap-5">
          <button
            disabled={page <= 1}
            className={`text-sm md:text-md px-3 md:px-4 py-1 md:py-2 rounded-md ${page <= 1 ? "border-1 border-[var(--border)] bg-white text-black" : "bg-black text-white cursor-pointer"}`}
            onClick={() => handlePagination(page - 1)}
          >
            Prev
          </button>
          <span className="text-sm md:text-md">
            Page {data?.currentPage} of {data?.totalPages} | {data?.totalBooks}{" "}
            books
          </span>
          <button
            disabled={page >= data?.totalPages}
            className={`text-sm md:text-md px-3 md:px-4 py-1 md:py-2 rounded-md ${page >= data?.totalPages ? "border-1 border-[var(--border)] bg-white text-black" : "bg-black text-white cursor-pointer"}`}
            onClick={() => handlePagination(page + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookPage;
