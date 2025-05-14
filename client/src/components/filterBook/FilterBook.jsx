"use client";
import "./FilterBook.css";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Select from "react-select";
import { allAuthor } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

const allGenre = [
  "Fiction",
  "Non-Fiction",
  "Mystery",
  "Science Fiction",
  "Fantasy",
  // ... rest of your genres
];

const FilterBook = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedFilters, setSelectedFilters] = useState({
    genre: [],
    author: null,
  });

  // Initialize state from URL params
  useEffect(() => {
    const params = {
      genre: searchParams.getAll("genre") || [],
      author: searchParams.get("author") || null,
    };
    setSelectedFilters(params);
  }, [searchParams]);

  const { data: authorData } = useQuery({
    queryKey: ["allAuthor"],
    queryFn: allAuthor,
    staleTime: 10000,
  });

  // Genre options
  const genreOptions = allGenre?.map((curElem) => ({
    value: curElem,
    label: curElem,
    type: "genre",
  }));

  // Author options
  const authorOptions = [
    { value: "none", label: "None", type: "author" },
    ...(authorData?.allAuthorName?.map((author) => ({
      value: author,
      label: author,
      type: "author",
    })) || []),
  ];

  // Update URL with current filters
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

    const queryString = params.toString();
    console.log("queryString", queryString);

    router.push(queryString ? `/books?${queryString}` : "/books", {
      scroll: false,
    });
  };

  // Handle genre selection (multi-select)
  const handleGenreChange = (selectedOptions) => {
    const newFilters = {
      ...selectedFilters,
      genre: selectedOptions.map((opt) => opt.value),
    };

    console.log("newFilters", newFilters);

    setSelectedFilters(newFilters);
    updateUrl(newFilters);
  };

  // Handle author selection (single-select)
  const handleAuthorChange = (selectedOption) => {
    const newFilters = {
      ...selectedFilters,
      author: selectedOption?.value || null,
    };
    setSelectedFilters(newFilters);
    updateUrl(newFilters);
  };

  // React select styles
  const selectStyle = {
    control: (baseStyles, state) => ({
      ...baseStyles,
      fontSize: "15px",
      textTransform: "capitalize",
      cursor: "pointer",
    }),
    option: (baseStyles, state) => ({
      ...baseStyles,
      fontSize: "15px",
      textTransform: "capitalize",
    }),
  };

  return (
    <div className="filter__container">
      <h1 className="heading">Filters</h1>

      <div className="filter__box">
        <h4>Genre</h4>
        <Select
          onChange={handleGenreChange}
          options={genreOptions}
          styles={selectStyle}
          isMulti
          value={genreOptions?.filter((opt) =>
            selectedFilters.genre.includes(opt.value)
          )}
        />
      </div>

      <div className="filter__box">
        <h4>Author</h4>
        <Select
          onChange={handleAuthorChange}
          options={authorOptions}
          styles={selectStyle}
          value={authorOptions?.find(
            (opt) =>
              opt.value === selectedFilters.author ||
              (selectedFilters.author === null && opt.value === "none")
          )}
        />
      </div>
    </div>
  );
};

export default FilterBook;
