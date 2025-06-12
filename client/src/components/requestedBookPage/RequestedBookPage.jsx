"use client";

import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { getRequestedBook } from "@/lib/api";
import Loading from "@/app/loading";
import { deleteRequestedBook } from "@/lib/api";

const RequestedBookPage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["getRequestedBook"],
    queryFn: getRequestedBook,
    staleTime: 10000,
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (bookId) => deleteRequestedBook(bookId),
    onSuccess: (data) => {
      alert(data.message);
      queryClient.invalidateQueries({ queryKey: ["getRequestedBook"] });
    },
    onError: (error) => {
      const backendMessage =
        error?.response?.data?.message || "Something went wrong";
      alert(backendMessage);
    },
  });

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this book?"
    );
    if (confirmDelete) {
      //   console.log("Deleting book with ID:", id);
      mutation.mutate(id);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg overflow-x-auto">
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Books Table</h2>
        </div>

        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Book Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Author Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Publication Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Language
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data?.allBookRequest?.map((book) => (
              <tr
                key={book._id}
                className="hover:bg-gray-50 transition duration-150"
              >
                <td className="capitalize px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                  {book.bookName}
                </td>
                <td className="capitalize px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {book.authorName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(book.publicationDate).toLocaleDateString()}
                </td>
                <td className="capitalize px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {book.language}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
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
                <td className="capitalize px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button
                    onClick={() => handleDelete(book._id)}
                    className="rounded-full bg-red-600 px-2 py-1 text-white cursor-pointer"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RequestedBookPage;
