import {
  Plus,
  BookOpen,
  Users,
  ShoppingCart,
  FileText,
  Tag,
} from "lucide-react";

const actions = [
  {
    title: "Add Book",
    icon: BookOpen,
  },
  {
    title: "Manage Users",
    icon: Users,
  },
  {
    title: "View Orders",
    icon: ShoppingCart,
  },
  {
    title: "Book Requests",
    icon: FileText,
  },
  {
    title: "Add Category",
    icon: Tag,
  },
];

const QuickActions = () => {
  return (
    <div>
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>

        <p className="text-sm text-gray-500">Frequently used admin actions</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <button
              key={action.title}
              className="flex flex-col items-center justify-center gap-2 rounded-xl border p-4 transition hover:bg-gray-50 hover:shadow-sm"
            >
              <div className="rounded-lg bg-gray-100 p-3">
                <Icon size={20} />
              </div>

              <span className="text-sm font-medium text-gray-700">
                {action.title}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;
