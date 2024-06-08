
import { NextResponse } from 'next/server';
import {getUserList} from "../../../lib/user"

export async function GET() {
  try {
    const { users } = await getUserList();
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching user list:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}