import { NextResponse } from "next/server";
import { clearAuthResponse } from "@/lib/auth";

export async function POST() {
  try {
    return clearAuthResponse();
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 