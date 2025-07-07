import React from "react";
import Heading from "@/shared/heading/Heading";
import { HandHelping } from "lucide-react";
import { allRequestedBook } from "@/http/api";
import { useQuery } from "@tanstack/react-query";
import Loading from "@/shared/loading/Loading";
import { Link } from "react-router-dom";

const RequestedBook = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["allRequestedBook"],
    queryFn: allRequestedBook,
    staleTime: 10000,
  });

  // console.log("data", data.requestedBook);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <main>
      <div>
        <Heading icon={<HandHelping />} title="Requested Book" />

        <div className="max-w-6xl mx-auto mt-10 p-4 sm:p-6 bg-white shadow-md rounded-lg">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800">
              All Requested Book
            </h2>
            <h3>Total Users: {data.length}</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-sm text-gray-600">Email</th>
                  <th className="px-4 py-3 text-sm text-gray-600">Book Name</th>
                  <th className="px-4 py-3 text-sm text-gray-600">
                    Author Name
                  </th>
                  <th className="px-4 py-3 text-sm text-gray-600">
                    Publication Date
                  </th>
                  <th className="px-4 py-3 text-sm text-gray-600">Language</th>
                  <th className="px-4 py-3 text-sm text-gray-600">Status</th>
                  <th className="px-4 py-3 text-sm text-gray-600">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data?.requestedBook?.map((curElem) => (
                  <tr key={curElem._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">
                      {curElem?.userId?.email}
                    </td>
                    <td className="px-4 py-3 text-sm capitalize">
                      {curElem?.bookName}
                    </td>
                    <td className="px-4 py-3 text-sm">{curElem?.authorName}</td>
                    <td className="px-4 py-3 text-sm">
                      {new Date(curElem.publicationDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-sm ">{curElem?.language}</td>
                    <td className={`px-4 py-3 text-sm`}>
                      <span className="flex justify-center items-center bg-red-800 text-white rounded-full px-2 py-2 text-center">
                        {curElem?.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <Link
                        to={`/users/delete-user/${curElem._id}`}
                        className="text-red-600 hover:underline cursor-pointer"
                      >
                        Update
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
};

export default RequestedBook;
