import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/db';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("sample_mflix");
  
    const users = await db
      .collection("users")
      .find({})
      .limit(4)
      .toArray();
  
    if (!users) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
  
    return NextResponse.json({users:users}, { status: 200 });
  
  } catch (error) {
    console.error('Error fetching user list:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}


export async function POST(request: NextRequest) {
  const client = await clientPromise;
  const db = client.db();
  const user = await request.json();

  await db.collection('users').insertOne(user);

  return NextResponse.json({ message: 'User created' }, { status: 201 });
}

/* export async function PUT(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId');
  const client = await clientPromise;
  const db = client.db();
  const updatedUser = await request.json();

  await db.collection('users').updateOne({ _id: userId }, { $set: updatedUser });

  return NextResponse.json({ message: 'User updated' }, { status: 200 });
}

export async function DELETE(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId');
  const client = await clientPromise;
  const db = client.db();

  await db.collection('users').deleteOne({ _id: userId });

  return NextResponse.json({ message: 'User deleted' }, { status: 200 });
} */
