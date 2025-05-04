import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to headers for every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ----for login---
export const login = async (email, password) => {
  // console.log("user data", { email, password });
  console.log(
    "process.env.NEXT_PUBLIC_BASE_URL",
    process.env.NEXT_PUBLIC_BASE_URL
  );

  const res = await api.post("/api/auth/login", { email, password });
  return res.data;
};
