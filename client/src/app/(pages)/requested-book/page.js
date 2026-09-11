"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { getRequestedBook, deleteRequestedBook } from "@/lib/api";
import Loading from "@/app/loading";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";

const STATUS_OPTIONS = ["pending", "in-progress", "available", "not-found"];

const RequestedBookPage = () => {
  const queryClient = useQueryClient();

  // URL PARAMS, router, pathname hooks
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathName = usePathname();

  // GET QUERY FROM URL
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const search = searchParams.get("search") || "";
  const statusParam = searchParams.get("status");
  const selectedStatuses = statusParam ? statusParam.split(",") : [];

  const [searchInput, setSearchInput] = useState(search);
  const debouncedSearch = useDebounce(searchInput, 500);

  // UPDATE URL HELPER FUNCTION
  const updateQueryParams = useCallback(
    (newParams) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(newParams).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.length > 0
            ? params.set(key, value.join(","))
            : params.delete(key);
        } else if (value !== undefined && value !== null && value !== "") {
          params.set(key, value.toString());
        } else {
          params.delete(key);
        }
      });

      if (!("page" in newParams)) {
        params.set("page", "1");
      }

      router.push(`${pathName}?${params.toString()}`, { scroll: false });
    },
    [searchParams, pathName, router],
  );

  // Sync debounced search value -> URL
  useEffect(() => {
    const currentSearch = searchParams.get("search") || "";

    if (debouncedSearch !== currentSearch) {
      updateQueryParams({ search: debouncedSearch });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  // Sync URL -> local input (e.g. back/forward navigation)
  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  const { data, isLoading } = useQuery({
    queryKey: [
      "getRequestedBook",
      {
        page,
        limit,
        search: debouncedSearch,
        status: statusParam,
      },
    ],
    queryFn: getRequestedBook,
    staleTime: 1000 * 60 * 5, // 5 minutes
    placeholderData: keepPreviousData,
  });

  const mutation = useMutation({
    mutationFn: deleteRequestedBook,
    onSuccess: (data) => {
      alert(data.message);
      queryClient.invalidateQueries({ queryKey: ["getRequestedBook"] });

      // Fix: if we just deleted the last item on a page beyond page 1,
      // step back a page instead of showing an empty page.
      if (books.length === 1 && page > 1) {
        updateQueryParams({ page: String(page - 1) });
      }
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

  // HANDLE STATUS CHANGE 3
  const handleStatusChange = (statusValue) => {
    let updatedStatus = [...selectedStatuses];

    if (updatedStatus.includes(statusValue)) {
      updatedStatus = updatedStatus.filter((s) => s !== statusValue);
    } else {
      updatedStatus.push(statusValue);
    }

    updateQueryParams({ status: updatedStatus, page: "1" });
  };

  const statusOptions = ["pending", "in-progress", "available", "not-found"];

  // SAFE fallback
  const books = data?.data?.requestedBook || [];
  const pagination = data?.data?.pagination || {};
  const totalPages = pagination.totalPage || 1;

  if (isLoading) return <Loading />;

  return (
    <div className="mx-3">
      <div className="p-3 md:p-5 max-w-6xl w-full mx-auto bg-gray-50 shadow-sm rounded-lg mt-5 min-h-[80vh] flex flex-col justify-between">
        <div>
          <div className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-xl font-semibold text-[var(--black)]">
              Requested Books
            </h2>

            <div className="text-sm text-gray-600 border-1 border-gray-300 px-3 py-[6px] rounded-sm">
              <p>
                Filtered Requested Books: {pagination?.filteredRequestedBook}
              </p>
            </div>
          </div>

          {/* Status Array Filter Checkboxes */}
          <div className="mb-4 flex flex-wrap items-center gap-4 bg-white p-3 rounded-md">
            {/* Search Input Bar */}
            <div className="flex items-center gap-2  w-full md:w-64">
              <input
                type="text"
                placeholder="Search by book or author..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="px-3 py-1.5 border border-gray-300 rounded-md text-sm w-full md:w-64"
              />
            </div>

            <span className="text-xs font-semibold text-gray-600 uppercase">
              Filter Status:
            </span>
            {STATUS_OPTIONS.map((status) => (
              <label
                key={status}
                className="inline-flex items-center gap-1.5 text-sm capitalize cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedStatuses.includes(status)}
                  onChange={() => handleStatusChange(status)}
                  className="rounded text-black focus:ring-black"
                />
                {status}
              </label>
            ))}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full table-auto divide-y divide-gray-200 overflow-hidden rounded-lg border-none border-spacing-0">
              <thead className="bg-gray-50">
                <tr className="bg-black text-white whitespace-nowrap">
                  <th className="px-4 md:px-6 py-2 md:py-3 text-left text-[8px] md:text-xs font-semibold uppercase">
                    Book Name
                  </th>
                  <th className="px-4 md:px-6 py-2 md:py-3 text-left text-[8px] md:text-xs uppercase">
                    Author
                  </th>
                  <th className="px-4 md:px-6 py-2 md:py-3 text-left text-[8px] md:text-xs uppercase hidden md:table-cell">
                    Pub. Date
                  </th>
                  <th className="px-4 md:px-6 py-2 md:py-3 text-left text-[8px] md:text-xs uppercase hidden md:table-cell">
                    Language
                  </th>
                  <th className="px-4 md:px-6 py-2 md:py-3 text-left text-[8px] md:text-xs uppercase">
                    Status
                  </th>
                  <th className="px-4 md:px-6 py-2 md:py-3 text-left text-[8px] md:text-xs uppercase">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
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
                      <td className="px-3 md:px-6 py-2 md:py-4 text-[9px] md:text-sm text-[var(--black)] hidden md:table-cell">
                        {new Date(book.publicationDate).toLocaleDateString()}
                      </td>
                      <td className="capitalize px-3 md:px-6 py-2 md:py-4 text-[9px] md:text-sm text-[var(--black)] hidden md:table-cell">
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
                          className="rounded cursor-pointer bg-red-600 px-3 py-1 text-white text-[9px] md:text-sm hover:bg-red-700"
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

        {/* Pagination Controls */}
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4 rounded-lg">
          <div className="text-sm text-gray-700">
            Page <span className="font-medium">{page}</span> of{" "}
            <span className="font-medium">{totalPages}</span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => updateQueryParams({ page: String(page - 1) })}
              disabled={page <= 1}
              className="px-3 py-1 text-xs md:text-sm bg-gray-200 text-gray-800 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition"
            >
              Previous
            </button>
            <button
              onClick={() => updateQueryParams({ page: String(page + 1) })}
              disabled={page >= totalPages}
              className="px-3 py-1 text-xs md:text-sm bg-gray-200 text-gray-800 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestedBookPage;
