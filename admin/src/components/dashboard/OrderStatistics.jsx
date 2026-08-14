import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

const data = [
  {
    name: "Completed",
    value: 68,
  },
  {
    name: "Pending",
    value: 17,
  },
  {
    name: "Cancelled",
    value: 10,
  },
  {
    name: "Refunded",
    value: 5,
  },
];

const COLORS = ["#22c55e", "#f59e0b", "#ef4444", "#64748b"];

const OrderStatistics = () => {
  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900">Order Statistics</h2>

      <p className="text-sm text-gray-500">Current order distribution</p>

      <div className="mt-5 h-[220px]">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={85}
              paddingAngle={3}
            >
              {data.map((entry, index) => (
                <Cell key={entry.name} fill={COLORS[index]} />
              ))}
            </Pie>

            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={item.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className="h-3 w-3 rounded-full"
                style={{
                  backgroundColor: COLORS[index],
                }}
              />

              <span className="text-sm text-gray-600">{item.name}</span>
            </div>

            <span className="text-sm font-semibold">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderStatistics;
