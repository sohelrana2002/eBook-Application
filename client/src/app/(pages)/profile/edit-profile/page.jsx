"use client";

import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchProfile, updateProfile } from "@/lib/api";
import Loading from "@/app/loading";
import { useRouter } from "next/navigation";

const EditProfile = () => {
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    bio: "",
    location: "",
    language: "",
  });

  const router = useRouter();

  const { data: prodileData, isLoading } = useQuery({
    queryKey: ["fetchProfile"],
    queryFn: fetchProfile,
  });

  // console.log("prodileData", prodileData.userProfile);

  useEffect(() => {
    if (prodileData) {
      setFormData({ ...prodileData?.userProfile });
    }
  }, [prodileData]);

  const mutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      alert(data.message);
      router.push("/profile");
    },

    onError: (error) => {
      alert(error?.response?.data?.message || "Update failed");
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center md:p-4">
      <div className="w-full max-w-2xl bg-white shadow-xl  rounded-2xl p-5 md:p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b border-[var(--border)] pb-2">
          Profile Information
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black-500"
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black-500"
              required
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Bio
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows="4"
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black-500"
              placeholder="Tell us a bit about yourself..."
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black-500"
            />
          </div>

          {/* Language */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Language
            </label>
            <input
              type="text"
              name="language"
              value={formData.language}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black-500"
            />
          </div>

          {/* Submit */}
          <div className="pt-4">
            <button
              type="submit"
              className="cursor-pointer w-full bg-[var(--blue)] text-white font-semibold py-2 rounded-lg  transition duration-200"
            >
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
