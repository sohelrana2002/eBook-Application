"use client";

import "./Newsletter.css";
import { useState } from "react";
import { newsletter } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";

const Newsletter = () => {
  const [email, setEmail] = useState("");

  const mutation = useMutation({
    mutationFn: (email) => newsletter(email),
    onSuccess: (data) => {
      alert(data.message);

      setEmail("");
    },
    onError: (error) => {
      alert(error?.response?.data?.message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    mutation.mutate(email);
  };

  return (
    <div className="newsletter__coontainer">
      <div className="container">
        <h1 className="heading">Newsletter</h1>
        <div className="newsletter__content">
          <h2>
            Subscribe to our newsletter and stay updated on the latest book!
          </h2>

          <form onSubmit={handleSubmit}>
            <input
              name="email"
              value={email}
              type="text"
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit" className="btn">
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Newsletter;
