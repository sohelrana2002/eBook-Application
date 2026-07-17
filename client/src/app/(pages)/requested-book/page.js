"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getRequestedBook, deleteRequestedBook } from "@/lib/api";
import Loading from "@/app/loading";

const RequestedBookPage = () => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["getRequestedBook"],
    queryFn: getRequestedBook,
    staleTime: 10000,
  });

  const mutation = useMutation({
    mutationFn: deleteRequestedBook,
    onSuccess: (data) => {
      alert(data.message);
      queryClient.invalidateQueries({ queryKey: ["getRequestedBook"] });
    },
    onError: (error) => {
      alert(
        error?.response?.data?.message || "Failed to delete requested book",
      );
    },
  });

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      mutation.mutate(id);
    }
  };

  if (isLoading) return <Loading />;

  // SAFE fallback
  const books = data?.allBookRequest || [];

  return (
    <div className="max-w-6xl w-full mx-auto bg-gray-50 shadow-sm rounded-lg mt-5 h-[80vh]">
      <div className="p-3 md:p-5">
        <div className="py-4">
          <h2 className="text-xl font-semibold text-[var(--black)]">
            Requested Books
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full table-auto divide-y divide-gray-200 overflow-hidden rounded-lg border-none border-spacing-0">
            <thead className="bg-gray-50">
              <tr className="bg-black text-white whitespace-nowrap">
                <th className="px-4 md:px-6 py-2 md:py-3 text-left text-[8px] md:text-xs font-semibold  uppercase">
                  Book Name
                </th>
                <th className="px-4 md:px-6 py-2 md:py-3 text-left text-[8px] md:text-xs  uppercase">
                  Author
                </th>
                <th className="px-4 md:px-6 py-2 md:py-3 text-left text-[8px] md:text-xs  uppercase">
                  Pub. Date
                </th>
                <th className="px-4 md:px-6 py-2 md:py-3 text-left text-[8px] md:text-xs  uppercase">
                  Language
                </th>
                <th className="px-4 md:px-6 py-2 md:py-3 text-left text-[8px] md:text-xs  uppercase">
                  Status
                </th>
                <th className="px-4 md:px-6 py-2 md:py-3 text-left text-[8px] md:text-xs uppercase">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {/* NO BOOK MESSAGE */}
              {books.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center py-6 text-gray-500 text-sm"
                  >
                    No book request found
                  </td>
                </tr>
              ) : (
                books.map((book) => (
                  <tr
                    key={book._id}
                    className="hover:bg-gray-100 transition whitespace-nowrap"
                  >
                    <td className="capitalize px-3 md:px-6 py-2 md:py-4 text-[9px] md:text-sm font-medium text-[var(--black)]">
                      {book.bookName}
                    </td>
                    <td className="capitalize px-3 md:px-6 py-2 md:py-4 text-[9px] md:text-sm text-[var(--black)]">
                      {book.authorName}
                    </td>
                    <td className="px-3 md:px-6 py-2 md:py-4 text-[9px] md:text-sm text-[var(--black)]">
                      {new Date(book.publicationDate).toLocaleDateString()}
                    </td>
                    <td className="capitalize px-3 md:px-6 py-2 md:py-4 text-[9px] md:text-sm text-[var(--black)]">
                      {book.language}
                    </td>
                    <td className="px-3 md:px-6 py-2 md:py-4">
                      <span
                        className={`capitalize inline-block px-2 py-1 rounded-full text-[9px] md:text-xs font-semibold ${
                          book.status === "available"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {book.status}
                      </span>
                    </td>
                    <td className="px-3 md:px-6 py-2 md:py-4">
                      <button
                        onClick={() => handleDelete(book._id)}
                        className="rounded  cursor-pointer bg-red-600 px-3 py-1 text-white  text-[9px] md:text-sm hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RequestedBookPage;
