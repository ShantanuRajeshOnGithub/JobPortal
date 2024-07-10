import clientPromise from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ message: 'Email is required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('HireHaven');

    const user = await db.collection('employer_profile').findOne(
      { email },
      { projection: { socialMediaLinks: 1, _id: 0 } }
    );

    if (!user) {
      return NextResponse.json({ message: 'Email not found' }, { status: 404 });
    }

    return NextResponse.json({ email, socialMediaLinks: user.socialMediaLinks || {} }, { status: 200 });
  } catch (error) {
    console.error('Error fetching user email:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}