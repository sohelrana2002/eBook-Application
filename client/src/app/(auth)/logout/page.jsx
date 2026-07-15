"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

const Logout = () => {
  const { logOutUser, isLoggedIn } = useAuth();
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
