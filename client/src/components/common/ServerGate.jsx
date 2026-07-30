import { useServerStatus } from "@/hooks/useServerStatus";
import ServerLoader from "./ServerLoader";

const ServerGate = ({ children }) => {
  const { serverReady, isLoading } = useServerStatus();

  if (isLoading) {
    return <ServerLoader />;
  }

  if (!serverReady) {
    return <ServerLoader />;
  }

  return children;
};

export default ServerGate;
