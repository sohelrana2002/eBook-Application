import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { login } from "@/http/api";
import { useNavigate } from "react-router-dom";
import { LoaderCircle } from "lucide-react";
import { useAuthContext } from "@/context/authContext";

const Login = () => {
  const [userLogin, setUserLogin] = useState({
    email: "",
    password: "",
    error: null,
  });

  const navigate = useNavigate();
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
      // console.log("Logged in user:", data);
      storeTokenInLS(data.token, data.name);

      setUserLogin((prev) => ({
        ...prev,
        error: null,
      }));
      navigate("/");
    },
    onError: (error) => {
      // console.log("error", error);

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
    <div>
      <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
        <div className="flex w-full max-w-sm flex-col gap-6">
          <div>
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-xl">Welcome back</CardTitle>
                <CardDescription>Login with admin account</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLoginSubmit}>
                  <div className="grid gap-6">
                    <div className="flex flex-col gap-4"></div>
                    <div className="grid gap-6">
                      <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="john@gmail.com"
                          value={userLogin.email}
                          onChange={handleInput}
                          name="email"
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <div className="flex items-center">
                          <Label htmlFor="password">Password</Label>
                          <a
                            href="#"
                            className="ml-auto text-sm underline-offset-4 hover:underline"
                          >
                            Forgot your password?
                          </a>
                        </div>
                        <Input
                          id="password"
                          type="password"
                          placeholder="*****"
                          required
                          value={userLogin.password}
                          onChange={handleInput}
                          name="password"
                        />
                      </div>
                      {userLogin.error && (
                        <p style={{ color: "red" }}>{userLogin.error}</p>
                      )}
                      <Button
                        type="submit"
                        className="w-full cursor-pointer"
                        disabled={mutation.isPending}
                      >
                        {mutation.isPending && (
                          <LoaderCircle className="animate-spin" />
                        )}
                        Login
                      </Button>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="bg-[var(--background)] p-4 rounded-lg flex flex-col gap-2">
            <h1 className="text-sm md:text-md font-bold">Demo Credentials</h1>
            <div className="flex items-center justify-between">
              <p className="text-xs md:text-[15px]">
                Admin: sohel@admin.com / admin123
              </p>
              <button
                onClick={() =>
                  setUserLogin({
                    email: "sohel@admin.com",
                    password: "admin123",
                  })
                }
                className="bg-[var(--foreground)] text-white px-3 py-1 rounded-sm cursor-pointer text-xs md:text-sm"
              >
                Try This
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
