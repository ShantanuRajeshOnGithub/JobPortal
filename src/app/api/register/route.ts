// app/api/register/route.ts
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import clientPromise from "@/lib/db";
import { error } from "console";

export async function POST(req: NextRequest) {
  const { name, email, password, accountType, acceptedTerms } =
    await req.json();

    // if (!email) {
    //   return NextResponse.json({ error: "Email is required" }, { status: 400 });
    // }

    // if (!password) {
    //   return NextResponse.json({error: "Password is required"},{ status:400 });
    // }
    
    // if (!name) {
    //   return NextResponse.json({ error: "Name is required" }, { status: 400 });
    // }

    // if (!accountType) {
    //   return NextResponse.json({ error: "Account type is required" }, { status: 400 });
    // } 
    
    // if (!acceptedTerms) {
    //   return NextResponse.json({error: "Accepted terms has to be selected before registration"}, { status: 400 });
    // }
    
  if(!email || !password|| !name || !accountType || !acceptedTerms){
    return NextResponse.json({ message: "check all required fields" }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db("HireHaven");

  // Check if user already exists
  const existingUser = await db.collection("users").findOne({ email });
  if (existingUser) {
    return NextResponse.json({ message: "User already exists" }, { status: 400 });
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
  } catch (message) {
    return NextResponse.json({ message: "Error creating user" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return NextResponse.json(
    {},
    { status: 204, headers: { Allow: "POST, OPTIONS" } }
  );
}
