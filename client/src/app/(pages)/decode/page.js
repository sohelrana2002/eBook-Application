"use client";

import React from "react";
import { jwtDecode } from "jwt-decode";

const Decode = () => {
  //   const { isLoggedIn } = useAuthContext();
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : "";

  const decoded = jwtDecode(token);

  console.log("decoded", decoded);

  return (
    <div>
      <h1>Decode history</h1>
      {token}
    </div>
  );
};

export default Decode;
