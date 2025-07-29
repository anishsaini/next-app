import { useState, useEffect } from "react";
import axios from "axios";

const Card = ({ postId, userId }) => {
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [dislikesCount, setDislikesCount] = useState(0);

  const updateReaction = async (action: "like" | "dislike") => {
    try {
      const res = await axios.post("/api/card", {
        postId,
        userId,
        action,
      });

      setLikesCount(res.data.likes);
      setDislikesCount(res.data.dislikes);
      setLiked(res.data.liked);
      setDisliked(res.data.disliked);
    } catch (err) {
      console.error("Error updating reaction:", err);
    }
  };

  const handleLike = () => updateReaction("like");
  const handleDislike = () => updateReaction("dislike");

  return (
    <div className="...">
      {/* ...existing content... */}

      <div className="mt-4 flex items-center gap-6 text-gray-400">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1.5 transition-colors ${
            liked ? "text-pink-500" : "hover:text-pink-500"
          }`}
        >
          <img src="/like.svg" className="h-6 w-6" />
          <span className="text-sm font-semibold">{likesCount}</span>
        </button>

        <button
          onClick={handleDislike}
          className={`flex items-center gap-1.5 transition-colors ${
            disliked ? "text-green-500" : "hover:text-green-500"
          }`}
        >
          <img src="/dislike.svg" className="h-6 w-6" />
          <span className="text-sm font-semibold">{dislikesCount}</span>
        </button>

        <button className="flex items-center gap-1.5 hover:text-blue-500">
          <img src="/comment.svg" className="h-6 w-6" />
          <span className="text-sm font-semibold">34</span>
        </button>
      </div>
    </div>
  );
};
export default Card;