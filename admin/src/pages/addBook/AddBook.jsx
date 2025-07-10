import Heading from "@/shared/heading/Heading";
import { CopyPlus, LoaderCircle } from "lucide-react";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBook } from "@/http/api";
import { useNavigate } from "react-router-dom";

const AddBook = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    genre: [],
    language: "",
    publicationDate: "",
    price: "",
    tags: [],
    isOscar: false,
    isNovel: false,
    isShortStory: false,
    isPoetry: false,
    isKidsBook: false,
    coverImage: null,
    bookFile: null,
  });

  console.log("formData", formData);

  const genres = [
    "Fiction",
    "Non-Fiction",
    "Mystery",
    "Science Fiction",
    "Fantasy",
    "Historical Fiction",
    "Biography",
    "Horror",
    "Poetry",
    "Drama",
    "Health",
  ];
  const allTags = [
    "fiction",
    "non-fiction",
    "mystery",
    "science-fiction",
    "fantasy",
    "historical-fiction",
    "biography",
    "horror",
    "poetry",
    "drama",
    "health",
  ];

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") {
      setFormData({ ...formData, [name]: files[0] });
    } else if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else if (name === "price") {
      setFormData({ ...formData, [name]: parseFloat(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleMultiSelect = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: prev[name].includes(value)
        ? prev[name].filter((v) => v !== value)
        : [...prev[name], value],
    }));
  };

  // ---dynamically reset state---
  const reset = Object.fromEntries(
    Object.entries(formData).map(([key, value]) => {
      if (Array.isArray(value)) return [key, []];
      if (typeof value === "boolean") return [key, false];
      if (value instanceof File || value === null) return [key, null];
      return [key, ""];
    })
  );

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createBook,
    onSuccess: (data) => {
      // console.log("Book created:", data);
      alert(data.message);
      queryClient.invalidateQueries({ queryKey: ["books"] });
      setFormData(reset);
      navigate("/books");
    },
    onError: (error) => {
      const backendMessage =
        error?.response?.data?.message || "Something went wrong";

      // const validationErrors = error?.response?.data?.errors;

      // console.error("Backend error:", backendMessage);
      alert(backendMessage);

      // Optional: Set validation errors in state if you want field-specific messages
      // if (validationErrors) {
      //   setFormErrors(validationErrors); // You need formErrors state
      // }
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("author", formData.author);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("language", formData.language);
    formDataToSend.append("publicationDate", formData.publicationDate);
    formDataToSend.append("price", formData.price);

    formData.genre.forEach((g) => formDataToSend.append("genre[]", g));
    formData.tags.forEach((t) => formDataToSend.append("tags[]", t));
    formDataToSend.append("coverImage", formData.coverImage);
    formDataToSend.append("bookFile", formData.bookFile);
    formDataToSend.append("isOscar", formData.isOscar);
    formDataToSend.append("isNovel", formData.isNovel);
    formDataToSend.append("isShortStory", formData.isShortStory);
    formDataToSend.append("isPoetry", formData.isPoetry);
    formDataToSend.append("isKidsBook", formData.isKidsBook);

    mutation.mutate(formDataToSend);
  };

  return (
    <div className="pb-15">
      <Heading icon={<CopyPlus />} title="Create a Book" />

      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow space-y-6"
      >
        <h2 className="text-2xl font-bold text-gray-800">Add New Book</h2>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 px-3 py-2"
            required
          />
        </div>

        {/* Author */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Author
          </label>
          <input
            name="author"
            value={formData.author}
            onChange={handleChange}
            className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 px-3 py-2"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="px-3 py-2 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Genre (multi-select) */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Genre
          </label>
          <div className="flex flex-wrap gap-2 mt-1">
            {genres?.map((g) => (
              <button
                type="button"
                key={g}
                onClick={() => handleMultiSelect("genre", g)}
                className={`px-3 py-1 rounded-full text-sm border cursor-pointer ${
                  formData?.genre?.includes(g)
                    ? "bg-[#000] text-white "
                    : "bg-white text-gray-700 border-gray-300"
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Language */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Language
          </label>
          <input
            name="language"
            value={formData.language}
            onChange={handleChange}
            className="px-3 py-2 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Publication Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Publication Date
          </label>
          <input
            type="date"
            name="publicationDate"
            value={formData.publicationDate}
            onChange={handleChange}
            className="px-3 py-2 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Price ($)
          </label>
          <input
            type="number"
            step="0.01"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="px-3 py-2 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            min={0}
          />
        </div>

        {/* Tags (multi-select) */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Tags
          </label>
          <div className="flex flex-wrap gap-2 mt-1">
            {allTags.map((tag) => (
              <button
                type="button"
                key={tag}
                onClick={() => handleMultiSelect("tags", tag)}
                className={`px-3 py-1 rounded-full text-sm border cursor-pointer ${
                  formData.tags.includes(tag)
                    ? "bg-[#000] text-white"
                    : "bg-white text-gray-700 border-gray-300"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Cover Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Cover Image
          </label>
          <input
            type="file"
            name="coverImage"
            onChange={handleChange}
            accept="image/*"
            className="mt-1"
          />
        </div>

        {/* Book File */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Book File (PDF)
          </label>
          <input
            type="file"
            name="bookFile"
            onChange={handleChange}
            accept=".pdf"
            className="mt-1"
          />
        </div>

        {/* =====isOscar===== */}
        <div className="flex items-center gap-2 mt-1">
          <input
            type="checkbox"
            name="isOscar"
            checked={formData.isOscar}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
          />
          <span className="text-sm text-gray-700">This book won an Oscar?</span>
        </div>

        {/* =====isNovel===== */}
        <div className="flex items-center gap-2 mt-1">
          <input
            type="checkbox"
            name="isNovel"
            checked={formData.isNovel}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
          />
          <span className="text-sm text-gray-700">
            Is this book a full-length novel?
          </span>
        </div>

        {/* =====isShortStory===== */}
        <div className="flex items-center gap-2 mt-1">
          <input
            type="checkbox"
            name="isShortStory"
            checked={formData.isShortStory}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
          />
          <span className="text-sm text-gray-700">
            Is this book a short story?
          </span>
        </div>

        {/* =====isPoetry===== */}
        <div className="flex items-center gap-2 mt-1">
          <input
            type="checkbox"
            name="isPoetry"
            checked={formData.isPoetry}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
          />
          <span className="text-sm text-gray-700">
            Is this book a collection of poetry?
          </span>
        </div>

        {/* =====isKidsBook===== */}
        <div className="flex items-center gap-2 mt-1">
          <input
            type="checkbox"
            name="isKidsBook"
            checked={formData.isKidsBook}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
          />
          <span className="text-sm text-gray-700">
            Is this book meant for children?
          </span>
        </div>

        <div>
          <button
            type="submit"
            className="cursor-pointer w-full py-2 px-4 bg-[#000] text-white rounded-md flex items-center gap-2 justify-center"
            disabled={mutation.isPending}
          >
            {mutation.isPending && <LoaderCircle className="animate-spin" />}
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBook;
