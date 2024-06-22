import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.JWT_SECRET,
  });
  if (!token) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  try {
    const response = await fetch(
      `${process.env.NEXTAUTH_URL}/api/auth/signout`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ callbackUrl: "/login", redirect: false }),
      }
    );

    if (response.ok) {
      const res = NextResponse.json(
        { message: "Logged out successfully" },
        { status: 200 }
      );

      // Clear session cookies
      res.cookies.set("next-auth.session-token", "", {
        path: "/",
        expires: new Date(0),
      });
      res.cookies.set("next-auth.csrf-token", "", {
        path: "/",
        expires: new Date(0),
      });
      res.cookies.set("next-auth.callback-url", "", {
        path: "/",
        expires: new Date(0),
      });

      return res;
    } else {
      const error = await response.json();
      return NextResponse.json(
        { message: "Logout failed", error },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Logout failed", error },
      { status: 500 }
    );
  }
}
