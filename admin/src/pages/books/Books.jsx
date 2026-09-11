import { listBooks } from "@/http/api";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  BookMarked,
  CirclePlus,
  Eye,
  Trash2,
  Pencil,
  Search,
} from "lucide-react";
import Loading from "@/shared/loading/Loading";
import { Button } from "@/components/ui/button";
import { Link, useSearchParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteBook } from "@/http/api";
import defaultImage from "/book.jpg";
import { Input } from "@/components/ui/input";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDebounce } from "@/hooks/useDebounce";

const Books = () => {
  const [searchParams, setSearchParams] = useSearchParams({
    page: 1,
    search: "",
  });
  const queryClient = useQueryClient();

  const page = parseInt(searchParams.get("page")) || 1;
  const search = searchParams.get("search");

  // ADDED DEBOUNCED SEARCH
  const debouncedSearch = useDebounce(search, 500);

  // ---handle search book ===
  const handleSearchBook = (e) => {
    setSearchParams({
      search: e.target.value,
      page: 1,
    });
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["books", { page, search: debouncedSearch }],
    queryFn: listBooks,
    staleTime: 1000 * 60 * 5, // Caches fresh data (5-mins)
    placeholderData: keepPreviousData,
  });

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
      "Are you sure want to delete the book?",
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
    <div className="w-full">
      <div className="flex items-center justify-between">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">
          All Books
        </h2>
        <Link to="/book/add-book">
          <Button className="cursor-pointer">
            <CirclePlus />
            Add Book
          </Button>
        </Link>
      </div>

      <p className="text-gray-600 text-sm md:text-[16px] pt-3 md:pt-0">
        Manage your books and view their sales performance.
      </p>

      {/* search field  */}
      <div className="py-5 flex flex-col md:flex-row gap-y-2 md:gap-0 items-start md:items-center justify-between">
        <div className="relative w-full md:w-md">
          <Search className="absolute left-2.5 top-[12px] h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            value={search}
            placeholder="Search books by title, author..."
            onChange={handleSearchBook}
            className="pl-8 placeholder:text-sm border-3 w-full"
            disabled={isLoading}
          />
        </div>
        <div className="text-sm text-gray-600 border-2 px-3 py-[6px] rounded-sm">
          <p>Total Books: {data.totalBooks}</p>
        </div>
      </div>

      {/* actual table  */}
      <div className="shadow-md p-2 rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Book Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Author name</TableHead>
              <TableHead className="hidden md:table-cell">
                Publication Date
              </TableHead>
              <TableHead className="hidden md:table-cell">Price</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.books?.length > 0 ? (
              data?.books?.map((curElem) => (
                <TableRow key={curElem._id}>
                  <TableCell className="font-medium capitalize">
                    <img
                      src={`${
                        curElem.coverImage ? curElem.coverImage : defaultImage
                      }`}
                      alt="books images"
                      className="h-10 w-10 rounded-md object-cover"
                    />
                  </TableCell>
                  <TableCell>{curElem.title}</TableCell>
                  <TableCell>{curElem.author}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {curElem.publicationDate.substring(0, 10)}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    ৳ {curElem.price}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {/* VIEW  */}
                      <Link
                        to={`/book/update/${curElem._id}`}
                        title="View"
                        className="w-[35px] h-[35px] border-2 grid place-items-center rounded-sm cursor-pointer"
                      >
                        <Eye className="w-[16px] h-[20px]" />
                      </Link>

                      {/* EDIT  */}
                      <Link
                        to={`/book/update/${curElem._id}`}
                        title="Edit"
                        className="w-[35px] h-[35px] border-2 grid place-items-center rounded-sm cursor-pointer"
                      >
                        <Pencil className="w-[16px] h-[20px]" />
                      </Link>

                      {/* DELETE  */}
                      <button
                        title="Delete"
                        onClick={() => handleDelete(curElem._id)}
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
          onClick={() =>
            setSearchParams({
              page: page === 1 ? 1 : page - 1,
            })
          }
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
          Page {data.currentPage} of {data.totalPages} | {data.totalBooks} books
        </span>

        <button
          onClick={() =>
            setSearchParams({
              page: data.totalPages > page ? page + 1 : page,
            })
          }
          disabled={page >= data.totalPages}
          className={`px-3 py-1 rounded ${
            page >= data.totalPages
              ? "bg-white text-black border cursor-auto"
              : "bg-black text-white cursor-pointer"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Books;
