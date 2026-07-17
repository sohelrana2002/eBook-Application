import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { ChevronDown, CircleUserRound, LogOut, BookCheck } from "lucide-react";

const ProfileDropdown = () => {
  const { name, logOutUser } = useAuth();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // logout
  const handleLogOut = () => {
    const confirmLogout = window.confirm("Are you sure want to logout?");

    if (confirmLogout) {
      logOutUser();
      alert("Logout successfully");
      router.replace("/login");
    }
  };

  const firstWord = name?.split(" ")[0].toUpperCase();

  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-full bg-[#000] px-4 py-2 text-sm font-medium text-white hover:bg-[#000000c9] focus:outline-none cursor-pointer capitalize"
      >
        {firstWord}
        <ChevronDown
          className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      <div
        className={`absolute ${isOpen ? "block" : "hidden"} overflow-hidden right-0 z-10 mt-0 pt-2 w-48 origin-top-right rounded-sm bg-transparent`}
      >
        <div className="bg-white shadow-lg border-2 border-[var(--border)] rounded-sm flex flex-col gap-0 py-2">
          {/* Account Info  */}
          <Link
            onClick={() => setIsOpen(false)}
            href="/account-info"
            className="flex items-center gap-3 px-4 py-2 w-full float-start text-black hover:bg-gray-100 cursor-pointer"
          >
            <CircleUserRound />
            <span className="text-sm font-semibold text-gray-700">
              Account Info
            </span>
          </Link>

          {/* Requested book  */}
          <Link
            onClick={() => setIsOpen(false)}
            href="/requested-book"
            className="flex items-center gap-3 px-4 py-2 w-full float-start text-black hover:bg-gray-100 cursor-pointer"
          >
            <BookCheck />
            <span className="text-sm font-semibold text-gray-700">
              Requested Book
            </span>
          </Link>

          {/* Logout  */}
          <div
            onClick={handleLogOut}
            className="flex items-center gap-3 px-4 py-2 w-full float-start text-black hover:bg-gray-100 cursor-pointer"
          >
            <LogOut />
            <button className="text-sm font-semibold text-gray-700 cursor-pointer">
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDropdown;
