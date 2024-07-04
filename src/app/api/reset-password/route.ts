// pages/api/reset-password.ts

import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/db";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
  const { password, token } = await req.json();

  // Basic validation
  if (!password || !token) {
    return NextResponse.json(
      { error: "Token and Password are required" },
      { status: 400 }
    );
  }

  try {
    const client = await clientPromise;
    const db = client.db("HireHaven");

    // Find user by reset token and check expiry
    const user = await db.collection("users").findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() }, // Check if token is not expired
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user's password in the database
    await db.collection("users").updateOne(
      { email: user.email }, // Assuming user email is stored in the database
      {
        $set: {
          password: hashedPassword,
          resetToken: null, // Clear reset token after resetting password
          resetTokenExpiry: null,
        },
      }
    );

    return NextResponse.json({ status: true, message: "Password reset successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error resetting password:", error);
    return NextResponse.json(
      { error: "Failed to reset password. Please try again later." },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json(
    {},
    { status: 204, headers: { Allow: "POST, OPTIONS" } }
  );
}
