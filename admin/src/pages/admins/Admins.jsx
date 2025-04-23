import { allAsmins } from "@/http/api";
import Heading from "@/shared/heading/Heading";
import Loading from "@/shared/loading/Loading";
import { useQuery } from "@tanstack/react-query";
import { LockKeyhole } from "lucide-react";

const Admins = () => {
  const { data: adminData, isLoading } = useQuery({
    queryKey: ["admins"],
    queryFn: allAsmins,
    staleTime: 10000,
  });

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div>
      <Heading icon={<LockKeyhole />} title="All Admins" />

      <div className="max-w-5xl mx-auto mt-10 p-4 sm:p-6 bg-white shadow-md rounded-lg">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800">
            Admin List
          </h2>
          <h3>Total Admin: {adminData.length}</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-sm text-gray-600">Name</th>
                <th className="px-4 py-3 text-sm text-gray-600">Email</th>
                <th className="px-4 py-3 text-sm text-gray-600">Role</th>
                <th className="px-4 py-3 text-sm text-gray-600">Created At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {adminData?.users?.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm capitalize">{user.name}</td>
                  <td className="px-4 py-3 text-sm">{user.email}</td>
                  <td className="px-4 py-3 text-sm capitalize">{user.role}</td>
                  <td className="px-4 py-3 text-sm">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Admins;
