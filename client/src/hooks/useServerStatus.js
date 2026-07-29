import { ServerContext } from "@/context/ServerContext";
import { useContext } from "react";

export const useServerStatus = () => {
  const enableServerGate =
    process.env.NEXT_PUBLIC_ENABLE_SERVER_GATE === "true";

  const context = useContext(ServerContext);

  //  Production Safety Check
  if (!context && enableServerGate) {
    throw new Error("useServerStatus must be used within a ServerProvider.");
  }

  // Development Mode
  if (!enableServerGate) {
    return {
      serverReady: true,
      isLoading: false,
    };
  }

  return context;
};
