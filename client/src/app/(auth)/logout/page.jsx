"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context/authContext";

const Logout = () => {
  const { logOutUser } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    logOutUser();
    alert("Logout successfully");
    router.replace("/login");
  }, []);

  return null;
};

export default Logout;
