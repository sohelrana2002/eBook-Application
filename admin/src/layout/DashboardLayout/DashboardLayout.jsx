import "./DashboardLayout.css";
import { BookMarked, Logs } from "lucide-react";
import { NavMenu } from "../../data/Data";
import { Link, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";

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
                <Link to={curElem.path} className="menu__box" key={curElem.id}>
                  <span>{curElem.icon}</span>
                  <span>{curElem.title}</span>
                </Link>
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
            <input type="text" placeholder="search..." />
          </div>

          <div className="user__profile">SOHEL</div>
        </div>

        {/* ----dashboard content--- */}
        <div className="right__dashboard-content">
          actual content
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
