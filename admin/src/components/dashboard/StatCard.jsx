import { ArrowDown, ArrowUp } from "lucide-react";

const StatCard = ({
  title,
  value,
  growth,
  icon: Icon,
  description,
  positive = true,
}) => {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>

          <h2 className="mt-2 text-2xl font-bold text-gray-900">{value}</h2>
        </div>

        <div className="rounded-lg bg-gray-100 p-3">
          <Icon size={22} className="text-gray-700" />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <span
          className={`flex items-center gap-1 text-xs font-semibold ${
            positive ? "text-green-600" : "text-red-600"
          }`}
        >
          {positive ? <ArrowUp size={13} /> : <ArrowDown size={13} />}
          {growth}
        </span>

        <span className="text-xs text-gray-400">{description}</span>
      </div>
    </div>
  );
};

export default StatCard;
