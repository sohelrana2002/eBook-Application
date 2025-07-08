import "./DashboardLayout.css";
import { BookMarked, Logs } from "lucide-react";
import { NavMenu } from "../../data/Data";
import { Link, Outlet, Navigate, NavLink } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import ProfileDropdown from "@/shared/ProfileDropdown/ProfileDropdown";
import { useQuery } from "@tanstack/react-query";
import { getUnseenRequestCount } from "@/http/api";

const DashboardLayout = () => {
  const [isNavShowing, setIsNavShowing] = useState(false);
  const navRef = useRef();

  // console.log(isNavShowing);

  const handleMenuButton = () => {
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

  // set token in local storage
  const token = localStorage.getItem("token");

  // unseen count function
  const { data: unseenCount } = useQuery({
    queryKey: ["unseenRequestCount"],
    queryFn: getUnseenRequestCount,
    staleTime: 10000,
  });

  // console.log("unseenCount", unseenCount?.count);

  // protected route
  if (!token) {
    return <Navigate to="/auth/login" replace />;
  }

  return (
    <div className="dashboardlayout__container">
      {/* --left dashboard--- */}
      <div className={`left__dashboardlayout ${isNavShowing && "show"}`}>
        <Link to="/" className="logo__dashboardlayout">
          <BookMarked />
          <span>e-Book Platform</span>
        </Link>
        <div className="dashboard__menu" ref={navRef}>
          {NavMenu &&
            NavMenu.map((curElem) => {
              const showBadge =
                curElem.title === "Requested Book" && unseenCount?.count > 0;

              // console.log("showBadge", showBadge);

              return (
                <NavLink
                  to={curElem.path}
                  className="menu__box"
                  key={curElem.id}
                >
                  <span>{curElem.icon}</span>
                  <span className="relative">
                    {curElem.title}
                    {showBadge && (
                      <span className="absolute top-1 -right-6 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
                        {unseenCount?.count}
                      </span>
                    )}
                  </span>
                </NavLink>
              );
            })}
        </div>
      </div>

      {/* ---right dashboardlayout--- */}
      <div className="right__dashboardlayout">
        <div className="nav__dashboardlayout">
          <div className="search__content">
            <div className="menu__button" onClick={handleMenuButton}>
              <Logs />
            </div>
          </div>

          <div className="user__profile">
            <ProfileDropdown />
          </div>
        </div>

        {/* ----dashboard content--- */}
        <div className="right__dashboard-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
