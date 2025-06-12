import "./ViewProfile.css";
import { useQuery } from "@tanstack/react-query";
import { fetchProfile } from "@/http/api";
import Heading from "../heading/Heading";
import { UserRoundPen } from "lucide-react";
import Loading from "../loading/Loading";

const ViewProfile = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["userProfile"],
    queryFn: fetchProfile,
    staleTime: 10000,
  });

  // console.log("data", data);

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <p className="text-red-500">Error: {error.message}</p>;
  }

  return (
    <div>
      <Heading icon={<UserRoundPen />} title="Profile" />
      <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">User Profile</h2>
        <div className="text-gray-700">
          <p className="capitalize">
            <strong>Name:</strong> {data?.userProfile?.name}
          </p>
          <p>
            <strong>Email:</strong> {data?.userProfile?.email}
          </p>
          <p className="capitalize">
            <strong>Role:</strong> {data?.userProfile?.role}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ViewProfile;
