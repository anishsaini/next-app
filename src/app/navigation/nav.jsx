"use client"; 

import React from "react";
import { useRouter } from "next/navigation";


const Navbar = () => {
  const router = useRouter();


  const directNavLinkStyles = "px-4 py-2 rounded-md text-sm font-extrabold transition-colors duration-200 hover:bg-[#2a2a2a]";

  return (
    <nav className="bg-[#1a1a1a] border-b border-[#2a2a2a] shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          <div className="flex-shrink-0">
            <a 
              onClick={() => router.push("/")} 
              className="cursor-pointer text-2xl font-extrabold bg-gradient-to-r from-blue-500 to-purple-200 text-transparent bg-clip-text"
              aria-label="Go to Home Page"
            >
              Next-App
            </a>
          </div>

          
          <div className="flex items-center space-x-4">
            <a 
              onClick={() => router.push("/")} 
              className={`${directNavLinkStyles} text-white font-extrabold cursor-pointer`}
              aria-label="Go to Home Page"
            >
              Home
            </a>
            <a 
              onClick={() => router.push("/feed")} 
              className={`${directNavLinkStyles} text-white font-extrabold cursor-pointer`}
              aria-label="Go to Feed Page"
            >
              Feed
            </a>
            <a 
              onClick={() => router.push("/profile")} 
              className={`${directNavLinkStyles} text-white font-extrabold cursor-pointer`}
              aria-label="Go to Profile Page"
            >
              Profile
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
