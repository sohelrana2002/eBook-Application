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

  const res = await api.post("/api/auth/login", { email, password });
  return res.data;
};

// ----for signup---
export const signup = async (name, email, password) => {
  // console.log("user data", {name, email, password });

  const res = await api.post("/api/auth/sign-up", { name, email, password });
  return res.data;
};

// ---for individual profile---
export const fetchProfile = async () => {
  const res = await api.get("/api/auth/user-profile");
  return res.data;
};

// ---for all author---
export const allAuthor = async () => {
  const res = await api.get("/api/filter/authors");
  return res.data;
};

// ---for all language---
export const allLanguage = async () => {
  const res = await api.get("/api/filter/language");
  return res.data;
};

// ----------fetchBooks-----
export const fetchBooks = async (filters = {}) => {
  const { genre, author, language, minPrice, maxPrice, search, sortBy, order } =
    filters;
  const url = new URL(`${process.env.NEXT_PUBLIC_BASE_URL}/api/books`);

  const params = new URLSearchParams();

  if (genre) params.append("genre", genre);
  if (author) params.append("author", author);
  if (language) params.append("language", language);
  if (minPrice) params.append("minPrice", minPrice);
  if (maxPrice) params.append("maxPrice", maxPrice);
  if (search) params.append("search", search);
  if (sortBy) params.append("sortBy", sortBy);
  if (order) params.append("order", order);

  url.search = params.toString();

  try {
    const res = await fetch(url, { cache: "no-cache" });
    if (!res.ok) throw new Error("Failed to fetch books");
    return await res.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error; // Rethrow to let React Query handle it
  }
};

// ----------list of books-------
export async function listBooks() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/books`, {
      cache: "no-cache",
    });

    if (!res.ok) {
      throw new Error("Response is not ok");
    }

    return res.json();
  } catch (error) {
    console.log(error);
  }
}
