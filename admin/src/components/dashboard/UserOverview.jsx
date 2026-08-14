import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const users = [
  { month: "Jan", users: 320 },
  { month: "Feb", users: 410 },
  { month: "Mar", users: 380 },
  { month: "Apr", users: 520 },
  { month: "May", users: 610 },
  { month: "Jun", users: 720 },
  { month: "Jul", users: 840 },
  { month: "Aug", users: 920 },
];

const UserOverview = () => {
  return (
    <div>
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-gray-900">User Overview</h2>

        <p className="text-sm text-gray-500">New user registrations</p>
      </div>

      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={users}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />

            <XAxis dataKey="month" axisLine={false} tickLine={false} />

            <YAxis axisLine={false} tickLine={false} />

            <Tooltip />

            <Bar dataKey="users" radius={[5, 5, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default UserOverview;
