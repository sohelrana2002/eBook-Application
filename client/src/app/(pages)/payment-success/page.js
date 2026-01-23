// pages/payment-success.jsx
"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api";

const PaymentSuccess = () => {
  const searchParams = useSearchParams();
  const tranId = searchParams.get("tran_id");

  useEffect(() => {
    if (tranId) {
      api
        .post("/api/payment/success", { tran_id: tranId })
        .then((res) => console.log("Payment verified:", res.data))
        .catch((err) => console.error(err));
    }
  }, [tranId]);

  return <div>Payment Success! Your eBook will be available soon.</div>;
};

export default PaymentSuccess;
