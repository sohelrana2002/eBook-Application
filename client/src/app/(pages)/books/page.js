import BookPage from "@/components/bookPage/BookPage";
import { listBooks } from "@/lib/api";

const Books = async () => {
  const allBooks = await listBooks();
  return <BookPage allBooks={allBooks} />;
};

export default Books;
