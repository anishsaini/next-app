import { NextResponse } from "next/server";
import User from "../../../models/User";
import { connectToDatabase } from "../../../lib/mongodb";

export async function POST(req: Request) {
  const { username, email, password } = await req.json();
  await connectToDatabase();

  // Check if user exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return NextResponse.json({ error: "User already exists" }, { status: 400 });
  }

  // Create user
  const user = new User({ username, email, password });
  await user.save();

  return NextResponse.json({ message: "User created" }, { status: 201 });
}