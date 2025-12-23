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
        error?.response?.data?.message || "Failed to delete requested book"
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
    <div className="min-h-screen md:p-6">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg overflow-x-auto">
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            Requested Books
          </h2>
        </div>

        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                Book Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                Author
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                Pub. Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                Language
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
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
                <tr key={book._id} className="hover:bg-gray-50 transition">
                  <td className="capitalize px-6 py-4 text-sm font-medium text-gray-800">
                    {book.bookName}
                  </td>
                  <td className="capitalize px-6 py-4 text-sm text-gray-700">
                    {book.authorName}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(book.publicationDate).toLocaleDateString()}
                  </td>
                  <td className="capitalize px-6 py-4 text-sm text-gray-500">
                    {book.language}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`capitalize inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                        book.status === "available"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {book.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDelete(book._id)}
                      className="rounded bg-red-600 px-3 py-1 text-white text-xs hover:bg-red-700"
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
  );
};

export default RequestedBookPage;
