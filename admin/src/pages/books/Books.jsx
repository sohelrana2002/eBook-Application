import { listBooks } from "@/http/api";
import Heading from "@/shared/heading/Heading";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { BookMarked, CirclePlus } from "lucide-react";
import Loading from "@/shared/loading/Loading";
import { Button } from "@/components/ui/button";
import { Link, useSearchParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteBook } from "@/http/api";

const Books = () => {
  const [searchParams, setSearchParams] = useSearchParams({
    page: 1,
    search: "",
  });
  const actionRef = useRef();
  const queryClient = useQueryClient();

  const page = parseInt(searchParams.get("page")) || 1;
  const search = searchParams.get("search");

  // ---handle search book ===
  const handleSearchBook = (e) => {
    setSearchParams({
      search: e.target.value,
      page: 1,
    });
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["books", { page, search }],
    queryFn: listBooks,
    staleTime: 10000,
    placeholderData: keepPreviousData,
  });

  const [openMenuId, setOpenMenuId] = useState(null);

  const toggleMenu = (id) => {
    setOpenMenuId((prevId) => (prevId === id ? null : id));
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (actionRef.current && !actionRef.current.contains(e.target)) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const mutation = useMutation({
    mutationFn: (bookId) => deleteBook(bookId),
    onSuccess: () => {
      // console.log("Book created:", data);
      alert("Book deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
    onError: (error) => {
      const backendMessage =
        error?.response?.data?.message || "Something went wrong";
      alert(backendMessage);
    },
  });

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure want to delete the book?"
    );

    if (confirmDelete) {
      mutation.mutate(id);
    }
  };

  // console.log("data", data);

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    console.log("isError", error.message);

    return (
      <h1>
        Error:{" "}
        {error?.response?.data?.message ||
          error?.message ||
          "Something went wrong"}
      </h1>
    );
  }

  return (
    <div className="pb-10">
      <div className="md:flex flex-row items-center justify-between  ">
        <Heading icon={<BookMarked />} title="Books" />
        <input
          type="search"
          value={search}
          className="mb-5 border rounded px-3 py-2 mt-[-50px] md:mb-0"
          placeholder="search book..."
          onChange={handleSearchBook}
        />
      </div>

      <div className="border p-3 rounded-sm h-full pb-5">
        <div className="flex item-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-800">Books</h2>
          <Link to="/book/add-book">
            <Button className="cursor-pointer">
              <CirclePlus />
              Add Book
            </Button>
          </Link>
        </div>

        <p className="text-gray-500 mb-4">
          Manage your books and view their sales performance.
        </p>

        <div className="overflow-x-auto rounded-lg shadow" ref={actionRef}>
          <table className="min-w-full divide-y divide-gray-200 bg-white">
            {/* ---books heading---- */}
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  Book Image
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  Genre
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  Author name
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  Publication Date
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>

            {/* ---books content--- */}
            {data?.books &&
              data?.books?.map((curElem) => {
                return (
                  <tbody className="divide-y divide-gray-100" key={curElem._id}>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <img
                          src="/book.jpg"
                          alt="books images"
                          className="h-10 w-10 rounded-md object-cover"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                        {curElem.title}
                      </td>
                      <td className="py-4 whitespace-nowrap text-sm text-gray-700 flex flex-wrap gap-1 items-center">
                        {curElem?.genre?.map((g, i) => {
                          return (
                            <span
                              key={i}
                              className="inline-flex rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800"
                            >
                              {g}
                            </span>
                          );
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ${curElem.price}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 capitalize">
                        {curElem.author}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {curElem.publicationDate.substring(0, 10)}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 relative">
                        <button
                          onClick={() => toggleMenu(curElem._id)}
                          className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full cursor-pointer"
                        >
                          ⋮
                        </button>

                        {openMenuId === curElem._id && (
                          <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-10 flex flex-col">
                            <div className="px-4 py-2 text-sm text-gray-500 border-b">
                              Actions
                            </div>
                            <Link
                              to={`/book/update/${curElem._id}`}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 cursor-pointer"
                            >
                              Edit
                            </Link>
                            <button
                              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100 cursor-pointer"
                              onClick={() => handleDelete(curElem._id)}
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  </tbody>
                );
              })}
          </table>
        </div>

        <div className="mt-5 text-sm text-gray-600">
          <div className="flex justify-center gap-2 mt-4">
            <button
              onClick={() =>
                setSearchParams({
                  page: page === 1 ? 1 : page - 1,
                })
              }
              disabled={page === 1}
              className={`px-3 py-1 rounded ${
                page === 1
                  ? "bg-white text-black border cursor-auto"
                  : "bg-black text-white cursor-pointer"
              }`}
            >
              Prev
            </button>

            <span className="px-4 py-1">
              {data.currentPage} out of {data.totalPages} & total -{" "}
              {data.totalBooks}
            </span>

            <button
              onClick={() =>
                setSearchParams({
                  page: data.totalPages > page ? page + 1 : page,
                })
              }
              disabled={page === data.totalPages}
              className={`px-3 py-1 rounded ${
                page === data.totalPages
                  ? "bg-white text-black border cursor-auto"
                  : "bg-black text-white cursor-pointer"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Books;
