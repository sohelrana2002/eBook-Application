"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { LoaderCircle } from "lucide-react";
import { signup } from "@/http/api";

const Signup = () => {
  const router = useRouter();
  const [userSignup, setUserSignup] = useState({
    name: "",
    email: "",
    password: "",
    cPassword: "",
    error: null,
  });

  const handleInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setUserSignup({
      ...userSignup,
      [name]: value,
    });
  };

  const mutation = useMutation({
    mutationFn: ({ name, email, password }) => signup(name, email, password),
    onSuccess: (data) => {
      alert("Signup successful!");
      //   console.log("Signup in user:", data);

      setUserSignup((prev) => ({
        ...prev,
        error: null,
      }));
      router.push("/login");
    },
    onError: (error) => {
      console.log("error", error);

      setUserSignup((prev) => ({
        ...prev,
        error: error?.response?.data?.message || "Login failed.",
      }));
    },
  });

  const handleSignupSubmit = async (e) => {
    e.preventDefault();

    if (userSignup.password === userSignup.cPassword) {
      mutation.mutate({
        name: userSignup.name,
        email: userSignup.email,
        password: userSignup.password,
      });
    } else {
      setUserSignup((prev) => ({
        ...prev,
        error: "Password didn't match",
      }));
    }

    // console.log("Submitted data:", userLogin);
  };

  return (
    <div className="container">
      <div className="h-[85vh] flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-[400px] bg-white p-7 rounded-2xl shadow-lg border-1 border-[var(--border)]">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-6">
            Create an Account
          </h2>

          <form className="space-y-3" onSubmit={handleSignupSubmit}>
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Full Name
              </label>
              <input
                id="name"
                type="text"
                required
                onChange={handleInput}
                value={userSignup.name}
                name="name"
                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                onChange={handleInput}
                value={userSignup.email}
                name="email"
                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                onChange={handleInput}
                value={userSignup.password}
                name="password"
                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="cPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <input
                id="cPassword"
                type="password"
                required
                onChange={handleInput}
                value={userSignup.cPassword}
                name="cPassword"
                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* ----error message--- */}
            {userSignup.error && (
              <p style={{ color: "red" }}>{userSignup.error}</p>
            )}
            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full bg-[#000] cursor-pointer text-white py-2 rounded-md hover: transition duration-200 flex items-center gap-2 justify-center"
            >
              {mutation.isPending && <LoaderCircle className="animate-spin" />}
              Sign Up
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-4">
            Have an account?
            <Link href="/login" className="text-[#000] hover:underline ml-1">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
