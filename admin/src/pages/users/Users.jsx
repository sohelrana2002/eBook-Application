import { allUsers } from "@/http/api";
import Heading from "@/shared/heading/Heading";
import Loading from "@/shared/loading/Loading";
import { useQuery } from "@tanstack/react-query";
import { UsersRound } from "lucide-react";
import { Link } from "react-router-dom";

const Users = () => {
  const { data: UsersData, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: allUsers,
    staleTime: 10000,
  });

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div>
      <Heading icon={<UsersRound />} title="All Users" />

      <div className="max-w-6xl mx-auto mt-10 p-4 sm:p-6 bg-white shadow-md rounded-lg">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800">
            User List
          </h2>
          <h3>Total Users: {UsersData.length}</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-sm text-gray-600">Name</th>
                <th className="px-4 py-3 text-sm text-gray-600">Email</th>
                <th className="px-4 py-3 text-sm text-gray-600">Role</th>
                <th className="px-4 py-3 text-sm text-gray-600">Created At</th>
                <th className="px-4 py-3 text-sm text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {UsersData?.users?.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm capitalize">{user.name}</td>
                  <td className="px-4 py-3 text-sm">{user.email}</td>
                  <td className="px-4 py-3 text-sm capitalize">{user.role}</td>
                  <td className="px-4 py-3 text-sm">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <Link
                      to={`/users/delete-user/${user._id}`}
                      className="text-red-600 hover:underline cursor-pointer"
                    >
                      Delete
                    </Link>
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

export default Users;
