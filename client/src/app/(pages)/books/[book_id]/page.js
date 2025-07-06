import Image from "next/image";
import { singleBook, reviewEachBook, recommentedBook } from "@/lib/api";
import ReviewSection from "@/components/reviewSection/ReviewSection";
import { renderRatingStars } from "@/lib/renderRatingStars";
import { Suspense } from "react";
import Loading from "@/app/loading";
import Link from "next/link";
import BookCard from "@/components/bookCard/BookCard";

const SingleBookPage = async ({ params }) => {
  const { book_id } = await params;

  const singleBookData = await singleBook(book_id);
  const bookReview = await reviewEachBook(book_id);
  const allRecommentedBook = await recommentedBook(book_id);

  // console.log("bookReview", bookReview);

  const bookDetails = singleBookData?.singeBook[0];
  // console.log("singleBookData", bookDetails);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-5 md:p-8">
            {/* Cover Image Section */}
            <div className="md:col-span-1 flex justify-center items-center">
              <div className="relative w-64 h-96 rounded-lg overflow-hidden shadow-lg">
                <Image
                  src="/book.jpg"
                  alt={bookDetails.title}
                  layout="fill"
                  objectFit="contain"
                  className="hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>

            {/* Book Details Section */}
            <div className="md:col-span-2 space-y-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 capitalize">
                  {bookDetails.title}
                </h1>
                <p className="text-lg md:text-xl text-gray-600 uppercase">
                  by {bookDetails.author}
                </p>
                <div className="mt-2 flex items-center">
                  {renderRatingStars(bookDetails.averageRating)}
                  <span className="ml-2 text-gray-600">
                    ({bookDetails.averageRating}/5)
                  </span>
                </div>
              </div>

              {/* Metadata Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 text-gray-700">
                <div className="flex gap-1 items-center flex-wrap">
                  <span className="font-semibold">Genres:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {bookDetails?.genre?.map((genre, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-purple-100 text-black rounded-full text-sm"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="font-semibold capitalize">Language:</span>{" "}
                  <span className="capitalize">{bookDetails.language}</span>
                </div>
                <div>
                  <span className="font-semibold">Published:</span>{" "}
                  {new Date(bookDetails.publicationDate).toLocaleDateString()}
                </div>
                <div>
                  <span className="font-semibold">Price:</span> $
                  {bookDetails.price}
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {bookDetails?.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-[#000] text-[#fff] rounded-full text-sm hover:bg-[#000000d3] transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Description */}
              <div className="prose max-w-none text-gray-700">
                <h3 className="text-xl font-semibold mb-2">Description</h3>
                <p className="capitalize">{bookDetails?.description}</p>
              </div>

              {/* Download Button */}
              <a
                href={bookDetails?.bookFile}
                download
                className="inline-block px-6 py-3 bg-black text-white rounded-lg hover:bg-[#000000d8] transition-colors duration-300 font-semibold cursor-pointer"
              >
                Download eBook
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ---review section---- */}
      <main className="max-w-2xl mx-auto mt-10">
        <Suspense fallback={<Loading />}>
          <ReviewSection initialReviews={bookReview} bookId={book_id} />
        </Suspense>
      </main>

      {/* smart book recommendation  */}
      <main className="mt-15">
        <h1 className="heading">Recommented Book</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-5 mt-4">
          {allRecommentedBook?.length === 0 ? (
            <h1>There are no recommendation book available</h1>
          ) : (
            <Suspense fallback={<Loading />}>
              {allRecommentedBook?.recommendations?.map((curElem) => (
                <Link
                  key={curElem._id}
                  href={`/books/${curElem._id}`} // Use proper href
                >
                  <BookCard {...curElem} />
                </Link>
              ))}
            </Suspense>
          )}
        </div>
      </main>
    </div>
  );
};

export default SingleBookPage;
