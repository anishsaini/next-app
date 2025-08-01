import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Post from "@/models/Post";
import { authenticateUser } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const user = await authenticateUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Connect to database
    await connectToDatabase();

    const formData = await request.formData();
    const mediaPath = formData.get("mediaPath") as string;
    const mediaType = formData.get("mediaType") as string;
    const caption = formData.get("caption") as string;

    if (!mediaPath) {
      return NextResponse.json({ error: "Media path is required" }, { status: 400 });
    }

    if (!mediaType || !['image', 'video'].includes(mediaType)) {
      return NextResponse.json({ error: "Valid media type is required" }, { status: 400 });
    }

    if (!caption || caption.trim() === "") {
      return NextResponse.json({ error: "Caption is required" }, { status: 400 });
    }

    // Get user from database
    const User = await import("@/models/User").then(m => m.default);
    const dbUser = await User.findOne({ email: user.email });
    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Create post in database
    const post = new Post({
      userId: dbUser._id,
      mediaPath: mediaPath,
      mediaType: mediaType,
      caption: caption.trim(),
      likes: [],
      comments: []
    });

    await post.save();

    return NextResponse.json({
      message: "Post created successfully",
      post: {
        id: post._id,
        mediaPath: post.mediaPath,
        mediaType: post.mediaType,
        caption: post.caption,
        createdAt: post.createdAt
      }
    });

  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const posts = await Post.find()
      .populate("userId", "username profilePic")
      .sort({ createdAt: -1 })
      

    return NextResponse.json({ posts });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
} 