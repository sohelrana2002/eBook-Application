import { Clock, ArrowRight } from "lucide-react";

const requests = [
  {
    title: "Clean Code",
    requestedBy: "Sohel Rana",
    time: "5 minutes ago",
  },
  {
    title: "The Pragmatic Programmer",
    requestedBy: "Rahim Ahmed",
    time: "25 minutes ago",
  },
  {
    title: "Design Patterns",
    requestedBy: "Karim Hasan",
    time: "1 hour ago",
  },
  {
    title: "You Don't Know JS",
    requestedBy: "Nusrat Jahan",
    time: "2 hours ago",
  },
];

const BookRequests = () => {
  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Book Requests</h2>

          <p className="text-sm text-gray-500">Recent user requests</p>
        </div>

        <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
          28 Pending
        </span>
      </div>

      <div className="space-y-4">
        {requests.map((request) => (
          <div
            key={request.title}
            className="flex items-center gap-3 rounded-lg border p-3"
          >
            <div className="rounded-lg bg-yellow-50 p-2">
              <Clock size={18} className="text-yellow-600" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{request.title}</p>

              <p className="text-xs text-gray-500">
                Requested by {request.requestedBy}
              </p>
            </div>

            <span className="hidden text-xs text-gray-400 sm:block">
              {request.time}
            </span>
          </div>
        ))}
      </div>

      <button className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg border py-2 text-sm font-medium hover:bg-gray-50">
        View All Requests
        <ArrowRight size={15} />
      </button>
    </div>
  );
};

export default BookRequests;
