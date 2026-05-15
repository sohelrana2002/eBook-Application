import axios from "axios";
import { jwtDecode } from "jwt-decode";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
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

        return Promise.reject(new Error("Invalid token" + error));
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
export const allAdmins = async () => {
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

// total unseen count book request
export const getUnseenRequestCount = async () => {
  const res = await api.get("/api/bookRequest/unseen-count");
  return res.data;
};

// after update the status mark as seen
export const markRequestSeen = async ({ bookId }) => {
  const res = await api.post(`api/bookRequest/${bookId}/mark-seen`);
  return res.data;
};
