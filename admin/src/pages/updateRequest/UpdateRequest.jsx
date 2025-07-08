import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  singleBookRequestDetails,
  updateBookRequestStatus,
  markRequestSeen,
} from "@/http/api";
import { useParams } from "react-router-dom";
import { HandHelping } from "lucide-react";
import Heading from "@/shared/heading/Heading";
import Loading from "@/shared/loading/Loading";

const UpdateRequest = () => {
  const { bookId } = useParams();

  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["singleBookRequest", bookId],
    queryFn: () => singleBookRequestDetails(bookId),
    staleTime: 10000,
  });

  // console.log("data", data);

  const mutation = useMutation({
    mutationFn: ({ bookId, status }) =>
      updateBookRequestStatus({ bookId, status }),
    onSuccess: (data) => {
      alert(data.message);
      queryClient.invalidateQueries(["singleBookRequest"]);
    },
    onError: (error) => {
      alert(error?.response?.data?.message || "Update failed");
    },
  });

  // isSeen is get true when wny book request details show
  const isSeenMutation = useMutation({
    mutationFn: ({ bookId }) => markRequestSeen({ bookId }),
    onSuccess: (data) => {
      alert(data.message);
      console.log("data", data.message);
      queryClient.invalidateQueries(["unseenRequestCount"]);
    },
    onError: (error) => {
      alert(error?.response?.data?.message || "Update failed");
    },
  });

  const handleStatusChange = (event) => {
    const newStatus = event.target.value;
    mutation.mutate({ bookId, status: newStatus });

    isSeenMutation.mutate({ bookId });
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <main className=" flex items-center flex-col justify-center p-6">
      <Heading icon={<HandHelping />} title="Book Request Details" />
      <div className="bg-white max-w-xl w-full p-8 rounded-xl shadow-lg border border-gray-100">
        <div className="space-y-3 text-gray-700 text-sm">
          <p className="capitalize">
            <span className="font-semibold">User Name:</span>{" "}
            {data?.singleRequestBook?.userId?.name}
          </p>
          <p>
            <span className="font-semibold">Email:</span>{" "}
            {data?.singleRequestBook?.userId?.email}
          </p>
          <p className="capitalize">
            <span className="font-semibold">Book Name:</span>{" "}
            <span className="capitalize">
              {data?.singleRequestBook?.bookName}
            </span>
          </p>
          <p className="capitalize">
            <span className="font-semibold">Author:</span>{" "}
            {data?.singleRequestBook?.authorName}
          </p>
          <p className="capitalize">
            <span className="font-semibold">Language:</span>{" "}
            {data?.singleRequestBook?.language}
          </p>
          <p className="capitalize">
            <span className="font-semibold">Published:</span>{" "}
            {new Date(
              data?.singleRequestBook?.publicationDate
            ).toLocaleDateString()}
          </p>
          <p className="capitalize">
            <span className="font-semibold">Status:</span>{" "}
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                data?.singleRequestBook?.status === "pending"
                  ? "bg-yellow-100 text-yellow-700"
                  : data?.singleRequestBook?.status === "available"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {data?.singleRequestBook?.status}
            </span>
          </p>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Change Status
          </label>
          <select
            value={data?.singleRequestBook?.status}
            onChange={handleStatusChange}
            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In-progress</option>
            <option value="available">Available</option>
            <option value="not-found">Not-found</option>
          </select>
        </div>
      </div>
    </main>
  );
};

export default UpdateRequest;
