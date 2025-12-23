// this study is a part of big project

"use client";

import React from "react";
import { jwtDecode } from "jwt-decode";

const Decode = () => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : "";

  const decoded = jwtDecode(token);
  //   console.log("decoded", decoded);

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
