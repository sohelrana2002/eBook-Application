"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuthContext } from "@/context/authContext";
import { useMutation } from "@tanstack/react-query";
import { LoaderCircle } from "lucide-react";
import { login } from "@/http/api";

const Login = () => {
  const router = useRouter();
  const [userLogin, setUserLogin] = useState({
    email: "",
    password: "",
    error: null,
  });

  //   console.log("userLogin", userLogin);

  const { storeTokenInLS } = useAuthContext();

  const handleInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setUserLogin({
      ...userLogin,
      [name]: value,
    });
  };

  const mutation = useMutation({
    mutationFn: ({ email, password }) => login(email, password),
    onSuccess: (data) => {
      alert("Login successful!");
      //   console.log("Logged in user:", data);
      storeTokenInLS(data.token, data.name);

      setUserLogin((prev) => ({
        ...prev,
        error: null,
      }));
      router.push("/");
    },
    onError: (error) => {
      console.log("error", error);

      setUserLogin((prev) => ({
        ...prev,
        error: error?.response?.data?.message || "Login failed.",
      }));
    },
  });

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    mutation.mutate({
      email: userLogin.email,
      password: userLogin.password,
    });

    // console.log("Submitted data:", userLogin);
  };

  return (
    <div className="container">
      <div className="min-h-screen flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border-1 border-[var(--border)]">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-6">
            Login to Your Account
          </h2>

          <form className="space-y-5" onSubmit={handleLoginSubmit}>
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
                value={userLogin.email}
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
                value={userLogin.password}
                name="password"
                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                Remember me
              </label>
              <Link href="#" className="text-blue-600 hover:underline">
                Forgot password?
              </Link>
            </div>

            {/* ----error message--- */}
            {userLogin.error && (
              <p style={{ color: "red" }}>{userLogin.error}</p>
            )}
            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200 flex items-center gap-2 justify-center"
            >
              {mutation.isPending && <LoaderCircle className="animate-spin" />}
              Sign In
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            Don’t have an account?
            <Link href="/signup" className="text-blue-600 hover:underline ml-1">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
