// api/get-employer-details.ts

import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/db";

export async function POST(req: NextRequest) {
    const { email } = await req.json();

    if (!email) {
        return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("HireHaven");

    try {
        const employerProfile = await db.collection("employer_profile").findOne(
            { email },
            {
                projection: {
                    _id: 0 // Exclude _id field
                }
            }
        );

        if (!employerProfile) {
            return NextResponse.json({ error: "Employer profile not found" }, { status: 404 });
        }

        return NextResponse.json({ email, employerProfile }, { status: 200 });
    } catch (error) {
        console.error("Error fetching employer profile:", error);
        return NextResponse.json({ error: "Error fetching employer profile" }, { status: 500 });
    }
}
