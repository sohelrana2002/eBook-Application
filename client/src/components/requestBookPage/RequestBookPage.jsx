"use client";
import { useState } from "react";
import { useAuthContext } from "@/context/authContext";

const RequestBookPage = () => {
  const { isLoggedIn } = useAuthContext();

  const [form, setForm] = useState({
    bookName: "",
    authorName: "",
    publicationDate: "",
    language: "",
  });

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-6 max-w-md shadow rounded bg-white">
          <h1 className="text-xl font-semibold mb-2">You're not logged in</h1>
          <p className="text-gray-600 mb-4">
            Please log in to request a book. Once logged in, you’ll be able to
            fill the request form.
          </p>
          <a
            href="/login"
            className="inline-block px-4 py-2 bg-[var(--blue)] text-white rounded cursor-pointer"
          >
            Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[90vh]">
      <div className="w-[90vw] md:w-[80vw] max-w-xl p-6 shadow rounded bg-white">
        <h1 className="text-xl md:text-2xl font-bold mb-4">
          Which Book Are You Looking For That’s Not On Our Website?
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium">Book Name</label>
            <input
              type="text"
              name="bookName"
              value={form.bookName}
              onChange={handleChange}
              required
              className="w-full border  border-[var(--border)] rounded p-2"
            />
          </div>

          <div>
            <label className="block font-medium">Author Name</label>
            <input
              type="text"
              name="authorName"
              value={form.authorName}
              onChange={handleChange}
              required
              className="w-full border border-[var(--border)] rounded p-2"
            />
          </div>

          <div>
            <label className="block font-medium">Publication Date</label>
            <input
              type="date"
              name="publicationDate"
              value={form.publicationDate}
              onChange={handleChange}
              required
              className="w-full border border-[var(--border)] rounded p-2"
            />
          </div>

          <div>
            <label className="block font-medium">Language</label>
            <input
              type="text"
              name="language"
              value={form.language}
              onChange={handleChange}
              required
              className="w-full border border-[var(--border)] rounded p-2"
            />
          </div>

          <button
            type="submit"
            className="bg-[var(--blue)] text-white w-full py-2 rounded hover:bg-[var(--black)] cursor-pointer"
          >
            Send Request
          </button>
        </form>
      </div>
    </div>
  );
};

export default RequestBookPage;
