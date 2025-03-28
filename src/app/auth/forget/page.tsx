"use client";
import React, { useState } from "react";
import Link from "next/link";
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleForgetPassword = async (e:any) => {
    e.preventDefault();

    if (!email) {
      toast.error("Email is required!");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    try {
      const url = process.env.NEXT_PUBLIC_API_URL;

      const res = await fetch(`${url}account/forgetpassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_email: email }),
      });

      const result = await res.json();

      if (res.status === 200 && result.success) {
        localStorage.setItem("email",email)
        setEmail("");
        toast.success("Reset link sent successfully!");
        router.push("/auth/verification");
      } else {
        toast.error(result.message || "Something went wrong.");
      }
    } catch (error: any) {
      console.error("Error occurred:", error);
      toast.error("An unexpected error occurred.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800">Forgot Password</h2>
        <p className="mt-2 text-sm text-center text-gray-600">
          Enter your email address, and we’ll send you a link to reset your password.
        </p>
        <form className="mt-6" onSubmit={handleForgetPassword}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="text"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-2 mt-2 text-gray-700 bg-gray-100 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
          >
            Send Reset Link
          </button>
          <ToastContainer position="bottom-center" />
        </form>
        <div className="mt-4 text-center">
          <Link href="/auth/login" className="text-sm text-blue-500 hover:underline hover:text-blue-600">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
