import { createContext, useContext, useReducer } from "react";
import authReducer from "@/reducer/authReducer";

// ====create contect======
const AuthContext = createContext();

const initialState = {
  token: localStorage.getItem("token"),
};

// ====create provider====
const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // ======store token in local storage====
  const storeTokenInLS = (serverToken, name) => {
    dispatch({
      type: "SET_TOKEN_IN_STATE",
      payload: serverToken,
    });
    localStorage.setItem("name", name);
    return localStorage.setItem("token", serverToken);
  };

  // =======user log out =====
  const logOutUser = () => {
    dispatch({
      type: "REMOVE_TOKEN",
    });
  };

  let isLoggedIn = state.token;

  const value = {
    ...state,
    dispatch,
    storeTokenInLS,
    logOutUser,
    isLoggedIn,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// =====custom hook========
const useAuthContext = () => {
  return useContext(AuthContext);
};

export { AuthProvider, useAuthContext };
