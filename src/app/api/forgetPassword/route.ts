import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/db";
import nodemailer from "nodemailer";
import { v4 as uuidv4 } from "uuid";


export async function POST(req: NextRequest) {
  let requestData;

  try {
    requestData = await req.json();
  } catch (error) {
    return NextResponse.json({ error: "Invalid JSON input" }, { status: 400 });
  }

  const { email } = requestData;

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db("HireHaven");

    const user = await db.collection("users").findOne({ email });

    const username = user?.name;
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Generate a reset token and set its expiry
    const resetToken = uuidv4();
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour expiry

    await db.collection("users").updateOne(
      { email },
      {
        $set: {
          resetToken,
          resetTokenExpiry,
        },
      }
    );

    // Send reset password email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: 'Password Reset',
      text: `Hi ${username} \n\nYou requested a password reset. \n\nPlease click the following link to reset your password: ${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken} \n\nThanks and Regards, \nHire Haven`,
    };

    await transporter.sendMail(mailOptions);
    
    return NextResponse.json({ message: "Password reset email sent" }, { status: 200 });

  } catch (error) {
    console.error("Error sending password reset email:", error);
    return NextResponse.json({ error: "Error sending password reset email" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return NextResponse.json(
    {},
    { status: 204, headers: { Allow: "POST, OPTIONS" } }
  );
}
