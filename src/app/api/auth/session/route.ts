import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { parse } from "cookie";
import { IncomingMessage, ServerResponse } from "http";
import { authOptions } from "../[...nextauth]/route";

export async function GET(request: NextRequest) {
  // Simulate the request and response objects
  const req = {
    headers: {
      ...Object.fromEntries(request.headers.entries()),
      cookie: request.headers.get("cookie") || "",
    },
    cookies: parse(request.headers.get("cookie") || ""),
  } as IncomingMessage & { cookies: Partial<{ [key: string]: string }> };

  const res = new ServerResponse(req);

  // Mock a session for testing purposes
  const mockSession = {
    user: { name: "Test User", email: "test@example.com" },
    expires: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
  };

  // Uncomment the line below to use the actual session fetching
  const session = await getServerSession(req, res, authOptions);
  //const session = mockSession; // Use mock session for testing

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json(session, { status: 200 });
}
