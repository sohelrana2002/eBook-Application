"use client";

import "./Navbar.css";
import { navMenu } from "@/data/Data";
import Link from "next/link";
import { X, Menu, ShoppingCart, LoaderCircle } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import ProfileDropdown from "../profileDropDown/ProfileDropDown";
import { useAuth } from "@/hooks/useAuth";
import { MdNotificationAdd } from "react-icons/md";
import { useNotification } from "@/hooks/useNotification";
import { formatDistanceToNow } from "date-fns";
import { useCart } from "@/hooks/useCart";

const Navbar = () => {
  const pathName = usePathname();
  const router = useRouter();
  const [isNavShowing, setIsNavShowing] = useState(false);
  const navRef = useRef();
  const notifacationRef = useRef();

  const { isLoggedIn, isLoading } = useAuth();
  const { alerts, setAlerts } = useNotification();
  const [showNotification, setShowNotification] = useState(false);

  const { state } = useCart();
  const { totalQuantity } = state || { totalQuantity: 0 };

  const handleToggle = () => {
    setIsNavShowing((prev) => !prev);
  };

  // Mobile menu outside click
  useEffect(() => {
    const handleOutSideNav = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setIsNavShowing(false);
      }
    };

    document.addEventListener("mousedown", handleOutSideNav);
    return () => {
      document.removeEventListener("mousedown", handleOutSideNav);
    };
  }, []);

  // Handle notification toggle
  const handleNotification = () => {
    setShowNotification((prev) => !prev);
  };

  // Handle outside of notification click
  useEffect(() => {
    const handleOutSideNotification = (e) => {
      if (
        notifacationRef.current &&
        !notifacationRef.current.contains(e.target)
      ) {
        setShowNotification(false);
      }
    };

    document.addEventListener("mousedown", handleOutSideNotification);
    return () => {
      document.removeEventListener("mousedown", handleOutSideNotification);
    };
  }, []);

  // Unread count
  const unreadCount = alerts ? alerts.filter((alert) => !alert.read).length : 0;

  // Handle notification item click
  const handleClick = (alert) => {
    //  Mark as read
    const updatedAlerts = alerts.map((a) =>
      a.id === alert.id ? { ...a, read: true } : a,
    );
    setAlerts(updatedAlerts);
    localStorage.setItem("notifications", JSON.stringify(updatedAlerts));

    // Hide dropdown
    setShowNotification(false);

    // Client-side Navigation
    router.push(`/books/${alert.id}`);
  };

  return (
    <nav className="nav relative">
      <div className="container navbar__conatiner">
        <Link href={"/"} className="logo">
          <span>Knowledgea</span>
        </Link>

        <ul
          className={`menu__item ${isNavShowing ? "active" : ""}`}
          ref={navRef}
        >
          {navMenu &&
            navMenu?.map((curElem) => {
              return (
                <Link
                  href={curElem.path}
                  key={curElem.id}
                  className={
                    pathName === curElem.path
                      ? "border-b-2 border-[var(--blue)]"
                      : "text-[var(--black)]"
                  }
                  onClick={() => setIsNavShowing(false)} // Mobile menu close on click
                >
                  <li>{curElem.title}</li>
                </Link>
              );
            })}
        </ul>

        <div className="user">
          {/* Cart */}
          <Link href="/cart" className="notifications">
            <div className="w-[30px] md:w-[35px] h-[30px] md:h-[35px] cursor-pointer border-2 border-[var(--border)] rounded-sm grid place-items-center relative">
              <ShoppingCart className="w-[15px] h-[15px] md:w-[20px] md:h-[20px]" />
              <div className="absolute right-[-12px] top-[-12px] w-[17px] h-[17px] md:w-[20px] md:h-[20px] rounded-full bg-black grid place-items-center">
                <span className="text-white grid place-items-center text-[10px] md:text-sm">
                  {totalQuantity}
                </span>
              </div>
            </div>
          </Link>

          {/* Notifications */}
          {isLoggedIn && (
            <div className="notifications" ref={notifacationRef}>
              <div
                className="w-[30px] md:w-[35px] h-[30px] md:h-[35px] cursor-pointer border-2 border-[var(--border)] rounded-sm grid place-items-center relative"
                onClick={handleNotification}
              >
                <MdNotificationAdd className="text-[15px] md:text-[20px]" />
                {unreadCount > 0 && (
                  <div className="absolute right-[-12px] top-[-12px] w-[20px] h-[20px] rounded-full bg-black grid place-items-center">
                    <span className="text-white grid place-items-center text-sm">
                      {unreadCount}
                    </span>
                  </div>
                )}
              </div>

              {/* Notification Dropdown */}
              {showNotification && (
                <div className="absolute top-[85%] right-5  mt-2 w-72 max-h-96 overflow-auto bg-white border border-[var(--border)] shadow-lg rounded z-50">
                  {alerts.length === 0 ? (
                    <p className="p-3 text-gray-500 text-sm text-center">
                      No notifications
                    </p>
                  ) : (
                    alerts
                      .slice()
                      .reverse()
                      .map((alert, index) => (
                        <div
                          key={alert.id || index}
                          onClick={() => handleClick(alert)}
                          className={`cursor-pointer hover:bg-gray-100 p-2 flex justify-between items-center border-b last:border-0 ${
                            alert.read
                              ? "bg-gray-50 text-gray-600"
                              : "bg-white font-medium text-black"
                          }`}
                        >
                          <p className="capitalize text-sm line-clamp-1 pr-2">
                            {alert.title} by {alert.author}
                          </p>
                          <p className="text-[10px] text-gray-400 whitespace-nowrap">
                            {alert.createdAt
                              ? formatDistanceToNow(new Date(alert.createdAt), {
                                  addSuffix: true,
                                })
                              : "just now"}
                          </p>
                        </div>
                      ))
                  )}
                </div>
              )}
            </div>
          )}

          {/* Profile / Login */}
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
                className="rounded-full flex items-center justify-center bg-[#000] px-4 py-2 text-sm font-medium text-white hover:bg-[#000000c9] focus:outline-none cursor-pointer capitalize"
              >
                Login
              </Link>
            )}
          </div>

          <div className="toggle__menu" onClick={handleToggle}>
            {isNavShowing ? <X /> : <Menu />}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
