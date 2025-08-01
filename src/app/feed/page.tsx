"use client";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Post from "@/app/components/Post";
import LoadingSpinner from "@/app/components/LoadingSpinner";


const getTokenFromCookies = () => {
  if (typeof document !== "undefined") {
    const cookies = document.cookie.split(";");
    const tokenCookie = cookies.find((cookie) =>
      cookie.trim().startsWith("token=")
    );
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
  const [authLoading, setAuthLoading] = useState(true);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchPosts();
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      setAuthLoading(true);
      console.log("Checking authentication...");

      const response = await fetch("/api/profile", {
        credentials: "include",
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
    } finally {
      setAuthLoading(false);
    }
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);
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

    setUploadLoading(true);
    const formData = new FormData();
    formData.append("media", file);
    formData.append("caption", caption);

    try {
      const res = await fetch("/api/feed", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        console.log("Upload successful:", data);
        
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
    } finally {
      setUploadLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f0f] via-[#1a1a1a] to-[#0f0f0f] text-white">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1a1a1a] to-[#2a2a2a] rounded-3xl border border-[#333] shadow-2xl p-8 mb-8 backdrop-blur-sm">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Social Feed
              </h2>
              <p className="text-gray-400 mt-1">
                Share your moments with the world
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                onClick={() => setShowModal(true)}
                disabled={authLoading}
              >
                {authLoading ? (
                  <>
                    <LoadingSpinner size="sm" />
                    <span>Loading...</span>
                  </>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    <span>Create Post</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Upload Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] p-8 rounded-3xl w-full max-w-lg relative border border-[#333] shadow-2xl">
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-white text-3xl transition-colors duration-200"
                onClick={() => setShowModal(false)}
                disabled={uploadLoading}
              >
                &times;
              </button>
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Create New Post
                </h3>
                <p className="text-gray-400 mt-2">
                  Share your moment with the community
                </p>
              </div>
              <form onSubmit={handleUpload} className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Choose Image
                  </label>
                  <div
                    className="border-2 border-dashed border-gray-600 rounded-xl p-6 text-center hover:border-blue-500 transition-colors duration-200 cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                      className="hidden"
                      required
                      disabled={uploadLoading}
                    />
                    {file ? (
                      <div className="space-y-3">
                        <svg
                          className="w-12 h-12 mx-auto text-green-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <div>
                          <p className="text-green-400 font-medium">
                            File selected!
                          </p>
                          <p className="text-gray-400 text-sm">{file.name}</p>
                          <p className="text-gray-500 text-xs">
                            Click to change file
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <svg
                          className="w-12 h-12 mx-auto text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                        <div>
                          <p className="text-gray-300 font-medium">
                            Click to upload image
                          </p>
                          <p className="text-gray-500 text-sm">
                            PNG, JPG, GIF up to 10MB
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Caption
                  </label>
                  <textarea
                    placeholder="What's on your mind?"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#262626] text-white border border-[#333] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none disabled:opacity-50 transition-all duration-200"
                    rows={4}
                    required
                    disabled={uploadLoading}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                  disabled={uploadLoading}
                >
                  {uploadLoading ? (
                    <>
                      <LoadingSpinner size="sm" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                      <span>Share Post</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Posts Feed */}
        <div className="space-y-8">
          {loading ? (
            <div className="flex justify-center py-16">
              <LoadingSpinner size="lg" />
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-3xl border border-[#333] p-12">
                <div className="text-8xl mb-6">📷</div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  No posts yet
                </h3>
                <p className="text-gray-400 mb-6 max-w-md mx-auto">
                  Be the first to share something amazing! Your posts will
                  appear here.
                </p>
                <button
                  onClick={() => setShowModal(true)}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Create Your First Post
                </button>
              </div>
            </div>
          ) : (
            posts.map((post) => <Post key={post._id} post={post} />)
          )}
        </div>
      </div>
    </div>
  );
}
