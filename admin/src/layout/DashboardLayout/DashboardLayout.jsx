import "./DashboardLayout.css";
import { BookMarked, Logs } from "lucide-react";
import { NavMenu } from "../../data/Data";
import { Link, Outlet, Navigate, NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import ProfileDropdown from "@/shared/ProfileDropdown/ProfileDropdown";

const DashboardLayout = () => {
  const [isNavShowing, setIsNavShowing] = useState(false);

  // console.log(isNavShowing);

  const handleMenuButton = () => {
    setIsNavShowing((prev) => !prev);
  };

  useEffect(() => {
    const handleOutSideNav = () => {
      setIsNavShowing(false);
    };

    document.addEventListener("mousedown", handleOutSideNav);
  }, []);

  const token = localStorage.getItem("token");

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
        <div className="dashboard__menu">
          {NavMenu &&
            NavMenu.map((curElem) => {
              return (
                <NavLink
                  to={curElem.path}
                  className="menu__box"
                  key={curElem.id}
                >
                  <span>{curElem.icon}</span>
                  <span>{curElem.title}</span>
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
