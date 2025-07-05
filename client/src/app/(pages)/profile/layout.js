"use client";

import "./ProfileLayout.css";
import Link from "next/link";
import { LayoutDashboard, SquareChevronRight, BookCheck } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const ProfileLayout = ({ children }) => {
  const [title, setTitle] = useState("user dashboard");
  const [isMenuShowing, setIsMenuShowing] = useState(false);
  const menuRef = useRef();
  const pathname = usePathname();

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

  useEffect(() => {
    if (pathname === "/profile/requested-book") {
      setTitle("requested book");
    } else if (pathname === "/profile/edit-profile") {
      setTitle("edit profile");
    } else {
      setTitle("user dashboard");
    }
  }, [pathname]);

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
          {/* user dashboard */}
          <li className="border-b-2 border-[var(--border)] p-2 rounded-lg">
            <button data-title="user dashboard" onClick={handleClick}>
              <Link
                href="/profile"
                className="capitalize md:text-sm text-md font-semibold flex items-center gap-2"
              >
                <LayoutDashboard size="18" />
                <span>user dashboard</span>
              </Link>
            </button>
          </li>

          {/* requested book */}
          <li className="border-b-2 border-[var(--border)] p-2 rounded-lg">
            <button data-title="requested book" onClick={handleClick}>
              <Link
                href="/profile/requested-book"
                className="capitalize md:text-sm text-md font-semibold flex items-center gap-2"
              >
                <BookCheck size="18" />
                <span>requested book</span>
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
