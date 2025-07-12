import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to headers for every request
if (typeof window !== "undefined") {
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
}

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
    limit,
  } = filters;
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
  if (isOscar) params.append("isOscar", isOscar);
  if (limit) params.append("limit", limit);

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

// -----singe book page ---
export async function singleBook(bookId) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/books/${bookId}`,
      {
        cache: "no-cache",
      }
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
      cache: "no-cache",
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

// get indevidual requested book info
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
      cache: "no-cache",
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
      cache: "no-cache",
    });

    return res.json();
  } catch (error) {
    console.log(error);
  }
}
