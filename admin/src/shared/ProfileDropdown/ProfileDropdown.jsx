import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="flex items-center gap-2 rounded-full bg-[#000] px-4 py-2 text-sm font-medium text-white hover:bg-[#000000c9] focus:outline-none cursor-pointer capitalize"
      >
        {localStorage.getItem("name")}
      </button>

      {isOpen && (
        <div className="absolute overflow-hidden right-0 z-10 mt-2 w-48 origin-top-right rounded-xl bg-white shadow-lg ring-1 ring-gray-400 ring-opacity-5">
          <div className="py-1">
            <Link
              to="/profile"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              View Profile
            </Link>
            <Link
              to="/logout"
              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
            >
              Logout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
