import { jwtDecode } from "jwt-decode";

export const isTokenExpired = (token) => {
  try {
    // Check if token exists and is a string
    if (!token || typeof token !== "string") {
      return true;
    }

    // Check token format (JWT should have 3 parts separated by dots)
    const tokenParts = token.split(".");
    if (tokenParts.length !== 3) {
      return true;
    }

    const decoded = jwtDecode(token);
    const currentDate = Date.now() / 1000; // Convert to seconds

    // Check if token has expiration claim
    if (!decoded.exp) {
      return true;
    }

    return decoded.exp < currentDate;
  } catch (error) {
    // If any error occurs during decoding, treat token as expired/invalid
    return true;
  }
};
