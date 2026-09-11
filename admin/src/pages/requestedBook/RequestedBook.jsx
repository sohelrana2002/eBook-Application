import React, { useEffect, useState } from "react";
import { Eye, Pencil, Search, Trash2 } from "lucide-react";
import { allRequestedBook, deleteRequestedBook } from "@/http/api";
import {
  keepPreviousData,
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import Loading from "@/shared/loading/Loading";
import { Link, useSearchParams } from "react-router-dom";
import { useDebounce } from "@/hooks/useDebounce";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ExampleComboboxMultiple, ComboboxBasic } from "@/utlis/customComboBox";
import { DateRangePicker } from "@/components/DateRangePicker";

// DEFINE REQUESTED BOOK STATUS
const BOOK_STATUS = [
  { label: "Pending", value: "pending" },
  { label: "In-Progress", value: "in-progress" },
  { label: "Available", value: "available" },
  { label: "Not-Found", value: "not-found" },
];

const RequestedBook = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();

  const page = parseInt(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";
  const statusParam = searchParams.get("status");
  const selectedStatuses = statusParam ? statusParam.split(",") : [];
  const seen = searchParams.get("seen") || undefined;
  const fromDate = searchParams.get("fromDate") || undefined;
  const toDate = searchParams.get("toDate") || undefined;

  // DATE RANGE STATE FOR PICKER
  const dateRange = {
    from: fromDate ? new Date(fromDate) : undefined,
    to: toDate ? new Date(toDate) : undefined,
  };

  // SEARCH TYPING SMOOTH EXPERIENCE
  const [searchInput, setSearchInput] = useState(search || "");
  const debouncedSearch = useDebounce(searchInput, 500);

  // UPDATE URL WITH CURRENT FILTER
  const updateFilters = (newFilters) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);

      Object.entries(newFilters).forEach(([key, value]) => {
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

      return params;
    });
  };

  // DEBOUNCE SEARCH
  useEffect(() => {
    const currentSearch = searchParams.get("search") || "";

    if (debouncedSearch !== currentSearch) {
      updateFilters({ search: debouncedSearch, page: 1 });
    }
  }, [debouncedSearch]);

  // BROWSER BACK BUTTON INPUT SYNC
  useEffect(() => {
    const curentSearch = searchParams.get("search") || "";

    if (searchInput !== curentSearch) {
      setSearchInput(curentSearch);
    }
  }, [searchParams]);

  // HANDLE STATUS CHANGE
  const handleStatusChange = (selectedOptions) => {
    updateFilters({ status: selectedOptions, page: 1 });
  };

  // HANDLE PAGINATION
  const handlePageChange = (newPage) => {
    updateFilters({ page: newPage });
  };

  // HANDLE SEEN OR UNSEEN
  const handleIsSeen = (checked) => {
    // checked true or false
    updateFilters({
      seen: checked ? "true" : undefined,
      page: 1,
    });
  };

  // DATE RANGE HANDLER
  const handleDateChange = (range) => {
    if (!range) {
      updateFilters({
        fromDate: undefined,
        toDate: undefined,
        page: 1,
      });
      return;
    }

    updateFilters({
      fromDate: range.from
        ? format(new Date(range.from), "yyyy-MM-dd")
        : undefined,
      toDate: range.to ? format(new Date(range.to), "yyyy-MM-dd") : undefined,
      page: 1,
    });
  };

  // FETCH REQUESTED BOOK DATA
  const { data, isLoading, isError, error } = useQuery({
    queryKey: [
      "allRequestedBook",
      {
        page,
        search: debouncedSearch,
        status: statusParam,
        seen,
        fromDate,
        toDate,
      },
    ],
    queryFn: allRequestedBook,
    staleTime: 1000 * 60 * 5, // Caches fresh data (5-mins)
    placeholderData: keepPreviousData,
  });

  // DELETE REQUESTED BOOK MUTATION
  const mutation = useMutation({
    mutationFn: deleteRequestedBook,
    onSuccess: (data) => {
      alert(data.message);
      queryClient.invalidateQueries({ queryKey: ["allRequestedBook"] });
    },
    onError: (error) => {
      const errorMessage = error?.response?.data?.message;
      alert(errorMessage);
    },
  });

  // HANDLE DELETE FUNCTION
  const handleDelete = (id) => {
    const confirmMessage = window.confirm(
      "Are you sure want to delete the book?",
    );

    if (confirmMessage) {
      mutation.mutate(id);
    }
  };

  // RESPONSE EXTRACTION
  const requestedBooks = data?.data?.requestedBooks || [];
  const pagination = data?.data?.pagination || {};
  // console.log("requestedBooks: ", requestedBooks);

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
    <main className="w-full">
      <h2 className="text-xl md:text-2xl font-bold text-gray-900">
        Requested Book List
      </h2>

      {/* search field  */}
      <div className="py-5 flex flex-col md:flex-row gap-y-2 md:gap-0 items-start md:items-center justify-between">
        <div className="relative w-full md:w-md">
          <Search className="absolute left-2.5 top-[12px] h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            value={searchInput}
            placeholder="Search books by user's name, title, author..."
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-8 placeholder:text-sm border-3 w-full"
            disabled={isLoading}
          />
        </div>
        <div className="text-sm text-gray-600 border-2 px-3 py-[6px] rounded-sm">
          <p>Filtered Requested Books: {pagination?.filteredRequestedBooks}</p>
        </div>
      </div>

      {/* MULTIPLE FILTERS  */}
      <div className="flex items-center gap-2 flex-wrap mb-4">
        {/* SELECT BOOK STATUS  */}
        <ExampleComboboxMultiple
          items={BOOK_STATUS}
          value={selectedStatuses}
          setValue={handleStatusChange}
          placeholder="Filter by status..."
        />

        {/* SEEN CHECKING  */}
        <div className="flex items-center gap-2 border-1 px-3 py-[6px] rounded-sm">
          <Checkbox
            id="isSeen"
            checked={seen === "true"}
            onCheckedChange={handleIsSeen}
          />
          <Label
            htmlFor="isSeen"
            className="cursor-pointer text-sm text-muted-foreground font-normal"
          >
            Only Seen Books
          </Label>
        </div>
        {/* DATE RANGE FILTER */}
        <div className="w-auto">
          <DateRangePicker
            label=""
            placeholder="Filter by date range"
            value={dateRange}
            onChange={handleDateChange}
          />
        </div>
      </div>

      {/* ACTUAL DATA TABLE  */}
      <div className="shadow-md p-2 rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Requested By</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Author name</TableHead>
              <TableHead className="hidden md:table-cell">
                Publication Date
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requestedBooks?.length > 0 ? (
              requestedBooks?.map((book) => (
                <TableRow
                  key={book._id}
                  className={`${book?.isSeen === true ? "" : "bg-blue-100/60"}`}
                >
                  <TableCell className="max-w-[120px]">
                    <div
                      className="truncate capitalize"
                      title={book?.user?.name}
                    >
                      {book?.user?.name}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[150px]">
                    <div className="truncate capitalize" title={book?.bookName}>
                      {book?.bookName}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[120px]">
                    <div
                      className="truncate capitalize"
                      title={book?.authorName}
                    >
                      {book?.authorName}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {new Date(book?.publicationDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div
                      className={`flex items-center justify-center  text-white rounded-sm w-fit px-3 py-1 text-center text-xs capitalize ${
                        book?.status === "available"
                          ? "bg-green-700"
                          : "bg-red-800"
                      }`}
                    >
                      {book?.status}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {/* VIEW  */}
                      <Link
                        to={`/book/update/${book?._id}`}
                        title="View"
                        className="w-[35px] h-[35px] border-2 grid place-items-center rounded-sm cursor-pointer"
                      >
                        <Eye className="w-[16px] h-[20px]" />
                      </Link>

                      {/* EDIT  */}
                      <Link
                        to={`/book/update/${book?._id}`}
                        title="Edit"
                        className="w-[35px] h-[35px] border-2 grid place-items-center rounded-sm cursor-pointer"
                      >
                        <Pencil className="w-[16px] h-[20px]" />
                      </Link>

                      {/* DELETE  */}
                      <button
                        title="Delete"
                        onClick={() => handleDelete(book._id)}
                        disabled={mutation.isPending}
                        className="w-[35px] h-[35px] bg-red-700 grid place-items-center rounded-sm cursor-pointer"
                      >
                        <Trash2 className="w-[16px] h-[20px] text-background" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No books found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination  */}
      <div className="flex items-center justify-center gap-2 text-sm text-gray-600 pt-6">
        <button
          onClick={() => handlePageChange(Math.max(page - 1, 1))}
          disabled={page <= 1}
          className={`px-3 py-1 rounded ${
            page <= 1
              ? "bg-white text-black border cursor-auto"
              : "bg-black text-white cursor-pointer"
          }`}
        >
          Prev
        </button>

        <span className="px-4">
          Page {pagination.pageNumber} of {pagination?.totalPages} |{" "}
          {pagination?.totalRequestedBooks} books
        </span>

        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page >= pagination.totalPages}
          className={`px-3 py-1 rounded ${
            page >= pagination.totalPages
              ? "bg-white text-black border cursor-auto"
              : "bg-black text-white cursor-pointer"
          }`}
        >
          Next
        </button>
      </div>
    </main>
  );
};

export default RequestedBook;
