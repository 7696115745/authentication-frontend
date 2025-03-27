"use client"
import React from "react";
import Link from "next/link";
import { toast, ToastContainer } from "react-toastify";
import { useState } from "react";
const Verification = () => {
const [otpVerification,setOtpVerification]=useState("")

     const handleForgetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    
        if (!otpVerification) {
          toast.error("code is required!");
          return;
        }

        try {
          const url = process.env.NEXT_PUBLIC_API_URL;
        
          
          const res = await fetch(`${url}account/otpverification`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({verification_otp:Number(otpVerification)}),
          });
          
          const result = await res.json();
          
          if (res.status === 200 && result.success) {
            setOtpVerification("")
           }  
        } catch (error: any) {
          console.error("Error occurred:", error);
          toast.error("An unexpected error occurred.");
        }
      };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800">OTP Verification</h2>
        <p className="mt-2 text-sm text-center text-gray-600">
           .
        </p>
        <form className="mt-6" onSubmit={handleForgetPassword}>
          <div className="mb-4">
            <label htmlFor="verification" className="block text-sm font-medium text-gray-700">
           Enter Verifcation Code
            </label>
            <input
              type="Number"
              id="verification"
              name="verification"
            value={otpVerification}           
            onChange={(e:any)=>setOtpVerification(e.target.value)}
            placeholder="Verification Code"
              className="w-full px-4 py-2 mt-2 text-gray-700 bg-gray-100 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
          >
             Submit
          </button>
          <ToastContainer position="bottom-center" />

        </form>
        <div className="mt-4 text-center">
          <Link
            href="/auth/forget"
            className="text-sm text-blue-500 hover:underline hover:text-blue-600"
          >
            Back to Forget Password
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Verification;