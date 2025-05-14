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

// ---for list of books---
// export const listBooks = async ({ queryKey }) => {
//   const [_key, { search, page }] = queryKey;
//   const res = await api.get("/api/books", {
//     params: { search, page, limit: 5 },
//   });
//   return res.data;
// };

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
    console.error("Error fetching books:", error);
    return null;
  }
}
