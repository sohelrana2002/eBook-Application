import React from "react";
import { Outlet, Navigate } from "react-router-dom";

const AuthLayout = () => {
  const token = localStorage.getItem("token");

  if (token) {
    return <Navigate to="/" replace />;
  }
  return (
    <>
      <Outlet />
    </>
  );
};

export default AuthLayout;
