import { NextResponse } from "next/server";
import User from "@/models/User";
import { connectToDatabase } from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import { generateToken, createAuthResponse } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    await connectToDatabase();

    const user = await User.findOne({ email });
    console.log("User found:", user);
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match:", isMatch);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }


    const token = generateToken({
      id: (user._id as any).toString(),
      email: user.email,
      username: user.username
    });

    return createAuthResponse(
      { 
        message: "Login successful",
        user: {
          id: user._id,
          email: user.email,
          username: user.username
        }
      },
      token
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
