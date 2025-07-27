import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";


export async function GET() {
  await connectToDatabase();

  const user = await User.findOne();

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({
    username: user.username,
    email: user.email,
    bio: user.bio || "this is bio"
  });
}


export async function PUT(request: Request) {
  await connectToDatabase();

  const body = await request.json();
  const { username, bio } = body;

  if (!username) {
    return NextResponse.json({ error: "Username is required" }, { status: 400 });
  }

  const user = await User.findOne();

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  user.username = username;
  user.bio = bio || "this is bio"; 

  await user.save();

  return NextResponse.json({
    message: "Profile updated successfully",
    user: {
      username: user.username,
      email: user.email,
      bio: user.bio,
    },
  });
}
