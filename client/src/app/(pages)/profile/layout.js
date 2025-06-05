"use client";

import "./ProfileLayout.css";
import Link from "next/link";
import { LayoutDashboard, SquareChevronRight } from "lucide-react";
import { useState, useEffect, useRef } from "react";

const ProfileLayout = ({ children }) => {
  const [title, setTitle] = useState("user dashboard");
  const [isMenuShowing, setIsMenuShowing] = useState(false);
  const menuRef = useRef();

  const handleToggle = () => {
    setIsMenuShowing((prev) => !prev);
  };

  useEffect(() => {
    const handleOutSideNav = (e) => {
      if (!menuRef.current?.contains(e.target)) {
        setIsMenuShowing(false);
      }
    };

    document.addEventListener("mousedown", handleOutSideNav);

    return () => {
      document.removeEventListener("mousedown", handleOutSideNav);
    };
  }, []);

  const handleClick = (e) => {
    const value = e.currentTarget.dataset.title;
    setTitle(value);
  };

  return (
    <main>
      <div
        className={`left__userProfile ${isMenuShowing && "active"}`}
        ref={menuRef}
      >
        <ul>
          <li className="border-b-2 border-[var(--border)] p-2 rounded-lg">
            <button data-title="user dashboard" onClick={handleClick}>
              <Link
                href="/profile"
                className="capitalize md:text-md text-lg font-semibold flex items-center gap-2"
              >
                <LayoutDashboard size="20" />
                <span>user dashboard</span>
              </Link>
            </button>
          </li>
        </ul>
      </div>
      <div className="right__userProfile">
        <div className="title__box">
          <div className="menu__btn" onClick={handleToggle}>
            <SquareChevronRight size={23} />
          </div>
          <span className="profile__title">{title}</span>
        </div>
        <div className="px-[20px]">{children}</div>
      </div>
    </main>
  );
};

export default ProfileLayout;
