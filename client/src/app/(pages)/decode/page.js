// this study is a part of big project

"use client";

import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const Decode = () => {
  const [decoded, setDecoded] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.warn("No token found");
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      setDecoded(decodedToken);
    } catch (error) {
      console.error("Invalid token", error);
    }
  }, []);

  if (!decoded) {
    return <p className="p-[5%]">Loading or invalid token...</p>;
  }

  return (
    <div className="p-[5%]">
      <h1>Study about JWT decoding.</h1>

      <h3 className="mt-[30px]">Id: {decoded.userId}</h3>
      <h3>Name: {decoded.name}</h3>
      <h3>Role: {decoded.role}</h3>

      {decoded.role === "admin" ? "Hello I'm admin" : "Hello I'm not admin"}
    </div>
  );
};

export default Decode;
