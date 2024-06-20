import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import clientPromise from "@/lib/db"; // Adjust the import path as needed
import logger from "@/utils/serverLogger";

async function getSessionFromRequest(req: NextRequest) {
  try {
    logger.info("Fetching session from auth/session API...");
    const response = await fetch(
      `${process.env.NEXTAUTH_URL}/api/auth/session`,
      {
        headers: {
          cookie: req.headers.get("cookie") || "",
        },
      }
    );

    if (!response.ok) {
      logger.error("Failed to fetch session:", response.statusText);
      return null;
    }

    const session = await response.json();
    logger.info("Session fetched:", session);
    return Object.keys(session).length ? session : null;
  } catch (error) {
    logger.error("Error fetching session:", error);
    return null;
  }
}

export async function middleware(request: NextRequest) {
  logger.info(`Middleware is running for: ${request.nextUrl.pathname}`);

  /*   // Always redirect to /login for testing
  const loginUrl = new URL('/login', request.url);
  console.log("Redirect URL:", loginUrl.toString());

  const response = NextResponse.redirect(loginUrl);
  console.log("Redirect response:", response);

  return response; */

  // Exclude the session API endpoint from the middleware
  if (request.nextUrl.pathname.startsWith("/api/auth/session")) {
    logger.info("Excluding session endpoint from middleware.");
    return NextResponse.next();
  }

  const session = await getSessionFromRequest(request);

  if (!session) {
    logger.warn("No session found. Redirecting to login...");
    const loginUrl = new URL("/login", request.url);
    logger.info(`Redirect URL: ${loginUrl.toString()}`);
    const response = NextResponse.redirect(loginUrl);
    logger.info("Redirect response:", response);
    return response;
  }

  /*
  // Uncomment and modify the following code to handle session-based logic
  const client = await clientPromise;
  const db = client.db();
  const user = await db.collection('users').findOne({ email: session.user.email });

  if (!user) {
    console.log("User not found. Redirecting to login...");
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const roles = await db.collection('roles').find({ _id: { $in: user.role_ids } }).toArray();
  const userPermissions = roles.flatMap(role => role.permissions);

  const requiredPermissions = request.nextUrl.pathname.startsWith('/admin')
    ? ['admin']
    : [];

  if (requiredPermissions && !requiredPermissions.every(permission => userPermissions.includes(permission))) {
    console.log("User does not have required permissions. Redirecting to forbidden...");
    return NextResponse.redirect(new URL('/forbidden', request.url));
  }
  */

  logger.info("Session exists, proceeding to next response...");
  return NextResponse.next();
}

export const config = {
  matcher: ["/api/users/:path*"], // Adjust paths as needed
};
