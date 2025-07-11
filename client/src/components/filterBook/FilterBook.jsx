"use client";
import "./FilterBook.css";
import Select from "react-select";
import { allAuthor, allLanguage, allGenre } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

const FilterBook = ({ selectedFilters, setSelectedFilters, updateUrl }) => {
  const { data: genreData } = useQuery({
    queryKey: ["allGenre"],
    queryFn: allGenre,
    staleTime: 10000,
  });

  const { data: authorData } = useQuery({
    queryKey: ["allAuthor"],
    queryFn: allAuthor,
    staleTime: 10000,
  });

  const { data: languageData } = useQuery({
    queryKey: ["allLanguage"],
    queryFn: allLanguage,
    staleTime: 10000,
  });

  // Genre options
  const genreOptions = genreData?.allGenreName?.map((curElem) => ({
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

  // language options
  const languageOptions = [
    { value: "none", label: "None", type: "language" },
    ...(languageData?.allLanguageName?.map((language) => ({
      value: language,
      label: language,
      type: "language",
    })) || []),
  ];

  // Handle genre selection (multi-select)
  const handleGenreChange = (selectedOptions) => {
    const newFilters = {
      ...selectedFilters,
      genre: selectedOptions.map((opt) => opt.value),
    };

    // console.log("newFilters", newFilters);

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

  // Handle author selection (single-select)
  const handleLanguageChange = (selectedOption) => {
    const newFilters = {
      ...selectedFilters,
      language: selectedOption?.value || null,
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

  // Handle price input changes
  const handlePriceChange = (type, value) => {
    const newValue = value.replace(/[^0-9.]/g, "");
    setSelectedFilters((prev) => ({
      ...prev,
      [type]: newValue,
    }));
  };

  // --handle isOscar input change---
  const handleIsOscar = (e) => {
    const newFilters = {
      ...selectedFilters,
      isOscar: e.target.checked ? true : null,
    };
    setSelectedFilters(newFilters);
    updateUrl(newFilters);
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

      <div className="filter__box">
        <h4>Language</h4>
        <Select
          onChange={handleLanguageChange}
          options={languageOptions}
          styles={selectStyle}
          value={languageOptions?.find(
            (opt) =>
              opt.value === selectedFilters.language ||
              (selectedFilters.language === null && opt.value === "none")
          )}
        />
      </div>

      <div className="filter__box">
        <h4>Price Range</h4>
        <div className="price-input-group">
          <input
            type="text"
            placeholder="Min price"
            value={selectedFilters.minPrice || ""}
            onChange={(e) => handlePriceChange("minPrice", e.target.value)}
            pattern="[0-9]*"
            inputMode="numeric"
          />
          <span className="price-separator">-</span>
          <input
            type="text"
            placeholder="Max price"
            value={selectedFilters.maxPrice || ""}
            onChange={(e) => handlePriceChange("maxPrice", e.target.value)}
            pattern="[0-9]*"
            inputMode="numeric"
          />
        </div>
      </div>

      <div className="filter__box">
        <h4>Oscar Winner</h4>
        <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <input
            type="checkbox"
            checked={selectedFilters.isOscar === true}
            onChange={handleIsOscar}
          />
          Oscar-winning books
        </label>
      </div>
    </div>
  );
};

export default FilterBook;
