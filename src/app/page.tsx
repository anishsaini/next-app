"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/app/components/LoadingSpinner";

export default function HomePage() {
  const router = useRouter();
  const [feedLoading, setFeedLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);

  const buttonStyles = "px-6 py-2.5 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2";

  const handleFeedClick = async () => {
    setFeedLoading(true);
    try {
      await router.push("/feed");
    } finally {
      setFeedLoading(false);
    }
  };

  const handleProfileClick = async () => {
    setProfileLoading(true);
    try {
      await router.push("/profile");
    } finally {
      setProfileLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white px-4 py-10 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-[#1a1a1a] rounded-2xl border border-[#2a2a2a] shadow-xl p-10 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">
          Welcome to Home Page 
        </h1>
        <p className="text-gray-400 text-lg md:text-xl mb-6">
          Anish Saini
        </p>
        <div className="flex justify-center gap-4">
          <button 
            onClick={handleFeedClick}  
            className={buttonStyles}
            disabled={feedLoading || profileLoading}
          >
            {feedLoading ? (
              <>
                <LoadingSpinner size="sm" />
                <span>Loading...</span>
              </>
            ) : (
              "Feed"
            )}
          </button>
          <button 
            onClick={handleProfileClick} 
            className={buttonStyles}
            disabled={feedLoading || profileLoading}
          >
            {profileLoading ? (
              <>
                <LoadingSpinner size="sm" />
                <span>Loading...</span>
              </>
            ) : (
              "Profile"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
