"use client";
import React, { useState, useRef } from "react";
import Card from "@/app/card/page";

export default function FeedPage() {
  const [showModal, setShowModal] = useState(false);
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState<File | null>(null);
 
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    const formData = new FormData();
    formData.append("media", file);
    formData.append("caption", caption);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      setShowModal(false);
      setCaption("");
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";

    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white px-4 py-10 flex items-center justify-center">
      <div className="max-w-xl w-full bg-[#1a1a1a] rounded-2xl border border-[#2a2a2a] shadow-xl p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Social Feed</h2>
          <button
            className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
            onClick={() => setShowModal(true)}
          >
            Post
          </button>
        </div>
   

       
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
                  accept="image/*,video/*"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="block w-full text-gray-300"
                  required
                />
                <input
                  type="text"
                  placeholder="Write a caption..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-[#262626] text-white border border-[#333] focus:outline-none"
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
      </div>
      <Card postId={"examplePostId"} userId={"exampleUserId"} />
    </div>
  );
}