// src/app/api/login/route.ts
import clientPromise from "@/lib/db";
import { MongoClient } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const json = await request.json();
    console.log("Request JSON:", json); 

    const { email, password } = json;

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("HireHaven");

    // Find user by email
    const user = await db.collection("users").findOne({ email });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const accountType = user.accountType;

    if (!accountType) {
      return NextResponse.json({ message: "Account type not found" }, { status: 500 });
    }

    return NextResponse.json({ accountType }, { status: 200 });
  } catch (error) {
    console.error("Error during fetching account type:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}