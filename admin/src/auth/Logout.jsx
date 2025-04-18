import { useEffect } from "react";
import { useAuthContext } from "@/context/authContext";
import { Navigate } from "react-router-dom";

const Logout = () => {
  const { logOutUser } = useAuthContext();

  useEffect(() => {
    logOutUser();
    alert("Logout successfully");
  }, []);

  return <Navigate to="/" />;
};

export default Logout;
