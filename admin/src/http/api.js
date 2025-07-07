import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
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

// ---for individual profile---
export const fetchProfile = async () => {
  const res = await api.get("/api/auth/user-profile");
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

// ---for list of books---
export const listBooks = async ({ queryKey }) => {
  const [_key, { search, page }] = queryKey;
  const res = await api.get("/api/books", {
    params: { search, page, limit: 5 },
  });
  return res.data;
};

// ----create a book---
export const createBook = async (formData) => {
  const res = await api.post("/api/books", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

// ---delete a book---
export const deleteBook = async (id) => {
  const res = await api.delete(`/api/books/${id}`);
  return res.data;
};

// ---get single book infor---
export const singleBook = async (id) => {
  const { data } = await api.get(`/api/books/${id}`);
  return data;
};

// ---update book---
export const updateBook = async ({ id, formData }) => {
  const res = await api.patch(`/api/books/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// ---get all users---
export const allUsers = async () => {
  const res = await api.get("/api/auth/users-info");
  return res.data;
};

// ----delete user----
export const deleteUser = async (id) => {
  const res = await api.delete(`/api/auth/delete-user/${id}`);
  return res.data;
};

// ---get all admins---
export const allAsmins = async () => {
  const res = await api.get("/api/auth/admin-info");
  return res.data;
};

// get all requested book
export const allRequestedBook = async () => {
  const res = await api.get("/api/bookRequest/all-request");
  return res.data;
};

// single book request details
export const singleBookRequestDetails = async (bookId) => {
  const res = await api.get(`/api/bookRequest/single-book-request/${bookId}`);
  return res.data;
};

// update requested book status
export const updateBookRequestStatus = async ({ bookId, status }) => {
  const res = await api.post(`/api/bookRequest/${bookId}/status`, { status });
  return res.data;
};
