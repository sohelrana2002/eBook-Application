import Heading from "@/shared/heading/Heading";
import { CopyPlus, LoaderCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { singleBook, updateBook } from "@/http/api";
import Loading from "@/shared/loading/Loading";
var singleBookData;

// --- Reusable MultiSelect With Custom Input ---
const MultiSelectWithCustomInput = ({
  label,
  options,
  selected,
  setSelected,
}) => {
  const [inputValue, setInputValue] = useState("");

  const handleToggle = (item) => {
    if (!Array.isArray(selected)) return;
    setSelected(
      selected.includes(item)
        ? selected.filter((i) => i !== item)
        : [...selected, item]
    );
  };

  const handleKeyDown = (e) => {
    if ((e.key === "Enter" || e.key === ",") && inputValue.trim()) {
      e.preventDefault();
      const newItem = inputValue.trim();

      if (!Array.isArray(selected)) return;
      if (!selected.includes(newItem)) {
        setSelected([...selected, newItem]);
      }

      setInputValue("");
    }
  };

  return (
    <div className="mt-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>

      {/* Predefined Options */}
      <div className="flex flex-wrap gap-2">
        {options.map((item) => (
          <button
            type="button"
            key={item}
            onClick={() => handleToggle(item)}
            className={`px-3 py-1 rounded-full text-sm border cursor-pointer ${
              selected?.includes(item)
                ? "bg-black text-white"
                : "bg-white text-gray-700 border-gray-300"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      {/* Custom input */}
      <input
        type="text"
        placeholder={`Add custom ${label.toLowerCase()}...`}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        className="mt-2 w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
      />

      {/* Display selected items */}
      <div className="mt-2 flex flex-wrap gap-2">
        {selected?.map((item) => (
          <span
            key={item}
            className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
};

const UpdateBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

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

  // console.log("formData", formData);

  const { data: bookData, isLoading } = useQuery({
    queryKey: ["book", id],
    queryFn: () => singleBook(id),
  });

  useEffect(() => {
    if (bookData) {
      singleBookData = bookData.singeBook;
      //   console.log("singleBookData:", singleBookData);

      setFormData({ ...singleBookData });
    }
  }, [bookData]);

  const defaultGenres = [
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
  const defaultTags = [
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

  // const handleMultiSelect = (name, value) => {
  //   setFormData((prev) => ({
  //     ...prev,
  //     [name]: prev[name].includes(value)
  //       ? prev[name].filter((v) => v !== value)
  //       : [...prev[name], value],
  //   }));
  // };

  const mutation = useMutation({
    mutationFn: ({ id, formData }) => updateBook({ id, formData }),
    onSuccess: (data) => {
      alert(data.message);
      queryClient.invalidateQueries(["books"]);
      navigate("/books");
    },
    onError: (error) => {
      alert(error?.response?.data?.message || "Update failed");
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

    //   mutation.mutate(formDataToSend);
    mutation.mutate({ id, formData: formDataToSend });
    // console.log(formData);
    // You can now send formData to backend using FormData if needed
  };

  if (isLoading) {
    <Loading />;
  }

  return (
    <div className="pb-15">
      <Heading icon={<CopyPlus />} title="Update a Book" />

      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow space-y-6"
      >
        <h2 className="text-2xl font-bold text-gray-800">Update a Book</h2>

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

        {/* Genre (with custom input) */}
        <MultiSelectWithCustomInput
          label="Genre"
          name="genre"
          options={defaultGenres}
          selected={formData.genre}
          setSelected={(genres) =>
            setFormData((prev) => ({ ...prev, genre: genres }))
          }
        />

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
            name="price"
            step="0.01"
            value={formData.price}
            onChange={handleChange}
            className="px-3 py-2 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            min={0}
          />
        </div>

        {/* Tags (with custom input) */}
        <MultiSelectWithCustomInput
          label="Tags"
          name="tags"
          options={defaultTags}
          selected={formData.tags}
          setSelected={(tags) => setFormData((prev) => ({ ...prev, tags }))}
        />

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

        {/* Flags */}
        {[
          ["isOscar", "This book won an Oscar?"],
          ["isNovel", "Is this book a full-length novel?"],
          ["isShortStory", "Is this book a short story?"],
          ["isPoetry", "Is this book a collection of poetry?"],
          ["isKidsBook", "Is this book meant for children?"],
        ].map(([name, label]) => (
          <div className="flex items-center gap-2 mt-1" key={name}>
            <input
              type="checkbox"
              name={name}
              checked={formData[name]}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
            <span className="text-sm text-gray-700">{label}</span>
          </div>
        ))}

        {/* submit  */}
        <div>
          <button
            type="submit"
            className="cursor-pointer w-full py-2 px-4 bg-[#000] text-white rounded-md flex items-center gap-2 justify-center"
            disabled={mutation.isPending}
          >
            {mutation.isPending && <LoaderCircle className="animate-spin" />}
            Update
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateBook;
