import BookPage from "@/components/bookPage/BookPage";
import { listBooks } from "@/http/api";

const Books = async () => {
  const allBooks = await listBooks();
  return <BookPage allBooks={allBooks} />;
};

export default Books;
