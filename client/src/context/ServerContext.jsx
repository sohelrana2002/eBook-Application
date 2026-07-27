"use client";

import { createContext, useEffect, useState } from "react";
import { api } from "@/lib/api";

const ServerContext = createContext();

const ServerProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [serverReady, setServerReady] = useState(false);

  useEffect(() => {
    let interval;

    const checkServer = async () => {
      try {
        const res = await api.get("/health");

        if (res.data?.success) {
          setIsLoading(false);
          setServerReady(true);

          if (interval) {
            clearInterval(interval);
          }
        }
      } catch (error) {
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
