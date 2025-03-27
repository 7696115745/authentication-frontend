"use client";
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface FromData {
  user_email: string;
  user_mobile: string; 
  user_password: string;
}

export default function Signup() {
  const router = useRouter();

  const [fromData, setFromData] = useState<FromData>({
    user_email: "",
    user_mobile: "",
    user_password: "",
  });

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!fromData.user_email || !fromData.user_password || !fromData.user_mobile) {
      toast.error("All fields are required!");
      return;
    }
    
    if (!/^\S+@\S+\.\S+$/.test(fromData.user_email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    
    if (fromData.user_mobile.length < 10 || isNaN(Number(fromData.user_mobile))) {
      toast.error("Phone number must be at least 10 digits and numeric.");
      return;
    }
    
    try {
      const url = process.env.NEXT_PUBLIC_API_URL;
      
      const formattedData = {
        ...fromData,
        user_mobile: Number(fromData.user_mobile), 
      };
      
      const res = await fetch(`${url}account/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
      });
      
      const result = await res.json();
      
      if (res.status === 200 && result.success) {
        router.push("auth/login")
        toast.success("Signup Successful");
        setFromData({ user_email: "", user_mobile: "", user_password: "" });
      } else {
        toast.error(result.message || "Failed to sign up. Please try again.");
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
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-8">
        <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-6">Sign Up</h2>
        <p className="text-gray-500 text-center mb-8">Create your account and start your journey with us.</p>
        <form className="space-y-6" onSubmit={handleSignup}>
          <div>
            <label htmlFor="user_email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              id="user_email"
              value={fromData.user_email}
              onChange={(e) => handleChange("user_email", e.target.value)}
              placeholder="Enter your email"
              className="w-full mt-2 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="user_mobile" className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="text"
              id="user_mobile"
              value={fromData.user_mobile}
              onChange={(e) => handleChange("user_mobile", e.target.value)}
              placeholder="Enter your phone number"
              className="w-full mt-2 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="user_password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="user_password"
              value={fromData.user_password}
              onChange={(e) => handleChange("user_password", e.target.value)}
              placeholder="Create a password"
              className="w-full mt-2 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg shadow-lg hover:bg-indigo-700 hover:shadow-xl transition duration-300 cursor-pointer"
          >
            Create Account
          </button>
          <ToastContainer position="bottom-center" />
        </form>
        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <Link href="auth/login" className="text-indigo-600 font-medium hover:underline transition duration-200">
            Log in here
          </Link>
        </p>
      </div>
    </div>
  );
}
