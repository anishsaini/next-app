import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import { NextRequest } from "next/server";
import { authenticateUser, getTokenFromRequest } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const payload = await authenticateUser(request);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findById(payload.id).select('-password');
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      username: user.username,
      email: user.email,
      bio: user.bio || "this is bio"
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await connectToDatabase();

    const payload = await authenticateUser(request);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { username, bio } = body;

    const user = await User.findById(payload.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Only update fields present in the request
    if (username !== undefined) user.username = username;
    if (bio !== undefined) user.bio = bio;

    await user.save();

    return NextResponse.json({
      message: "Profile updated successfully",
      user: {
        username: user.username,
        email: user.email,
        bio: user.bio,
      },
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Migration endpoint to add bio field to all users
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    
    // Update all users that don't have a bio field
    const result = await User.updateMany(
      { bio: { $exists: false } },
      { $set: { bio: "this is bio" } }
    );
    
    return NextResponse.json({
      message: `Updated ${result.modifiedCount} users with bio field`,
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    console.error('Migration error:', error);
    return NextResponse.json({ error: 'Migration failed' }, { status: 500 });
  }
}
