const orders = [
  {
    id: "#ORD-1024",
    customer: "Rahim Ahmed",
    book: "JavaScript Mastery",
    amount: "৳450",
    status: "Completed",
    date: "Aug 14, 2026",
  },
  {
    id: "#ORD-1023",
    customer: "Karim Hasan",
    book: "React Complete Guide",
    amount: "৳600",
    status: "Pending",
    date: "Aug 14, 2026",
  },
  {
    id: "#ORD-1022",
    customer: "Nusrat Jahan",
    book: "Python Fundamentals",
    amount: "৳520",
    status: "Completed",
    date: "Aug 13, 2026",
  },
  {
    id: "#ORD-1021",
    customer: "Sakib Khan",
    book: "Next.js Handbook",
    amount: "৳700",
    status: "Completed",
    date: "Aug 13, 2026",
  },
  {
    id: "#ORD-1020",
    customer: "Mim Akter",
    book: "TypeScript Guide",
    amount: "৳550",
    status: "Cancelled",
    date: "Aug 12, 2026",
  },
];

const statusStyle = {
  Completed: "bg-green-100 text-green-700",
  Pending: "bg-yellow-100 text-yellow-700",
  Cancelled: "bg-red-100 text-red-700",
};

const RecentOrders = () => {
  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Orders
          </h2>

          <p className="text-sm text-gray-500">
            Latest customer orders
          </p>
        </div>

        <button className="text-sm font-medium text-gray-700 hover:underline">
          View All →
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] text-left">
          <thead>
            <tr className="border-b text-xs uppercase text-gray-500">
              <th className="px-4 py-3">Order ID</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Book</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-b last:border-0 hover:bg-gray-50"
              >
                <td className="px-4 py-4 text-sm font-medium">
                  {order.id}
                </td>

                <td className="px-4 py-4 text-sm text-gray-600">
                  {order.customer}
                </td>

                <td className="px-4 py-4 text-sm text-gray-600">
                  {order.book}
                </td>

                <td className="px-4 py-4 text-sm font-medium">
                  {order.amount}
                </td>

                <td className="px-4 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyle[order.status]}`}
                  >
                    {order.status}
                  </span>
                </td>

                <td className="px-4 py-4 text-sm text-gray-500">
                  {order.date}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentOrders;