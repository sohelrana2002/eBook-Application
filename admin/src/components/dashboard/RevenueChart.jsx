import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import { useState } from "react";

const monthlyData = [
  { month: "Jan", revenue: 42000 },
  { month: "Feb", revenue: 51000 },
  { month: "Mar", revenue: 48000 },
  { month: "Apr", revenue: 62000 },
  { month: "May", revenue: 75000 },
  { month: "Jun", revenue: 69000 },
  { month: "Jul", revenue: 85000 },
  { month: "Aug", revenue: 92000 },
  { month: "Sep", revenue: 88000 },
  { month: "Oct", revenue: 105000 },
  { month: "Nov", revenue: 115000 },
  { month: "Dec", revenue: 128000 },
];

const RevenueChart = () => {
  const [period, setPeriod] = useState("12 Months");

  return (
    <div>
      <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Revenue Overview
          </h2>

          <p className="text-sm text-gray-500">
            Track your revenue performance
          </p>
        </div>

        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="rounded-lg border bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-200"
        >
          <option>7 Days</option>
          <option>30 Days</option>
          <option>6 Months</option>
          <option>12 Months</option>
        </select>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={monthlyData}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopOpacity={0.2} />
                <stop offset="95%" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} />

            <XAxis dataKey="month" axisLine={false} tickLine={false} />

            <YAxis
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `৳${value / 1000}k`}
            />

            <Tooltip
              formatter={(value) => [`৳${value.toLocaleString()}`, "Revenue"]}
            />

            <Area
              type="monotone"
              dataKey="revenue"
              strokeWidth={2}
              fill="url(#revenueGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueChart;
