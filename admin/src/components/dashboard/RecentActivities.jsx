import { UserPlus, ShoppingCart, BookPlus, Bell } from "lucide-react";

const activities = [
  {
    type: "user",
    title: "New user registered",
    description: "Rahim Ahmed created an account",
    time: "5 minutes ago",
  },
  {
    type: "order",
    title: "New order received",
    description: "Order #ORD-1024 was placed",
    time: "12 minutes ago",
  },
  {
    type: "book",
    title: "New book added",
    description: "Admin added JavaScript Mastery",
    time: "30 minutes ago",
  },
  {
    type: "request",
    title: "New book request",
    description: "Clean Architecture was requested",
    time: "1 hour ago",
  },
];

const icons = {
  user: UserPlus,
  order: ShoppingCart,
  book: BookPlus,
  request: Bell,
};

const RecentActivities = () => {
  return (
    <div>
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-gray-900">
          Recent Activities
        </h2>

        <p className="text-sm text-gray-500">Latest platform activities</p>
      </div>

      <div className="space-y-5">
        {activities.map((activity) => {
          const Icon = icons[activity.type];

          return (
            <div key={activity.title} className="flex gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100">
                <Icon size={17} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-900">
                  {activity.title}
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  {activity.description}
                </p>

                <p className="mt-1 text-xs text-gray-400">{activity.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentActivities;
