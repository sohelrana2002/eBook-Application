"use client";

import { useState } from "react";
import { api } from "@/lib/api";

const BuyBook = ({ bookDetails }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleBuy = async () => {
    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const res = await api.post("/api/payment/initiate", {
        bookId: bookDetails?._id,
      });

      // ✅ Success → redirect to SSLCOMMERZ
      if (res.data?.paymentUrl) {
        window.location.href = res.data.paymentUrl;
      } else {
        setError("Unable to initiate payment. Please try again.");
      }
    } catch (err) {
      // ✅ Backend error message
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Something went wrong. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <button
        onClick={handleBuy}
        disabled={loading}
        className={`inline-block px-6 py-3 rounded-lg font-semibold transition-colors duration-300
          ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-black text-white hover:bg-[#000000d8]"
          }
        `}
      >
        {loading ? "Processing..." : "Buy Book"}
      </button>

      {/* Error message */}
      {error && <p className="text-sm text-red-600 font-medium">{error}</p>}
    </div>
  );
};

export default BuyBook;
