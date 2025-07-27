"use client";

import React, { useEffect, useState } from "react";

interface User {
  username: string;
  email: string;
  bio?: string;
}

const ProfileCard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [popup, setPopup] = useState(false);
  const [editUsername, setEditUsername] = useState("");
  const [editBio, setEditBio] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  
    
  const handleOpenPopup = () => {
    if (user) {
      setEditUsername(user.username);
      setEditBio(user.bio || "");
    }
    setPopup(true);
  };

  const handleClosePopup = () => {
    setPopup(false);
    setError(""); 
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: editUsername,
          bio: editBio,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update profile");
      }

      const result = await res.json();
      setUser(result.user); 
      setPopup(false);      
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  const buttonStyles =
    "px-6 py-2.5 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition";

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/profile");
        const data: User = await res.json();
        setUser(data);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white px-4 py-10 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-[#1a1a1a] rounded-2xl border border-[#2a2a2a] shadow-xl p-10 text-center">
        <img
          className="w-24 h-24 mx-auto rounded-full border-4 border-[#2a2a2a]"
          src="/uploads/logo.png" 
          alt="Profile"
        />

        <h2 className="mt-4 text-2xl font-bold text-white">{user?.username}</h2>
        <p className="text-gray-400">{user?.email}</p>

        <p className="mt-4 text-sm text-gray-400">
          {user?.bio || "This is a sample bio. You can edit your profile to add more details."}
        </p>

        <div className="mt-6 flex justify-center gap-4">
          <button className={buttonStyles} onClick={handleOpenPopup}>
            Edit Profile
          </button>
        </div>
      </div>

      
      {popup && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-[#1a1a1a] p-6 rounded-xl w-[90%] max-w-md text-left border border-[#2a2a2a]">
            <h3 className="text-xl font-semibold mb-4 text-white">Edit Profile</h3>

            <label className="block text-sm mb-1 text-gray-300">Username</label>
            <input
              type="text"
              value={editUsername}
              onChange={(e) => setEditUsername(e.target.value)}
              className="w-full mb-4 px-4 py-2 rounded bg-[#2a2a2a] border border-gray-600 text-white"
            />

            <label className="block text-sm mb-1 text-gray-300">Bio</label>
            <textarea
              value={editBio}
              onChange={(e) => setEditBio(e.target.value)}
              className="w-full mb-4 px-4 py-2 rounded bg-[#2a2a2a] border border-gray-600 text-white resize-none"
              rows={3}
            />

            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={handleClosePopup}
                className="px-5 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileCard;
