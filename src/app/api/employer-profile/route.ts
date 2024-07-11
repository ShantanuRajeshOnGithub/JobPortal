// api/employer-profile.ts

import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/db";

export async function POST(req: NextRequest) {
    const {
        email,
        name,
        website,
        foundedDate,
        companySize,
        phoneNumber,
        category,
        aboutCompany,
        socialMediaLinks
    } = await req.json();

    if (!email || !name || !website || !foundedDate || !companySize || !phoneNumber || !category || !aboutCompany) {
        return NextResponse.json({ error: "Check all required fields" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("HireHaven");

    const employerProfileData = {
        name,
        website,
        foundedDate,
        companySize,
        phoneNumber,
        category,
        aboutCompany,
        socialMediaLinks
    };

    try {
        const profileResult = await db.collection("employer_profile").updateOne(
            { email },
            { $set: employerProfileData },
            { upsert: true }
        );

        let message = "";
        if (profileResult.matchedCount > 0) {
            message = "Employer profile updated successfully";
        } else {
            message = "New employer profile created successfully";
        }

        // Update user's name in the users collection
        const userUpdate = await db.collection("users").updateOne(
            { email },
            { $set: { name } }
        );

        if (userUpdate.modifiedCount > 0) {
            message += ". User's name updated successfully";
        }

        return NextResponse.json({ message }, { status: 200 });
    } catch (error) {
        console.error("Error updating/inserting details:", error);
        return NextResponse.json({ error: "Error updating/inserting details" }, { status: 500 });
    }
}
