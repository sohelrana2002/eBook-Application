import BookPage from "@/components/bookPage/BookPage";
import { fetchBooks, listBooks } from "@/lib/api";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Discover your next read | e-Book application",
  description:
    "Browse and filter through our expensive collection of amazing books.s",
};

const Books = async ({ searchParams }) => {
  const params = await searchParams;

  const genre = params.genre
    ? Array.isArray(params.genre)
      ? params.genre
      : [params.genre]
    : [];
  const author = params.author || null;
  const language = params.language || null;
  const minPrice = params.minPrice || "";
  const maxPrice = params.maxPrice || "";
  const search = params.search || "";
  const sortBy = params.sortBy || "";
  const order = params.order || "";
  const isOscar = params.isOscar === "true" ? true : null;
  const page = parseInt(params.page || "1");
  const limit = parseInt(params.limit || "20");

  const initialBookData = await fetchBooks({
    genre,
    author,
    language,
    minPrice,
    maxPrice,
    search,
    sortBy,
    order,
    isOscar,
    page,
    limit,
  });

  return (
    <BookPage
      initialBookData={initialBookData}
      serverParams={{
        genre,
        author,
        language,
        minPrice,
        maxPrice,
        search,
        sortBy,
        order,
        isOscar,
        page,
        limit,
      }}
    />
  );
};

export default Books;
