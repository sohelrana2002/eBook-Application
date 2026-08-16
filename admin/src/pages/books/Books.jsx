import { listBooks } from "@/http/api";
import Heading from "@/shared/heading/Heading";
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

const Books = () => {
  const [searchParams, setSearchParams] = useSearchParams({
    page: 1,
    search: "",
  });
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
    <div className="pb-10">
      <div>
        <Heading icon={<BookMarked />} title="Books" />
      </div>

      <div className="border p-3 md:p-5 rounded-sm h-full pb-5">
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

        {/* search field  */}
        <div className="pb-5 flex flex-col md:flex-row gap-y-5 md:gap-0 items-center justify-between">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              value={search}
              placeholder="Search books by title, author..."
              onChange={handleSearchBook}
              className="pl-8 placeholder:text-sm border-3 max-w-md lg:w-lg"
              disabled={isLoading}
            />
          </div>
          <div className="text-sm text-muted-foreground">
            <p>Total Books: {data.totalBooks}</p>
          </div>
        </div>

        {/* actual table  */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Book Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Author name</TableHead>
              <TableHead>Publication Date</TableHead>
              <TableHead>Price</TableHead>
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
                  <TableCell>
                    {curElem.publicationDate.substring(0, 10)}
                  </TableCell>
                  <TableCell>৳ {curElem.price}</TableCell>
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
  );
};

export default Books;
