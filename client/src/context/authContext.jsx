"use client";

import { createContext, useContext, useReducer, useEffect } from "react";
import authReducer from "@/reducer/authReducer";
import { isTokenExpired } from "@/helper/checkTokenExpiry/checkTokenExpiry";

const initialState = {
  token: "",
  name: "",
  isLoading: true, // Added loading state
  error: null, // Optional: for error handling
};

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // User log out
  const logOutUser = () => {
    try {
      dispatch({ type: "LOGOUT_START" });

      localStorage.removeItem("token");
      localStorage.removeItem("name");

      dispatch({ type: "LOGOUT_SUCCESS" });
    } catch (error) {
      dispatch({ type: "LOGOUT_FAILURE", payload: error.message });
    }
  };

  // Initialize auth state (runs once on mount)
  useEffect(() => {
    const initializeAuth = () => {
      try {
        dispatch({ type: "LOAD_TOKEN_START" });

        const token =
          typeof window !== "undefined" ? localStorage.getItem("token") : "";
        const name =
          typeof window !== "undefined" ? localStorage.getItem("name") : "";

        if (token && !isTokenExpired(token)) {
          dispatch({
            type: "LOAD_TOKEN_SUCCESS",
            payload: { token, name },
          });
        } else {
          dispatch({ type: "LOAD_TOKEN_FAILURE" });
          logOutUser();
        }
      } catch (error) {
        dispatch({ type: "LOAD_TOKEN_FAILURE", payload: error.message });
      }
    };

    initializeAuth();
  }, []);

  // Store token in local storage
  const storeTokenInLS = (serverToken, name) => {
    try {
      dispatch({ type: "STORE_TOKEN_START" });

      localStorage.setItem("name", name);
      localStorage.setItem("token", serverToken);

      dispatch({
        type: "STORE_TOKEN_SUCCESS",
        payload: { token: serverToken, name },
      });
    } catch (error) {
      dispatch({ type: "STORE_TOKEN_FAILURE", payload: error.message });
    }
  };

  const isLoggedIn = !!state.token;

  const value = {
    ...state,
    storeTokenInLS,
    logOutUser,
    isLoggedIn,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useAuthContext = () => {
  return useContext(AuthContext);
};

export { AuthProvider, useAuthContext };
