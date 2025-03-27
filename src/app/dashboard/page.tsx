"use client";
import { useState, useEffect } from "react";
import jwt from "jsonwebtoken";
import { useRouter } from "next/navigation";
const AccountDetails = () => {
  const [accountDetails, setAccountDetails] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router=useRouter()

  const isTokenExpired = (token: string): boolean => {
    try {
      const decoded: any = jwt.decode(token);
      if (decoded?.exp && Date.now() >= decoded.exp * 1000) {
        return true; 
      }
      return false;
    } catch {
      return true; 
    }
  };

  useEffect(() => {
    const fetchAccountDetails = async () => {
      const url = process.env.NEXT_PUBLIC_API_URL;
      const token = sessionStorage.getItem("accessToken");

      if (!token) {
        setError("No access token found. Please log in.");
        setIsLoading(false);
        return;
      }

      if (isTokenExpired(token)) {
        setError("Session expired. Please log in again.");
        router.push("/auth/login")
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`${url}account/details`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        setAccountDetails(data.data || []);
      } catch (error: any) {
        setError(error.message || "An unknown error occurred.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccountDetails();
  }, []);

  if (isLoading) {
    return <div>Loading account details...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-gray-700">Account Details</h2>
      <div className="mt-4">
        {accountDetails.length > 0 ? (
          accountDetails.map((detail, index) => (
            <ul key={index} className="space-y-2">
              <li>
                <strong>ID:</strong> {detail.id}
              </li>
              <li>
                <strong>Email:</strong> {detail.user_email}
              </li>
              <li>
                <strong>Mobile:</strong> {detail.user_mobile}
              </li>
              <li>
                <strong>Date:</strong> {new Date(detail.date).toLocaleString()}
              </li>
            </ul>
          ))
        ) : (
          <div>No account details available.</div>
        )}
      </div>
    </div>
  );
};

export default AccountDetails;
