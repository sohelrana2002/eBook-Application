import BookPage from "@/components/bookPage/BookPage";
import { listBooks } from "@/lib/api";

export const dynamic = "force-dynamic";

const Books = async () => {
  const allBooks = await listBooks();
  return <BookPage allBooks={allBooks} />;
};

export default Books;
