import { jwtDecode } from "jwt-decode";

export const isTokenExpired = (token) => {
  try {
    const decoded = jwtDecode(token);
    const currentDate = Date.now() / 1000;

    return decoded.exp < currentDate;
  } catch (error) {
    return true;
  }
};
