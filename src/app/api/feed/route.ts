
import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
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

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });

    const formData = await request.formData();
    const file = formData.get("media") as File;
    const caption = formData.get("caption") as string;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (!caption || caption.trim() === "") {
      return NextResponse.json({ error: "Caption is required" }, { status: 400 });
    }

    // Check file type and size
    const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const allowedVideoTypes = ['video/mp4', 'video/mov', 'video/avi', 'video/webm', 'video/quicktime'];
    const allowedTypes = [...allowedImageTypes, ...allowedVideoTypes];
    
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: "Invalid file type. Please upload an image (JPEG, PNG, GIF, WebP) or video (MP4, MOV, AVI, WebM)" 
      }, { status: 400 });
    }

    // Determine media type
    const isVideo = allowedVideoTypes.includes(file.type);
    const mediaType = isVideo ? 'video' : 'image';

    // Generate unique filename
    const timestamp = Date.now();
    const originalName = file.name;
    const fileName = `${timestamp}_${originalName}`;
    const filePath = path.join(uploadDir, fileName);

    // Save file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await fs.writeFile(filePath, buffer);

    const fileUrl = `/uploads/${fileName}`;

    // Get user from database
    const User = await import("@/models/User").then(m => m.default);
    const dbUser = await User.findOne({ email: user.email });
    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Create post in database
    const post = new Post({
      userId: dbUser._id,
      mediaPath: fileUrl,
      mediaType: mediaType,
      caption: caption.trim(),
      likes: [],
      comments: []
    });

    await post.save();

    return NextResponse.json({
      message: "Post created successfully",
      filename: fileName,
      url: fileUrl,
      mediaType: mediaType,
      post: {
        id: post._id,
        mediaPath: post.mediaPath,
        mediaType: post.mediaType,
        caption: post.caption,
        createdAt: post.createdAt
      }
    });

  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
