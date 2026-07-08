"use client";

import { createContext, useContext, useReducer, useEffect } from "react";
import authReducer from "@/reducer/authReducer";
import { isTokenExpired } from "@/helper/checkTokenExpiry/checkTokenExpiry";
import { jwtDecode } from "jwt-decode";

const initialState = {
  token: "",
  name: "",
  isLoading: true,
  error: null,
};

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // User log out with redirect
  const logOutUser = (redirect = true) => {
    try {
      dispatch({ type: "LOGOUT_START" });

      localStorage.removeItem("token");
      localStorage.removeItem("name");

      dispatch({ type: "LOGOUT_SUCCESS" });

      // Redirect to login page after logout
      if (redirect && typeof window !== "undefined") {
        window.location.replace("/login");
      }
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

        if (token) {
          // Check if token is expired during initialization
          if (isTokenExpired(token)) {
            // Token is expired, log out and redirect
            dispatch({ type: "LOAD_TOKEN_FAILURE", payload: "Token expired" });
            logOutUser();
          } else {
            // Token is valid, load it
            dispatch({
              type: "LOAD_TOKEN_SUCCESS",
              payload: { token, name },
            });
          }
        } else {
          // No token found
          dispatch({ type: "LOAD_TOKEN_FAILURE" });
        }
      } catch (error) {
        dispatch({ type: "LOAD_TOKEN_FAILURE", payload: error.message });
        logOutUser(false);
      }
    };

    initializeAuth();
  }, []);

  // Handle token expiration with timeout
  useEffect(() => {
    if (!state.token) return;

    let timeoutId;

    const setupTokenExpirationCheck = () => {
      try {
        const decoded = jwtDecode(state.token);
        const expireAt = decoded.exp * 1000; // Convert to milliseconds
        const timeLeft = expireAt - Date.now();

        // If token is already expired
        if (timeLeft <= 0) {
          logOutUser();
          return;
        }

        // Set timeout for when token will expire
        timeoutId = setTimeout(() => {
          logOutUser();
        }, timeLeft);
      } catch (error) {
        // If token is invalid, log out
        logOutUser();
      }
    };

    setupTokenExpirationCheck();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [state.token]);

  // Store token in local storage
  const storeTokenInLS = (serverToken, name) => {
    try {
      dispatch({ type: "STORE_TOKEN_START" });

      // Check if new token is valid before storing
      if (isTokenExpired(serverToken)) {
        throw new Error("Token is expired");
      }

      // Validate token structure
      const decoded = jwtDecode(serverToken);
      if (!decoded.exp) {
        throw new Error("Invalid token structure");
      }

      localStorage.setItem("name", name);
      localStorage.setItem("token", serverToken);

      dispatch({
        type: "STORE_TOKEN_SUCCESS",
        payload: { token: serverToken, name },
      });
    } catch (error) {
      dispatch({ type: "STORE_TOKEN_FAILURE", payload: error.message });
      logOutUser(false); // Log out but don't redirect
      throw error; // Re-throw to handle in calling component
    }
  };

  // Periodic token check (optional, handles system time changes)
  useEffect(() => {
    if (!state.token) return;

    const checkInterval = setInterval(() => {
      if (isTokenExpired(state.token)) {
        logOutUser();
      }
    }, 60000); // Check every minute

    return () => clearInterval(checkInterval);
  }, [state.token]);

  const isLoggedIn = !!state.token && !state.isLoading;

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
