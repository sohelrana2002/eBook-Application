"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthContext } from "@/context/authContext";

const GoogleAuth = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { storeTokenInLS } = useAuthContext();

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const name = payload?.name || "User";

        // console.log("payload", payload);

        storeTokenInLS(token, name);

        // Delay to allow localStorage write to complete
        setTimeout(() => {
          router.replace("/");
        }, 300);
      } catch (err) {
        console.error("Invalid token", err);
        router.replace("/login");
      }
    } else {
      console.warn("No token in URL");
      router.replace("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <p className="h-[95vh] w-[95vw] flex items-center justify-center">
      Logging you in with Google...
    </p>
  );
};

export default GoogleAuth;
