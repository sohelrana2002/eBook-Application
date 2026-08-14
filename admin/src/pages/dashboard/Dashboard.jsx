import {
  BookOpen,
  Users,
  ShoppingCart,
  DollarSign,
  FileText,
  Activity,
} from "lucide-react";

import StatCard from "@/components/dashboard/StatCard";
import RevenueChart from "@/components/dashboard/RevenueChart";
import OrderStatistics from "@/components/dashboard/OrderStatistics";
import RecentOrders from "@/components/dashboard/RecentOrders";
import TopSellingBooks from "@/components/dashboard/TopSellingBooks";
import UserOverview from "@/components/dashboard/UserOverview";
import BookRequests from "@/components/dashboard/BookRequests";
import RecentActivities from "@/components/dashboard/RecentActivities";
import QuickActions from "@/components/dashboard/QuickActions";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

          <p className="mt-1 text-sm text-gray-500">
            Welcome back! Here's what's happening with your e-book platform.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-lg border bg-white px-4 py-2 text-sm text-gray-600 shadow-sm">
          <Activity size={17} />
          <span>Live Overview</span>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Books"
          value="1,245"
          growth="+12.5%"
          icon={BookOpen}
          description="Compared to last month"
          positive
        />

        <StatCard
          title="Total Users"
          value="8,542"
          growth="+8.2%"
          icon={Users}
          description="Compared to last month"
          positive
        />

        <StatCard
          title="Total Orders"
          value="3,421"
          growth="+15.4%"
          icon={ShoppingCart}
          description="Compared to last month"
          positive
        />

        <StatCard
          title="Total Revenue"
          value="৳8,45,200"
          growth="+18.7%"
          icon={DollarSign}
          description="Compared to last month"
          positive
        />
      </div>

      {/* Secondary Stats */}
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-2">
        <StatCard
          title="Book Requests"
          value="28"
          growth="+6"
          icon={FileText}
          description="Pending requests"
          positive
        />

        <StatCard
          title="Active Users"
          value="1,284"
          growth="+11.3%"
          icon={Activity}
          description="Currently active"
          positive
        />
      </div>

      {/* Revenue + Orders */}
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="rounded-xl border bg-white p-5 shadow-sm xl:col-span-2">
          <RevenueChart />
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <OrderStatistics />
        </div>
      </div>

      {/* Recent Orders */}
      <div className="mt-6 rounded-xl border bg-white p-5 shadow-sm">
        <RecentOrders />
      </div>

      {/* Books + Users */}
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <TopSellingBooks />
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <UserOverview />
        </div>
      </div>

      {/* Requests + Activities */}
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <BookRequests />
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <RecentActivities />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 rounded-xl border bg-white p-5 shadow-sm">
        <QuickActions />
      </div>
    </div>
  );
};

export default Dashboard;
