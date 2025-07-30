"use client";
import { useEffect, useState } from "react";

const ProfilePage = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [previewPic, setPreviewPic] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/profile", { credentials: "include" });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch profile");

        setProfile(data);
        setUsername(data.username);
        setBio(data.bio);
        setProfilePic(data.profilePic || "");
        setPreviewPic(data.profilePic || "");
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setPreviewPic(base64);
        setProfilePic(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const updateProfile = async () => {
    try {
      setUpdating(true);
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, bio, profilePic }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update profile");
      setProfile(data.user);
      setModalOpen(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/logout", {
      method: "POST",
      credentials: "include",
    });
    window.location.href = "/login";
  };

  if (loading) return <div className="text-center text-white">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white px-4 py-10 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-[#1a1a1a] rounded-2xl border border-[#2a2a2a] shadow-xl p-10 text-center">
        <h1 className="text-4xl font-extrabold mb-4 bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">
          Profile Page
        </h1>
        <img
          src={profile?.profilePic || "/default-avatar.png"}
          alt="Profile"
          className="w-32 h-32 mx-auto rounded-full object-cover border mb-4"
        />
        <div className="text-left mt-6 space-y-4">
          <div>
            <span className="font-bold">Username:</span> {profile?.username}
          </div>
          <div>
            <span className="font-bold">Email:</span> {profile?.email}
          </div>
          <div>
            <span className="font-bold">Bio:</span> {profile?.bio}
          </div>
        </div>

        <div className="mt-8 space-x-4">
          <button
            onClick={() => setModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            Edit Profile
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-[#1a1a1a] rounded-lg p-8 w-[90%] max-w-md text-white relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-white text-xl"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
            <input
              className="w-full mb-4 p-2 rounded bg-[#2a2a2a] border border-gray-600"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="New username"
            />
            <textarea
              className="w-full mb-4 p-2 rounded bg-[#2a2a2a] border border-gray-600"
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="New bio"
            />
            <input
              type="file"
              accept="image/*"
              className="mb-4"
              onChange={handleImageChange}
            />
            {previewPic && (
              <img
                src={previewPic}
                alt="Preview"
                className="w-24 h-24 mx-auto rounded-full mb-4 object-cover"
              />
            )}
            <button
              onClick={updateProfile}
              disabled={updating}
              className="bg-green-600 hover:bg-green-700 w-full py-2 rounded-lg disabled:opacity-50"
            >
              {updating ? "Updating..." : "Save Changes"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
