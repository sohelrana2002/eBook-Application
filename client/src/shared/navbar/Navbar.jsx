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

const Navbar = () => {
  const pathName = usePathname();
  const [isNavShowing, setIsNavShowing] = useState(false);
  const navRef = useRef();
  const { isLoggedIn, isLoading } = useAuthContext();

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

  return (
    <nav className="nav">
      <div className="container navbar__conatiner">
        <Link href={"/"} className="logo">
          <div>
            <NotebookText />
          </div>
          <span>e-Book Platform</span>
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
          <div>
            {isLoading ? (
              <div className="profile">
                <LoaderCircle className="animate-spin" />
              </div>
            ) : isLoggedIn ? (
              <ProfileDropdown />
            ) : (
              <Link href="/login" className="profile">
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
