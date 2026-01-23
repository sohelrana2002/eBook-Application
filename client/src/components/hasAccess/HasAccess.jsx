"use client";

import { api } from "@/lib/api";
import { useEffect, useState } from "react";
import BuyBook from "../buyBook/BuyBook";

const HasAccess = ({ bookDetails }) => {
  const [access, setAccess] = useState(null);

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const res = await api.get(`/api/book-access/${bookDetails._id}/access`);
        // console.log("res", res);

        setAccess(res.data);
      } catch (error) {
        setAccess({ hasAccess: false });
      }
    };

    if (bookDetails._id) {
      checkAccess();
    }
  }, [bookDetails._id]);

  const handleDownload = async () => {
    try {
      const token = localStorage.getItem("token"); // JWT token

      const res = await api.get(access.downloadUrl, {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Get the actual file name from bookFile path
      const fileName = bookDetails.bookFile.split("/").pop();

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName); // use real file name
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Download error", err.response || err);
      alert("Failed to download book. Please try again.");
    }
  };

  return (
    <div>
      {/* Loading */}
      {access === null && <p>Checking access...</p>}

      {/* Download */}
      {access?.hasAccess && (
        <button
          onClick={handleDownload}
          className="inline-block px-6 py-3 rounded-lg font-semibold transition-colors duration-300 bg-black text-white hover:bg-[#000000d8]"
        >
          Download Book
        </button>
      )}

      {/* Buy */}
      {access && !access.hasAccess && <BuyBook bookDetails={bookDetails} />}

      {/* Login hint */}
      {access?.reason === "NOT_LOGGED_IN" && (
        <p className="text-sm text-gray-500">
          Please login to buy or download this book
        </p>
      )}
    </div>
  );
};

export default HasAccess;
