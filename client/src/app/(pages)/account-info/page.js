"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchProfile } from "@/lib/api";
import Loading from "@/app/loading";
import Link from "next/link";
import {
  User,
  Mail,
  Phone,
  Globe,
  MapPin,
  BookUser,
  MessageSquareText,
} from "lucide-react";

const AccountInfo = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["userProfile"],
    queryFn: fetchProfile,
    staleTime: 10000,
  });
  // console.log("data", data);

  if (isLoading) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  if (isError) {
    return <p className="text-red-500">Error: {error.message}</p>;
  }

  return (
    <div className="flex items-center justify-center h-[90vh] w-full px-3 md:px-4">
      <main className="max-w-3xl w-full border border-gray-300 rounded-2xl bg-gray-50 shadow-sm">
        <div className="p-6 md:p-10 w-full">
          <div className="flex items-center justify-between mb-4 md:mb-8">
            <h1 className="text-xl md:text-3xl font-semibold">Account Info</h1>
            <Link
              href="/account-info/edit-profile"
              className="bg-[var(--blue)] text-[#fff] rounded-md px-4 py-1"
            >
              Edit Profile
            </Link>
          </div>

          {/* Profile Card Section */}
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
    </div>
  );
};

export default AccountInfo;

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
