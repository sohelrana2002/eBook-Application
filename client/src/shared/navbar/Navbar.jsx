"use client";

import "./Navbar.css";
import { navMenu } from "@/data/Data";
import Link from "next/link";
import { NotebookText, X, Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import ProfileDropdown from "../profileDropDown/ProfileDropDown";
import { useAuthContext } from "@/context/authContext";
import { LoaderCircle } from "lucide-react";
import { MdNotificationAdd } from "react-icons/md";
import { useNotificationContext } from "@/context/notificationContext";
import { formatDistanceToNow } from "date-fns";

const Navbar = () => {
  const pathName = usePathname();
  const [isNavShowing, setIsNavShowing] = useState(false);
  const navRef = useRef();
  const notifacationRef = useRef();
  const { isLoggedIn, isLoading } = useAuthContext();
  const { alerts, setAlerts } = useNotificationContext();
  const [showNotificaion, setShowNotification] = useState(false);

  const handleToggle = () => {
    setIsNavShowing((prev) => !prev);
  };

  useEffect(() => {
    const handleOutSideNav = (e) => {
      if (!navRef.current?.contains(e.target)) {
        setIsNavShowing(false);
      }
    };

    document.addEventListener("mousedown", handleOutSideNav);

    return () => {
      document.removeEventListener("mousedown", handleOutSideNav);
    };
  }, []);

  // handle notification
  const handleNotification = () => {
    setShowNotification((prev) => !prev);
  };

  // handle outside of notification
  useEffect(() => {
    const handleOutSideNav = (e) => {
      if (!notifacationRef.current?.contains(e.target)) {
        setShowNotification(false);
      }
    };

    document.addEventListener("mousedown", handleOutSideNav);

    return () => {
      document.removeEventListener("mousedown", handleOutSideNav);
    };
  }, []);

  // Count unread notifications for the badge
  const unreadCount = alerts.filter((alert) => !alert.read).length;

  // handle notification topic click
  const handleClick = (alert) => {
    // Mark the clicked notification as read
    const updatedAlerts = alerts.map((a) =>
      a.id === alert.id ? { ...a, read: true } : a
    );
    setAlerts(updatedAlerts);
    localStorage.setItem("notifications", JSON.stringify(updatedAlerts));

    // Navigate to the book page
    window.location.href = `/books/${alert.id}`;
  };

  return (
    <nav className="nav relative">
      <div className="container navbar__conatiner">
        <Link href={"/"} className="logo">
          <div>
            <NotebookText />
          </div>
          <span>Knowledgea</span>
        </Link>

        <ul className={`menu__item ${isNavShowing && "active"}`} ref={navRef}>
          {navMenu &&
            navMenu?.map((curElem) => {
              return (
                <Link
                  href={curElem.path}
                  key={curElem.id}
                  className={
                    pathName === curElem.path
                      ? "border-b-2  border-[var(--blue)]"
                      : "text-[var(--black)]"
                  }
                >
                  <li>{curElem.title}</li>
                </Link>
              );
            })}
        </ul>

        <div className="user">
          <div className="notifications" onClick={handleNotification}>
            <div className="w-[35px] h-[35px] cursor-pointer border-2 border-[var(--border)] rounded-sm grid place-items-center relative">
              <MdNotificationAdd size={20} />{" "}
              <div className="absolute right-[-12px] top-[-12px] w-[20px] h-[20px] rounded-full bg-black grid place-items-center">
                <span className="text-white grid place-items-center text-sm">
                  {unreadCount}
                </span>
              </div>
            </div>
          </div>
          <div>
            {isLoading ? (
              <div className="profile">
                <LoaderCircle className="animate-spin" />
              </div>
            ) : isLoggedIn ? (
              <ProfileDropdown />
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 rounded-full bg-[#000] px-4 py-2 text-sm font-medium text-white hover:bg-[#000000c9] focus:outline-none cursor-pointer capitalize"
              >
                Login
              </Link>
            )}
          </div>
          <div className="toggle__menu" onClick={handleToggle}>
            {isNavShowing ? <X /> : <Menu />}
          </div>
        </div>

        {/*notification  */}
        {showNotificaion && (
          <div
            ref={notifacationRef}
            className="absolute top-full right-5 mt-2 w-80 max-h-96 overflow-auto bg-white border shadow-lg rounded"
          >
            {alerts.length === 0 && (
              <p className="p-2 text-gray-500">No notifications</p>
            )}
            {alerts
              .slice()
              .reverse() // newest on top
              .map((alert, index) => (
                <div
                  key={index}
                  onClick={() => handleClick(alert)}
                  className={`cursor-pointer hover:bg-gray-100 p-2 flex justify-between ${
                    alert.read ? "bg-gray-50" : "bg-white font-medium"
                  }`}
                >
                  <div>
                    {alert.title} by {alert.author}
                  </div>
                  <div className="text-xs text-gray-400">
                    {formatDistanceToNow(new Date(alert.createdAt), {
                      addSuffix: true,
                    })}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
