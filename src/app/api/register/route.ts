// app/api/register/route.ts
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import clientPromise from "@/lib/db";

export async function POST(req: NextRequest) {
  const { name, email, password, accountType, acceptedTerms } =
    await req.json();

  const client = await clientPromise;
  const db = client.db("HireHaven");

  // Check if user already exists
  const existingUser = await db.collection("users").findOne({ email });
  if (existingUser) {
    return NextResponse.json({ error: "User already exists" }, { status: 400 });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create a new user
  const newUser = {
    name,
    email,
    password: hashedPassword,
    accountType,
    acceptedTerms,
  };

  try {
    await db.collection("users").insertOne(newUser);
    return NextResponse.json(
      { message: "User created successfully" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: "Error creating user" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return NextResponse.json(
    {},
    { status: 204, headers: { Allow: "POST, OPTIONS" } }
  );
}
