import dbConnect from "../../../lib/dbConnect";
import Post from "../../../models/Post";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { postId, userId, action } = req.body;

  if (!postId || !userId || !["like", "dislike"].includes(action)) {
    return res.status(400).json({ message: "Invalid request" });
  }

  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const hasLiked = post.likes.includes(userId);
    const hasDisliked = post.dislikes.includes(userId);

    if (action === "like") {
      if (hasLiked) {
        post.likes.pull(userId);
      } else {
        post.likes.push(userId);
        if (hasDisliked) post.dislikes.pull(userId); 
      }
    } else if (action === "dislike") {
      if (hasDisliked) {
        post.dislikes.pull(userId);
      } else {
        post.dislikes.push(userId);
        if (hasLiked) post.likes.pull(userId); 
      }
    }

    await post.save();
    return res.status(200).json({
      likes: post.likes.length,
      dislikes: post.dislikes.length,
      liked: post.likes.includes(userId),
      disliked: post.dislikes.includes(userId),
    });
  } catch (error) {
    console.error("Error liking/disliking post:", error);
    return res.status(500).json({ message: "Server error" });
  }
}
