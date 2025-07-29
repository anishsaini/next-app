"use client";
import { useEffect, useState } from "react";

const ProfilePage = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/profile", {
          credentials: 'include', 
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch profile");
        setProfile(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const updateProfile = async (updates: any) => {
    try {
      const res = await fetch("/api/profile", {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update profile");
      setProfile(data.user);
      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", {
        method: 'POST',
        credentials: 'include',
      });
     
      window.location.href = '/login';
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  if (loading) return <div className="text-center text-white">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white px-4 py-10 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-[#1a1a1a] rounded-2xl border border-[#2a2a2a] shadow-xl p-10 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">
          Profile Page
        </h1>
        <p className="text-gray-400 text-lg md:text-xl mb-6">
          User Profile Information
        </p>
        <div className="text-left mt-6 space-y-4">
          <div><span className="font-bold">Username:</span> {profile?.username}</div>
          <div><span className="font-bold">Email:</span> {profile?.email}</div>
          <div><span className="font-bold">Bio:</span> {profile?.bio}</div>
        </div>
        <div className="mt-8 space-x-4">
          <button 
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
export default ProfilePage;
