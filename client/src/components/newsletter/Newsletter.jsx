"use client";

import { useState } from "react";
import "./Newsletter.css";

const Newsletter = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {};
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
