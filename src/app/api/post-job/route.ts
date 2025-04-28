import { NextResponse } from 'next/server';
import clientPromise from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      jobTitle,
      jobDescription,
      jobCategory,
      jobType,
      salaryMin,
      salaryMax,
      skills,
      experience,
      location,
      industry,
      fileAttachment,
    } = body;

    const newJobPost = {
      jobTitle,
      jobDescription,
      jobCategory,
      jobType,
      salaryMin,
      salaryMax,
      skills,
      experience,
      location,
      industry,
      fileAttachment,
      createdAt: new Date(),
    };

    const client = await clientPromise;
    const db = client.db('HireHaven');

    await db.collection('job_posts').insertOne(newJobPost);

    return NextResponse.json({ message: 'Job posted successfully', data: newJobPost });
  } catch (error) {
    console.error('Error posting job:', error);
    return NextResponse.json({ error: 'Failed to post job' }, { status: 500 });
  }
}
