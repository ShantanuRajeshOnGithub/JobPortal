import clientPromise from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const json = await request.json();
    const { email, socialMediaLinks } = json;


    if (!email || !socialMediaLinks) {
      return NextResponse.json({ message: 'Email and social media links are required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('HireHaven');


    const user = await db.collection('employer_profile').findOne({ email: email });

    if (!user) {
      return NextResponse.json({ message: 'Email not found' }, { status: 404 });
    }

    const result = await db.collection('employer_profile').updateOne(
      { email: email },
      { $set: { socialMediaLinks: { ...user.socialMediaLinks, ...socialMediaLinks } } }
    );

    return NextResponse.json({ message: 'Social media links updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error during updating social media links:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}