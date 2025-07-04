import "./ViewProfile.css";
import { useQuery } from "@tanstack/react-query";
import { fetchProfile } from "@/http/api";
import Loading from "../loading/Loading";
import { NavLink } from "react-router-dom";

import {
  User,
  Mail,
  Phone,
  Globe,
  MapPin,
  BookUser,
  MessageSquareText,
} from "lucide-react";

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
    <main>
      <div className="max-w-3xl mx-auto p-1 md:p-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl md:text-3xl font-semibold ">My Profile</h1>
          <NavLink
            to="/admin-profile/edit-profile"
            className="bg-black text-[#fff] rounded-2xl px-3 py-1"
          >
            Edit Profile
          </NavLink>
        </div>
        <div className="bg-white shadow-md rounded-xl border border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6">
            <ProfileRow
              icon={<User size={20} />}
              label="Name"
              value={data?.userProfile?.name}
            />
            <ProfileRow
              icon={<Mail size={20} />}
              label="Email"
              value={data?.userProfile?.email}
            />
            <ProfileRow
              icon={<Phone size={20} />}
              label="Phone"
              value={data?.userProfile?.phoneNumber || "—"}
            />
            <ProfileRow
              icon={<MessageSquareText size={20} />}
              label="Bio"
              value={data?.userProfile?.bio || "—"}
            />
            <ProfileRow
              icon={<MapPin size={20} />}
              label="Location"
              value={data?.userProfile?.location || "—"}
            />
            <ProfileRow
              icon={<Globe size={20} />}
              label="Language"
              value={data?.userProfile?.language || "—"}
            />
            <ProfileRow
              icon={<BookUser size={20} />}
              label="Role"
              value={data?.userProfile?.role || "—"}
            />
          </div>
        </div>
      </div>
    </main>
  );
};

export default ViewProfile;

function ProfileRow({ icon, label, value }) {
  return (
    <div className="flex items-start space-x-3">
      <div className="text-gray-500 pt-1">{icon}</div>
      <div>
        <p className="text-sm text-gray-500 font-medium">{label}</p>
        <p
          className={`text-base font-semibold text-gray-800 ${
            label === "Email" ? "normal-case" : "capitalize"
          }`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}
