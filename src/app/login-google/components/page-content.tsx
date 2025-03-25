"use client";

import { getAuthorizationGoogleUrl } from "@/api/auth-api";
import { useState } from "react";

export default function PageContent() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);

    try {
      const { url } = await getAuthorizationGoogleUrl();

      // Redirect to Google login page
      window.location.href = url;

      // window.open(url, "loginPopup", "width=500,height=600");
    } catch {
      console.error("An error occurred during login.");
    }

    setIsLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Login with Google
        </h2>
        <button
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="flex items-center justify-center w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 disabled:bg-gray-400"
        >
          {isLoading ? "Loading..." : "Sign In with Google"}
        </button>
      </div>
    </div>
  );
}
