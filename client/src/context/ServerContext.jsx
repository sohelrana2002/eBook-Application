"use client";

import { createContext, useEffect, useState } from "react";
import { api } from "@/lib/api";

const ServerContext = createContext();

const CACHE_KEY = "server_awake_timestamp";
const AWAKE_DURATION = 10 * 60 * 1000;

const ServerProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(() => {
    if (typeof window === "undefined") return true;

    const lastAwake = localStorage.getItem(CACHE_KEY);

    if (lastAwake) {
      const isStillFresh = Date.now() - parseInt(lastAwake) < AWAKE_DURATION;

      if (isStillFresh) return false;
    }

    return false;
  });

  const [serverReady, setServerReady] = useState(() => {
    if (typeof window === "undefined") return false;

    const lastAwake = localStorage.getItem(CACHE_KEY);

    if (lastAwake) {
      return Date.now() - parseInt(lastAwake) < AWAKE_DURATION;
    }

    return false;
  });

  useEffect(() => {
    let interval;

    const checkServer = async () => {
      try {
        const res = await api.get("/health");

        if (res.data?.success) {
          localStorage.setItem(CACHE_KEY, Date.now().toString());
          setIsLoading(false);
          setServerReady(true);

          if (interval) {
            clearInterval(interval);
          }
        }
      } catch (error) {
        localStorage.removeItem(CACHE_KEY);
        setServerReady(false);
        setIsLoading(true);
      }
    };

    checkServer();

    interval = setInterval(() => {
      checkServer();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const value = {
    serverReady,
    isLoading,
  };

  return (
    <ServerContext.Provider value={value}>{children}</ServerContext.Provider>
  );
};

export { ServerContext, ServerProvider };
