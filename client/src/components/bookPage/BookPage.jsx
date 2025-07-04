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
  const hasInitialized = useRef(false);

  const [selectedFilters, setSelectedFilters] = useState({
    genre: [],
    author: null,
    language: null,
    minPrice: "",
    maxPrice: "",
    search: "",
    sortBy: "",
    order: "",
    isOscar: null,
  });

  // console.log("selectedFilters", selectedFilters);

  const genre = searchParams.get("genre");
  const author = searchParams.get("author");
  const language = searchParams.get("language");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const search = searchParams.get("search");
  const sortBy = searchParams.get("sortBy");
  const order = searchParams.get("order");
  const isOscar = searchParams.get("isOscar");

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

  // -------Initialize state from URL params
  useEffect(() => {
    if (!hasInitialized.current) {
      const params = {
        genre: searchParams.getAll("genre") || [],
        author: searchParams.get("author") || null,
        language: searchParams.get("language") || null,
        minPrice: searchParams.get("minPrice") || null,
        maxPrice: searchParams.get("maxPrice") || null,
        search: searchParams.get("search") || "",
        sortBy: searchParams.get("sortBy") || "",
        order: searchParams.get("order") || "",
        isOscar: searchParams.get("isOscar") === "true" ? true : null,
      };
      setSelectedFilters(params);
      hasInitialized.current = true;
    }
  }, []);

  // ---Update URL with current filters
  const updateUrl = (newFilters) => {
    const params = new URLSearchParams();

    // Add genre filters
    newFilters.genre.forEach((genre) => {
      params.append("genre", genre);
    });

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

    const queryString = params.toString();
    // console.log("queryString", queryString);

    router.push(queryString ? `/books?${queryString}` : "/books", {
      scroll: false,
    });
  };

  const { data, isLoading } = useQuery({
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
      }),
    placeholderData: keepPreviousData,
    initialData: allBooks,
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
