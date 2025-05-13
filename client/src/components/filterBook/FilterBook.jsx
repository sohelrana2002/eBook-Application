"use client";
import "./FilterBook.css";
// 27575350

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const FilterBook = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [genre, setGenre] = useState(searchParams.get("genre") || "");
  const [languages, setLanguages] = useState(
    searchParams.getAll("language") || []
  );
  const [prices, setPrices] = useState(searchParams.getAll("price") || []);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();

    if (genre) params.set("genre", genre);
    languages.forEach((lang) => params.append("language", lang));
    prices.forEach((price) => params.append("price", price));

    router.push(`/books?${params.toString()}`);
  }, [genre, languages, prices, router]);

  // Toggle helper for checkbox arrays
  const toggleFilter = (value, list, setList) => {
    if (list.includes(value)) {
      setList(list.filter((item) => item !== value));
    } else {
      setList([...list, value]);
    }
  };

  return (
    <div className="filter__wrapper">
      {/* Genre select */}
      <div className="filter__group">
        <label>Genre</label>
        <select value={genre} onChange={(e) => setGenre(e.target.value)}>
          <option value="">All</option>
          <option value="fiction">Fiction</option>
          <option value="nonfiction">Non-fiction</option>
          <option value="fantasy">Fantasy</option>
          <option value="romance">Romance</option>
        </select>
      </div>

      {/* Language checkboxes */}
      <div className="filter__group">
        <label>Language</label>
        {["English", "Spanish", "French", "Hindi"].map((lang) => (
          <div key={lang}>
            <input
              type="checkbox"
              id={lang}
              checked={languages.includes(lang)}
              onChange={() => toggleFilter(lang, languages, setLanguages)}
            />
            <label htmlFor={lang}>{lang}</label>
          </div>
        ))}
      </div>

      {/* Price checkboxes */}
      <div className="filter__group">
        <label>Price</label>
        {["0-10", "10-20", "20-50"].map((range) => (
          <div key={range}>
            <input
              type="checkbox"
              id={range}
              checked={prices.includes(range)}
              onChange={() => toggleFilter(range, prices, setPrices)}
            />
            <label htmlFor={range}>${range}</label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilterBook;
