import axios from "axios";
import { jwtDecode } from "jwt-decode";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// flag to prevent multiple redirects
let isRedirecting = false;

// helper to clear session and redirect to login
const logoutAndRedirect = () => {
  if (isRedirecting || typeof window == "undefined") return;
  isRedirecting = true;

  localStorage.removeItem("token");
  localStorage.removeItem("name");

  // avoid redirect loop, only redirect if not alreday on login page
  if (!window.location.pathname.startsWith("/login")) {
    window.location.href = "/login";
  }
};

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");

    if (token) {
      // check if token expire locally
      try {
        const { exp } = jwtDecode(token);

        if (Date.now() >= exp * 1000) {
          // token expired, logout immediately
          logoutAndRedirect();

          return Promise.reject(new Error("Token expired"));
        }
      } catch (error) {
        // invalid token, treat as expired
        logoutAndRedirect();

        return Promise.reject(new Error("Invalid token"));
      }

      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

// handle 401 from server
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      logoutAndRedirect();
    }

    return Promise.reject(error);
  },
);

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

// ---for all genres---
export const allGenre = async () => {
  const res = await api.get("/api/filter/genres");
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
  const {
    genre,
    author,
    language,
    minPrice,
    maxPrice,
    search,
    sortBy,
    order,
    isOscar,
    page,
    limit,
  } = filters;
  const url = new URL(`${process.env.NEXT_PUBLIC_BASE_URL}/api/books`);

  const params = new URLSearchParams();

  if (genre) {
    if (Array.isArray(genre) && genre.length > 0) {
      params.append("genre", genre.join(","));
    }
  } else if (typeof genre === "string" && genre.trim() !== "") {
    params.append("genre", genre);
  }

  if (author && author !== "none") params.append("author", author);
  if (language && language !== "none") params.append("language", language);
  if (minPrice) params.append("minPrice", minPrice);
  if (maxPrice) params.append("maxPrice", maxPrice);
  if (search && search.trim() !== "") params.append("search", search);
  if (sortBy) params.append("sortBy", sortBy);
  if (order) params.append("order", order);
  if (isOscar !== undefined && isOscar !== null)
    params.append("isOscar", isOscar);
  if (page) params.append("page", page);
  if (limit) params.append("limit", limit);

  url.search = params.toString();

  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch books");
    return await res.json();
  } catch (error) {
    console.error("API fetch boos Error:", error);
    throw error; // Rethrow to let React Query handle it
  }
};

// -----singe book page ---
export async function singleBook(bookId) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/books/${bookId}`,
      {
        cache: "no-store",
      },
    );

    if (!res.ok) {
      throw new Error("Response is not ok");
    }

    return res.json();
  } catch (error) {
    console.log(error);
  }
}

// ---get review from each book---
export async function reviewEachBook(bookId) {
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/${bookId}/reviews`;
  // console.log("Fetching URL:", url);

  try {
    const res = await fetch(url, {
      cache: "no-store",
    });

    return res.json();
  } catch (error) {
    console.log(error);
  }
}

// ---add review section-------
export const addReview = async (bookId, rating, comment) => {
  // console.log("addreview data", { bookId, rating, comment });

  const res = await api.post(`/api/${bookId}/review`, { rating, comment });
  return res.data;
};

// ---create book request method-------
export const requestBook = async ({
  bookName,
  authorName,
  publicationDate,
  language,
}) => {
  const res = await api.post(`api/bookRequest`, {
    bookName,
    authorName,
    publicationDate,
    language,
  });

  return res.data;
};

// update profile information
export const updateProfile = async ({
  name,
  phoneNumber,
  bio,
  location,
  language,
}) => {
  const res = await api.put("api/auth/update-profile", {
    name,
    phoneNumber,
    bio,
    location,
    language,
  });

  return res.data;
};

// get individual requested book info
export const getRequestedBook = async () => {
  const res = await api.get("/api/bookRequest/user");

  return res.data;
};

// delete requested book
export const deleteRequestedBook = async (id) => {
  const res = await api.delete(`/api/bookRequest/delete/${id}`);

  return res.data;
};

//recommented books
export async function recommentedBook(bookId) {
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/books/by-tags/${bookId}`;
  // console.log("Fetching URL:", url);

  try {
    const res = await fetch(url, {
      cache: "no-store",
    });

    return res.json();
  } catch (error) {
    console.log(error);
  }
}

// featured books
export async function featuredBook() {
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/featured-book`;

  try {
    const res = await fetch(url, {
      cache: "no-store",
    });

    return res.json();
  } catch (error) {
    console.log(error);
  }
}

// newsletter
export const newsletter = async (email) => {
  const res = await api.post("/api/newsletter", { email });

  return res.data;
};

//conatct form
export const createContact = async (email, message) => {
  const res = await api.post("/api/contact", { email, message });

  return res.data;
};

// book assistant assistant
export const createBookAssistant = async (message) => {
  const res = await api.post("/api/assistant", { message });

  return res.data;
};
