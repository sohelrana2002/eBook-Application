import { BookOpen, TrendingUp } from "lucide-react";

const books = [
  {
    title: "JavaScript Mastery",
    author: "John Smith",
    sales: 245,
    revenue: "৳1,10,250",
  },
  {
    title: "React Complete Guide",
    author: "David Miller",
    sales: 198,
    revenue: "৳1,18,800",
  },
  {
    title: "Python Fundamentals",
    author: "Robert Wilson",
    sales: 176,
    revenue: "৳91,520",
  },
  {
    title: "Next.js Handbook",
    author: "Alex Brown",
    sales: 154,
    revenue: "৳1,07,800",
  },
  {
    title: "TypeScript Guide",
    author: "Michael Lee",
    sales: 132,
    revenue: "৳72,600",
  },
];

const TopSellingBooks = () => {
  return (
    <div>
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-gray-900">
          Top Selling Books
        </h2>

        <p className="text-sm text-gray-500">Best performing books</p>
      </div>

      <div className="space-y-4">
        {books.map((book, index) => (
          <div key={book?.index} className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100">
              <BookOpen size={18} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-gray-900">
                {book.title}
              </p>

              <p className="text-xs text-gray-500">{book.author}</p>
            </div>

            <div className="text-right">
              <div className="flex items-center justify-end gap-1 text-xs font-semibold text-green-600">
                <TrendingUp size={13} />
                {book.sales}
              </div>

              <p className="text-xs text-gray-500">{book.revenue}</p>
            </div>
          </div>
        ))}
      </div>

      <button className="mt-5 w-full rounded-lg border py-2 text-sm font-medium hover:bg-gray-50">
        View All Books
      </button>
    </div>
  );
};

export default TopSellingBooks;
