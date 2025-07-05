import "../DashboardLayout/DashboardLayout.css";
import { BookMarked, Logs } from "lucide-react";
import { AdminProfileMenu } from "../../data/Data";
import { Link, Outlet, Navigate, NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import ProfileDropdown from "@/shared/ProfileDropdown/ProfileDropdown";
import { useLocation } from "react-router-dom";

const AdminProfileLayout = () => {
  const [isNavShowing, setIsNavShowing] = useState(false);
  const [title, setTitle] = useState("admin profile");
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/admin-profile/edit-profile") {
      setTitle("edit profile");
    } else {
      setTitle("admin profile");
    }
  }, [location.pathname]);

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
          {AdminProfileMenu &&
            AdminProfileMenu.map((curElem) => {
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
          <div className="title__box">
            <span className="profile__title">{title}</span>
          </div>

          <div className="pt-5">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfileLayout;
