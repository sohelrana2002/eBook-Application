"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context/authContext";

const Logout = () => {
  const { logOutUser, isLoggedIn } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/");
    } else {
      logOutUser();
      alert("Logout successfully");
      router.replace("/login");
    }
  }, [isLoggedIn, router]);

  return null;
};

export default Logout;
