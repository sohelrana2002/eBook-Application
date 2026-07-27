import { ServerContext } from "@/context/ServerContext";
import { useContext } from "react";

export const useServerStatus = () => {
  const context = useContext(ServerContext);

  if (!context) {
    throw new Error("useServerStatus must be used within a ServerProvider.");
  }

  return context;
};
