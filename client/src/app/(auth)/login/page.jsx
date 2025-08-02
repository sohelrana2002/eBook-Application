"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuthContext } from "@/context/authContext";
import { useMutation } from "@tanstack/react-query";
import { LoaderCircle } from "lucide-react";
import { login } from "@/lib/api";
import GoogleButton from "react-google-button";

const Login = () => {
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [userLogin, setUserLogin] = useState({
    email: "",
    password: "",
    error: null,
  });

  //   console.log("userLogin", userLogin);

  const { storeTokenInLS, isLoggedIn, isLoading } = useAuthContext();

  useEffect(() => {
    if (!isLoading && isLoggedIn) {
      setIsRedirecting(true);
      router.replace("/");
    }
  }, [isLoggedIn, router, isLoading]);

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

  const handleGoogleLogin = () => {
    // ✅ Backend on port 3000
    window.location.href = "http://localhost:3000/api/auth/google";
  };

  if (isLoading || isRedirecting) {
    return (
      <div className="h-screen flex items-center justify-center">
        <LoaderCircle className="animate-spin w-10 h-10 text-black" />
        <span className="ml-2 text-gray-600">Redirecting...</span>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="h-[85vh] flex items-center justify-center px-0 py-8">
        <div className="w-full max-w-[400px] bg-white p-7 rounded-2xl shadow-lg border-1 border-[var(--border)]">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-6">
            Login to Your Account
          </h2>

          <form className="space-y-3" onSubmit={handleLoginSubmit}>
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
              <Link href="#" className="text-[#000] hover:underline">
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
              className="w-full bg-[#000] cursor-pointer text-white py-2 rounded-md hover: transition duration-200 flex items-center gap-2 justify-center"
            >
              {mutation.isPending && <LoaderCircle className="animate-spin" />}
              Log In
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-4">
            Don’t have an account?
            <Link href="/signup" className="text-[#000] hover:underline ml-1">
              Register
            </Link>
          </p>

          <div className="pt-3 flex justify-center items-center">
            <GoogleButton onClick={handleGoogleLogin} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
