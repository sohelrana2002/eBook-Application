import { listBooks } from "@/http/api";
import Heading from "@/shared/heading/Heading";
import { useQuery } from "@tanstack/react-query";
import { BookMarked, CirclePlus } from "lucide-react";
import Loading from "@/shared/loading/Loading";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const Books = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["books"],
    queryFn: listBooks,
    staleTime: 10000,
  });

  const [openMenuId, setOpenMenuId] = useState(null);

  const toggleMenu = (id) => {
    setOpenMenuId((prevId) => (prevId === id ? null : id));
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".action-menu")) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
    <div>
      <Heading icon={<BookMarked />} title="Books" />

      <div className="border p-3 rounded-sm h-full">
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

        <div className="overflow-x-auto rounded-lg shadow">
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
                  Created at
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
                          src={curElem.coverImage}
                          alt="books images"
                          className="h-10 w-10 rounded-md object-cover"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {curElem.title}
                      </td>
                      <td className="py-4 whitespace-nowrap text-sm text-gray-700 flex flex-col gap-y-1 items-center">
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
                        ৳ {curElem.price}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                        {curElem.author}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {curElem.created_at.substring(0, 10)}
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
                            <button
                              onClick={() => {
                                console.log("Edit", curElem._id);
                                setOpenMenuId(null);
                                console.log("clicked");
                              }}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 cursor-pointer"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                console.log("Delete", curElem._id);
                                setOpenMenuId(null);
                              }}
                              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100 cursor-pointer"
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

        <div className="mt-4 text-sm text-gray-600">
          Showing 1-50 of 232 products
        </div>
      </div>
    </div>
  );
};

export default Books;
