"use client"
import Link from "next/link";
import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
interface FromData {
  user_email: string;
   user_password: string;
}
const Login = () => {
    const router = useRouter();
    const [fromData, setFromData] = useState<FromData>({
      user_email: "",
       user_password: "",
    });
       const handleLogin = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    
        if (!fromData.user_email || !fromData.user_password) {
          toast.error("All fields are required!");
          return;
        }
        
        if (!/^\S+@\S+\.\S+$/.test(fromData.user_email)) {
          toast.error("Please enter a valid email address.");
          return;
        }
     
        try {
          const url = process.env.NEXT_PUBLIC_API_URL;
   const res = await fetch(`${url}account/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(fromData),
          });
          
          const result = await res.json();
           if (res.status === 200 && result.success) {
            sessionStorage.setItem("accessToken", result.data.accessToken)

            router.push("/dashboard")
            toast.success("Login Successful");
            setFromData({ user_email: "", user_password: "" });
          } else {
            toast.error(result.message || "Failed to login. Please try again.");
          }
        } catch (error: any) {
          console.error("Error occurred:", error);
          toast.error("An unexpected error occurred.");
        }
      };
      const handleChange = (name: string, value: string) => {
        setFromData((prev) => ({
          ...prev,
          [name]: value,
        }));
      };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Login to Your Account
        </h2>
        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              id="user_email"
              name="user_email"
              value={fromData.user_email}
              onChange={(e) => handleChange("user_email", e.target.value)}
              className="block w-full px-4 py-2 mt-1 text-sm border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="user_password"
              name="user_password"
              value={fromData.user_password}
              onChange={(e) => handleChange("user_password", e.target.value)}
              className="block w-full px-4 py-2 mt-1 text-sm border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your password"
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 text-sm text-gray-600"
              >
                Remember me
              </label>
            </div>
            <Link
              href="/auth/forget"
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              Forgot your password?
            </Link>
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
          >
            Sign In
          </button>
       <ToastContainer position="bottom-center" />
         </form>
        <p className="text-sm text-center text-gray-600">
          Don't have an account?{" "}
          <Link href="/" className="font-medium text-blue-600 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
