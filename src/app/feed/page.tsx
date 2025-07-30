"use client";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Post from "@/app/components/Post";

const getTokenFromCookies = () => {
  if (typeof document !== "undefined") {
    const cookies = document.cookie.split(";");
    const tokenCookie = cookies.find((cookie) => cookie.trim().startsWith("token="));
    return tokenCookie ? tokenCookie.split("=")[1] : null;
  }
  return null;
};

export default function FeedPage() {
  const [showModal, setShowModal] = useState(false);
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
 
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchPosts();
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      console.log("Checking authentication...");
      
      const response = await fetch("/api/profile", {
        credentials: 'include' // This sends the httpOnly cookie automatically
      });
      
      console.log("Profile API response status:", response.status);
      
      if (response.ok) {
        const userData = await response.json();
        console.log("User authenticated:", userData);
        setIsAuthenticated(true);
      } else {
        console.log("User not authenticated");
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Auth check error:", error);
      setIsAuthenticated(false);
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/posts");
      if (response.ok) {
        const data = await response.json();
        setPosts(data.posts);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

    const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    
    console.log("Is authenticated state:", isAuthenticated);
    
    if (!isAuthenticated) {
      alert("Please login to create posts");
      router.push("/login");
      return;
    }

    const formData = new FormData();
    formData.append("media", file);
    formData.append("caption", caption);

    try {
      const res = await fetch("/api/feed", {
        method: "POST",
        credentials: 'include', // This sends the httpOnly cookie automatically
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        console.log("Upload successful:", data);
        alert("Post created successfully!");
        setShowModal(false);
        setCaption("");
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        fetchPosts();
      } else {
        const error = await res.json();
        console.error("Upload failed:", error);
        if (error.error === "Unauthorized") {
          alert("Please login to create posts");
          router.push("/login");
        } else {
          alert("Upload failed: " + (error.error || "Unknown error"));
        }
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed: Network error");
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white px-4 py-10">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-[#1a1a1a] rounded-2xl border border-[#2a2a2a] shadow-xl p-6 mb-6">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold">Social Feed</h2>
            <div className="flex space-x-2">
              <button
                className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
                onClick={() => setShowModal(true)}
              >
                Create Post
              </button>
            </div>
          </div>
        </div>

        {/* Upload Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-[#181818] p-8 rounded-xl w-full max-w-md relative">
              <button
                className="absolute top-2 right-3 text-gray-400 hover:text-white text-2xl"
                onClick={() => setShowModal(false)}
              >
                &times;
              </button>
              <h3 className="text-xl font-bold mb-4">Create Post</h3>
              <form onSubmit={handleUpload} className="space-y-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="block w-full text-gray-300"
                  required
                />
                <textarea
                  placeholder="Write a caption..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-[#262626] text-white border border-[#333] focus:outline-none resize-none"
                  rows={3}
                  required
                />
                <button
                  type="submit"
                  className="w-full py-2 bg-blue-600 rounded hover:bg-blue-700 font-semibold"
                >
                  Upload
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Posts Feed */}
        <div className="space-y-6">
          {loading ? (
            <div className="text-center text-white py-8">Loading posts...</div>
          ) : posts.length === 0 ? (
            <div className="text-center text-gray-400 py-8">No posts yet. Be the first to post!</div>
          ) : (
            posts.map((post) => <Post key={post._id} post={post} />)
          )}
        </div>
      </div>
    </div>
  );
}
